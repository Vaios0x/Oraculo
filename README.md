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

### 🪙 Operaciones de Tokens Avanzadas

* **Transferencias**: Transferencias seguras entre cuentas con validación
* **Delegación**: Sistema de delegación para transferencias autorizadas
* **Quema de Tokens**: Reducción controlada de la oferta de tokens
* **Congelamiento**: Control de cuentas para casos especiales
* **Wrapped SOL**: Operaciones con SOL nativo como token SPL
* **Operaciones en Lote**: Procesamiento eficiente de múltiples operaciones

### 🔧 Extensiones de Tokens Avanzadas

* **Scaled UI Amount**: Multiplicadores dinámicos para cantidades de UI
* **Transfer Fees**: Comisiones automáticas en transferencias
* **Metadata**: Metadatos enriquecidos para tokens
* **Memo Transfer**: Requerimiento de memos en transferencias
* **Immutable Owner**: Propietarios permanentes de cuentas
* **Non-Transferable**: Tokens que no pueden ser transferidos
* **Interest Bearing**: Tokens que generan interés automáticamente
* **Default Account State**: Estado por defecto para nuevas cuentas
* **Permanent Delegate**: Delegado permanente e irrevocable
* **Mint Close Authority**: Autoridad para cerrar mints
* **Token Groups**: Grupos y miembros de tokens
* **CPI Guard**: Protección contra transferencias no autorizadas
* **Pausable**: Pausar operaciones de tokens
* **Transfer Hook**: Hooks personalizados para transferencias
* **Confidential Transfer**: Transferencias confidenciales
* **Variable Length Mint**: Mints con longitud variable

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
npm run examples:spl-token-advanced    # Ejecutar ejemplos avanzados de SPL Token
npm run examples:mint-tokens-advanced  # Ejecutar ejemplos avanzados de Mint Tokens
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

#### SPL Token Avanzados
```typescript
import { SPLTokenAdvancedExamples } from '@/examples/spl-token-advanced-examples';
import { SPLTokenManager, SPLTokenUtils } from '@/utils/spl-token-manager';

// Ejemplos avanzados de SPL Token
await SPLTokenAdvancedExamples.basics();                    // Conceptos básicos de SPL Token
await SPLTokenAdvancedExamples.mintAccountManagement();     // Gestión de cuentas mint
await SPLTokenAdvancedExamples.tokenAccountManagement();    // Gestión de cuentas de token
await SPLTokenAdvancedExamples.associatedTokenAccount();   // Cuentas de token asociadas
await SPLTokenAdvancedExamples.tokenOperations();          // Operaciones de token
await SPLTokenAdvancedExamples.security();                 // Seguridad de tokens
await SPLTokenAdvancedExamples.optimization();             // Optimización de tokens
await SPLTokenAdvancedExamples.testing();                  // Testing de tokens
await SPLTokenAdvancedExamples.bestPractices();            // Mejores prácticas
await SPLTokenAdvancedExamples.useCases();                 // Casos de uso

// Gestor de SPL Token
const tokenManager = new SPLTokenManager(connection);

// Crear token mint
const { mint, signature } = await tokenManager.createTokenMint(
  payer,
  mintAuthority,
  freezeAuthority,
  9 // decimals
);
console.log("Token mint creado:", mint.publicKey.toString());
console.log("Firma:", signature);

// Crear cuenta de token asociada
const { ata, signature: ataSignature } = await tokenManager.createAssociatedTokenAccount(
  payer,
  mint.publicKey,
  owner
);
console.log("ATA creada:", ata.toString());
console.log("Firma:", ataSignature);
```

#### Operaciones de Token
```typescript
// Mintear tokens
const mintSignature = await tokenManager.mintTokens(
  mint.publicKey,
  ata,
  mintAuthority,
  1000000 // amount
);
console.log("Tokens minteados:", mintSignature);

// Transferir tokens
const transferSignature = await tokenManager.transferTokens(
  sourceAccount,
  destinationAccount,
  owner,
  500000 // amount
);
console.log("Tokens transferidos:", transferSignature);

// Aprobar delegado
const approveSignature = await tokenManager.approveDelegate(
  tokenAccount,
  delegate,
  owner,
  100000 // amount
);
console.log("Delegado aprobado:", approveSignature);

// Quemar tokens
const burnSignature = await tokenManager.burnTokens(
  tokenAccount,
  mint.publicKey,
  owner,
  100000 // amount
);
console.log("Tokens quemados:", burnSignature);
```

