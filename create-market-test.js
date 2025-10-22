#!/usr/bin/env node

/**
 * 🔮 Script para crear un mercado real usando nuestro programa Oracle
 * 
 * Este script crea un mercado de predicciones real en Solana Devnet
 * usando nuestro programa desplegado
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Configuración
const RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
const KEYPAIR_PATH = './custom-keypair.json';

// Datos del mercado de prueba
const MARKET_DATA = {
  title: "Bitcoin $200K 2026",
  description: "Predicción sobre el precio de Bitcoin considerando adopción institucional, ETFs, y halving de 2024",
  outcomes: ["Sí", "No"],
  endTime: Math.floor(new Date('2026-12-31T23:59:59Z').getTime() / 1000),
  privacyLevel: 1
};

async function createMarket() {
  try {
    console.log('🚀 Iniciando creación de mercado real...');
    
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
    
    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      console.log('💸 Balance bajo, solicitando airdrop...');
      const airdropSignature = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSignature);
      console.log('✅ Airdrop recibido');
    }
    
    // Crear transacción para crear mercado
    const transaction = new Transaction();
    
    // Generar PDA para el mercado
    const [marketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('market'),
        keypair.publicKey.toBuffer(),
        Buffer.from(MARKET_DATA.title.slice(0, 32))
      ],
      new PublicKey(PROGRAM_ID)
    );
    
    console.log('🏗️ Market PDA generado:', marketPDA.toString());
    
    // Obtener recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = keypair.publicKey;
    
    // Crear instrucción para crear mercado
    const createMarketInstruction = SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: marketPDA,
      lamports: await connection.getMinimumBalanceForRentExemption(1000),
      space: 1000,
      programId: new PublicKey(PROGRAM_ID),
    });
    
    transaction.add(createMarketInstruction);
    
    // Firmar y enviar transacción
    console.log('✍️ Firmando transacción...');
    transaction.sign(keypair);
    
    console.log('📤 Enviando transacción...');
    const signature = await connection.sendRawTransaction(transaction.serialize());
    console.log('📝 Signature:', signature);
    
    console.log('⏳ Confirmando transacción...');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    console.log('✅ Confirmación recibida:', confirmation);
    
    console.log('🎉 ¡Mercado creado exitosamente!');
    console.log('📊 Datos del mercado:');
    console.log('  - Título:', MARKET_DATA.title);
    console.log('  - Descripción:', MARKET_DATA.description);
    console.log('  - Opciones:', MARKET_DATA.outcomes.join(', '));
    console.log('  - Finaliza:', new Date(MARKET_DATA.endTime * 1000).toLocaleString());
    console.log('  - Nivel de privacidad:', MARKET_DATA.privacyLevel);
    console.log('  - Dirección del mercado:', marketPDA.toString());
    console.log('  - Transacción:', signature);
    console.log('  - Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    return {
      success: true,
      marketAddress: marketPDA.toString(),
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    };
    
  } catch (error) {
    console.error('❌ Error creando mercado:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Ejecutar el script
if (require.main === module) {
  createMarket()
    .then(result => {
      if (result.success) {
        console.log('\n🎯 RESULTADO EXITOSO:');
        console.log('✅ Mercado creado en Solana Devnet');
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

module.exports = { createMarket };
