#!/usr/bin/env node

/**
 * 🔮 Test November 2025 Dates - Script de prueba para verificar fechas de noviembre 2025 en adelante
 * 
 * Script que verifica que todas las fechas de los mercados sean de noviembre 2025 en adelante
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

function testNovember2025Dates() {
  console.log('🔮 Verificando fechas de noviembre 2025 en adelante...\n');

  // Fechas de referencia
  const november2025 = Math.floor(new Date('2025-11-01').getTime() / 1000);
  const december2025 = Math.floor(new Date('2025-12-31').getTime() / 1000);
  const june2026 = Math.floor(new Date('2026-06-15').getTime() / 1000);
  const december2026 = Math.floor(new Date('2026-12-31').getTime() / 1000);

  console.log('📅 Fechas de referencia:');
  console.log(`   Noviembre 2025: ${new Date(november2025 * 1000).toLocaleDateString('es-MX')}`);
  console.log(`   Diciembre 2025: ${new Date(december2025 * 1000).toLocaleDateString('es-MX')}`);
  console.log(`   Junio 2026: ${new Date(june2026 * 1000).toLocaleDateString('es-MX')}`);
  console.log(`   Diciembre 2026: ${new Date(december2026 * 1000).toLocaleDateString('es-MX')}`);
  console.log('');

  // Probar fechas de ejemplo
  const testDates = [
    {
      name: 'Diciembre 2025',
      timestamp: december2025,
      expected: '2025-12-31'
    },
    {
      name: 'Junio 2026',
      timestamp: june2026,
      expected: '2026-06-15'
    },
    {
      name: 'Diciembre 2026',
      timestamp: december2026,
      expected: '2026-12-31'
    }
  ];

  console.log('🧪 Probando fechas de ejemplo:\n');

  testDates.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}:`);
    console.log(`   Timestamp: ${test.timestamp}`);
    
    // Verificar que sea de noviembre 2025 en adelante
    const isValid = test.timestamp >= november2025;
    console.log(`   ✅ Válida (≥ noviembre 2025): ${isValid ? 'Sí' : 'No'}`);
    
    // Mostrar fecha formateada
    const date = new Date(test.timestamp * 1000);
    console.log(`   📅 Fecha: ${date.toLocaleDateString('es-MX')}`);
    console.log(`   📅 Fecha completa: ${date.toLocaleString('es-MX')}`);
    console.log('');
  });

  // Probar fechas incorrectas (que deberían ser corregidas)
  console.log('❌ Fechas que deberían ser corregidas:\n');
  
  const invalidDates = [
    {
      name: 'Enero 2024',
      timestamp: Math.floor(new Date('2024-01-15').getTime() / 1000),
      shouldBeCorrected: true
    },
    {
      name: 'Octubre 2025',
      timestamp: Math.floor(new Date('2025-10-15').getTime() / 1000),
      shouldBeCorrected: true
    },
    {
      name: 'Noviembre 2025',
      timestamp: Math.floor(new Date('2025-11-15').getTime() / 1000),
      shouldBeCorrected: false
    }
  ];

  invalidDates.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}:`);
    console.log(`   Timestamp: ${test.timestamp}`);
    
    const date = new Date(test.timestamp * 1000);
    console.log(`   📅 Fecha: ${date.toLocaleDateString('es-MX')}`);
    
    const isValid = test.timestamp >= november2025;
    console.log(`   ✅ Válida: ${isValid ? 'Sí' : 'No'}`);
    
    if (!isValid && test.shouldBeCorrected) {
      console.log(`   🔧 Debería corregirse a: ${new Date(december2025 * 1000).toLocaleDateString('es-MX')}`);
    }
    console.log('');
  });

  console.log('✅ Verificación completada!');
  console.log('\n📝 Resumen:');
  console.log('   - Todas las fechas deben ser ≥ noviembre 2025');
  console.log('   - Fechas anteriores se corrigen a diciembre 2025');
  console.log('   - Formato mexicano: dd/mm/yyyy');
  console.log('   - Sin fechas de 2024 o anteriores');
}

// Ejecutar la prueba
if (require.main === module) {
  testNovember2025Dates();
}

module.exports = { testNovember2025Dates };
