# 🔮 OráculoS - Mercado de Predicciones Descentralizado

## 📖 Descripción

**OráculoS** es una plataforma descentralizada de mercado de predicciones que permite a los usuarios crear, participar y ganar en mercados de predicción sobre eventos futuros. La aplicación utiliza tecnología blockchain para garantizar transparencia, inmutabilidad y pagos automáticos.

## ✨ Características Principales

### 🎯 Mercados de Predicción

* **Creación de Mercados**: Los usuarios pueden crear mercados de predicción sobre cualquier evento
* **Participación**: Compra y venta de acciones en diferentes resultados
* **Liquidación Automática**: Resolución automática basada en datos del mundo real
* **Transparencia Total**: Todas las transacciones son públicas y verificables

### 💰 Sistema de Recompensas

* **Pagos Automáticos**: Los ganadores reciben sus recompensas automáticamente
* **Comisiones**: Sistema de comisiones para creadores de mercados
* **Pool de Liquidez**: Mecanismo de liquidez para mercados activos

### 🔒 Seguridad y Descentralización

* **Smart Contracts**: Lógica de negocio ejecutada en blockchain
* **Oracles**: Integración con oráculos para datos del mundo real
* **Custodia Descentralizada**: Los usuarios mantienen control total de sus fondos

## 🚀 Tecnologías Utilizadas

* **Frontend**: React, TypeScript, Tailwind CSS
* **Blockchain**: Solana
* **Smart Contracts**: Anchor Framework
* **Oracles**: Pyth Network, Switchboard
* **Wallet**: Phantom, Solflare
* **PWA**: Progressive Web App para experiencia móvil

## 📱 Experiencia de Usuario

### Para Creadores de Mercados

1. **Crear Mercado**: Define el evento, fechas y opciones
2. **Configurar Parámetros**: Establece comisiones y reglas de liquidación
3. **Promocionar**: Comparte tu mercado con la comunidad

### Para Participantes

1. **Explorar Mercados**: Navega por mercados activos y populares
2. **Analizar**: Revisa datos históricos y tendencias
3. **Invertir**: Compra acciones en tus predicciones favoritas
4. **Monitorear**: Sigue el rendimiento de tus inversiones

## 🎮 Tipos de Mercados Soportados

* **Deportes**: Resultados de partidos, campeonatos, récords
* **Política**: Elecciones, decisiones gubernamentales, encuestas
* **Economía**: Precios de activos, indicadores económicos, criptomonedas
* **Tecnología**: Lanzamientos de productos, adopción de tecnologías
* **Entretenimiento**: Premios, audiencias, eventos culturales
* **Ciencia**: Descubrimientos, avances tecnológicos, investigaciones

## 🔧 Instalación y Configuración

### Prerrequisitos

* Node.js 18+
* Rust 1.70+
* Solana CLI
* Anchor Framework

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Vaios0x/Oraculo.git
cd Oraculo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Compilar smart contracts
npm run anchor:build

# Desplegar contratos
npm run anchor:deploy

# Iniciar aplicación
npm run dev
```

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir aplicación
npm run start            # Iniciar aplicación en producción

# Solana
npm run anchor:build     # Compilar programas Anchor
npm run anchor:deploy    # Desplegar programas
npm run anchor:test      # Ejecutar pruebas
npm run solana:setup     # Configurar Solana CLI
npm run solana:balance   # Verificar balance

# Ejemplos
npm run examples:accounts     # Ejecutar ejemplos de cuentas
npm run examples:transactions # Ejecutar ejemplos de transacciones
npm run examples:programs     # Ejecutar ejemplos de programas
npm run examples:pda          # Ejecutar ejemplos de PDA
npm run examples:cpi          # Ejecutar ejemplos de CPI
npm run examples:transactions-structure # Ejecutar ejemplos de estructura de transacciones
npm run examples:transaction-fees      # Ejecutar ejemplos de tarifas de transacciones
npm run examples:programs-advanced     # Ejecutar ejemplos avanzados de programas
npm run examples:pda-advanced          # Ejecutar ejemplos avanzados de PDAs
npm run examples:cpi-advanced          # Ejecutar ejemplos avanzados de CPI
```

### 📚 Ejemplos de Uso

#### Leer Cuentas de Solana
```typescript
import { SolanaAccountManager, AccountUtils } from '@/utils/solana-accounts';

// Crear conexión
const connection = AccountUtils.createConnection();
const accountManager = new SolanaAccountManager(connection);

// Obtener información de cuenta
const account = await accountManager.fetchWalletAccount(publicKey);
console.log(accountManager.formatAccountData(account));
```

