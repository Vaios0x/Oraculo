use oraculo_token_integration::client::{OraculoClient, utils};
use solana_sdk::{
    signature::{Keypair, Signer},
    pubkey::Pubkey,
    system_instruction,
};
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Oráculo Client Example");
    println!("========================");

    // Crear cliente para devnet
    let program_id = "11111111111111111111111111111111"; // Reemplazar con el ID real del programa
    let client = utils::create_devnet_client(program_id)?;
    
    // Crear keypairs para testing
    let payer = Keypair::new();
    let market_account = Keypair::new();
    let bettor = Keypair::new();
    
    println!("✅ Cliente creado exitosamente");
    println!("📊 Program ID: {}", program_id);
    println!("👤 Payer: {}", payer.pubkey());
    println!("🏪 Market Account: {}", market_account.pubkey());
    println!("🎯 Bettor: {}", bettor.pubkey());

    // Ejemplo de crear un mercado
    println!("\n📈 Creando mercado de predicción...");
    
    let title = "¿Bitcoin llegará a $100k en 2024?".to_string();
    let description = "Un mercado de predicción sobre el precio de Bitcoin".to_string();
    let end_time = 1735689600; // 31 de diciembre de 2024
    let outcome_options = vec!["Sí".to_string(), "No".to_string()];
    let token_decimals = 9;
    
    // Crear token mint (simulado)
    let token_mint = Pubkey::new_unique();
    let market_token_account = Pubkey::new_unique();
    
    match client.create_market(
        &payer,
        &market_account,
        &token_mint,
        &market_token_account,
        title.clone(),
        description.clone(),
        end_time,
        outcome_options.clone(),
        token_decimals,
    ) {
        Ok(signature) => {
            println!("✅ Mercado creado exitosamente!");
            println!("📝 Transaction signature: {}", signature);
        }
        Err(e) => {
            println!("❌ Error creando mercado: {}", e);
        }
    }

    // Ejemplo de hacer una apuesta
    println!("\n🎯 Haciendo apuesta...");
    
    let market_id = market_account.pubkey();
    let bettor_token_account = Pubkey::new_unique();
    let outcome_index = 0; // "Sí"
    let amount = 1_000_000; // 1 SOL (en lamports)
    
    match client.stake_tokens(
        &bettor,
        &market_id,
        &bettor_token_account,
        &market_token_account,
        market_id,
        outcome_index,
        amount,
    ) {
        Ok(signature) => {
            println!("✅ Apuesta realizada exitosamente!");
            println!("📝 Transaction signature: {}", signature);
            println!("💰 Cantidad apostada: {} lamports", amount);
            println!("🎯 Opción seleccionada: {}", outcome_options[outcome_index as usize]);
        }
        Err(e) => {
            println!("❌ Error realizando apuesta: {}", e);
        }
    }

    // Ejemplo de distribuir ganancias
    println!("\n🏆 Distribuyendo ganancias...");
    
    let winning_outcome = 0; // "Sí" ganó
    
    match client.distribute_winnings(
        &payer,
        &market_id,
        &market_token_account,
        market_id,
        winning_outcome,
    ) {
        Ok(signature) => {
            println!("✅ Ganancias distribuidas exitosamente!");
            println!("📝 Transaction signature: {}", signature);
            println!("🏆 Resultado ganador: {}", outcome_options[winning_outcome as usize]);
        }
        Err(e) => {
            println!("❌ Error distribuyendo ganancias: {}", e);
        }
    }

    // Ejemplo de obtener información del mercado
    println!("\n📊 Obteniendo información del mercado...");
    
    match client.get_market(&market_id) {
        Ok(market) => {
            println!("✅ Información del mercado obtenida:");
            println!("📝 Título: {}", market.title);
            println!("📄 Descripción: {}", market.description);
            println!("⏰ Tiempo de finalización: {}", market.end_time);
            println!("🎯 Opciones: {:?}", market.outcome_options);
            println!("💰 Total apostado: {}", market.total_staked);
            println!("📊 Apuestas por opción: {:?}", market.outcome_stakes);
            println!("🏁 Resuelto: {}", market.is_resolved);
            if let Some(winner) = market.winning_outcome {
                println!("🏆 Ganador: {}", winner);
            }
        }
        Err(e) => {
            println!("❌ Error obteniendo información del mercado: {}", e);
        }
    }

    // Ejemplo de obtener balance
    println!("\n💰 Obteniendo balance...");
    
    match client.get_balance(&payer.pubkey()) {
        Ok(balance) => {
            println!("✅ Balance obtenido:");
            println!("👤 Payer balance: {} lamports", balance);
            println!("💵 Balance en SOL: {:.6}", balance as f64 / 1_000_000_000.0);
        }
        Err(e) => {
            println!("❌ Error obteniendo balance: {}", e);
        }
    }

    println!("\n🎉 Ejemplo completado exitosamente!");
    println!("=====================================");
    
    Ok(())
}
