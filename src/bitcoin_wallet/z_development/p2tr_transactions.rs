// will split the method into multiple smaller methods accordingly to the flow needed

// create the alice and bob script and the internal key and send my unspent to it

// create transaction that takes the scripts and spends them all togheter

//
//
// each step here
// function that creates OP_CODE scripts for branches

use std::{collections::BTreeMap, str::FromStr};

use bitcoin::{
    blockdata::{block, opcodes::all, script::Builder},
    psbt::{Prevouts, TapTree},
    schnorr::TapTweak,
    secp256k1::{All, Message, Secp256k1, SecretKey},
    util::{
        sighash::{ScriptPath, SighashCache},
        taproot::{ControlBlock, LeafVersion, TaprootBuilder, TaprootSpendInfo},
    },
    Address, KeyPair, LockTime, Network, OutPoint, PackedLockTime, SchnorrSig, SchnorrSighashType,
    Script, Sequence, Transaction, TxIn, TxOut, Witness, XOnlyPublicKey,
};
use bitcoin_hashes::{hex::FromHex, Hash};
use electrum_client::{Client, ElectrumApi};

use crate::bitcoin_wallet::z_development::helpers;

fn get_total_available_amount(prev_tx: &Vec<Transaction>) -> u64 {
    // let mut amount = 0;
    // for tx in prev_tx {
    //     for out in &tx.output {
    //         amount += out.value;
    //     }
    // }
    // amount
    prev_tx
        .iter()
        .flat_map(|tx| tx.output.iter())
        .map(|out| out.value)
        .sum()
    // TODO: filter only for amounts owned by address
}

fn create_prev_outputs(prev_tx: &Vec<TxIn>) -> Vec<TxIn> {
    let mut prev_outputs: Vec<TxIn> = vec![];
    for tx in prev_tx {
        prev_outputs.push(TxIn {
            previous_output: tx.previous_output.clone(),
            script_sig: Script::new(),
            sequence: Sequence(0xFFFFFFFF),
            witness: Witness::default(),
        })
    }
    prev_outputs
}