#### Gestión de Autoridades
```typescript
// Congelar cuenta
const freezeSignature = await tokenManager.freezeAccount(
  tokenAccount,
  mint.publicKey,
  freezeAuthority
);
console.log("Cuenta congelada:", freezeSignature);

// Descongelar cuenta
const thawSignature = await tokenManager.thawAccount(
  tokenAccount,
  mint.publicKey,
  freezeAuthority
);
console.log("Cuenta descongelada:", thawSignature);

// Establecer autoridad
const setAuthoritySignature = await tokenManager.setAuthority(
  mint.publicKey,
  currentAuthority,
  newAuthority,
  AuthorityType.MintTokens
);
console.log("Autoridad establecida:", setAuthoritySignature);

// Revocar delegado
const revokeSignature = await tokenManager.revokeDelegate(
  tokenAccount,
  owner
);
console.log("Delegado revocado:", revokeSignature);
```

#### Información de Token
```typescript
// Obtener información de cuenta de token
const tokenAccountInfo = await tokenManager.getTokenAccount(tokenAccount);
if (tokenAccountInfo) {
  console.log("📊 Información de Cuenta de Token:");
  console.log(`Mint: ${tokenAccountInfo.mint.toString()}`);
  console.log(`Propietario: ${tokenAccountInfo.owner.toString()}`);
  console.log(`Cantidad: ${SPLTokenUtils.formatTokenAmount(tokenAccountInfo.amount, 9)}`);
  console.log(`Delegado: ${tokenAccountInfo.delegate?.toString() || 'Ninguno'}`);
  console.log(`Estado: ${tokenAccountInfo.state}`);
  console.log(`Es nativo: ${tokenAccountInfo.isNative}`);
}

// Obtener información de mint
const mintInfo = await tokenManager.getMintInfo(mint.publicKey);
if (mintInfo) {
  console.log("🏭 Información de Mint:");
  console.log(`Autoridad de mint: ${mintInfo.mintAuthority?.toString() || 'Ninguna'}`);
  console.log(`Autoridad de congelación: ${mintInfo.freezeAuthority?.toString() || 'Ninguna'}`);
  console.log(`Suministro: ${SPLTokenUtils.formatTokenAmount(mintInfo.supply, mintInfo.decimals)}`);
  console.log(`Decimales: ${mintInfo.decimals}`);
  console.log(`Inicializado: ${mintInfo.isInitialized}`);
}
```

#### Cuentas de Token Asociadas
```typescript
// Obtener dirección ATA
const ataAddress = await tokenManager.getAssociatedTokenAddress(mint, owner);
console.log("Dirección ATA:", ataAddress.toString());

// Verificar si ATA existe
const ataExists = await tokenManager.associatedTokenAccountExists(mint, owner);
console.log("ATA existe:", ataExists);

// Crear ATA si no existe
if (!ataExists) {
  const { ata, signature } = await tokenManager.createAssociatedTokenAccount(
    payer,
    mint,
    owner
  );
  console.log("ATA creada:", ata.toString());
  console.log("Firma:", signature);
}
```

#### Sincronización de SOL Nativo
```typescript
// Sincronizar SOL nativo a SOL envuelto
const syncSignature = await tokenManager.syncNative(wrappedSolAccount, authority);
console.log("SOL sincronizado:", syncSignature);

// Verificar balance después de sincronización
const accountInfo = await tokenManager.getTokenAccount(wrappedSolAccount);
if (accountInfo) {
  console.log("Balance de SOL envuelto:", SPLTokenUtils.formatTokenAmount(accountInfo.amount, 9));
}
```

#### Utilidades de Token
```typescript
// Formatear cantidad de token
const formattedAmount = SPLTokenUtils.formatTokenAmount(1000000000n, 9);
console.log("Cantidad formateada:", formattedAmount); // "1.000000000"

// Parsear cantidad de token
const parsedAmount = SPLTokenUtils.parseTokenAmount("1.5", 9);
console.log("Cantidad parseada:", parsedAmount.toString()); // "1500000000"

// Obtener IDs de programa
const tokenProgramId = SPLTokenUtils.getTokenProgramId();
const ataProgramId = SPLTokenUtils.getAssociatedTokenProgramId();
console.log("Token Program ID:", tokenProgramId.toString());
console.log("ATA Program ID:", ataProgramId.toString());

// Validar cuenta de token
const isValidAccount = SPLTokenUtils.validateTokenAccount(tokenAccountInfo);
console.log("Cuenta válida:", isValidAccount);

// Validar cuenta mint
const isValidMint = SPLTokenUtils.validateMintAccount(mintInfo);
console.log("Mint válido:", isValidMint);
```