#### Analizar Tipos de Cuentas
```typescript
import { AccountExamples } from '@/examples/account-examples';

// Ejemplos incluidos
await AccountExamples.fetchWalletAccount();
await AccountExamples.fetchProgramAccount();
await AccountExamples.fetchMintAccount();
await AccountExamples.compareAccountTypes();
await AccountExamples.analyzeAccount("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
```

#### Escribir Transacciones a Solana
```typescript
import { SolanaTransactionManager, TransactionUtils } from '@/utils/solana-transactions';

// Crear manager de transacciones
const connection = TransactionUtils.createConnection();
const transactionManager = new SolanaTransactionManager(connection);

// Transferir SOL
const result = await transactionManager.transferSOL({
  from: senderPublicKey,
  to: receiverPublicKey,
  amount: 0.1, // 0.1 SOL
  signer: senderKeypair
});

// Crear token
const tokenResult = await transactionManager.createToken({
  wallet: walletKeypair,
  decimals: 6,
  mintAuthority: walletKeypair.publicKey
});
```

#### Ejemplos de Transacciones
```typescript
import { TransactionExamples } from '@/examples/transaction-examples';

// Ejemplos incluidos
await TransactionExamples.transferSOL();        // Transferir SOL
await TransactionExamples.createToken();        // Crear token
await TransactionExamples.mintTokens();         // Mintear tokens
await TransactionExamples.transferTokens();     // Transferir tokens
await TransactionExamples.complexTransaction(); // Transacciones complejas
```

#### Desarrollar y Desplegar Programas
```typescript
import { ProgramExamples } from '@/examples/program-examples';

// Ejemplos de desarrollo de programas
await ProgramExamples.deployHelloAnchor();        // Desplegar programa
await ProgramExamples.interactionPatterns();      // Patrones de interacción
await ProgramExamples.testingStrategies();       // Estrategias de testing
await ProgramExamples.deploymentChecklist();      // Checklist de despliegue
await ProgramExamples.debuggingTechniques();     // Técnicas de debugging
await ProgramExamples.upgradeStrategies();       // Estrategias de upgrade
```

#### Program Derived Addresses (PDA)
```typescript
import { PdaExamples } from '@/examples/pda-examples';

// Ejemplos de PDA
await PdaExamples.basics();                    // Conceptos básicos de PDA
await PdaExamples.derivation();               // Derivación de PDAs
await PdaExamples.crud();                     // Operaciones CRUD con PDA
await PdaExamples.bestPractices();            // Mejores prácticas
await PdaExamples.security();                 // Consideraciones de seguridad
await PdaExamples.advancedPatterns();         // Patrones avanzados
await PdaExamples.testingStrategies();        // Estrategias de testing
```

#### Cross Program Invocation (CPI)
```typescript
import { CpiExamples } from '@/examples/cpi-examples';

// Ejemplos de CPI
await CpiExamples.basics();                    // Conceptos básicos de CPI
await CpiExamples.systemProgram();            // CPI con System Program
await CpiExamples.pdaSigning();               // PDA signing con CPI
await CpiExamples.tokenProgram();             // CPI con Token Program
await CpiExamples.customProgram();            // CPI con programas personalizados
await CpiExamples.errorHandling();            // Manejo de errores
await CpiExamples.testingStrategies();        // Estrategias de testing
await CpiExamples.bestPractices();            // Mejores prácticas
await CpiExamples.advancedPatterns();         // Patrones avanzados
```

#### Transactions and Instructions
```typescript
import { TransactionStructureExamples } from '@/examples/transaction-structure-examples';
import { AdvancedTransactionBuilder } from '@/utils/transaction-builder';

// Ejemplos de estructura de transacciones
await TransactionStructureExamples.basics();                    // Conceptos básicos
await TransactionStructureExamples.instructionStructure();      // Estructura de instrucciones
await TransactionStructureExamples.accountMeta();              // Metadatos de cuentas
await TransactionStructureExamples.messageStructure();          // Estructura de mensajes
await TransactionStructureExamples.transactionSize();           // Límites de tamaño
await TransactionStructureExamples.complexTransaction();       // Transacciones complejas
await TransactionStructureExamples.transactionAnalysis();      // Análisis de transacciones
await TransactionStructureExamples.instructionData();           // Datos de instrucciones
await TransactionStructureExamples.transactionOptimization();  // Optimización
await TransactionStructureExamples.transactionTesting();       // Testing

// Constructor avanzado de transacciones
const builder = new AdvancedTransactionBuilder({
  connection,
  feePayer: wallet
});

const signature = await builder
  .addInstruction(transferInstruction)
  .addSigner(additionalSigner)
  .sendAndConfirm();
```

