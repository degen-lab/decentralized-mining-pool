use std::{env, str::FromStr};

use bitcoin::secp256k1::{rand::rngs::OsRng, SecretKey};
use bitcoin_wallet::{
    configuration::tap_script_demo::script_demo, constants::SEED,
    input_data::regtest_call::RegtestCall,
};

use bitcoin_wallet::z_development::this_tap_script_with_tap::Test_tap_with_tap;

use electrum_client::{Client, ElectrumApi};
use simple_wallet::{p2tr_key::p2tr, p2wpkh::p2wpkh};

pub mod bitcoin_wallet;
pub mod simple_wallet;

fn main() {
    env::set_var("RUST_BACKTRACE", "full");

    // let client = RegtestCall::init(
    //     &vec!["bcrt1prnpxwf9tpjm4jll4ts72s2xscq66qxep6w9hf6sqnvwe9t4gvqasklfhyj"],
    //     "regtest11112",
    //     150,
    // );

    // p2tr(Some(SEED), client);

    //dsa
    Test_tap_with_tap();

    // let client = Client::new("ssl://localhost:18443/").unwrap();
    // let header = client.block_headers_subscribe().unwrap();
    // println!("test client {:?}",);
}

// #[test]
// fn test_tap_root_key_sig() {
//     println!("Testing layer 1 pay to tap root with key signature");
//     let client = RegtestCall::init(
//         &vec!["bcrt1prnpxwf9tpjm4jll4ts72s2xscq66qxep6w9hf6sqnvwe9t4gvqasklfhyj"],
//         "my_wallet",
//         150,
//     );
//     p2tr(Some(SEED), client);
// }

// #[test]
// fn test_pay_2_witness_public_key_hash() {
//     println!("Testing layer 1 pay to witness public key signature");
//     let client = RegtestCall::init(
//         &vec!["bcrt1qzvsdwjay5x69088n27h0qgu0tm4u6gwqgxna9d"],
//         "my_wallet",
//         150,
//     );
//     p2wpkh(Some(SEED), client);
// }