#### Métricas de Token
```typescript
// Obtener métricas
const metrics = tokenManager.getMetrics();
console.log("📊 Métricas de Token:");
console.log(`Total de mints: ${metrics.totalMints}`);
console.log(`Total de cuentas: ${metrics.totalAccounts}`);
console.log(`Suministro total: ${SPLTokenUtils.formatTokenAmount(metrics.totalSupply, 9)}`);
console.log(`Balance promedio: ${SPLTokenUtils.formatTokenAmount(metrics.averageBalance, 9)}`);

console.log("📈 Mints más usados:");
Object.entries(metrics.mostUsedMints).forEach(([mint, count]) => {
  console.log(`${mint}: ${count} operaciones`);
});

console.log("🔢 Conteo de operaciones:");
Object.entries(metrics.operationCounts).forEach(([operation, count]) => {
  console.log(`${operation}: ${count} veces`);
});

// Resetear métricas
tokenManager.resetMetrics();
console.log("📊 Métricas reseteadas");
```

#### Mint Tokens Avanzados
```typescript
import { MintTokensAdvancedExamples } from '@/examples/mint-tokens-advanced-examples';
import { MintTokensManager, MintTokensUtils } from '@/utils/mint-tokens-manager';

// Ejemplos avanzados de Mint Tokens
await MintTokensAdvancedExamples.basics();                    // Conceptos básicos de minting
await MintTokensAdvancedExamples.authorityManagement();     // Gestión de autoridades
await MintTokensAdvancedExamples.supplyManagement();         // Gestión de suministro
await MintTokensAdvancedExamples.strategies();               // Estrategias de minting
await MintTokensAdvancedExamples.security();                 // Seguridad de minting
await MintTokensAdvancedExamples.economics();                // Economía de tokens
await MintTokensAdvancedExamples.optimization();             // Optimización de minting
await MintTokensAdvancedExamples.testing();                  // Testing de minting
await MintTokensAdvancedExamples.bestPractices();            // Mejores prácticas
await MintTokensAdvancedExamples.useCases();                 // Casos de uso

// Gestor de Mint Tokens
const mintManager = new MintTokensManager(connection);

// Mintear tokens
const operation = await mintManager.mintTokens(
  mint.publicKey,
  destinationAccount,
  mintAuthority,
  1000000, // amount
  9 // decimals
);
console.log("Tokens minteados:", operation.signature);
console.log("Cantidad:", operation.amount.toString());
console.log("Destino:", operation.destination.toString());
```

#### Operaciones de Minting
```typescript
// Mintear tokens individual
const operation = await mintManager.mintTokens(
  mint.publicKey,
  destinationAccount,
  mintAuthority,
  1000000 // amount
);
console.log("Operación de minting:", MintTokensUtils.formatMintingOperation(operation));

// Mintear tokens en lote
const destinations = [
  { account: account1, amount: 500000 },
  { account: account2, amount: 300000 },
  { account: account3, amount: 200000 }
];
const batchOperations = await mintManager.batchMintTokens(
  mint.publicKey,
  destinations,
  mintAuthority
);
console.log("Operaciones en lote:", batchOperations.length);

// Establecer autoridad de mint
const setAuthoritySignature = await mintManager.setMintAuthority(
  mint.publicKey,
  currentAuthority,
  newAuthority,
  AuthorityType.MintTokens
);
console.log("Autoridad establecida:", setAuthoritySignature);

// Revocar autoridad de mint
const revokeSignature = await mintManager.revokeMintAuthority(
  mint.publicKey,
  currentAuthority
);
console.log("Autoridad revocada:", revokeSignature);
```

#### Gestión de Suministro
```typescript
// Obtener información de suministro
const supply = await mintManager.getTokenSupply(mint.publicKey);
if (supply) {
  console.log("📊 Información de Suministro:");
  console.log(MintTokensUtils.formatTokenSupply(supply));
  console.log(`Suministro actual: ${supply.currentSupply.toString()}`);
  console.log(`Suministro máximo: ${supply.maxSupply?.toString() || 'Ilimitado'}`);
  console.log(`Decimales: ${supply.decimals}`);
  console.log(`Inicializado: ${supply.isInitialized}`);
  console.log(`Autoridad de mint: ${supply.mintAuthority?.toString() || 'Ninguna'}`);
  console.log(`Autoridad de congelación: ${supply.freezeAuthority?.toString() || 'Ninguna'}`);
}

// Verificar si se puede mintear
const canMint = await mintManager.canMint(mint.publicKey, mintAuthority.publicKey);
console.log("¿Se puede mintear?", canMint);

// Obtener historial de minting
const history = await mintManager.getMintingHistory(mint.publicKey, 50);
console.log("📈 Historial de Minting:");
history.forEach((op, index) => {
  console.log(`${index + 1}. ${MintTokensUtils.formatMintingOperation(op)}`);
});
```