#### Estructura de Transacciones
```typescript
// Estructura de transacción
interface Transaction {
  signatures: Signature[];     // Firmas (64 bytes cada una)
  message: Message;           // Mensaje de transacción
}

interface Message {
  header: MessageHeader;       // Encabezado (3 bytes)
  accountKeys: Pubkey[];      // Direcciones de cuentas (32 bytes cada una)
  recentBlockhash: Hash;      // Blockhash reciente (32 bytes)
  instructions: CompiledInstruction[]; // Instrucciones
}

interface MessageHeader {
  numRequiredSignatures: u8;           // Número de firmantes requeridos
  numReadonlySignedAccounts: u8;       // Firmantes de solo lectura
  numReadonlyUnsignedAccounts: u8;     // No firmantes de solo lectura
}
```

#### Constructor Avanzado de Transacciones
```typescript
// Constructor de transacciones avanzado
const builder = new AdvancedTransactionBuilder({
  connection,
  feePayer: wallet
});

// Análisis de transacción
const analysis = await builder
  .addInstruction(instruction1)
  .addInstruction(instruction2)
  .addSigner(signer)
  .analyzeTransaction();

console.log("Tamaño total:", analysis.totalSize);
console.log("Dentro del límite:", analysis.isWithinSizeLimit);
console.log("Cuentas:", analysis.accounts);
```

#### Transaction Fees y Optimización
```typescript
import { TransactionFeesExamples } from '@/examples/transaction-fees-examples';
import { FeeOptimizer, FeeUtils } from '@/utils/fee-optimizer';

// Ejemplos de tarifas de transacciones
await TransactionFeesExamples.basics();                    // Conceptos básicos de tarifas
await TransactionFeesExamples.baseFeeCalculation();        // Cálculo de tarifa base
await TransactionFeesExamples.prioritizationFeeCalculation(); // Cálculo de tarifa de prioridad
await TransactionFeesExamples.computeUnitOptimization();   // Optimización de CU
await TransactionFeesExamples.feeOptimizationStrategies(); // Estrategias de optimización
await TransactionFeesExamples.realTimeFeeMonitoring();     // Monitoreo en tiempo real
await TransactionFeesExamples.advancedFeeManagement();     // Gestión avanzada de tarifas
await TransactionFeesExamples.feeAnalysisTools();          // Herramientas de análisis
await TransactionFeesExamples.feeStrategies();             // Estrategias de tarifas
await TransactionFeesExamples.feeMonitoring();             // Monitoreo de tarifas

// Optimizador de tarifas
const feeOptimizer = new FeeOptimizer(connection);

// Obtener recomendación de tarifas
const recommendation = await feeOptimizer.getFeeRecommendation(300_000, 'high');
console.log("CU Limit:", recommendation.cuLimit);
console.log("CU Price:", recommendation.cuPrice);
console.log("Estimated Fee:", recommendation.estimatedFee);

// Optimizar transacción
const optimizedTransaction = await feeOptimizer.optimizeTransaction(transaction, 'high');

// Estimar tarifas
const fees = await feeOptimizer.estimateFees(transaction, 'medium');
const breakdown = feeOptimizer.getFeeBreakdown(fees);
console.log(breakdown.breakdown);
```

#### Estructura de Tarifas
```typescript
// Estructura de tarifas de Solana
interface TransactionFees {
  baseFee: number;        // 5000 lamports por firma
  priorityFee: number;    // CU limit × CU price
  totalFee: number;       // baseFee + priorityFee
}

// Distribución de tarifa base
// 50% quemado (removido de circulación)
// 50% pagado al validador

// Tarifa de prioridad
// 100% pagado al validador
// Aumenta probabilidad de procesamiento
```

#### Optimización de Compute Units
```typescript
// Configurar límite de CU
const limitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000 // Límite optimizado
});

// Configurar precio de CU
const priceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1 // 1 micro-lamport por CU
});

// Aplicar a transacción
const transaction = new Transaction()
  .add(limitInstruction)
  .add(priceInstruction)
  .add(transferInstruction);
```

