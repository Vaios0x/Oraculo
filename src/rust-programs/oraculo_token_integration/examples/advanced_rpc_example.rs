use oraculo_token_integration::client::{OraculoClient, utils};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
};
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Oráculo Advanced RPC Methods Example");
    println!("======================================");

    // Crear cliente para devnet
    let client = utils::create_devnet_client("11111111111111111111111111111111")?;
    
    // Crear RPC client directo para métodos avanzados
    let rpc_client = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );

    println!("✅ Cliente RPC avanzado creado exitosamente");

    // ==================== Token Methods ====================
    println!("\n🪙 Token Methods");
    println!("=================");

    // Ejemplo con USDC (mint conocido)
    let usdc_mint = Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")?;
    
    // Obtener suministro de token
    match rpc_client.get_token_supply(&usdc_mint) {
        Ok(supply) => {
            println!("💰 USDC Supply:");
            println!("   Amount: {}", supply.amount);
            println!("   Decimals: {}", supply.decimals);
            println!("   UI Amount: {:?}", supply.ui_amount);
            println!("   UI Amount String: {}", supply.ui_amount_string);
        }
        Err(e) => println!("❌ Error getting token supply: {}", e),
    }

    // Obtener cuentas más grandes del token
    match rpc_client.get_token_largest_accounts(&usdc_mint) {
        Ok(accounts) => {
            println!("🏆 USDC Largest Accounts ({} found):", accounts.value.len());
            for (i, account) in accounts.value.iter().take(3).enumerate() {
                println!("   {}. {}: {} tokens", 
                    i + 1, account.address, account.ui_amount_string);
            }
        }
        Err(e) => println!("❌ Error getting token largest accounts: {}", e),
    }

    // ==================== Transaction Methods ====================
    println!("\n💸 Advanced Transaction Methods");
    println!("================================");

    // Obtener conteo de transacciones
    match rpc_client.get_transaction_count() {
        Ok(count) => {
            println!("📊 Total Transactions: {}", count);
        }
        Err(e) => println!("❌ Error getting transaction count: {}", e),
    }

    // Simular una transacción (ejemplo con transfer)
    let test_keypair = Keypair::new();
    let recipient = Pubkey::new_unique();
    
    // Crear una transacción de transfer simple
    let transfer_instruction = solana_sdk::system_instruction::transfer(
        &test_keypair.pubkey(),
        &recipient,
        1000, // 1000 lamports
    );
    
    let recent_blockhash = rpc_client.get_latest_blockhash()?;
    let transaction = solana_sdk::transaction::Transaction::new_signed_with_payer(
        &[transfer_instruction],
        Some(&test_keypair.pubkey()),
        &[&test_keypair],
        recent_blockhash,
    );

    // Simular la transacción
    match rpc_client.simulate_transaction(&transaction) {
        Ok(result) => {
            println!("🧪 Transaction Simulation:");
            println!("   Success: {}", result.value.err.is_none());
            if let Some(err) = result.value.err {
                println!("   Error: {:?}", err);
            }
            if let Some(logs) = result.value.logs {
                println!("   Logs: {:?}", logs);
            }
            if let Some(units) = result.value.units_consumed {
                println!("   Compute Units: {}", units);
            }
        }
        Err(e) => println!("❌ Error simulating transaction: {}", e),
    }

    // ==================== Blockhash Methods ====================
    println!("\n🔗 Blockhash Methods");
    println!("====================");

    // Obtener hash de bloque más reciente
    match rpc_client.get_latest_blockhash() {
        Ok(blockhash) => {
            println!("🔗 Latest Blockhash: {}", blockhash.blockhash);
            println!("   Last Valid Block Height: {}", blockhash.last_valid_block_height);
        }
        Err(e) => println!("❌ Error getting latest blockhash: {}", e),
    }

    // Verificar si un blockhash es válido
    let test_blockhash = "J7rBdM6AecPDEZp8aPq5iPSNKVkU5Q76F3oAV4eW5wsW";
    match rpc_client.is_blockhash_valid(&test_blockhash) {
        Ok(is_valid) => {
            println!("✅ Blockhash {} is valid: {}", test_blockhash, is_valid);
        }
        Err(e) => println!("❌ Error checking blockhash validity: {}", e),
    }

    // ==================== Utility Methods ====================
    println!("\n🔧 Utility Methods");
    println!("==================");

    // Obtener slot mínimo del ledger
    match rpc_client.get_minimum_ledger_slot() {
        Ok(slot) => {
            println!("📦 Minimum Ledger Slot: {}", slot);
        }
        Err(e) => println!("❌ Error getting minimum ledger slot: {}", e),
    }

    // Obtener versión del nodo
    match rpc_client.get_version() {
        Ok(version) => {
            println!("🔧 Node Version:");
            println!("   Solana Core: {}", version.solana_core);
            println!("   Feature Set: {}", version.feature_set);
        }
        Err(e) => println!("❌ Error getting version: {}", e),
    }

    // Obtener cuentas de voto
    match rpc_client.get_vote_accounts() {
        Ok(vote_accounts) => {
            println!("🗳️ Vote Accounts:");
            println!("   Current: {}", vote_accounts.current.len());
            println!("   Delinquent: {}", vote_accounts.delinquent.len());
            
            if !vote_accounts.current.is_empty() {
                let first_vote = &vote_accounts.current[0];
                println!("   First Vote Account:");
                println!("     Vote Pubkey: {}", first_vote.vote_pubkey);
                println!("     Node Pubkey: {}", first_vote.node_pubkey);
                println!("     Activated Stake: {}", first_vote.activated_stake);
                println!("     Commission: {}%", first_vote.commission);
            }
        }
        Err(e) => println!("❌ Error getting vote accounts: {}", e),
    }

    // ==================== Airdrop Methods ====================
    println!("\n💧 Airdrop Methods");
    println!("==================");

    // Solicitar airdrop (solo funciona en devnet/testnet)
    let test_pubkey = Pubkey::new_unique();
    let airdrop_amount = 1_000_000_000; // 1 SOL
    
    match rpc_client.request_airdrop(&test_pubkey, airdrop_amount) {
        Ok(signature) => {
            println!("💧 Airdrop requested:");
            println!("   Recipient: {}", test_pubkey);
            println!("   Amount: {} lamports", airdrop_amount);
            println!("   Signature: {}", signature);
            
            // Verificar el airdrop
            tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            match rpc_client.get_balance(&test_pubkey) {
                Ok(balance) => {
                    println!("   ✅ Balance after airdrop: {} lamports", balance);
                }
                Err(e) => println!("   ❌ Error checking balance: {}", e),
            }
        }
        Err(e) => println!("❌ Error requesting airdrop: {}", e),
    }

    // ==================== Advanced Monitoring ====================
    println!("\n👀 Advanced Monitoring");
    println!("======================");

    // Monitorear slot por 10 segundos
    println!("🔍 Monitoring slot changes for 10 seconds...");
    let start_slot = rpc_client.get_slot()?;
    println!("   Initial slot: {}", start_slot);
    
    for i in 1..=5 {
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
        match rpc_client.get_slot() {
            Ok(current_slot) => {
                let progress = current_slot - start_slot;
                println!("   Check {}: Slot {} (+{})", i, current_slot, progress);
            }
            Err(e) => println!("   Check {}: Error - {}", i, e),
        }
    }

    // ==================== Batch Operations ====================
    println!("\n📦 Batch Operations");
    println!("==================");

    // Ejecutar múltiples operaciones en lote
    let batch_operations = vec![
        rpc_client.get_slot(),
        rpc_client.get_block_height(),
        rpc_client.get_health(),
        rpc_client.get_identity(),
    ];

    println!("🚀 Executing batch operations...");
    let start_time = std::time::Instant::now();
    
    let results = futures::future::join_all(batch_operations).await;
    let duration = start_time.elapsed();
    
    println!("✅ Batch operations completed in {:?}", duration);
    
    for (i, result) in results.iter().enumerate() {
        match result {
            Ok(value) => println!("   {}. Success: {:?}", i + 1, value),
            Err(e) => println!("   {}. Error: {}", i + 1, e),
        }
    }

    // ==================== Error Handling Examples ====================
    println!("\n🛡️ Error Handling Examples");
    println!("==========================");

    // Ejemplo de manejo de errores con retry
    let mut retry_count = 0;
    let max_retries = 3;
    
    loop {
        match rpc_client.get_health() {
            Ok(health) => {
                println!("💚 Health check successful: {}", health);
                break;
            }
            Err(e) => {
                retry_count += 1;
                if retry_count >= max_retries {
                    println!("❌ Health check failed after {} retries: {}", max_retries, e);
                    break;
                }
                println!("⚠️ Health check failed (attempt {}), retrying...", retry_count);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }

    println!("\n🎉 Advanced RPC Methods example completed successfully!");
    println!("=====================================================");
    
    Ok(())
}