#### Análisis de Minting
```typescript
// Calcular tasa de minting
const mintingRate = await mintManager.calculateMintingRate(
  mint.publicKey,
  24 * 60 * 60 * 1000 // 24 horas
);
console.log("📊 Tasa de Minting:");
console.log(`Tasa: ${mintingRate.rate.toFixed(2)} mints por hora`);
console.log(`Total minteado: ${mintingRate.totalMinted.toString()}`);
console.log(`Ventana de tiempo: ${mintingRate.timeWindow / (60 * 60 * 1000)} horas`);

// Monitorear actividad de minting
const activity = await mintManager.monitorMintingActivity(
  mint.publicKey,
  60000 // 1 minuto
);
console.log("📈 Actividad de Minting:");
console.log(`Mints en el período: ${activity.mintsInPeriod}`);
console.log(`Cantidad total minteada: ${activity.totalAmountMinted.toString()}`);
console.log(`Cantidad promedio: ${activity.averageMintAmount.toString()}`);
console.log(`Tasa de minting: ${activity.mintingRate.toFixed(2)} mints/segundo`);

// Calcular eficiencia de minting
const efficiency = MintTokensUtils.calculateMintingEfficiency(history);
console.log("⚡ Eficiencia de Minting:");
console.log(`Total minteado: ${efficiency.totalMinted.toString()}`);
console.log(`Cantidad promedio: ${efficiency.averageAmount.toString()}`);
console.log(`Frecuencia de minting: ${efficiency.mintingFrequency.toFixed(2)}`);
console.log(`Eficiencia: ${efficiency.efficiency.toFixed(2)}`);
```

#### Validación de Operaciones
```typescript
// Validar operación de minting
const validation = mintManager.validateMintingOperation(
  mint.publicKey,
  destinationAccount,
  1000000,
  mintAuthority.publicKey
);
if (validation.valid) {
  console.log("✅ Operación válida");
} else {
  console.log("❌ Errores de validación:");
  validation.errors.forEach(error => console.log(`  - ${error}`));
}

// Comparar operaciones de minting
if (history.length >= 2) {
  const comparison = MintTokensUtils.compareMintingOperations(
    history[0],
    history[1]
  );
  console.log("🔍 Comparación de Operaciones:");
  console.log(`Mismo mint: ${comparison.sameMint}`);
  console.log(`Mismo destino: ${comparison.sameDestination}`);
  console.log(`Misma autoridad: ${comparison.sameAuthority}`);
  console.log(`Diferencia de cantidad: ${comparison.amountDifference.toString()}`);
}
```

#### Métricas de Minting
```typescript
// Obtener métricas
const metrics = mintManager.getMetrics();
console.log("📊 Métricas de Minting:");
console.log(`Total de mints: ${metrics.totalMints}`);
console.log(`Cantidad total minteada: ${metrics.totalAmountMinted.toString()}`);
console.log(`Cantidad promedio: ${metrics.averageMintAmount.toString()}`);
console.log(`Cambios de autoridad: ${metrics.authorityChanges}`);

console.log("📈 Mints más activos:");
Object.entries(metrics.mostActiveMints).forEach(([mint, count]) => {
  console.log(`${mint}: ${count} operaciones`);
});

console.log("📊 Crecimiento de suministro:");
Object.entries(metrics.supplyGrowth).forEach(([mint, growth]) => {
  console.log(`${mint}: +${growth.toString()} tokens`);
});

// Resetear métricas
mintManager.resetMetrics();
console.log("📊 Métricas reseteadas");
```

#### Estrategias de Minting
```typescript
// Estrategia de suministro fijo
const fixedSupplyStrategy = {
  maxSupply: 1000000000n, // 1B tokens
  currentSupply: 0n,
  canMint: (amount: bigint) => {
    return fixedSupplyStrategy.currentSupply + amount <= fixedSupplyStrategy.maxSupply;
  }
};

// Estrategia de suministro controlado
const controlledSupplyStrategy = {
  dailyLimit: 1000000n, // 1M tokens por día
  lastMintDate: new Date(),
  canMint: (amount: bigint) => {
    const today = new Date();
    const isNewDay = today.getDate() !== controlledSupplyStrategy.lastMintDate.getDate();
    return isNewDay || amount <= controlledSupplyStrategy.dailyLimit;
  }
};

// Estrategia de suministro dinámico
const dynamicSupplyStrategy = {
  baseRate: 0.01, // 1% por día
  maxRate: 0.05, // 5% máximo
  calculateRate: (supply: bigint, target: bigint) => {
    const ratio = Number(supply) / Number(target);
    return Math.min(ratio * dynamicSupplyStrategy.baseRate, dynamicSupplyStrategy.maxRate);
  }
};

console.log("📈 Estrategias de Minting:");
console.log("Suministro fijo:", fixedSupplyStrategy.canMint(1000000n));
console.log("Suministro controlado:", controlledSupplyStrategy.canMint(500000n));
console.log("Suministro dinámico:", dynamicSupplyStrategy.calculateRate(1000000n, 10000000n));
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

## 🔧 Token Extensions Manager

### Características Principales

El **Token Extensions Manager** proporciona una interfaz completa para gestionar extensiones avanzadas de tokens SPL en Solana:

#### 🪙 Scaled UI Amount Extension
```typescript
import { TokenExtensionsManager } from './src/utils/token-extensions-manager';

