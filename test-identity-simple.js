#!/usr/bin/env node

const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Cargar el IDL
const idlPath = path.join(__dirname, 'frontend', 'idl', 'oraculo_identity.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// Configuración
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey(idl.address);

console.log('🧪 Test simplificado de ZK Identity...');
console.log('📋 Program ID:', PROGRAM_ID.toString());
console.log('🌐 RPC URL:', RPC_URL);

async function testIdentityProgram() {
  try {
    // Crear conexión
    const connection = new Connection(RPC_URL, 'confirmed');
    
    // Crear un keypair de prueba
    const testKeypair = Keypair.generate();
    console.log('👤 Test Wallet:', testKeypair.publicKey.toString());
    
    // Airdrop SOL para las transacciones
    console.log('\n💰 Solicitando airdrop...');
    try {
      const airdropSig = await connection.requestAirdrop(testKeypair.publicKey, 2 * 1e9); // 2 SOL
      await connection.confirmTransaction(airdropSig);
      console.log('✅ Airdrop completado');
    } catch (error) {
      console.log('⚠️ Airdrop falló, continuando...');
    }
    
    // Crear provider sin usar Program completo
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
    
    // Test data
    const testVkId = new Uint8Array(32).fill(1);
    const testPredicateHash = new Uint8Array(32).fill(2);
    const testIssuerHash = new Uint8Array(32).fill(3);
    const testExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
    const testNonce = new Uint8Array(16).fill(4);
    const testPublicInputs = new Uint8Array([1, 2, 3, 4, 5]);
    const testProof = new Uint8Array([6, 7, 8, 9, 10]);
    
    console.log('\n🔧 Test 1: Crear instrucción init_config...');
    try {
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        PROGRAM_ID
      );
      
      console.log('📋 Config PDA:', configPda.toString());
      
      // Crear instrucción manualmente usando el discriminador
      const initConfigDiscriminator = Buffer.from([23, 235, 115, 232, 168, 96, 1, 231]);
      const allowedIssuersRoot = new Uint8Array(32).fill(0);
      const version = 1;
      
      // Serializar argumentos
      const argsBuffer = Buffer.alloc(4 + 32 + 4); // version (u32) + allowed_issuers_root (32 bytes) + version (u32)
      argsBuffer.writeUInt32LE(version, 0);
      Buffer.from(allowedIssuersRoot).copy(argsBuffer, 4);
      argsBuffer.writeUInt32LE(version, 36);
      
      const instructionData = Buffer.concat([initConfigDiscriminator, argsBuffer]);
      
      const initConfigIx = {
        programId: PROGRAM_ID,
        keys: [
          { pubkey: testKeypair.publicKey, isSigner: true, isWritable: true },
          { pubkey: configPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: instructionData
      };
      
      const tx = new Transaction().add(initConfigIx);
      tx.feePayer = testKeypair.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      
      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
      await connection.confirmTransaction(sig, 'confirmed');
      
      console.log('✅ Init config enviado:', sig);
    } catch (error) {
      if (error.message?.includes('already in use')) {
        console.log('✅ Config ya inicializado');
      } else {
        console.log('❌ Error en init_config:', error.message);
      }
    }
    
    console.log('\n🔍 Test 2: Crear instrucción verify_identity_proof...');
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
      const slotBuffer = Buffer.alloc(8);
      slotBuffer.writeBigUInt64LE(BigInt(slot), 0);
      const [noncePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('nonce'), testKeypair.publicKey.toBuffer(), slotBuffer],
        PROGRAM_ID
      );
      
      console.log('📋 Attestation PDA:', attestationPda.toString());
      console.log('📋 Config PDA:', configPda.toString());
      console.log('📋 Nonce PDA:', noncePda.toString());
      
      // Crear instrucción manualmente
      const verifyDiscriminator = Buffer.from([7, 88, 49, 216, 219, 55, 206, 170]);
      
      // Serializar argumentos (simplificado)
      const argsBuffer = Buffer.concat([
        testVkId,
        testPredicateHash,
        testIssuerHash,
        Buffer.alloc(8).fill(0), // expiresAt placeholder
        testNonce,
        Buffer.from([testPublicInputs.length]), // length prefix for bytes
        testPublicInputs,
        Buffer.from([testProof.length]), // length prefix for bytes
        testProof
      ]);
      
      const instructionData = Buffer.concat([verifyDiscriminator, argsBuffer]);
      
      const verifyIx = {
        programId: PROGRAM_ID,
        keys: [
          { pubkey: testKeypair.publicKey, isSigner: true, isWritable: true },
          { pubkey: attestationPda, isSigner: false, isWritable: true },
          { pubkey: configPda, isSigner: false, isWritable: true },
          { pubkey: noncePda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: instructionData
      };
      
      const tx = new Transaction().add(verifyIx);
      tx.feePayer = testKeypair.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      
      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
      await connection.confirmTransaction(sig, 'confirmed');
      
      console.log('✅ Verify identity proof enviado:', sig);
    } catch (error) {
      console.log('❌ Error en verify_identity_proof:', error.message);
    }
    
    console.log('\n📊 Test 3: Verificar cuentas...');
    try {
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        PROGRAM_ID
      );
      
      const configInfo = await connection.getAccountInfo(configPda);
      if (configInfo) {
        console.log('✅ Config account encontrado, tamaño:', configInfo.data.length);
        console.log('📋 Config owner:', configInfo.owner.toString());
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
        console.log('📋 Attestation owner:', attestationInfo.owner.toString());
      } else {
        console.log('❌ Attestation account no encontrado');
      }
    } catch (error) {
      console.log('❌ Error verificando cuentas:', error.message);
    }
    
    console.log('\n🎉 Test completado!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar el test
testIdentityProgram().catch(console.error);
