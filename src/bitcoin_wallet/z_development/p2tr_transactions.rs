// will split the method into multiple smaller methods accordingly to the flow needed

// create the alice and bob script and the internal key and send my unspent to it

// create transaction that takes the scripts and spends them all togheter

//
//
// each step here
// function that creates OP_CODE scripts for branches

use std::{collections::BTreeMap, str::FromStr};

use bitcoin::{
    blockdata::{opcodes::all, script::Builder},
    psbt::{Prevouts, TapTree},
    schnorr::TapTweak,
    secp256k1::{All, Message, Secp256k1, SecretKey},
    util::{
        sighash::{ScriptPath, SighashCache},
        taproot::{ControlBlock, LeafVersion, TaprootBuilder, TaprootSpendInfo},
    },
    Address, KeyPair, Network, OutPoint, PackedLockTime, SchnorrSig, SchnorrSighashType, Script,
    Sequence, Transaction, TxIn, TxOut, Witness, XOnlyPublicKey,
};
use bitcoin_hashes::{hex::FromHex, Hash};
use electrum_client::{Client, ElectrumApi};

// working
// branch refund after x blocks
// alice case
fn create_branch_1(alice_public_key: &XOnlyPublicKey) -> bitcoin::Script {
    // 144 OP_CHECKSEQUENCEVERIFY OP_DROP <pubkey_alice> OP_CHECKSIG
    Builder::new()
        .push_int(144)
        // .push_opcode(all::OP_CHECKSEQUENCEVERIFY) // fix this code
        .push_opcode(all::OP_DROP)
        .push_x_only_key(alice_public_key)
        .push_opcode(all::OP_CHECKSIG)
        .into_script();

    Script::from_hex(
        "029000b275209997a497d964fc1a62885b05a51166a65a90df00492c8d7cf61d6accf54803beac",
    )
    .unwrap()
}

// working
// branch spending
// bob case
fn create_branch_2(
    preimage_hash: &bitcoin::hashes::sha256::Hash,
    bob_public_key: &XOnlyPublicKey,
) -> bitcoin::Script {
    // OP_SHA256 preimage_hash OP_EQUALVERIFY <pubkey_bob> OP_CHECKSIG
    Builder::new()
        .push_opcode(all::OP_SHA256)
        .push_slice(preimage_hash)
        .push_opcode(all::OP_EQUALVERIFY)
        .push_x_only_key(bob_public_key)
        .push_opcode(all::OP_CHECKSIG)
        .into_script()
}

// working
// function that creates tree
// in: scripts for branches
// out: tree script
fn create_tree(
    secp: &Secp256k1<All>,
    internal: &KeyPair,
    branch_1: &Script,
    branch_2: &Script,
) -> (bitcoin::util::taproot::TaprootSpendInfo, bitcoin::Address) {
    // TODO: check if &branch_1.clone() is same value as bob_script.clone() on main file
    let builder =
        TaprootBuilder::with_huffman_tree(vec![(1, branch_1.clone()), (1, branch_2.clone())])
            .unwrap();

    let (internal_public_key, _) = internal.x_only_public_key();

    let tap_tree = TapTree::from_builder(builder).unwrap();
    let tap_info = tap_tree
        .into_builder()
        .finalize(secp, internal_public_key)
        .unwrap();

    let merkle_root = tap_info.merkle_root();

    let address = Address::p2tr(
        secp,
        tap_info.internal_key(),
        tap_info.merkle_root(),
        Network::Testnet,
    );

    return (tap_info, address);

    // TODO: write next funcitons, come back to see what to add to return here
    // return:
    // address
    // tap_tree ?
    // what else ?
}

// working
fn get_prev_txs(
    client: &Client,
    address: &Address,
) -> (
    std::vec::Vec<bitcoin::TxIn>,
    std::vec::Vec<bitcoin::Transaction>,
) {
    let vec_tx_in = client
        .script_list_unspent(&(address.script_pubkey()))
        .unwrap()
        .iter()
        .map(|l| TxIn {
            previous_output: OutPoint::new(l.tx_hash, l.tx_pos.try_into().unwrap()),
            script_sig: Script::new(),
            sequence: Sequence(0xFFFFFFFF),
            witness: Witness::default(),
        })
        .collect::<Vec<TxIn>>();

    let prev_tx = vec_tx_in
        .iter()
        .map(|tx_id| client.transaction_get(&tx_id.previous_output.txid).unwrap())
        .collect::<Vec<Transaction>>();
    return (vec_tx_in, prev_tx);
}

// working
fn create_transaction(vec_tx_in: Vec<TxIn>, output_address: &Address, amount: u64) -> Transaction {
    Transaction {
        version: 2,
        lock_time: PackedLockTime(0),
        input: vec![TxIn {
            previous_output: vec_tx_in[3].previous_output.clone(), //TODO: change this [3] for general case
            script_sig: Script::new(),
            sequence: Sequence(0xFFFFFFFF),
            witness: Witness::default(),
        }],

        output: vec![TxOut {
            value: amount,
            // Address::from_str(
            //   //     "tb1p5kaqsuted66fldx256lh3en4h9z4uttxuagkwepqlqup6hw639gskndd0z",
            //   // )
            //   // .unwrap()
            //   // .script_pubkey(),
            script_pubkey: output_address.script_pubkey(), // where funds are going
        }],
    }
}