#### Monitoreo de Tarifas en Tiempo Real
```typescript
// Monitorear condiciones de red
const conditions = await feeOptimizer.getNetworkConditions();
console.log("Congestión:", conditions.congestion);
console.log("Tarifa promedio:", conditions.averageFee);
console.log("Precio CU recomendado:", conditions.recommendedCuPrice);

// Monitorear tendencias
const trends = await feeOptimizer.monitorFeeTrends(300000); // 5 minutos
console.log("Tendencia:", trends.trend);
console.log("Tarifa promedio:", trends.averageFee);
```

#### Programs Avanzados
```typescript
import { ProgramsAdvancedExamples } from '@/examples/programs-advanced-examples';
import { ProgramAnalyzer, ProgramUtils } from '@/utils/program-analyzer';

// Ejemplos avanzados de programas
await ProgramsAdvancedExamples.basics();                    // Conceptos básicos de programas
await ProgramsAdvancedExamples.builtInPrograms();          // Programas integrados
await ProgramsAdvancedExamples.loaderPrograms();           // Programas loader
await ProgramsAdvancedExamples.precompiledPrograms();      // Programas precompilados
await ProgramsAdvancedExamples.developmentApproaches();   // Enfoques de desarrollo
await ProgramsAdvancedExamples.verifiableBuilds();          // Builds verificables
await ProgramsAdvancedExamples.programUpgrading();         // Actualización de programas
await ProgramsAdvancedExamples.programSecurity();          // Seguridad de programas
await ProgramsAdvancedExamples.programPerformance();       // Rendimiento de programas
await ProgramsAdvancedExamples.programTesting();           // Testing de programas

// Analizador de programas
const programAnalyzer = new ProgramAnalyzer(connection);

// Analizar programa
const analysis = await programAnalyzer.analyzeProgram(programId);
console.log("Información del programa:", analysis.programInfo);
console.log("Puntuación de seguridad:", analysis.securityScore);
console.log("Recomendaciones:", analysis.recommendations);

// Obtener estadísticas
const stats = await programAnalyzer.getProgramStatistics(programId);
console.log("Total de cuentas:", stats.totalAccounts);
console.log("Total de lamports:", stats.totalLamports);
```

#### Programas Integrados de Solana
```typescript
// Programas core de Solana
const builtInPrograms = ProgramUtils.getBuiltInProgramIds();
console.log("System Program:", builtInPrograms.SystemProgram);
console.log("Vote Program:", builtInPrograms.VoteProgram);
console.log("Stake Program:", builtInPrograms.StakeProgram);
console.log("Config Program:", builtInPrograms.ConfigProgram);
console.log("Compute Budget Program:", builtInPrograms.ComputeBudgetProgram);

// Verificar si es programa integrado
const isBuiltIn = ProgramUtils.isBuiltInProgram(programId);
console.log("Es programa integrado:", isBuiltIn);

// Obtener tipo de programa
const programType = ProgramUtils.getProgramType(programId);
console.log("Tipo de programa:", programType);
```

#### Análisis de Programas
```typescript
// Análisis completo de programa
const analysis = await programAnalyzer.analyzeProgram(programId);

console.log("📊 Análisis del Programa:");
console.log(`ID: ${analysis.programInfo.programId.toString()}`);
console.log(`Propietario: ${analysis.programInfo.owner.toString()}`);
console.log(`Ejecutable: ${analysis.programInfo.executable}`);
console.log(`Actualizable: ${analysis.programInfo.isUpgradeable}`);
console.log(`Cargador: ${analysis.programInfo.loader}`);
console.log(`Verificado: ${analysis.isVerified}`);
console.log(`Puntuación de seguridad: ${analysis.securityScore}/100`);

console.log("📈 Métricas de rendimiento:");
console.log(`Uso promedio de CU: ${analysis.performanceMetrics.averageCuUsage}`);
console.log(`Uso máximo de CU: ${analysis.performanceMetrics.maxCuUsage}`);
console.log(`Eficiencia: ${(analysis.performanceMetrics.efficiency * 100).toFixed(1)}%`);

console.log("💡 Recomendaciones:");
analysis.recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});
```

#### Comparación de Programas
```typescript
// Comparar múltiples programas
const programIds = [
  new PublicKey("11111111111111111111111111111111"), // System Program
  new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // Token Program
  customProgramId
];

const comparison = await programAnalyzer.comparePrograms(programIds);
console.log("🏆 Comparación de Programas:");
console.log(`Más seguro: ${comparison.comparison.mostSecure.toString()}`);
console.log(`Más eficiente: ${comparison.comparison.mostEfficient.toString()}`);
console.log(`Más grande: ${comparison.comparison.largestProgram.toString()}`);
console.log(`Más actualizable: ${comparison.comparison.mostUpgradeable.toString()}`);
```

