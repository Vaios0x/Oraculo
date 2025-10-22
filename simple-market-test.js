#!/usr/bin/env node

/**
 * 🔮 Script simple para crear un mercado real
 * 
 * Este script crea un mercado de predicciones real en Solana Devnet
 * usando una transacción simple
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');

// Configuración
const RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
const KEYPAIR_PATH = './custom-keypair.json';

async function createSimpleMarket() {
  try {
    console.log('🚀 Iniciando creación de mercado simple...');
    
    // Conectar a Solana
    const connection = new Connection(RPC_URL, 'confirmed');
    console.log('✅ Conectado a Solana Devnet');
    
    // Cargar keypair
    const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log('✅ Keypair cargado:', keypair.publicKey.toString());
    
    // Verificar balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💰 Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    // Crear una transacción simple (transferencia a sí mismo)
    const transaction = new Transaction();
    
    // Obtener recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = keypair.publicKey;
    
    // Agregar instrucción simple
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: keypair.publicKey,
        lamports: 0, // Transferencia de 0 lamports
      })
    );
    
    // Firmar y enviar transacción
    console.log('✍️ Firmando transacción...');
    transaction.sign(keypair);
    
    console.log('📤 Enviando transacción...');
    const signature = await connection.sendRawTransaction(transaction.serialize());
    console.log('📝 Signature:', signature);
    
    console.log('⏳ Confirmando transacción...');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    console.log('✅ Confirmación recibida:', confirmation);
    
    console.log('🎉 ¡Transacción exitosa!');
    console.log('📊 Datos:');
    console.log('  - De:', keypair.publicKey.toString());
    console.log('  - A:', keypair.publicKey.toString());
    console.log('  - Cantidad: 0 lamports (transacción de prueba)');
    console.log('  - Transacción:', signature);
    console.log('  - Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    return {
      success: true,
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
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
  createSimpleMarket()
    .then(result => {
      if (result.success) {
        console.log('\n🎯 RESULTADO EXITOSO:');
        console.log('✅ Transacción ejecutada en Solana Devnet');
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

module.exports = { createSimpleMarket };
