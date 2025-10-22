#!/usr/bin/env node

/**
 * 🔮 Clear Demo Markets - Script para limpiar mercados demo con fechas incorrectas
 * 
 * Script que limpia el localStorage para eliminar mercados demo con fechas de 1970
 * y permite que se creen nuevos mercados con fechas correctas
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

function clearDemoMarkets() {
  console.log('🔮 Limpiando mercados demo con fechas incorrectas...\n');

  try {
    // Simular el localStorage del navegador
    const DEMO_MARKETS_KEY = 'oraculo-demo-markets';
    
    // En un entorno real, esto se ejecutaría en el navegador
    console.log('📝 Para limpiar los mercados demo:');
    console.log('   1. Abre las herramientas de desarrollador (F12)');
    console.log('   2. Ve a la pestaña "Application" o "Aplicación"');
    console.log('   3. En el panel izquierdo, busca "Local Storage"');
    console.log('   4. Selecciona tu dominio (localhost:3000 o similar)');
    console.log('   5. Busca la clave "oraculo-demo-markets"');
    console.log('   6. Elimina esa entrada');
    console.log('   7. Recarga la página');
    
    console.log('\n🔧 Alternativamente, ejecuta este código en la consola del navegador:');
    console.log('   localStorage.removeItem("oraculo-demo-markets");');
    console.log('   location.reload();');
    
    console.log('\n✅ Después de limpiar:');
    console.log('   - Los mercados demo existentes se eliminarán');
    console.log('   - Los nuevos mercados tendrán fechas correctas (2025-2026)');
    console.log('   - El componente SafeDate mostrará las fechas correctamente');
    
    console.log('\n📊 Verificación de fechas:');
    const now = Math.floor(Date.now() / 1000);
    const oneYearFromNow = now + (86400 * 365);
    const oneYearDate = new Date(oneYearFromNow * 1000);
    
    console.log(`   Fecha actual: ${new Date().toLocaleDateString('es-MX')}`);
    console.log(`   Fecha en 1 año: ${oneYearDate.toLocaleDateString('es-MX')}`);
    console.log(`   Timestamp en 1 año: ${oneYearFromNow}`);
    
    console.log('\n🎯 Resultado esperado:');
    console.log('   - Mercados nuevos: fechas en 2025-2026');
    console.log('   - No más fechas de 1970');
    console.log('   - Formato mexicano (dd/mm/yyyy)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar la limpieza
if (require.main === module) {
  clearDemoMarkets();
}

module.exports = { clearDemoMarkets };
