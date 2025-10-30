#!/usr/bin/env node

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Cargar el IDL completo
const idlPath = path.join(__dirname, 'frontend', 'idl', 'oraculo_identity_complete.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// Configuración
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey(idl.address);

console.log('🧪 Iniciando test de ZK Identity en consola...');
console.log('📋 Program ID:', PROGRAM_ID.toString());
console.log('🌐 RPC URL:', RPC_URL);

async function testIdentityProgram() {
  try {
    // Crear conexión
    const connection = new Connection(RPC_URL, 'confirmed');
    
    // Crear un keypair de prueba
    const testKeypair = Keypair.generate();
    console.log('👤 Test Wallet:', testKeypair.publicKey.toString());
    
    // Crear provider
    const wallet = {
      publicKey: testKeypair.publicKey,
      signTransaction: async (tx) => {
        tx.sign(testKeypair);
        return tx;
      },
      signAllTransactions: async (txs) => {
        return txs.map(tx => {
          tx.sign(testKeypair);
          return tx;
        });
      }
    };
    
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    provider.publicKey = testKeypair.publicKey; // Asegurar que esté disponible
    
    // Crear programa
    const program = new anchor.Program(idl, PROGRAM_ID, provider);
    console.log('✅ Programa creado exitosamente');
    
    // Test data
    const testVkId = new Uint8Array(32).fill(1);
    const testPredicateHash = new Uint8Array(32).fill(2);
    const testIssuerHash = new Uint8Array(32).fill(3);
    const testExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
    const testNonce = new Uint8Array(16).fill(4);
    const testPublicInputs = new Uint8Array([1, 2, 3, 4, 5]);
    const testProof = new Uint8Array([6, 7, 8, 9, 10]);
    
    console.log('\n🔧 Test 1: Inicializar config...');
    try {
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        PROGRAM_ID
      );
      
      const ix = await program.methods
        .initConfig(Array.from(new Uint8Array(32).fill(0)), new anchor.BN(1))
        .accounts({
          admin: testKeypair.publicKey,
          verifierConfig: configPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      
      const tx = new anchor.web3.Transaction().add(ix);
      tx.feePayer = testKeypair.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      
      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
      await connection.confirmTransaction(sig, 'confirmed');
      
      console.log('✅ Config inicializado:', sig);
    } catch (error) {
      if (error.message?.includes('already in use')) {
        console.log('✅ Config ya inicializado');
      } else {
        console.log('❌ Error inicializando config:', error.message);
      }
    }
    
    console.log('\n🔍 Test 2: Verificar identity proof...');
    try {
      const [attestationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('attest'), testKeypair.publicKey.toBuffer(), testPredicateHash],
        PROGRAM_ID
      );
      
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        PROGRAM_ID
      );
      
      const slot = await connection.getSlot();
      const [noncePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('nonce'), testKeypair.publicKey.toBuffer(), Buffer.alloc(8).fill(0)],
        PROGRAM_ID
      );
      
      const ix = await program.methods
        .verifyIdentityProof(
          Array.from(testVkId),
          Array.from(testPredicateHash),
          Array.from(testIssuerHash),
          new anchor.BN(testExpiresAt),
          Array.from(testNonce),
          Array.from(testPublicInputs),
          Array.from(testProof)
        )
        .accounts({
          subject: testKeypair.publicKey,
          attestationPda: attestationPda,
          verifierConfig: configPda,
          noncePda: noncePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      
      const tx = new anchor.web3.Transaction().add(ix);
      tx.feePayer = testKeypair.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      
      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
      await connection.confirmTransaction(sig, 'confirmed');
      
      console.log('✅ Identity proof verificado:', sig);
    } catch (error) {
      console.log('❌ Error verificando identity proof:', error.message);
    }
    
    console.log('\n📊 Test 3: Leer cuentas...');
    try {
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        PROGRAM_ID
      );
      
      const configInfo = await connection.getAccountInfo(configPda);
      if (configInfo) {
        console.log('✅ Config account encontrado, tamaño:', configInfo.data.length);
      } else {
        console.log('❌ Config account no encontrado');
      }
      
      const [attestationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('attest'), testKeypair.publicKey.toBuffer(), testPredicateHash],
        PROGRAM_ID
      );
      
      const attestationInfo = await connection.getAccountInfo(attestationPda);
      if (attestationInfo) {
        console.log('✅ Attestation account encontrado, tamaño:', attestationInfo.data.length);
      } else {
        console.log('❌ Attestation account no encontrado');
      }
    } catch (error) {
      console.log('❌ Error leyendo cuentas:', error.message);
    }
    
    console.log('\n🎉 Test completado!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar el test
testIdentityProgram().catch(console.error);