fn sign_tx(
    secp: Secp256k1<All>,
    tx_ref: &Transaction,
    prevouts: &Prevouts<TxOut>,
    script: &Script,
    bob: &KeyPair,
    tap_info: &TaprootSpendInfo,
    internal: &KeyPair,
    preimage: &Vec<u8>,
) -> Transaction {
    let mut tx = tx_ref.clone();
    let sighash_sig = SighashCache::new(&mut tx.clone())
        .taproot_script_spend_signature_hash(
            0,
            prevouts,
            ScriptPath::with_defaults(script),
            SchnorrSighashType::AllPlusAnyoneCanPay,
        )
        .unwrap();
    // println!("sighash_sig: {}", sighash_sig);
    // println!("message: {}", Message::from_slice(&sighash_sig).unwrap());
    let sig = secp.sign_schnorr(&Message::from_slice(&sighash_sig).unwrap(), bob);
    // println!("sig: {}", sig);

    let actual_control = tap_info
        .control_block(&(script.clone(), LeafVersion::TapScript))
        .unwrap();
    // println!("actual_control: {:#?}", actual_control);

    // verify commitment
    let tweak_key_pair = internal.tap_tweak(&secp, tap_info.merkle_root()).to_inner();
    let (tweak_key_pair_public_key, _) = tweak_key_pair.x_only_public_key();
    let res = actual_control.verify_taproot_commitment(&secp, tweak_key_pair_public_key, script);

    // TODO: sync with main file this b_tree_map
    // let mut b_tree_map = BTreeMap::<ControlBlock, (Script, LeafVersion)>::default();
    // b_tree_map.insert(
    //     actual_control.clone(),
    //     (script.clone(), LeafVersion::TapScript),
    // );

    let schnorr_sig = SchnorrSig {
        sig,
        hash_ty: SchnorrSighashType::AllPlusAnyoneCanPay,
    };

    let wit = Witness::from_vec(vec![
        schnorr_sig.to_vec(),
        preimage.clone(), //TODO: remove on the new op_codes operations
        script.to_bytes(),
        actual_control.serialize(),
    ]);

    tx.input[0].witness = wit;

    tx
}

#[test]
pub fn test_main() {
    let secp = Secp256k1::new();
    // predefined data
    let alice_secret =
        SecretKey::from_str("2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90")
            .unwrap();
    let bob_secret =
        SecretKey::from_str("81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9")
            .unwrap();
    let internal_secret =
        SecretKey::from_str("1229101a0fcf2104e8808dab35661134aa5903867d44deb73ce1c7e4eb925be8")
            .unwrap();
    let preimage =
        Vec::from_hex("107661134f21fc7c02223d50ab9eb3600bc3ffc3712423a1e47bb1f9a9dbf55f").unwrap();

    // data extracted from predefined
    // TODO: will use directly the public key for FORST, no access to its private key before hand
    let alice = KeyPair::from_secret_key(&secp, &alice_secret);
    let (alice_public_key, _) = alice.x_only_public_key();
    let bob = KeyPair::from_secret_key(&secp, &bob_secret);
    let (bob_public_key, _) = bob.x_only_public_key();
    let internal = KeyPair::from_secret_key(&secp, &internal_secret);
    let (internal_public_key, _) = internal.x_only_public_key();
    let preimage_hash = bitcoin::hashes::sha256::Hash::hash(&preimage);

    println!("alice public key {}", alice.public_key());
    println!("bob public key {}", bob.public_key());
    println!("internal public key {}", internal.public_key());

    println!("preimage {}", preimage_hash.to_string());

    // scripts construction
    let alice_script = create_branch_1(&alice_public_key);
    let bob_script = create_branch_2(&preimage_hash, &bob_public_key);

    println!("alice script {}", alice_script.to_string());
    println!("bob script {}", bob_script.to_string());

    let (tap_info, address) = create_tree(&secp, &internal, &alice_script, &bob_script);

    println!("address {:?}", address);

    let client = Client::new("ssl://electrum.blockstream.info:60002").unwrap();
    let (vec_tx_in, prev_tx) = get_prev_txs(&client, &address);

    // now it is picked manually the highest value
    // TODO: add all the inputs from the script and send that amount of funds
    println!("prev_tx {:?}", prev_tx);

    // creates tx
    let output_address =
        Address::from_str("tb1p5kaqsuted66fldx256lh3en4h9z4uttxuagkwepqlqup6hw639gskndd0z")
            .unwrap();

    // TODO: as decribed above, pick amount using the tapscript key_signed way of adding the funds from all prevouts
    let amount = 399200;
    let mut tx = create_transaction(vec_tx_in, &output_address, amount);

    // sign tx

    // TODO: function that picks the wanted prev_tx, in theory it should be only one.
    // in practice
    // multiple ins because someone sent funds to the address for malicious purposses to pick a lower amount instead
    // => always pick the heightest amount OR add all the amounts
    let prevouts = Prevouts::One(0, prev_tx[3].output[0].clone());
    println!("prevouts {:?}", prevouts);
    tx = sign_tx(
        secp,
        &tx,
        &prevouts,
        &bob_script,
        &bob,
        &tap_info,
        &internal,
        &preimage,
    );

    // broadcast tx
    let tx_id = client.transaction_broadcast(&tx).unwrap();
    println!("transaction hash: {}", tx_id.to_string());
}
