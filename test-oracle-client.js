#!/usr/bin/env node

/**
 * 🔮 Script para probar nuestro cliente Oracle
 * 
 * Este script usa nuestro cliente Oracle para crear un mercado
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Importar nuestro cliente Oracle
const { OracleClient } = require('./src/oracle-client');

// Configuración
const RPC_URL = 'https://api.devnet.solana.com';
const KEYPAIR_PATH = './custom-keypair.json';

// Datos del mercado
const MARKET_DATA = {
  title: "Bitcoin 200K 2026",
  description: "Predicción sobre el precio de Bitcoin para finales de 2026",
  outcomes: ["Sí", "No"],
  endTime: Math.floor(new Date('2026-12-31T23:59:59Z').getTime() / 1000),
  privacyLevel: 1
};

async function testOracleClient() {
  try {
    console.log('🚀 Probando cliente Oracle...');
    
    // Conectar a Solana
    const connection = new Connection(RPC_URL, 'confirmed');
    console.log('✅ Conectado a Solana Devnet');
    
    // Cargar keypair
    const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log('✅ Keypair cargado:', keypair.publicKey.toString());
    
    // Verificar balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💰 Balance:', balance / 1000000000, 'SOL');
    
    // Crear cliente Oracle
    const oracleClient = new OracleClient(connection);
    console.log('✅ Cliente Oracle creado');
    
    // Crear mercado usando nuestro cliente
    console.log('🔮 Creando mercado con cliente Oracle...');
    const result = await oracleClient.createMarket(
      MARKET_DATA.title,
      MARKET_DATA.description,
      MARKET_DATA.endTime,
      MARKET_DATA.outcomes,
      MARKET_DATA.privacyLevel,
      keypair
    );
    
    console.log('🎉 ¡Mercado creado exitosamente!');
    console.log('📊 Resultado:');
    console.log('  - Market Address:', result.marketAddress);
    console.log('  - Signature:', result.signature);
    console.log('  - Explorer:', `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);
    
    return {
      success: true,
      marketAddress: result.marketAddress,
      signature: result.signature,
      explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Ejecutar el script
if (require.main === module) {
  testOracleClient()
    .then(result => {
      if (result.success) {
        console.log('\n🎯 RESULTADO EXITOSO:');
        console.log('✅ Mercado creado con cliente Oracle en Solana Devnet');
        console.log('🔗 Ver en Explorer:', result.explorerUrl);
        process.exit(0);
      } else {
        console.log('\n❌ ERROR:');
        console.log('❌', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { testOracleClient };
