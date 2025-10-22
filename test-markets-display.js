#!/usr/bin/env node

/**
 * 🔮 Test Markets Display - Script de prueba para verificar la visualización de mercados
 * 
 * Script que prueba la funcionalidad de obtener y mostrar mercados reales
 * desde el programa Oracle desplegado en Solana
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const { Connection, PublicKey } = require('@solana/web3.js');

// Configuración
const PROGRAM_ID = '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function testMarketsDisplay() {
  console.log('🔮 Iniciando prueba de visualización de mercados...\n');

  try {
    // Conectar a Solana Devnet
    const connection = new Connection(DEVNET_RPC, 'confirmed');
    console.log('✅ Conectado a Solana Devnet');

    // Verificar que el programa existe
    const programId = new PublicKey(PROGRAM_ID);
    const programInfo = await connection.getAccountInfo(programId);
    
    if (!programInfo) {
      throw new Error('❌ Programa no encontrado en la red');
    }
    
    console.log('✅ Programa encontrado:', PROGRAM_ID);
    console.log('📊 Datos del programa:', {
      owner: programInfo.owner.toString(),
      executable: programInfo.executable,
      lamports: programInfo.lamports,
      dataLength: programInfo.data.length
    });

    // Buscar todas las cuentas del programa
    console.log('\n🔍 Buscando cuentas de mercados...');
    
    const accounts = await connection.getProgramAccounts(programId, {
      filters: [
        {
          dataSize: 8 + 32 + 4 + 100 + 4 + 200 + 8 + 4 + 100 + 1 + 1 + 8 + 1 + 32 + 8, // Tamaño de Market account
        }
      ]
    });

    console.log(`📊 Cuentas encontradas: ${accounts.length}`);

    if (accounts.length === 0) {
      console.log('\n⚠️  No se encontraron mercados creados');
      console.log('💡 Para probar la funcionalidad:');
      console.log('   1. Ve a la aplicación web');
      console.log('   2. Conecta tu wallet');
      console.log('   3. Crea un mercado de predicciones');
      console.log('   4. Regresa a la sección "Markets" para verlo');
      return;
    }

    // Procesar cada cuenta de mercado
    console.log('\n📋 Procesando mercados encontrados:');
    
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      console.log(`\n🏪 Mercado ${i + 1}:`);
      console.log(`   Dirección: ${account.pubkey.toString()}`);
      console.log(`   Tamaño de datos: ${account.account.data.length} bytes`);
      console.log(`   Lamports: ${account.account.lamports}`);
      console.log(`   Ejecutable: ${account.account.executable}`);
      
      // Intentar parsear los datos del mercado
      try {
        const data = account.account.data;
        let offset = 0;

        // Discriminator (8 bytes) - saltar
        offset += 8;

        // Creator (32 bytes)
        const creator = new PublicKey(data.slice(offset, offset + 32));
        offset += 32;
        console.log(`   Creador: ${creator.toString()}`);

        // Title length (4 bytes) + title
        const titleLength = data.readUInt32LE(offset);
        offset += 4;
        const title = data.slice(offset, offset + titleLength).toString();
        offset += titleLength;
        console.log(`   Título: ${title}`);

        // Description length (4 bytes) + description
        const descriptionLength = data.readUInt32LE(offset);
        offset += 4;
        const description = data.slice(offset, offset + descriptionLength).toString();
        offset += descriptionLength;
        console.log(`   Descripción: ${description}`);

        // End time (8 bytes)
        const endTime = Number(data.readBigUInt64LE(offset));
        offset += 8;
        console.log(`   Fecha de finalización: ${new Date(endTime * 1000).toLocaleString()}`);

        // Outcomes length (4 bytes) + outcomes
        const outcomesLength = data.readUInt32LE(offset);
        offset += 4;
        const outcomes = [];
        for (let j = 0; j < outcomesLength; j++) {
          const outcomeLength = data.readUInt32LE(offset);
          offset += 4;
          const outcome = data.slice(offset, offset + outcomeLength).toString();
          offset += outcomeLength;
          outcomes.push(outcome);
        }
        console.log(`   Opciones: ${outcomes.join(', ')}`);

        // Total staked (8 bytes)
        const totalStaked = Number(data.readBigUInt64LE(offset));
        offset += 8;
        console.log(`   Total apostado: ${totalStaked} lamports`);

        // Is resolved (1 byte)
        const isResolved = data[offset] === 1;
        offset += 1;
        console.log(`   Resuelto: ${isResolved ? 'Sí' : 'No'}`);

        // Winning outcome (1 byte, optional)
        if (isResolved) {
          const winningOutcome = data[offset];
          offset += 1;
          console.log(`   Resultado ganador: ${winningOutcome}`);
        }

        // Privacy level (1 byte)
        const privacyLevel = data[offset];
        offset += 1;
        console.log(`   Nivel de privacidad: ${privacyLevel}`);

        console.log(`   ✅ Mercado parseado correctamente`);

      } catch (parseError) {
        console.log(`   ❌ Error parseando mercado: ${parseError.message}`);
      }
    }

    console.log('\n🎉 Prueba completada exitosamente!');
    console.log('\n📝 Resumen:');
    console.log(`   - Programa ID: ${PROGRAM_ID}`);
    console.log(`   - Red: Solana Devnet`);
    console.log(`   - Cuentas encontradas: ${accounts.length}`);
    console.log(`   - Estado: ✅ Funcional`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testMarketsDisplay()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { testMarketsDisplay };
