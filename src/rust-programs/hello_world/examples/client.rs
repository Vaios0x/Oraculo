use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::Instruction,
    message::Message,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_instruction,
    transaction::Transaction,
};

// Replace with your program ID
const PROGRAM_ID: &str = "4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create connection to local validator
    let rpc_url = "http://localhost:8899";
    let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    // Create a new keypair for the transaction payer
    let payer = Keypair::new();
    println!("Payer: {}", payer.pubkey());

    // Airdrop some SOL to the payer
    let airdrop_signature = client
        .request_airdrop(&payer.pubkey(), 1_000_000_000)
        .await?;
    client.confirm_transaction(&airdrop_signature).await?;
    println!("Airdrop signature: {}", airdrop_signature);

    // Parse the program ID
    let program_id = PROGRAM_ID.parse::<Pubkey>()?;

    // Create instruction to invoke the hello world program
    let instruction = Instruction::new_with_bytes(program_id, &[], vec![]);

    // Create and send transaction
    let message = Message::new(&[instruction], Some(&payer.pubkey()));
    let transaction = Transaction::new(&[&payer], message, client.get_latest_blockhash().await?);

    let signature = client.send_and_confirm_transaction(&transaction).await?;
    println!("Transaction signature: {}", signature);

    Ok(())
}