#### PDAs Avanzados
```typescript
import { PDAAdvancedExamples } from '@/examples/pda-advanced-examples';
import { PDAManager, PDAUtils } from '@/utils/pda-manager';

// Ejemplos avanzados de PDAs
await PDAAdvancedExamples.basics();                    // Conceptos básicos de PDAs
await PDAAdvancedExamples.derivation();                // Derivación de PDAs
await PDAAdvancedExamples.security();                  // Seguridad de PDAs
await PDAAdvancedExamples.accountCreation();           // Creación de cuentas PDA
await PDAAdvancedExamples.patterns();                  // Patrones de PDAs
await PDAAdvancedExamples.optimization();             // Optimización de PDAs
await PDAAdvancedExamples.testing();                  // Testing de PDAs
await PDAAdvancedExamples.bestPractices();            // Mejores prácticas
await PDAAdvancedExamples.useCases();                 // Casos de uso
await PDAAdvancedExamples.troubleshooting();          // Solución de problemas

// Gestor de PDAs
const pdaManager = new PDAManager(connection);

// Derivar PDA
const derivation = await pdaManager.derivePDA(programId, ["user", userAddress]);
console.log("PDA:", derivation.pda.toString());
console.log("Bump:", derivation.bump);
console.log("Canonical:", derivation.canonical);

// Verificar si PDA existe
const exists = await pdaManager.pdaExists(derivation.pda);
console.log("PDA existe:", exists);

// Obtener información de cuenta PDA
const pdaAccount = await pdaManager.getPDAAccount(derivation.pda);
if (pdaAccount) {
  console.log("Propietario:", pdaAccount.owner.toString());
  console.log("Lamports:", pdaAccount.lamports);
  console.log("Espacio:", pdaAccount.space);
}
```

#### Patrones de PDAs
```typescript
// Obtener patrones comunes
const patterns = pdaManager.getCommonPatterns();
console.log("Patrones disponibles:");
patterns.forEach(pattern => {
  console.log(`- ${pattern.name}: ${pattern.description}`);
  console.log(`  Seeds: ${pattern.seeds.join(' + ')}`);
  console.log(`  Uso: ${pattern.useCase}`);
  console.log("");
});

// Generar PDA para patrón específico
const userProfilePattern = patterns.find(p => p.name === "User Profile");
if (userProfilePattern) {
  const userProfilePDA = await pdaManager.generatePDAForPattern(
    programId,
    userProfilePattern,
    userAddress
  );
  console.log("PDA de perfil de usuario:", userProfilePDA.pda.toString());
}
```

#### Análisis de PDAs
```typescript
// Analizar uso de PDAs
const analysis = await pdaManager.analyzePDAUsage(programId);
console.log("📊 Análisis de PDAs:");
console.log(`Total de PDAs: ${analysis.totalPDAs}`);
console.log(`PDAs activos: ${analysis.activePDAs}`);
console.log(`Total de lamports: ${analysis.totalLamports}`);
console.log(`Tamaño promedio: ${analysis.averageSize} bytes`);

console.log("📈 Patrones de uso:");
Object.entries(analysis.patterns).forEach(([pattern, count]) => {
  console.log(`${pattern}: ${count} PDAs`);
});

// Optimizar operaciones PDA
const optimization = await pdaManager.optimizePDAOperations(programId);
console.log("💡 Recomendaciones:");
optimization.recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});

console.log("⚡ Optimizaciones disponibles:");
Object.entries(optimization.optimizations).forEach(([key, value]) => {
  console.log(`${key}: ${value ? '✅' : '❌'}`);
});
```

#### Gestión Avanzada de PDAs
```typescript
// Derivar múltiples PDAs
const seedSets = [
  ["user", userAddress],
  ["global", "config"],
  ["token", userAddress, mintAddress]
];

const multiplePDAs = await pdaManager.deriveMultiplePDAs(programId, seedSets);
console.log("PDAs derivados:");
multiplePDAs.forEach((pda, index) => {
  console.log(`${index + 1}. ${pda.pda.toString()} (bump: ${pda.bump})`);
});

// Validar derivación PDA
const isValid = pdaManager.validatePDADerivation(
  derivation.pda,
  programId,
  derivation.seeds,
  derivation.bump
);
console.log("Derivación válida:", isValid);

// Obtener estadísticas
const stats = await pdaManager.getPDAStatistics(programId);
console.log("📊 Estadísticas de PDAs:");
console.log(`Derivaciones en caché: ${stats.derivationCount}`);
console.log(`Tiempo promedio: ${stats.averageDerivationTime}ms`);
console.log(`Tasa de acierto: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
console.log(`Patrones más usados: ${stats.mostUsedPatterns.join(', ')}`);
```

#### Utilidades de PDA
```typescript
// Formatear derivación PDA
const formatted = PDAUtils.formatPDADerivation(derivation);
console.log("Información de PDA:");
console.log(formatted);