const manager = new TokenExtensionsManager(connection);

// Crear token con extensión Scaled UI Amount
const result = await manager.createTokenWithScaledUIAmount(
  payer,
  mint,
  decimals,
  1.5, // Multiplicador inicial
  "Scaled Token",
  "SCALED",
  "https://example.com/metadata.json"
);

// Actualizar multiplicador
await manager.updateScaledUIMultiplier(
  mint,
  2.0, // Nuevo multiplicador
  authority
);

// Calcular cantidades UI
const uiAmount = await manager.calculateUIAmount(mint, rawAmount);
const rawAmount = await manager.calculateRawAmount(mint, uiAmount);
```

#### 💰 Transfer Fee Extension
```typescript
// Crear token con comisiones de transferencia
const result = await manager.createTokenWithTransferFee(
  payer,
  mint,
  decimals,
  150, // 1.5% de comisión
  BigInt(1000000), // Comisión máxima
  "Fee Token",
  "FEE"
);

// Calcular comisión de transferencia
const fee = await manager.calculateTransferFee(mint, amount);

// Obtener información de comisiones
const feeInfo = await manager.getTransferFeeInfo(mint);
```

#### 📝 Metadata Extension
```typescript
// Crear token con metadatos enriquecidos
const additionalMetadata = new Map<string, string>();
additionalMetadata.set("description", "Token con metadatos avanzados");
additionalMetadata.set("image", "https://example.com/image.png");

const result = await manager.createTokenWithMetadata(
  payer,
  mint,
  decimals,
  "Metadata Token",
  "META",
  "https://example.com/metadata.json",
  additionalMetadata
);
```

#### 📝 Memo Transfer Extension
```typescript
// Crear token que requiere memos en transferencias
const result = await manager.createTokenWithMemoTransfer(
  payer,
  mint,
  decimals,
  true // Requerir memos
);
```

#### 🔒 Immutable Owner Extension
```typescript
// Crear token con propietario inmutable
const result = await manager.createTokenWithImmutableOwner(
  payer,
  mint,
  decimals,
  owner // Propietario permanente
);
```

#### 🚫 Non-Transferable Extension
```typescript
// Crear token no transferible
const result = await manager.createTokenWithNonTransferable(
  payer,
  mint,
  decimals
);
```

#### 💰 Interest Bearing Extension
```typescript
// Crear token que genera interés
const result = await manager.createTokenWithInterestBearing(
  payer,
  mint,
  decimals,
  500, // 5% anual en basis points
  "Interest Token",
  "INT",
  "https://example.com/metadata.json"
);

// Calcular interés
const interest = await manager.calculateInterest(
  mint,
  principal,
  timeElapsed
);

// Obtener tasa de interés actual
const currentRate = await manager.getCurrentInterestRate(mint);
```

#### 🔒 Default Account State Extension
```typescript
// Crear token con estado por defecto
const result = await manager.createTokenWithDefaultAccountState(
  payer,
  mint,
  decimals,
  'Frozen', // Nuevas cuentas estarán congeladas
  "Frozen Token",
  "FROZEN",
  "https://example.com/metadata.json"
);
```

#### 🔐 Permanent Delegate Extension
```typescript
// Crear token con delegado permanente
const result = await manager.createTokenWithPermanentDelegate(
  payer,
  mint,
  decimals,
  delegate, // Delegado permanente
  "Permanent Token",
  "PERM",
  "https://example.com/metadata.json"
);
```

#### 🔒 Mint Close Authority Extension
```typescript
// Crear token con autoridad de cierre
const result = await manager.createTokenWithMintCloseAuthority(
  payer,
  mint,
  decimals,
  closeAuthority, // Autoridad para cerrar el mint
  "Closeable Token",
  "CLOSE",
  "https://example.com/metadata.json"
);
```

#### 👥 Token Groups Extension
```typescript
// Crear token grupo
const groupResult = await manager.createTokenWithGroup(
  payer,
  groupMint,
  decimals,
  100, // tamaño máximo
  "Collection Group",
  "GROUP",
  "https://example.com/group-metadata.json"
);

