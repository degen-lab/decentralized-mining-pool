use std::{str::FromStr};

use bitcoin::{blockdata::{opcodes::all, script::Builder}, psbt::{Input, PartiallySignedTransaction}, secp256k1::{All, Message, Scalar, Secp256k1, SecretKey}, util::sighash::SighashCache, Address, EcdsaSig, EcdsaSighashType, PackedLockTime, PrivateKey, PublicKey, Transaction, TxOut, Script};

use miniscript::psbt::PsbtExt;

use crate::bitcoin_wallet::{
    constants::NETWORK,
    input_data::{RpcCall},
};

use electrum_client::{Client, ElectrumApi};

pub fn p2wpkh_electrum(secret_string: Option<&str>, client: &Client, amount_spent: u64, output_script: &Script) {
    let secp = Secp256k1::new();
    let private_key = from_seed(&secret_string);
    let address = Address::p2wpkh(&private_key.public_key(&secp), NETWORK).unwrap();

    println!("address {}", address.to_string());

    if (secret_string.is_none()) {
        return;
    }


    let (tx_in_list, transaction_list) = crate::bitcoin_wallet::z_development::helpers::get_prev_txs(&client, &address);


    let prevouts = transaction_list
        .iter()
        .flat_map(|tx| tx.output.clone())
        .filter(|p| address.script_pubkey().eq(&p.script_pubkey))
        .collect::<Vec<TxOut>>();
    let total: u64 = prevouts.iter().map(|tx_out| tx_out.value).sum();

    let out_put = create_output(total, amount_spent, output_script.clone(), address.script_pubkey());

    let unsigned_tx = Transaction {
        version: 2,
        lock_time: PackedLockTime(0),
        input: tx_in_list,
        output: out_put,
    };

    let mut psbt = PartiallySignedTransaction::from_unsigned_tx(unsigned_tx.clone()).unwrap();

    psbt.inputs = sign_all_unsigned_tx(&secp, &prevouts, &unsigned_tx, &private_key);

    let transaction = psbt.finalize(&secp).unwrap().extract_tx().clone();
    let hash = client.transaction_broadcast(&transaction);
    println!("Hash of transaction {}", hash.unwrap());
}

fn create_output(total: u64, amount_spent: u64, output_script: Script, my_address: Script) -> Vec<TxOut> {
    // 300 is the fee
    let send_amt = (total - 300);
    println!("Total {}, {}", total, amount_spent);
    let out_put = vec![
        TxOut {
            value: amount_spent,
            script_pubkey: output_script,
        },
        TxOut {
            value: send_amt - amount_spent,
            script_pubkey: my_address,
        },
    ];
    out_put
}

fn sign_all_unsigned_tx(
    secp: &Secp256k1<All>,
    prevouts: &Vec<TxOut>,
    unsigned_tx: &Transaction,
    private_key: &PrivateKey,
) -> Vec<Input> {
    return prevouts
        .iter()
        .enumerate()
        .map(|(index, tx_out)| sign_tx(secp, index, unsigned_tx, private_key, tx_out).clone())
        .collect();
}

fn sign_tx(
    secp: &Secp256k1<All>,
    index: usize,
    unsigned_tx: &Transaction,
    private_key: &PrivateKey,
    tx_out: &TxOut,
) -> Input {
    let script_pubkey = Builder::new()
        .push_opcode(all::OP_DUP)
        .push_opcode(all::OP_HASH160)
        .push_slice(&tx_out.script_pubkey[2..])
        .push_opcode(all::OP_EQUALVERIFY)
        .push_opcode(all::OP_CHECKSIG)
        .into_script();
    let hash_ty = EcdsaSighashType::All;
    let sighash = SighashCache::new(&mut unsigned_tx.clone())
        .segwit_signature_hash(index, &script_pubkey, tx_out.value, hash_ty)
        .unwrap();

    let message = Message::from_slice(&sighash).unwrap();

    let sig = secp.sign_ecdsa(&message, &private_key.inner);

    let ecdsa_sig = EcdsaSig { sig, hash_ty };

    let mut input = Input::default();

    input.witness_script = Some(tx_out.script_pubkey.clone());

    input
        .partial_sigs
        .insert(PublicKey::from_private_key(&secp, private_key), ecdsa_sig);

    input.witness_utxo = Some(tx_out.clone());

    return input;
}

pub fn from_seed(secret_string: &Option<&str>) -> PrivateKey {
    let scalar = Scalar::random();
    let secret = match secret_string {
        Some(sec_str) => SecretKey::from_str(&sec_str).unwrap(),
        None => {
            let secret_key = SecretKey::from_slice(&scalar.to_be_bytes()).unwrap();
            println!("secret_key: {}", secret_key.display_secret());
            secret_key
        }
    };
    return PrivateKey::new(secret, NETWORK);
}

pub fn from_prv(secret_string: &Option<&str>) -> PrivateKey {
    let scalar = Scalar::random();
    return match secret_string {
        Some(sec_str) => PrivateKey::from_str(&sec_str).unwrap(),
        None => {
            let secret_key = SecretKey::from_slice(&scalar.to_be_bytes()).unwrap();
            println!("secret_key: {}", secret_key.display_secret());
            PrivateKey::new(secret_key, NETWORK)
        }
    };
}
