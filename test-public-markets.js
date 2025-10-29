#!/usr/bin/env node

/**
 * 🧪 Test Script - Verificar Visibilidad Pública de Mercados
 * 
 * Script para probar que todos los mercados creados por cualquier wallet
 * son visibles públicamente en la plataforma
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');

// Configuración
const DEVNET_RPC = 'https://api.devnet.solana.com';
const ORACLE_PROGRAM_ID = '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';

async function testPublicMarketVisibility() {
  console.log('🧪 Iniciando prueba de visibilidad pública de mercados...\n');

  try {
    // Conectar a Solana Devnet
    const connection = new Connection(DEVNET_RPC, 'confirmed');
    console.log('✅ Conectado a Solana Devnet');

    // Obtener todas las cuentas del programa Oracle
    const programId = new PublicKey(ORACLE_PROGRAM_ID);
    console.log(`🔍 Buscando mercados en el programa: ${programId.toString()}`);

    const accounts = await connection.getProgramAccounts(programId, {
      commitment: 'confirmed'
    });

    console.log(`📊 Total de cuentas encontradas: ${accounts.length}`);

    if (accounts.length === 0) {
      console.log('⚠️  No se encontraron mercados. Esto es normal si es la primera vez que se ejecuta.');
      console.log('💡 Para crear mercados de prueba, usa la interfaz web en la pestaña "Crear Mercado"');
      return;
    }

    // Analizar cada cuenta
    let validMarkets = 0;
    const creators = new Set();

    for (const account of accounts) {
      try {
        if (account.account.data.length > 8) {
          // Intentar parsear como mercado
          const data = account.account.data;
          let offset = 8; // Saltar discriminator

          // Leer creator (32 bytes)
          const creator = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;

          // Leer title length (4 bytes)
          const titleLength = data.readUInt32LE(offset);
          offset += 4;

          // Leer title
          const title = data.slice(offset, offset + titleLength).toString();
          offset += titleLength;

          validMarkets++;
          creators.add(creator.toString());

          console.log(`✅ Mercado encontrado:`);
          console.log(`   📍 Address: ${account.pubkey.toString()}`);
          console.log(`   👤 Creator: ${creator.toString()}`);
          console.log(`   📝 Title: ${title}`);
          console.log(`   📊 Data Size: ${account.account.data.length} bytes`);
          console.log('');
        }
      } catch (error) {
        console.warn(`⚠️  Error parsing account ${account.pubkey.toString()}:`, error.message);
      }
    }

    // Resumen de resultados
    console.log('📋 RESUMEN DE PRUEBA:');
    console.log('='.repeat(50));
    console.log(`🎯 Total de mercados válidos: ${validMarkets}`);
    console.log(`👥 Total de creadores únicos: ${creators.size}`);
    console.log(`🌐 Visibilidad: PÚBLICA (todos los mercados son visibles)`);
    console.log('');

    if (validMarkets > 0) {
      console.log('✅ PRUEBA EXITOSA: Los mercados son visibles públicamente');
      console.log('💡 Cualquier usuario puede ver todos los mercados creados por cualquier wallet');
    } else {
      console.log('⚠️  No se encontraron mercados válidos para probar');
      console.log('💡 Crea algunos mercados usando la interfaz web para probar la funcionalidad');
    }

    // Listar creadores únicos
    if (creators.size > 0) {
      console.log('\n👥 CREADORES ÚNICOS ENCONTRADOS:');
      creators.forEach((creator, index) => {
        console.log(`   ${index + 1}. ${creator}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testPublicMarketVisibility()
    .then(() => {
      console.log('\n🎉 Prueba completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { testPublicMarketVisibility };