// Crear token miembro
const memberResult = await manager.createTokenWithGroupMember(
  payer,
  memberMint,
  decimals,
  groupResult.mint, // grupo al que pertenece
  1, // número de miembro
  "Collection Member",
  "MEMBER",
  "https://example.com/member-metadata.json"
);

// Obtener información del grupo
const groupInfo = await manager.getTokenGroupInfo(groupResult.mint);
const memberInfo = await manager.getTokenGroupMemberInfo(memberResult.mint);
```

#### 🛡️ CPI Guard Extension
```typescript
// Crear token con protección CPI
const result = await manager.createTokenWithCpiGuard(
  payer,
  mint,
  decimals,
  true, // bloquear CPI
  "Protected Token",
  "GUARD",
  "https://example.com/metadata.json"
);

// Verificar si CPI Guard está habilitado
const cpiGuardEnabled = await manager.isCpiGuardEnabled(mint);
```

#### ⏸️ Pausable Extension
```typescript
// Crear token pausable
const result = await manager.createTokenWithPausable(
  payer,
  mint,
  decimals,
  pauseAuthority, // Autoridad para pausar
  "Pausable Token",
  "PAUSE",
  "https://example.com/metadata.json"
);

// Pausar operaciones
const pauseSignature = await manager.pauseTokenOperations(mint, pauseAuthority);

// Reanudar operaciones
const unpauseSignature = await manager.unpauseTokenOperations(mint, pauseAuthority);

// Verificar si está pausado
const isPaused = await manager.isTokenPaused(mint);
```

#### 🪝 Transfer Hook Extension
```typescript
// Crear token con transfer hook
const result = await manager.createTokenWithTransferHook(
  payer,
  mint,
  decimals,
  hookProgramId, // Programa del hook
  hookAuthority, // Autoridad del hook
  "Hook Token",
  "HOOK",
  "https://example.com/metadata.json"
);
```

#### 🔒 Confidential Transfer Extension
```typescript
// Crear token con transferencias confidenciales
const result = await manager.createTokenWithConfidentialTransfer(
  payer,
  mint,
  decimals,
  auditorElgamalPubkey, // Clave pública del auditor
  auditorAuthority, // Autoridad del auditor
  "Confidential Token",
  "CONF",
  "https://example.com/metadata.json"
);
```

#### 📏 Variable Length Mint Extension
```typescript
// Crear token con mint de longitud variable
const data = new Uint8Array([1, 2, 3, 4, 5]);
const result = await manager.createTokenWithVariableLengthMint(
  payer,
  mint,
  decimals,
  100, // longitud
  data, // datos personalizados
  "Variable Token",
  "VAR",
  "https://example.com/metadata.json"
);
```

### ⚠️ Incompatibilidades de Extensiones

```typescript
// Verificar compatibilidad de extensiones
const compatibility = manager.checkExtensionCompatibility(extensions);

if (compatibility.incompatible.length > 0) {
  console.log('❌ Extensiones incompatibles:', compatibility.incompatible);
}

if (compatibility.warnings.length > 0) {
  console.log('⚠️ Advertencias:', compatibility.warnings);
}

if (compatibility.recommendations.length > 0) {
  console.log('💡 Recomendaciones:', compatibility.recommendations);
}
```

#### Extensiones Incompatibles:
- **NonTransferable** ❌ **TransferFee**: No se pueden cobrar comisiones en tokens no transferibles
- **ScaledUIAmount** ❌ **InterestBearing**: No se pueden aplicar multiplicadores a tokens con interés
- **ConfidentialTransfer** ⚠️ **Metadata**: Las transferencias confidenciales pueden limitar la visibilidad de metadatos
- **Pausable** ⚠️ **PermanentDelegate**: Los tokens pausables con delegados permanentes pueden tener comportamiento complejo

### Ejemplos Avanzados

#### Múltiples Extensiones Combinadas
```typescript
import { TokenExtensionsExamples } from './src/examples/token-extensions-advanced-examples';

const result = await TokenExtensionsExamples.multipleExtensionsExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Análisis de Costos de Extensiones
```typescript
const costAnalysis = await TokenExtensionsExamples.extensionCostAnalysisExample(
  connection,
  extensionSets
);
```

#### Monitoreo de Extensiones
```typescript
const monitoring = await TokenExtensionsExamples.extensionMonitoringExample(
  connection,
  duration
);
```

