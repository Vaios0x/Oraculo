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
    println!("🚀 Oráculo RPC Methods Example");
    println!("==============================");

    // Crear cliente para devnet
    let client = utils::create_devnet_client("11111111111111111111111111111111")?;
    
    // Crear RPC client directo para métodos avanzados
    let rpc_client = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );

    println!("✅ Cliente RPC creado exitosamente");

    // ==================== Account Methods ====================
    println!("\n📊 Account Methods");
    println!("==================");

    // Obtener información de una cuenta
    let test_pubkey = Pubkey::new_unique();
    match rpc_client.get_account(&test_pubkey) {
        Ok(Some(account)) => {
            println!("✅ Account Info:");
            println!("   Lamports: {}", account.lamports);
            println!("   Owner: {}", account.owner);
            println!("   Executable: {}", account.executable);
            println!("   Rent Epoch: {}", account.rent_epoch);
        }
        Ok(None) => println!("ℹ️  Account not found"),
        Err(e) => println!("❌ Error getting account: {}", e),
    }

    // Obtener balance
    match rpc_client.get_balance(&test_pubkey) {
        Ok(balance) => {
            println!("💰 Balance: {} lamports ({:.6} SOL)", 
                balance, balance as f64 / 1_000_000_000.0);
        }
        Err(e) => println!("❌ Error getting balance: {}", e),
    }

    // ==================== Block Methods ====================
    println!("\n📦 Block Methods");
    println!("=================");

    // Obtener slot actual
    match rpc_client.get_slot() {
        Ok(slot) => {
            println!("🎯 Current Slot: {}", slot);
        }
        Err(e) => println!("❌ Error getting slot: {}", e),
    }

    // Obtener altura del bloque
    match rpc_client.get_block_height() {
        Ok(height) => {
            println!("📏 Block Height: {}", height);
        }
        Err(e) => println!("❌ Error getting block height: {}", e),
    }

    // Obtener slot líder
    match rpc_client.get_slot_leader() {
        Ok(leader) => {
            println!("👑 Slot Leader: {}", leader);
        }
        Err(e) => println!("❌ Error getting slot leader: {}", e),
    }

    // Obtener información de época
    match rpc_client.get_epoch_info() {
        Ok(epoch_info) => {
            println!("📅 Epoch Info:");
            println!("   Epoch: {}", epoch_info.epoch);
            println!("   Slot Index: {}", epoch_info.slot_index);
            println!("   Slots in Epoch: {}", epoch_info.slots_in_epoch);
            println!("   Absolute Slot: {}", epoch_info.absolute_slot);
        }
        Err(e) => println!("❌ Error getting epoch info: {}", e),
    }

    // ==================== Transaction Methods ====================
    println!("\n💸 Transaction Methods");
    println!("======================");

    // Obtener firmas para una dirección (usando una dirección conocida)
    let known_address = Pubkey::from_str("11111111111111111111111111111111")?;
    match rpc_client.get_signatures_for_address(&known_address, Some(5)) {
        Ok(signatures) => {
            println!("📝 Recent Signatures ({} found):", signatures.len());
            for (i, sig) in signatures.iter().enumerate().take(3) {
                println!("   {}. {} (Slot: {})", i + 1, sig.signature, sig.slot);
            }
        }
        Err(e) => println!("❌ Error getting signatures: {}", e),
    }

    // ==================== Supply Methods ====================
    println!("\n💰 Supply Methods");
    println!("==================");

    // Obtener información de suministro
    match rpc_client.get_supply() {
        Ok(supply) => {
            println!("💎 Supply Information:");
            println!("   Total: {} SOL", supply.value.total as f64 / 1_000_000_000.0);
            println!("   Circulating: {} SOL", supply.value.circulating as f64 / 1_000_000_000.0);
            println!("   Non-Circulating: {} SOL", supply.value.non_circulating as f64 / 1_000_000_000.0);
        }
        Err(e) => println!("❌ Error getting supply: {}", e),
    }

    // Obtener cuentas más grandes
    match rpc_client.get_largest_accounts() {
        Ok(accounts) => {
            println!("🏆 Largest Accounts ({} found):", accounts.value.len());
            for (i, account) in accounts.value.iter().take(3).enumerate() {
                println!("   {}. {}: {} lamports", 
                    i + 1, account.address, account.lamports);
            }
        }
        Err(e) => println!("❌ Error getting largest accounts: {}", e),
    }

    // ==================== Performance Methods ====================
    println!("\n⚡ Performance Methods");
    println!("=======================");

    // Obtener muestras de rendimiento
    match rpc_client.get_recent_performance_samples(Some(3)) {
        Ok(samples) => {
            println!("📊 Recent Performance Samples:");
            for (i, sample) in samples.iter().enumerate() {
                let tps = sample.num_transactions as f64 / sample.sample_period_secs as f64;
                println!("   {}. Slot {}: {} txns in {}s ({:.2} TPS)", 
                    i + 1, sample.slot, sample.num_transactions, 
                    sample.sample_period_secs, tps);
            }
        }
        Err(e) => println!("❌ Error getting performance samples: {}", e),
    }

    // ==================== Health Methods ====================
    println!("\n🏥 Health Methods");
    println!("==================");

    // Verificar salud del nodo
    match rpc_client.get_health() {
        Ok(health) => {
            println!("💚 Node Health: {}", health);
        }
        Err(e) => println!("❌ Error getting health: {}", e),
    }

    // Obtener identidad del nodo
    match rpc_client.get_identity() {
        Ok(identity) => {
            println!("🆔 Node Identity: {}", identity.identity);
        }
        Err(e) => println!("❌ Error getting identity: {}", e),
    }

    // ==================== Utility Methods ====================
    println!("\n🔧 Utility Methods");
    println!("==================");

    // Obtener hash de bloque más reciente
    match rpc_client.get_latest_blockhash() {
        Ok(blockhash) => {
            println!("🔗 Latest Blockhash: {}", blockhash.blockhash);
            println!("   Last Valid Block Height: {}", blockhash.last_valid_block_height);
        }
        Err(e) => println!("❌ Error getting latest blockhash: {}", e),
    }

    // Obtener mínimo balance para exención de renta
    let data_length = 100;
    match rpc_client.get_minimum_balance_for_rent_exemption(data_length) {
        Ok(min_balance) => {
            println!("💸 Minimum Balance for {} bytes: {} lamports", 
                data_length, min_balance);
        }
        Err(e) => println!("❌ Error getting minimum balance: {}", e),
    }

    // ==================== Batch Operations ====================
    println!("\n📦 Batch Operations");
    println!("===================");

    // Ejecutar múltiples operaciones en lote
    let batch_operations = vec![
        rpc_client.get_slot(),
        rpc_client.get_block_height(),
        rpc_client.get_health(),
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

    // ==================== Monitoring Example ====================
    println!("\n👀 Monitoring Example");
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

    println!("\n🎉 RPC Methods example completed successfully!");
    println!("=============================================");
    
    Ok(())
}
