#!/usr/bin/env node

/**
 * 🔮 Test Date Formatting - Script de prueba para verificar el formato de fechas
 * 
 * Script que prueba la conversión correcta de timestamps entre segundos y milisegundos
 * para asegurar que las fechas se muestren correctamente en la aplicación
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

function testDateFormatting() {
  console.log('🔮 Iniciando prueba de formato de fechas...\n');

  // Fechas de prueba
  const testDates = [
    {
      name: 'Fecha futura 2025',
      timestamp: Math.floor(new Date('2025-12-31').getTime() / 1000), // En segundos
      expected: '2025-12-31'
    },
    {
      name: 'Fecha futura 2026',
      timestamp: Math.floor(new Date('2026-06-15').getTime() / 1000), // En segundos
      expected: '2026-06-15'
    },
    {
      name: 'Fecha actual + 1 año',
      timestamp: Math.floor(Date.now() / 1000) + (86400 * 365), // 1 año desde ahora
      expected: 'Aproximadamente 1 año en el futuro'
    },
    {
      name: 'Timestamp en milisegundos (incorrecto)',
      timestamp: new Date('2025-12-31').getTime(), // En milisegundos
      expected: '1970-01-01 (fecha incorrecta)'
    }
  ];

  console.log('📅 Probando conversión de timestamps:\n');

  testDates.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}:`);
    console.log(`   Timestamp: ${test.timestamp}`);
    
    // Método incorrecto (como estaba antes)
    const incorrectDate = new Date(test.timestamp);
    console.log(`   ❌ Método incorrecto: ${incorrectDate.toLocaleDateString('es-MX')}`);
    
    // Método correcto (como está ahora)
    let correctDate;
    if (test.timestamp < 1e12) {
      // Es timestamp en segundos
      correctDate = new Date(test.timestamp * 1000);
    } else {
      // Es timestamp en milisegundos
      correctDate = new Date(test.timestamp);
    }
    console.log(`   ✅ Método correcto: ${correctDate.toLocaleDateString('es-MX')}`);
    
    // Verificar si es válida
    if (isNaN(correctDate.getTime())) {
      console.log(`   ⚠️  Fecha inválida detectada`);
    } else {
      console.log(`   📊 Año: ${correctDate.getFullYear()}`);
      console.log(`   📊 Mes: ${correctDate.getMonth() + 1}`);
      console.log(`   📊 Día: ${correctDate.getDate()}`);
    }
    
    console.log(`   📝 Esperado: ${test.expected}`);
    console.log('');
  });

  // Probar con timestamps de Solana (en segundos)
  console.log('🔗 Probando timestamps típicos de Solana:\n');
  
  const now = Math.floor(Date.now() / 1000);
  const futureDates = [
    { name: '6 meses', days: 180 },
    { name: '1 año', days: 365 },
    { name: '2 años', days: 730 }
  ];

  futureDates.forEach((test, index) => {
    const timestamp = now + (86400 * test.days);
    const date = new Date(timestamp * 1000);
    
    console.log(`${index + 1}. ${test.name} desde ahora:`);
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Fecha: ${date.toLocaleDateString('es-MX')}`);
    console.log(`   Fecha completa: ${date.toLocaleString('es-MX')}`);
    console.log('');
  });

  console.log('✅ Prueba de formato de fechas completada!');
  console.log('\n📝 Resumen:');
  console.log('   - Los timestamps de Solana están en segundos');
  console.log('   - JavaScript Date() espera milisegundos');
  console.log('   - Solución: multiplicar por 1000 antes de crear Date()');
  console.log('   - Verificación: si timestamp < 1e12, es en segundos');
}

// Ejecutar la prueba
if (require.main === module) {
  testDateFormatting();
}

module.exports = { testDateFormatting };