#### Tokens con Interés
```typescript
const interestToken = await TokenExtensionsExamples.interestBearingExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Estado por Defecto de Cuentas
```typescript
const defaultState = await TokenExtensionsExamples.defaultAccountStateExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Delegado Permanente
```typescript
const permanentDelegate = await TokenExtensionsExamples.permanentDelegateExample(
  connection,
  payer,
  mint,
  delegate,
  decimals
);
```

#### Autoridad de Cierre de Mint
```typescript
const mintClose = await TokenExtensionsExamples.mintCloseAuthorityExample(
  connection,
  payer,
  mint,
  closeAuthority,
  decimals
);
```

#### Grupos de Tokens
```typescript
const tokenGroups = await TokenExtensionsExamples.tokenGroupsExample(
  connection,
  payer,
  groupMint,
  memberMint,
  decimals
);
```

#### Protección CPI
```typescript
const cpiGuard = await TokenExtensionsExamples.cpiGuardExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Combinaciones Avanzadas
```typescript
const advancedCombinations = await TokenExtensionsExamples.advancedExtensionCombinationsExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Tokens Pausables
```typescript
const pausableToken = await TokenExtensionsExamples.pausableExample(
  connection,
  payer,
  mint,
  pauseAuthority,
  decimals
);
```

#### Transfer Hooks
```typescript
const transferHook = await TokenExtensionsExamples.transferHookExample(
  connection,
  payer,
  mint,
  hookProgramId,
  hookAuthority,
  decimals
);
```

#### Transferencias Confidenciales
```typescript
const confidentialTransfer = await TokenExtensionsExamples.confidentialTransferExample(
  connection,
  payer,
  mint,
  auditorElgamalPubkey,
  auditorAuthority,
  decimals
);
```

#### Mints de Longitud Variable
```typescript
const variableLengthMint = await TokenExtensionsExamples.variableLengthMintExample(
  connection,
  payer,
  mint,
  length,
  data,
  decimals
);
```

#### Verificación de Compatibilidad
```typescript
const compatibility = await TokenExtensionsExamples.extensionCompatibilityExample(
  connection,
  extensions
);
```

#### Sistema Completo de Extensiones
```typescript
const completeSystem = await TokenExtensionsExamples.completeExtensionSystemExample(
  connection,
  payer,
  mint,
  decimals
);
```

#### Transferencias Confidenciales Avanzadas
```typescript
// Verificar disponibilidad
const isAvailable = await manager.isConfidentialTransferAvailable();

// Configurar cuenta para transferencias confidenciales
const elgamalKeypair = await manager.generateElGamalKeypair(payer, account);
const aesKey = await manager.generateAESKey(payer, account);
const configureSignature = await manager.configureConfidentialTransferAccount(
  account, mint, payer, elgamalKeypair, aesKey
);

// Depositar tokens a balance confidencial pendiente
const depositSignature = await manager.depositToConfidentialPendingBalance(
  account, payer, amount, decimals
);

// Aplicar balance pendiente a balance disponible
const applySignature = await manager.applyPendingBalance(
  account, payer, elgamalKeypair, aesKey
);

// Transferir tokens confidencialmente
const transferSignature = await manager.confidentialTransfer(
  sourceAccount, destinationAccount, payer, amount, decimals,
  sourceElgamalKeypair, sourceAESKey, destElgamalPubkey
);

// Retirar de balance confidencial
const withdrawSignature = await manager.withdrawFromConfidentialBalance(
  account, payer, amount, decimals, elgamalKeypair, aesKey
);
```

#### Flujo Completo de Transferencias Confidenciales
```typescript
const workflow = await TokenExtensionsExamples.completeConfidentialTransferWorkflowExample(
  connection,
  payer,
  mint,
  decimals
);
```

### ⚠️ Estado Actual de Transferencias Confidenciales

**Las Transferencias Confidenciales están temporalmente deshabilitadas** debido a una auditoría de seguridad del programa ZK ElGamal. Aunque los conceptos y la implementación siguen siendo válidos, las funciones no estarán disponibles hasta que se complete la auditoría.

#### Limitaciones Actuales:
- ❌ **ZK ElGamal Program deshabilitado** en mainnet y devnet
- ❌ **Transferencias confidenciales no disponibles** temporalmente
- ⚠️ **Auditoría de seguridad en progreso** - funcionalidad será restaurada
- 📋 **Conceptos y código siguen siendo válidos** para cuando estén disponibles