// working
fn create_transaction(
    vec_tx_in: &Vec<TxIn>,
    output_address: &Address,
    amount: u64,
    tx_index: usize,
    unlock_block: usize,
) -> Transaction {
    Transaction {
        version: 2,
        lock_time: PackedLockTime(unlock_block as u32),
        // lock_time: LockTime::from_height((unlock_block + 1) as u32)
        //     .unwrap()
        //     .into(),
        input: vec![TxIn {
            previous_output: vec_tx_in[tx_index].previous_output.clone(),
            script_sig: Script::new(),
            sequence: Sequence(0xFFFFFFFF),
            witness: Witness::default(),
        }],
        // input: create_prev_outputs(vec_tx_in), // if all the input txs are used
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

fn prev_outs_txout(prev: &Vec<Transaction>) -> Vec<TxOut> {
    prev.iter()
        .flat_map(|tx| tx.output.clone())
        .collect::<Vec<TxOut>>()
}

fn sign_tx(
    secp: Secp256k1<All>,
    tx_ref: &Transaction,
    prevouts: &Prevouts<TxOut>,
    script: &Script,
    user_key_pair: &KeyPair,
    tap_info: &TaprootSpendInfo,
    internal: &KeyPair,
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
    let sig = secp.sign_schnorr(&Message::from_slice(&sighash_sig).unwrap(), user_key_pair);
    // println!("sig: {}", sig);

    let actual_control = tap_info
        .control_block(&(script.clone(), LeafVersion::TapScript))
        .unwrap();
    // println!("actual_control: {:#?}", actual_control);

    // verify commitment
    let tweak_key_pair = internal.tap_tweak(&secp, tap_info.merkle_root()).to_inner();
    let (tweak_key_pair_public_key, _) = tweak_key_pair.x_only_public_key();
    let res = actual_control.verify_taproot_commitment(&secp, tweak_key_pair_public_key, script);

    let schnorr_sig = SchnorrSig {
        sig,
        hash_ty: SchnorrSighashType::AllPlusAnyoneCanPay,
    };

    let wit = Witness::from_vec(vec![
        schnorr_sig.to_vec(),
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
    // let preimage =
    //     Vec::from_hex("107661134f21fc7c02223d50ab9eb3600bc3ffc3712423a1e47bb1f9a9dbf55f").unwrap();

    // data extracted from predefined
    // TODO: will use directly the public key for FORST, no access to its private key before hand
    let alice = KeyPair::from_secret_key(&secp, &alice_secret);
    let (alice_public_key, _) = alice.x_only_public_key();
    let bob = KeyPair::from_secret_key(&secp, &bob_secret);
    let (bob_public_key, _) = bob.x_only_public_key();
    let internal = KeyPair::from_secret_key(&secp, &internal_secret);
    let (internal_public_key, _) = internal.x_only_public_key();
    // let preimage_hash = bitcoin::hashes::sha256::Hash::hash(&preimage);

    println!("alice public key {}", alice.public_key());
    println!("bob public key {}", bob.public_key());
    println!("internal public key {}", internal.public_key());

    // println!("preimage {}", preimage_hash.to_string());

    let client = Client::new("ssl://electrum.blockstream.info:60002").unwrap();
    // get the current block height using the client
    let block_height = helpers::get_current_block_height(&client);

    // write it for 2 blocks from this moment
    // new address is this
    // new object is this
    let unlock_block = 2427365;
    //  2424648 + 2; //2427237

    println!("unlock block {}", unlock_block);

    // scripts construction
    let alice_script = helpers::create_script_refund(&alice_public_key, unlock_block);
    let bob_script = helpers::create_script_pox(&bob_public_key);

    println!("alice script {}", alice_script.to_string());
    println!("bob script {}", bob_script.to_string());

    let (tap_info, address) = helpers::create_tree(&secp, &internal, &alice_script, &bob_script);

    println!("address {:?}", address);
    println!("current block heigh {}", block_height);
    let (vec_tx_in, prev_tx) = helpers::get_prev_txs(&client, &address);

    // creates tx
    let output_address =
        Address::from_str("tb1p5cqxec8l6nxnw0lxay4qxuq2kx4w0n5vmfnp36z4746zdpw462eqy9wmy0")
            .unwrap();
    // let output_address = Address::from_str("tb1q6vgmar6dvshat2eqnkq20nuwrth75pnuz5fk2g").unwrap();

    // gets the best prev out to spend and saves the index of the tx and of the output
    let (best_prev_tx_index, best_prev_out_index) =
        helpers::get_best_prev_to_spend_index(&prev_tx, &address);

    // let total = get_total_available_amount(&prev_tx);
    let total = helpers::get_best_amount(
        &prev_tx,
        best_prev_tx_index as usize,
        best_prev_out_index as usize,
    );
    println!(
        "is lock height {:?}",
        LockTime::from_height(block_height as u32)
    );

    println!("total {}", total);
    println!("packed lock time: {}", PackedLockTime(block_height as u32));

    let fees = 300;
    let amount = total - fees;
    println!("amount this {}", amount);
    let mut tx = create_transaction(
        &vec_tx_in,
        &output_address,
        amount,
        best_prev_tx_index as usize,
        block_height,
    );

    // sign tx
    let prevouts = Prevouts::One(
        0,
        prev_tx[best_prev_tx_index as usize].output[best_prev_out_index as usize].clone(),
    );

    // should sign all prevouts
    // let prev_out_tx_total = prev_outs_txout(&prev_tx);
    // let prevouts = Prevouts::All(&prev_out_tx_total);
    println!("prevouts {:?}", prevouts);

    println!("tx before signing {:?}", tx);

    // alice signing method - not working
    tx = sign_tx(
        secp,
        &tx,
        &prevouts,
        &alice_script,
        &alice,
        &tap_info,
        &internal,
    );

    // bob signing method
    // tx = sign_tx(
    //     secp,
    //     &tx,
    //     &prevouts,
    //     &bob_script,
    //     &bob,
    //     &tap_info,
    //     &internal,
    // );

    // broadcast tx
    let tx_id = client.transaction_broadcast(&tx).unwrap();
    println!("transaction hash: {}", tx_id.to_string());
}