// Validar patrón PDA
const pattern = patterns[0];
const isValidPattern = PDAUtils.validatePDAPattern(pattern);
console.log("Patrón válido:", isValidPattern);

// Generar seeds desde plantilla
const template = "user + profile + timestamp";
const seeds = PDAUtils.generateSeedsFromTemplate(
  template,
  userAddress,
  { timestamp: Date.now().toString() }
);
console.log("Seeds generados:", seeds);

// Comparar derivaciones PDA
const derivation1 = await pdaManager.derivePDA(programId, ["user", userAddress]);
const derivation2 = await pdaManager.derivePDA(programId, ["user", userAddress]);
const comparison = PDAUtils.comparePDADerivations(derivation1, derivation2);
console.log("Comparación de PDAs:");
console.log(`Mismo PDA: ${comparison.samePDA}`);
console.log(`Mismas seeds: ${comparison.sameSeeds}`);
console.log(`Mismo programa: ${comparison.sameProgram}`);
console.log(`Diferencia de bump: ${comparison.bumpDifference}`);
```

#### CPI Avanzados
```typescript
import { CPIAdvancedExamples } from '@/examples/cpi-advanced-examples';
import { CPIManager, CPIUtils } from '@/utils/cpi-manager';

// Ejemplos avanzados de CPI
await CPIAdvancedExamples.basics();                    // Conceptos básicos de CPI
await CPIAdvancedExamples.patterns();                 // Patrones de CPI
await CPIAdvancedExamples.security();                  // Seguridad de CPI
await CPIAdvancedExamples.optimization();             // Optimización de CPI
await CPIAdvancedExamples.testing();                  // Testing de CPI
await CPIAdvancedExamples.bestPractices();            // Mejores prácticas
await CPIAdvancedExamples.useCases();                 // Casos de uso
await CPIAdvancedExamples.troubleshooting();          // Solución de problemas
await CPIAdvancedExamples.architecture();             // Arquitectura de CPI
await CPIAdvancedExamples.monitoring();               // Monitoreo de CPI

// Gestor de CPI
const cpiManager = new CPIManager(connection);

// Crear CPI call para transferencia SOL
const solTransferCPI = cpiManager.createSOLTransferCPI(from, to, amount);
console.log("CPI de transferencia SOL:", CPIUtils.formatCPICall(solTransferCPI));

// Ejecutar CPI
const result = await cpiManager.executeCPI(solTransferCPI, payer);
console.log("Resultado CPI:", result.success ? "Éxito" : "Error");
if (result.signature) {
  console.log("Firma:", result.signature);
}
```

#### Patrones de CPI
```typescript
// Obtener patrones comunes
const patterns = cpiManager.getCommonPatterns();
console.log("Patrones de CPI disponibles:");
patterns.forEach(pattern => {
  console.log(`- ${pattern.name}: ${pattern.description}`);
  console.log(`  Programa: ${pattern.programId.toString()}`);
  console.log(`  Cuentas: ${pattern.accounts.join(', ')}`);
  console.log(`  Uso: ${pattern.useCase}`);
  console.log("");
});

// Crear CPI para patrón específico
const tokenTransferCPI = cpiManager.createTokenTransferCPI(
  sourceAccount,
  destinationAccount,
  authorityAccount,
  amount
);
console.log("CPI de transferencia de token:", CPIUtils.formatCPICall(tokenTransferCPI));
```

#### Análisis de CPI
```typescript
// Analizar rendimiento de CPI
const analysis = cpiManager.analyzeCPIPerformance();
console.log("💡 Recomendaciones:");
analysis.recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});

console.log("⚡ Optimizaciones disponibles:");
Object.entries(analysis.optimizations).forEach(([key, value]) => {
  console.log(`${key}: ${value ? '✅' : '❌'}`);
});