#### Requisitos para Transferencias Confidenciales:
- ✅ **Token mint** debe tener extensión `ConfidentialTransferMint`
- ✅ **Cuentas de origen y destino** deben estar configuradas para transferencias confidenciales
- ✅ **Pares de claves ElGamal** deben ser generados para encriptación
- ✅ **Claves AES** deben ser generadas para desencriptación eficiente
- ✅ **Pruebas ZK** deben ser generadas del lado del cliente
- ✅ **Múltiples cuentas de prueba** necesarias para operaciones

### Utilidades de Extensiones

```typescript
import { TokenExtensionsUtils } from './src/utils/token-extensions-manager';

// Formatear configuración de Scaled UI Amount
const formatted = TokenExtensionsUtils.formatScaledUIAmountConfig(config);

// Formatear configuración de Transfer Fee
const feeFormatted = TokenExtensionsUtils.formatTransferFeeConfig(feeConfig);

// Formatear metadatos de token
const metadataFormatted = TokenExtensionsUtils.formatTokenMetadata(metadata);

// Validar configuración de extensión
const validation = TokenExtensionsUtils.validateExtensionConfig('metadata', config);

// Calcular costos de extensiones
const costs = TokenExtensionsUtils.calculateExtensionCosts(extensions);

// Comparar configuraciones de extensiones
const comparison = TokenExtensionsUtils.compareExtensionConfigs(config1, config2);
```

## 🪙 Token Operations Manager

### Características Principales

El **Token Operations Manager** proporciona una interfaz completa para operaciones avanzadas de tokens SPL en Solana:

#### 🔄 Transferencias de Tokens
```typescript
import { TokenOperationsManager } from './src/utils/token-operations-manager';

const manager = new TokenOperationsManager(connection);

// Transferencia básica
const transfer = await manager.transferTokens(
  sourceAccount,
  destinationAccount,
  amount,
  authority
);

// Transferencia con validación
const transferChecked = await manager.transferTokensChecked(
  sourceAccount,
  destinationAccount,
  mint,
  amount,
  decimals,
  authority
);
```

#### 🔐 Sistema de Delegación
```typescript
// Aprobar delegado
const delegation = await manager.approveDelegateChecked(
  tokenAccount,
  mint,
  delegate,
  amount,
  decimals,
  owner
);

// Revocar delegación
const revokeSignature = await manager.revokeDelegate(
  tokenAccount,
  owner
);
```

#### 🔥 Quema de Tokens
```typescript
// Quemar tokens con validación
const burn = await manager.burnTokensChecked(
  tokenAccount,
  mint,
  amount,
  decimals,
  authority
);
```

#### ❄️ Congelamiento de Cuentas
```typescript
// Congelar cuenta
const freeze = await manager.freezeAccount(
  tokenAccount,
  mint,
  freezeAuthority
);

// Descongelar cuenta
const thaw = await manager.thawAccount(
  tokenAccount,
  mint,
  freezeAuthority
);
```

#### 🪙 Wrapped SOL (WSOL)
```typescript
// Sincronizar SOL nativo
const syncSignature = await manager.syncNative(wrappedSOLAccount);

// Cerrar cuenta WSOL (unwrap)
const unwrapSignature = await manager.closeAccount(
  wrappedSOLAccount,
  destination,
  owner
);
```

### Ejemplos Avanzados

#### Transferencia Completa
```typescript
import { TokenOperationsExamples } from './src/examples/token-operations-advanced-examples';

const result = await TokenOperationsExamples.completeTokenTransferWorkflow(
  connection,
  payer,
  mint,
  sourceOwner,
  destinationOwner,
  amount,
  decimals
);
```

#### Sistema de Delegación Avanzado
```typescript
const delegationResult = await TokenOperationsExamples.advancedDelegationSystem(
  connection,
  payer,
  mint,
  tokenOwner,
  delegate,
  delegationAmount,
  decimals
);
```

#### Operaciones en Lote
```typescript
const batchResult = await TokenOperationsExamples.batchTokenOperations(
  connection,
  payer,
  mint,
  operations,
  decimals
);
```

### Métricas y Monitoreo

```typescript
// Obtener métricas
const metrics = manager.getMetrics();

// Monitorear operaciones
const monitoring = await TokenOperationsExamples.tokenOperationsMonitoring(
  connection,
  duration
);

// Validar operaciones
const validation = await TokenOperationsExamples.tokenOperationsValidation(
  connection,
  operations
);
```

### Utilidades

```typescript
import { TokenOperationsUtils } from './src/utils/token-operations-manager';

// Formatear operación
const formatted = TokenOperationsUtils.formatTransferOperation(operation);

// Calcular eficiencia
const efficiency = TokenOperationsUtils.calculateOperationEfficiency(operations);

// Validar operación
const validation = TokenOperationsUtils.validateTransferOperation(
  source,
  destination,
  amount,
  authority
);
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
