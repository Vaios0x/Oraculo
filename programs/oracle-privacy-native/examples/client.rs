use oracle_privacy_native::{OracleInstruction, MarketAccount, BetAccount};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_program,
    transaction::Transaction,
};
use std::str::FromStr;

#[tokio::main]
async fn main() {
    // Replace with your actual program ID from deployment
    let program_id = Pubkey::from_str("DPdNmG6KptafxXNpeTX2UEnuVqikTh5WWjumsrnzoGo1")
        .expect("Invalid program ID");

    // Connect to devnet
    let rpc_url = String::from("https://api.devnet.solana.com");
    let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    // Generate a new keypair for paying fees
    let payer = Keypair::new();

    // Request airdrop of 2 SOL for transaction fees
    println!("Requesting airdrop...");
    let airdrop_signature = client
        .request_airdrop(&payer.pubkey(), 2_000_000_000)
        .expect("Failed to request airdrop");

    // Wait for airdrop confirmation
    loop {
        if client
            .confirm_transaction(&airdrop_signature)
            .unwrap_or(false)
        {
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(500));
    }
    println!("Airdrop confirmed");

    // Create a new prediction market
    println!("\nCreating prediction market...");
    let market_keypair = Keypair::new();
    let title = "Will Bitcoin reach $100k in 2024?";
    let description = "A prediction market about Bitcoin's price reaching $100k by the end of 2024";
    let end_time = 1735689600; // End of 2024
    let outcomes = vec!["Yes".to_string(), "No".to_string()];
    let privacy_level = 1; // Private

    // Serialize the create market instruction
    let instruction_data = borsh::to_vec(&OracleInstruction::CreateMarket {
        title: title.to_string(),
        description: description.to_string(),
        end_time,
        outcomes: outcomes.clone(),
        privacy_level,
    })
    .expect("Failed to serialize instruction");

    let create_instruction = Instruction::new_with_bytes(
        program_id,
        &instruction_data,
        vec![
            AccountMeta::new(market_keypair.pubkey(), true),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
    );

    let mut transaction = Transaction::new_with_payer(&[create_instruction], Some(&payer.pubkey()));

    let blockhash = client
        .get_latest_blockhash()
        .expect("Failed to get blockhash");
    transaction.sign(&[&payer, &market_keypair], blockhash);

    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            println!("Market created successfully!");
            println!("Transaction: {}", signature);
            println!("Market address: {}", market_keypair.pubkey());
            println!("Title: {}", title);
            println!("Outcomes: {:?}", outcomes);
        }
        Err(err) => {
            eprintln!("Failed to create market: {}", err);
            return;
        }
    }

    // Place a bet on the market
    println!("\nPlacing a bet...");
    let bet_keypair = Keypair::new();
    let outcome_index = 0; // "Yes"
    let amount = 1000000; // 0.001 SOL
    let commitment_hash = [1u8; 32];

    // Serialize the place bet instruction
    let bet_instruction_data = borsh::to_vec(&OracleInstruction::PlaceBet {
        outcome_index,
        amount,
        commitment_hash,
    })
    .expect("Failed to serialize instruction");

    let bet_instruction = Instruction::new_with_bytes(
        program_id,
        &bet_instruction_data,
        vec![
            AccountMeta::new(market_keypair.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new(bet_keypair.pubkey(), true),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
    );

    let mut transaction = Transaction::new_with_payer(&[bet_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &bet_keypair], blockhash);

    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            println!("Bet placed successfully!");
            println!("Transaction: {}", signature);
            println!("Bet address: {}", bet_keypair.pubkey());
            println!("Amount: {} lamports on outcome {}", amount, outcome_index);
        }
        Err(err) => {
            eprintln!("Failed to place bet: {}", err);
            return;
        }
    }

    // Resolve the market
    println!("\nResolving market...");
    let winning_outcome = 0; // "Yes"
    let resolution_proof = [2u8; 32];

    // Serialize the resolve market instruction
    let resolve_instruction_data = borsh::to_vec(&OracleInstruction::ResolveMarket {
        winning_outcome,
        resolution_proof,
    })
    .expect("Failed to serialize instruction");

    let resolve_instruction = Instruction::new_with_bytes(
        program_id,
        &resolve_instruction_data,
        vec![
            AccountMeta::new(market_keypair.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
        ],
    );

    let mut transaction = Transaction::new_with_payer(&[resolve_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer], blockhash);

    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            println!("Market resolved successfully!");
            println!("Transaction: {}", signature);
            println!("Winning outcome: {}", winning_outcome);
        }
        Err(err) => {
            eprintln!("Failed to resolve market: {}", err);
            return;
        }
    }

    // Claim winnings
    println!("\nClaiming winnings...");
    let bet_proof = [3u8; 32];

    // Serialize the claim winnings instruction
    let claim_instruction_data = borsh::to_vec(&OracleInstruction::ClaimWinnings {
        bet_proof,
    })
    .expect("Failed to serialize instruction");

    let claim_instruction = Instruction::new_with_bytes(
        program_id,
        &claim_instruction_data,
        vec![
            AccountMeta::new(market_keypair.pubkey(), false),
            AccountMeta::new(bet_keypair.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
    );

    let mut transaction = Transaction::new_with_payer(&[claim_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer], blockhash);

    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            println!("Winnings claimed successfully!");
            println!("Transaction: {}", signature);
        }
        Err(err) => {
            eprintln!("Failed to claim winnings: {}", err);
        }
    }

    println!("\n🎉 Oracle program demo completed successfully!");
}