// Obtener métricas
const metrics = cpiManager.getMetrics();
console.log("📊 Métricas de CPI:");
console.log(`Total de llamadas: ${metrics.totalCalls}`);
console.log(`Llamadas exitosas: ${metrics.successfulCalls}`);
console.log(`Llamadas fallidas: ${metrics.failedCalls}`);
console.log(`Tiempo promedio: ${metrics.averageExecutionTime}ms`);
console.log(`Total de CU: ${metrics.totalComputeUnits}`);
```

#### Gestión Avanzada de CPI
```typescript
// Ejecutar múltiples CPI en lote
const cpiCalls = [
  cpiManager.createSOLTransferCPI(from1, to1, amount1),
  cpiManager.createSOLTransferCPI(from2, to2, amount2),
  cpiManager.createTokenTransferCPI(source, destination, authority, tokenAmount)
];

const batchResults = await cpiManager.executeBatchCPI(cpiCalls, payer);
console.log("Resultados del lote:");
batchResults.forEach((result, index) => {
  console.log(`CPI ${index + 1}: ${result.success ? 'Éxito' : 'Error'}`);
  if (result.error) {
    console.log(`  Error: ${result.error}`);
  }
});

// Crear CPI con PDA signer
const pdaCPI = cpiManager.createPDACPICall(
  programId,
  [pdaAccount, recipientAccount],
  instructionData,
  [["pda", userAddress.toBuffer()]],
  bump
);
console.log("CPI con PDA signer:", CPIUtils.formatCPICall(pdaCPI));
```

#### Monitoreo de CPI
```typescript
// Monitorear CPI calls
const monitoring = await cpiManager.monitorCPICalls(programId, 60000); // 1 minuto
console.log("📊 Monitoreo de CPI:");
console.log(`Total de llamadas: ${monitoring.totalCalls}`);
console.log(`Tasa de éxito: ${(monitoring.successRate * 100).toFixed(1)}%`);
console.log(`Tiempo promedio: ${monitoring.averageTime}ms`);
console.log(`Errores: ${monitoring.errors.length}`);

// Validar CPI call
const validation = cpiManager.validateCPICall(solTransferCPI);
if (validation.valid) {
  console.log("✅ CPI call válido");
} else {
  console.log("❌ CPI call inválido:");
  validation.errors.forEach(error => console.log(`  - ${error}`));
}
```

#### Utilidades de CPI
```typescript
// Formatear CPI call
const formatted = CPIUtils.formatCPICall(solTransferCPI);
console.log("Información de CPI:");
console.log(formatted);

// Crear instrucción CPI
const instruction = CPIUtils.createCPIInstruction(solTransferCPI);
console.log("Instrucción CPI creada:", instruction.programId.toString());

// Validar patrón CPI
const pattern = patterns[0];
const isValidPattern = CPIUtils.validateCPIPattern(pattern);
console.log("Patrón válido:", isValidPattern);

// Comparar CPI calls
const comparison = CPIUtils.compareCPICalls(cpi1, cpi2);
console.log("Comparación de CPI calls:");
console.log(`Mismo programa: ${comparison.sameProgram}`);
console.log(`Mismas cuentas: ${comparison.sameAccounts}`);
console.log(`Mismos datos: ${comparison.sameData}`);
console.log(`Mismos signers: ${comparison.sameSigners}`);
```

#### CPI con PDA Signing
```typescript
// Crear CPI con PDA como signer
const pdaSeeds = [["vault", userAddress.toBuffer()]];
const pdaBump = 255; // Canonical bump

const pdaCPI = cpiManager.createPDACPICall(
  SystemProgram.programId,
  [pdaAccount, recipientAccount],
  transferInstructionData,
  pdaSeeds,
  pdaBump
);

// Ejecutar CPI con PDA signing
const pdaResult = await cpiManager.executeCPI(pdaCPI, payer);
console.log("Resultado CPI con PDA:", pdaResult.success ? "Éxito" : "Error");

// Verificar que el PDA puede firmar
const canSign = pdaCPI.pdaSeeds && pdaCPI.pdaSeeds.length > 0;
console.log("PDA puede firmar:", canSign);
```

#### Optimización de CPI
```typescript
// Analizar y optimizar CPI
const optimization = cpiManager.analyzeCPIPerformance();

console.log("🔧 Optimizaciones recomendadas:");
if (optimization.optimizations.batchOperations) {
  console.log("✅ Usar operaciones en lote para reducir transacciones");
}

if (optimization.optimizations.accountReuse) {
  console.log("✅ Reutilizar cuentas para optimizar rendimiento");
}

if (optimization.optimizations.instructionOptimization) {
  console.log("✅ Optimizar datos de instrucción para reducir CU");
}

if (optimization.optimizations.caching) {
  console.log("✅ Implementar caché para reducir llamadas fallidas");
}

// Resetear métricas
cpiManager.resetMetrics();
console.log("📊 Métricas reseteadas");
```

#### Programa CPI Messenger Completo
```rust
// programs/cpi-messenger/src/lib.rs
use anchor_lang::system_program::{transfer, Transfer};

#[program]
pub mod cpi_messenger {
    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        // CPI: Transfer SOL from user to vault
        let transfer_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        );

        transfer(cpi_context, 1_000_000)?; // 0.001 SOL
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        // CPI: Transfer SOL from vault back to user
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"vault",
            user_key.as_ref(),
            &[ctx.bumps.vault_account]
        ]];

        let cpi_context = CpiContext::new(...)
            .with_signer(signer_seeds);
        transfer(cpi_context, vault_balance)?;
        Ok(())
    }
}
```

#### Testing CPI Completo
```typescript
// tests/cpi-messenger.test.ts
describe("CPI Messenger", () => {
  it("Update Message Account with Payment", async () => {
    const newMessage = "Hello, Solana!";
    
    const txHash = await program.methods
      .update(newMessage)
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    // Verify payment was made
    const vaultBalance = await program.methods
      .getVaultBalance()
      .accounts({ vaultAccount: vaultPda })
      .view();

    expect(vaultBalance.toNumber()).to.equal(1_000_000); // 0.001 SOL
  });
});
```

#### Programa PDA Messenger Completo
```rust
// programs/pda-messenger/src/lib.rs
use anchor_lang::prelude::*;

#[program]
pub mod pda_messenger {
    pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
        let account_data = &mut ctx.accounts.message_account;
        account_data.user = ctx.accounts.user.key();
        account_data.message = message;
        account_data.bump = ctx.bumps.message_account;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        seeds = [b"message", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 4 + message.len() + 1
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
```

#### Testing PDA Completo
```typescript
// tests/pda-messenger.test.ts
describe("PDA Messenger", () => {
  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Create Message Account", async () => {
    const message = "Hello, World!";
    const txHash = await program.methods
      .create(message)
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    const messageAccount = await program.account.messageAccount.fetch(messagePda);
    expect(messageAccount.message).to.equal(message);
  });
});
```

#### Programa Hello Anchor Completo
```rust
// programs/hello-anchor/src/lib.rs
use anchor_lang::prelude::*;

#[program]
mod hello_anchor {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64
}
```

#### Testing Completo
```typescript
// tests/hello-anchor.test.ts
describe("Hello Anchor", () => {
  it("Initialize account with data", async () => {
    const newAccountKp = anchor.web3.Keypair.generate();
    const data = new anchor.BN(42);
    
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();
    
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );
    
    expect(data.eq(newAccount.data)).to.be.true;
  });
});
```

## 📊 Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend PWA  │    │  Smart Contracts│    │   Oracle Data   │
│                 │    │                 │    │                 │
│  - React/TS     │◄──►│  - Anchor       │◄──►│  - Pyth Network │
│  - Wallet Conn  │    │  - Solana       │    │  - Switchboard  │
│  - UI/UX        │    │  - SPL Tokens   │    │  - Chainlink    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Roadmap

### Fase 1 - MVP (Actual)

* Interfaz básica de usuario
* Conexión de wallet
* Creación de mercados simples
* Sistema de trading básico

### Fase 2 - Expansión

* Mercados complejos (múltiples resultados)
* Sistema de reputación
* Análisis avanzado y gráficos
* API pública

### Fase 3 - Escalabilidad

* Mercados de alta frecuencia
* Integración con más oráculos
* Mobile app nativa
* Gobernanza descentralizada

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

* [Documentación](https://docs.oraculos.dev)
* [Discord](https://discord.gg/oraculos)
* [Twitter](https://twitter.com/oraculos_dev)
* [Telegram](https://t.me/oraculos)

## 💡 ¿Por qué OráculoS?

En un mundo lleno de incertidumbre, **OráculoS** democratiza el acceso a la información del futuro. No solo es una plataforma de trading, es una herramienta para:

* **Investigación**: Los precios de mercado reflejan la sabiduría colectiva
* **Hedge**: Protege contra riesgos específicos
* **Especulación**: Aprovecha tu conocimiento sobre eventos futuros
* **Entretenimiento**: Participa en mercados sobre temas que te interesan

---

**¡El futuro es predecible con OráculoS! 🔮✨**
