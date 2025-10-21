/**
 * 🔮 Oráculo Solana Cookbook Best Practices
 * 
 * Implementación de las mejores prácticas del Solana Cookbook
 * para optimizar el rendimiento y la seguridad del proyecto Oráculo
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  Commitment,
  AccountInfo,
  TransactionSignature,
  BlockInfo,
  EpochInfo,
  SupplyInfo,
  PerformanceSample,
  PrioritizationFee,
  VersionedTransaction,
  TransactionMessage,
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  clusterApiUrl
} from '@solana/web3.js';
import { 
  createMint, 
  createAccount, 
  getAccount, 
  getMint, 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAccount,
  transfer,
  transferChecked,
  mintTo,
  burn,
  freezeAccount,
  thawAccount,
  setAuthority,
  AuthorityType,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { 
  createSolanaRpc, 
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  createKeyPairSignerFromBytes,
  createKeyPairSignerFromPrivateKeyBytes,
  createKeyPairFromBytes,
  createSignerFromKeyPair,
  getBase58Encoder,
  getBase58Decoder,
  getUtf8Encoder,
  signBytes,
  verifySignature,
  airdropFactory,
  lamports,
  address,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  sendAndConfirmTransactionFactory,
  getSignatureFromTransaction,
  getTransferSolInstruction,
  getAddMemoInstruction,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
  getComputeUnitEstimateForTransactionMessageFactory,
  compileTransactionMessage,
  getCompiledTransactionMessageEncoder,
  getBase64Decoder,
  type TransactionMessageBytesBase64,
  pipe,
  prependTransactionMessageInstructions,
  createSolanaClient,
  type SolanaClient
} from '@solana/kit';
import { 
  getCreateAccountInstruction,
  SYSTEM_PROGRAM_ADDRESS 
} from '@solana-program/system';
import { 
  getSetComputeUnitLimitInstruction as getComputeBudgetSetComputeUnitLimit,
  getSetComputeUnitPriceInstruction as getComputeBudgetSetComputeUnitPrice
} from '@solana-program/compute-budget';
import { getAddMemoInstruction as getMemoAddMemo } from '@solana-program/memo';

// ==================== Best Practices Types ====================

export interface OptimizedConnectionConfig {
  endpoint: string;
  commitment: Commitment;
  confirmTransactionInitialTimeout: number;
  wsEndpoint?: string;
  disableRetryOnRateLimit?: boolean;
  maxRetries?: number;
}

export interface TransactionOptimizationConfig {
  computeUnitLimit?: number;
  computeUnitPrice?: number;
  priorityFee?: number;
  skipPreflight?: boolean;
  preflightCommitment?: Commitment;
  maxRetries?: number;
  replaceRecentBlockhash?: boolean;
}

export interface AccountOptimizationConfig {
  space: number;
  programId: PublicKey;
  rentExempt?: boolean;
  closeable?: boolean;
  transferable?: boolean;
}

export interface TokenOptimizationConfig {
  decimals: number;
  mintAuthority?: PublicKey;
  freezeAuthority?: PublicKey;
  supply?: number;
  transferable?: boolean;
  burnable?: boolean;
  pausable?: boolean;
}

export interface MarketOptimizationConfig {
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  tokenDecimals: number;
  creatorFee?: number;
  resolutionFee?: number;
  minStake?: number;
  maxStake?: number;
}

export interface PerformanceMetrics {
  transactionLatency: number;
  computeUnitsConsumed: number;
  feePaid: number;
  confirmationTime: number;
  successRate: number;
  errorRate: number;
}

export interface SecurityConfig {
  maxTransactionSize: number;
  maxComputeUnits: number;
  maxFee: number;
  allowedPrograms: PublicKey[];
  blockedPrograms: PublicKey[];
  requireSignatures: boolean;
  validateAccounts: boolean;
}

// ==================== Solana Cookbook Best Practices Class ====================

export class SolanaCookbookBestPractices {
  private connection: Connection;
  private rpc: any;
  private rpcSubscriptions: any;
  private client: SolanaClient;
  private commitment: Commitment;
  private performanceMetrics: Map<string, PerformanceMetrics> = new Map();
  private securityConfig: SecurityConfig;

  constructor(
    endpoint: string = 'https://api.devnet.solana.com',
    commitment: Commitment = 'confirmed',
    securityConfig?: Partial<SecurityConfig>
  ) {
    this.connection = new Connection(endpoint, commitment);
    this.rpc = createSolanaRpc(endpoint);
    this.rpcSubscriptions = createSolanaRpcSubscriptions(
      endpoint.replace('https://', 'wss://').replace('http://', 'ws://')
    );
    this.client = createSolanaClient({ urlOrMoniker: endpoint });
    this.commitment = commitment;
    
    // Configuración de seguridad por defecto
    this.securityConfig = {
      maxTransactionSize: 1232, // Tamaño máximo de transacción
      maxComputeUnits: 200000, // Límite máximo de compute units
      maxFee: 0.01 * LAMPORTS_PER_SOL, // Fee máximo (0.01 SOL)
      allowedPrograms: [
        SystemProgram.programId,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      ],
      blockedPrograms: [],
      requireSignatures: true,
      validateAccounts: true,
      ...securityConfig
    };
  }

  // ==================== Connection Optimization ====================

  /**
   * Crear conexión optimizada siguiendo las mejores prácticas
   */
  static createOptimizedConnection(config: OptimizedConnectionConfig): Connection {
    return new Connection(config.endpoint, {
      commitment: config.commitment,
      confirmTransactionInitialTimeout: config.confirmTransactionInitialTimeout,
      wsEndpoint: config.wsEndpoint,
      disableRetryOnRateLimit: config.disableRetryOnRateLimit,
      maxRetries: config.maxRetries
    });
  }

  /**
   * Configurar conexión con balanceador de carga
   */
  static createLoadBalancedConnection(
    endpoints: string[],
    commitment: Commitment = 'confirmed'
  ): Connection {
    // Seleccionar endpoint aleatorio para balancear carga
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    return new Connection(randomEndpoint, commitment);
  }

  /**
   * Configurar conexión con fallback
   */
  static createFallbackConnection(
    primaryEndpoint: string,
    fallbackEndpoints: string[],
    commitment: Commitment = 'confirmed'
  ): Connection {
    try {
      return new Connection(primaryEndpoint, commitment);
    } catch (error) {
      console.warn('Primary endpoint failed, trying fallback:', error);
      for (const fallback of fallbackEndpoints) {
        try {
          return new Connection(fallback, commitment);
        } catch (fallbackError) {
          console.warn('Fallback endpoint failed:', fallback, fallbackError);
        }
      }
      throw new Error('All endpoints failed');
    }
  }

  // ==================== Transaction Optimization ====================

  /**
   * Optimizar transacción siguiendo las mejores prácticas
   */
  async optimizeTransaction(
    instructions: any[],
    payer: any,
    config?: TransactionOptimizationConfig
  ): Promise<any> {
    // 1. Estimar compute units
    const getComputeUnitEstimate = getComputeUnitEstimateForTransactionMessageFactory({ rpc: this.rpc });
    const estimatedComputeUnits = await getComputeUnitEstimate(
      createTransactionMessage({ version: 0 })
    );

    // 2. Aplicar límite de compute units con margen de seguridad
    const computeUnitLimit = config?.computeUnitLimit || Math.min(
      Math.floor(estimatedComputeUnits * 1.1), // 10% de margen
      this.securityConfig.maxComputeUnits
    );

    // 3. Calcular fee de prioridad óptimo
    const priorityFee = config?.priorityFee || await this.calculateOptimalPriorityFee();

    // 4. Crear transacción optimizada
    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    
    let transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(payer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx)
    );

    // 5. Agregar instrucciones de compute budget
    const computeBudgetInstructions = [
      getSetComputeUnitLimitInstruction({ units: computeUnitLimit }),
      getSetComputeUnitPriceInstruction({ microLamports: BigInt(priorityFee) })
    ];

    transactionMessage = pipe(
      transactionMessage,
      (tx) => prependTransactionMessageInstructions(computeBudgetInstructions, tx),
      (tx) => appendTransactionMessageInstructions(instructions, tx)
    );

    // 6. Validar transacción
    await this.validateTransaction(transactionMessage);

    return transactionMessage;
  }

  /**
   * Calcular fee de prioridad óptimo
   */
  async calculateOptimalPriorityFee(): Promise<number> {
    try {
      const fees = await this.connection.getRecentPrioritizationFees();
      
      if (fees.length === 0) return 1000; // Fee mínimo
      
      // Calcular percentil 50 para balance entre costo y velocidad
      const sortedFees = fees.map(f => f.prioritizationFee).sort((a, b) => a - b);
      const medianIndex = Math.floor(sortedFees.length / 2);
      
      return Math.min(sortedFees[medianIndex] || 1000, this.securityConfig.maxFee);
    } catch (error) {
      console.warn('Error calculating optimal priority fee:', error);
      return 1000; // Fee por defecto
    }
  }

  /**
   * Validar transacción antes de enviar
   */
  async validateTransaction(transaction: any): Promise<boolean> {
    try {
      // 1. Verificar tamaño de transacción
      const serialized = compileTransactionMessage(transaction);
      if (serialized.length > this.securityConfig.maxTransactionSize) {
        throw new Error(`Transaction too large: ${serialized.length} bytes`);
      }

      // 2. Simular transacción
      const simulation = await this.connection.simulateTransaction(transaction, {
        commitment: this.commitment,
        replaceRecentBlockhash: true
      });

      if (simulation.value.err) {
        throw new Error(`Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      // 3. Verificar compute units
      if (simulation.value.unitsConsumed && simulation.value.unitsConsumed > this.securityConfig.maxComputeUnits) {
        throw new Error(`Transaction exceeds compute unit limit: ${simulation.value.unitsConsumed}`);
      }

      return true;
    } catch (error) {
      console.error('Transaction validation failed:', error);
      return false;
    }
  }

  // ==================== Account Optimization ====================

  /**
   * Crear cuenta optimizada siguiendo las mejores prácticas
   */
  async createOptimizedAccount(
    payer: any,
    newAccount: any,
    config: AccountOptimizationConfig
  ): Promise<string> {
    // 1. Calcular rent exemption
    const rentLamports = await this.rpc.getMinimumBalanceForRentExemption(config.space).send();
    
    // 2. Crear instrucción de cuenta
    const createAccountInstruction = getCreateAccountInstruction({
      payer,
      newAccount,
      lamports: rentLamports,
      programAddress: config.programId,
      space: BigInt(config.space)
    });

    // 3. Optimizar transacción
    const transactionMessage = await this.optimizeTransaction(
      [createAccountInstruction],
      payer
    );

    // 4. Enviar transacción
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    const result = await sendAndConfirmTransactionFactory({
      rpc: this.rpc,
      rpcSubscriptions: this.rpcSubscriptions
    })(signedTransaction, { commitment: this.commitment });

    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Crear PDA optimizada
   */
  async createOptimizedPDA(
    seeds: (Buffer | Uint8Array)[],
    programId: PublicKey,
    payer: any,
    space: number
  ): Promise<{ address: PublicKey; bump: number; signature: string }> {
    const [pda, bump] = PublicKey.findProgramAddressSync(seeds, programId);
    
    const signature = await this.createOptimizedAccount(
      payer,
      { address: pda },
      {
        space,
        programId,
        rentExempt: true,
        closeable: true,
        transferable: false
      }
    );

    return { address: pda, bump, signature };
  }

  // ==================== Token Optimization ====================

  /**
   * Crear token optimizado siguiendo las mejores prácticas
   */
  async createOptimizedToken(
    payer: any,
    mint: any,
    config: TokenOptimizationConfig
  ): Promise<string> {
    // 1. Crear mint instruction
    const createMintInstruction = {
      programId: TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: mint.address, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
      ],
      data: Buffer.from([]) // Datos de inicialización del mint
    };

    // 2. Optimizar transacción
    const transactionMessage = await this.optimizeTransaction(
      [createMintInstruction],
      payer,
      {
        computeUnitLimit: 10000, // Límite específico para creación de mint
        priorityFee: 1000 // Fee bajo para operaciones simples
      }
    );

    // 3. Enviar transacción
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    const result = await sendAndConfirmTransactionFactory({
      rpc: this.rpc,
      rpcSubscriptions: this.rpcSubscriptions
    })(signedTransaction, { commitment: this.commitment });

    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Transferir tokens optimizado
   */
  async transferTokensOptimized(
    sender: any,
    from: PublicKey,
    to: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number,
    options?: {
      memo?: string;
      priorityFee?: number;
    }
  ): Promise<string> {
    // 1. Crear instrucción de transferencia
    const transferInstruction = {
      programId: TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: from, isSigner: false, isWritable: true },
        { pubkey: to, isSigner: false, isWritable: true },
        { pubkey: sender.address, isSigner: true, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false }
      ],
      data: Buffer.from([]) // Datos de transferencia
    };

    const instructions = [transferInstruction];

    // 2. Agregar memo si se especifica
    if (options?.memo) {
      const memoInstruction = getAddMemoInstruction({ memo: options.memo });
      instructions.push(memoInstruction);
    }

    // 3. Optimizar transacción
    const transactionMessage = await this.optimizeTransaction(
      instructions,
      sender,
      {
        computeUnitLimit: 5000, // Límite específico para transferencias
        priorityFee: options?.priorityFee
      }
    );

    // 4. Enviar transacción
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    const result = await sendAndConfirmTransactionFactory({
      rpc: this.rpc,
      rpcSubscriptions: this.rpcSubscriptions
    })(signedTransaction, { commitment: this.commitment });

    return getSignatureFromTransaction(signedTransaction);
  }

  // ==================== Market Optimization ====================

  /**
   * Crear mercado optimizado siguiendo las mejores prácticas
   */
  async createOptimizedMarket(
    creator: any,
    config: MarketOptimizationConfig
  ): Promise<{ marketId: PublicKey; signature: string }> {
    const marketId = new PublicKey(Keypair.generate().publicKey);
    
    // 1. Crear token mint para el mercado
    const tokenMint = new PublicKey(Keypair.generate().publicKey);
    const mintSignature = await this.createOptimizedToken(
      creator,
      { address: tokenMint },
      {
        decimals: config.tokenDecimals,
        mintAuthority: creator.address,
        transferable: true,
        burnable: true
      }
    );

    // 2. Crear instrucción de inicialización del mercado
    const initializeMarketInstruction = {
      programId: new PublicKey('11111111111111111111111111111111'), // Program ID del mercado
      keys: [
        { pubkey: marketId, isSigner: false, isWritable: true },
        { pubkey: creator.address, isSigner: true, isWritable: false },
        { pubkey: tokenMint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data: Buffer.from([]) // Datos de inicialización del mercado
    };

    // 3. Optimizar transacción
    const transactionMessage = await this.optimizeTransaction(
      [initializeMarketInstruction],
      creator,
      {
        computeUnitLimit: 15000, // Límite específico para creación de mercados
        priorityFee: 2000, // Fee medio para operaciones complejas
        memo: `Creating market: ${config.title}`
      }
    );

    // 4. Enviar transacción
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    const result = await sendAndConfirmTransactionFactory({
      rpc: this.rpc,
      rpcSubscriptions: this.rpcSubscriptions
    })(signedTransaction, { commitment: this.commitment });

    return {
      marketId,
      signature: getSignatureFromTransaction(signedTransaction)
    };
  }

  // ==================== Performance Monitoring ====================

  /**
   * Registrar métricas de rendimiento
   */
  recordPerformanceMetrics(
    operation: string,
    startTime: number,
    endTime: number,
    computeUnitsConsumed?: number,
    feePaid?: number,
    success: boolean
  ): void {
    const latency = endTime - startTime;
    const metrics: PerformanceMetrics = {
      transactionLatency: latency,
      computeUnitsConsumed: computeUnitsConsumed || 0,
      feePaid: feePaid || 0,
      confirmationTime: latency,
      successRate: success ? 1 : 0,
      errorRate: success ? 0 : 1
    };

    this.performanceMetrics.set(operation, metrics);
  }

  /**
   * Obtener métricas de rendimiento
   */
  getPerformanceMetrics(operation?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (operation) {
      return this.performanceMetrics.get(operation) || {
        transactionLatency: 0,
        computeUnitsConsumed: 0,
        feePaid: 0,
        confirmationTime: 0,
        successRate: 0,
        errorRate: 0
      };
    }
    return this.performanceMetrics;
  }

  /**
   * Analizar rendimiento y sugerir optimizaciones
   */
  analyzePerformance(): {
    recommendations: string[];
    bottlenecks: string[];
    optimizations: string[];
  } {
    const recommendations: string[] = [];
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];

    // Analizar métricas
    for (const [operation, metrics] of this.performanceMetrics) {
      if (metrics.transactionLatency > 5000) {
        bottlenecks.push(`${operation}: High latency (${metrics.transactionLatency}ms)`);
        recommendations.push(`Consider optimizing ${operation} transaction structure`);
      }

      if (metrics.computeUnitsConsumed > 100000) {
        bottlenecks.push(`${operation}: High compute usage (${metrics.computeUnitsConsumed} units)`);
        recommendations.push(`Consider reducing compute units for ${operation}`);
      }

      if (metrics.feePaid > 0.001 * LAMPORTS_PER_SOL) {
        bottlenecks.push(`${operation}: High fees (${metrics.feePaid} lamports)`);
        recommendations.push(`Consider optimizing priority fees for ${operation}`);
      }

      if (metrics.successRate < 0.95) {
        bottlenecks.push(`${operation}: Low success rate (${metrics.successRate * 100}%)`);
        recommendations.push(`Investigate failures in ${operation}`);
      }
    }

    // Sugerir optimizaciones
    optimizations.push('Use batch transactions for multiple operations');
    optimizations.push('Implement retry logic with exponential backoff');
    optimizations.push('Cache frequently accessed account data');
    optimizations.push('Use address lookup tables for large transactions');
    optimizations.push('Implement connection pooling for high throughput');

    return { recommendations, bottlenecks, optimizations };
  }

  // ==================== Security Best Practices ====================

  /**
   * Validar seguridad de transacción
   */
  async validateTransactionSecurity(transaction: any): Promise<{
    isSecure: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // 1. Verificar programas permitidos
      const programs = this.extractProgramsFromTransaction(transaction);
      for (const program of programs) {
        if (this.securityConfig.blockedPrograms.includes(program)) {
          errors.push(`Blocked program detected: ${program.toString()}`);
        }
        if (this.securityConfig.allowedPrograms.length > 0 && 
            !this.securityConfig.allowedPrograms.includes(program)) {
          warnings.push(`Unknown program: ${program.toString()}`);
        }
      }

      // 2. Verificar tamaño de transacción
      const serialized = compileTransactionMessage(transaction);
      if (serialized.length > this.securityConfig.maxTransactionSize) {
        errors.push(`Transaction too large: ${serialized.length} bytes`);
      }

      // 3. Verificar compute units
      const simulation = await this.connection.simulateTransaction(transaction);
      if (simulation.value.unitsConsumed && 
          simulation.value.unitsConsumed > this.securityConfig.maxComputeUnits) {
        errors.push(`Transaction exceeds compute unit limit: ${simulation.value.unitsConsumed}`);
      }

      // 4. Verificar fees
      const fee = await this.connection.getFeeForMessage(serialized);
      if (fee.value && fee.value > this.securityConfig.maxFee) {
        warnings.push(`High transaction fee: ${fee.value} lamports`);
      }

      return {
        isSecure: errors.length === 0,
        warnings,
        errors
      };
    } catch (error) {
      return {
        isSecure: false,
        warnings: [],
        errors: [`Security validation failed: ${error}`]
      };
    }
  }

  /**
   * Extraer programas de una transacción
   */
  private extractProgramsFromTransaction(transaction: any): PublicKey[] {
    const programs: PublicKey[] = [];
    // Implementar extracción de programas de la transacción
    return programs;
  }

  /**
   * Configurar políticas de seguridad
   */
  updateSecurityConfig(config: Partial<SecurityConfig>): void {
    this.securityConfig = { ...this.securityConfig, ...config };
  }

  // ==================== Utility Methods ====================

  /**
   * Obtener configuración de red óptima
   */
  static getOptimalNetworkConfig(network: 'devnet' | 'mainnet' | 'testnet' | 'local'): OptimizedConnectionConfig {
    const configs = {
      devnet: {
        endpoint: 'https://api.devnet.solana.com',
        commitment: 'confirmed' as Commitment,
        confirmTransactionInitialTimeout: 60000,
        wsEndpoint: 'wss://api.devnet.solana.com',
        maxRetries: 3
      },
      mainnet: {
        endpoint: 'https://api.mainnet-beta.solana.com',
        commitment: 'confirmed' as Commitment,
        confirmTransactionInitialTimeout: 60000,
        wsEndpoint: 'wss://api.mainnet-beta.solana.com',
        maxRetries: 5
      },
      testnet: {
        endpoint: 'https://api.testnet.solana.com',
        commitment: 'confirmed' as Commitment,
        confirmTransactionInitialTimeout: 60000,
        wsEndpoint: 'wss://api.testnet.solana.com',
        maxRetries: 3
      },
      local: {
        endpoint: 'http://localhost:8899',
        commitment: 'confirmed' as Commitment,
        confirmTransactionInitialTimeout: 30000,
        wsEndpoint: 'ws://localhost:8900',
        maxRetries: 1
      }
    };

    return configs[network];
  }

  /**
   * Obtener mejores prácticas para el entorno actual
   */
  getBestPracticesForEnvironment(): {
    recommendations: string[];
    config: OptimizedConnectionConfig;
    security: SecurityConfig;
  } {
    const network = this.connection.rpcEndpoint.includes('mainnet') ? 'mainnet' :
                   this.connection.rpcEndpoint.includes('devnet') ? 'devnet' :
                   this.connection.rpcEndpoint.includes('testnet') ? 'testnet' : 'local';

    const config = SolanaCookbookBestPractices.getOptimalNetworkConfig(network);
    
    const recommendations = [
      'Use appropriate commitment levels for your use case',
      'Implement retry logic with exponential backoff',
      'Monitor network performance and adjust accordingly',
      'Use batch operations when possible',
      'Implement proper error handling and logging',
      'Cache frequently accessed data',
      'Use address lookup tables for large transactions',
      'Monitor and optimize compute unit usage',
      'Implement proper security validations',
      'Use appropriate priority fees for your needs'
    ];

    return {
      recommendations,
      config,
      security: this.securityConfig
    };
  }
}

// ==================== Factory Functions ====================

export function createSolanaCookbookBestPractices(
  endpoint: string = 'https://api.devnet.solana.com',
  commitment: Commitment = 'confirmed',
  securityConfig?: Partial<SecurityConfig>
): SolanaCookbookBestPractices {
  return new SolanaCookbookBestPractices(endpoint, commitment, securityConfig);
}

export function createDevnetBestPractices(): SolanaCookbookBestPractices {
  return createSolanaCookbookBestPractices('https://api.devnet.solana.com', 'confirmed');
}

export function createMainnetBestPractices(): SolanaCookbookBestPractices {
  return createSolanaCookbookBestPractices('https://api.mainnet-beta.solana.com', 'confirmed');
}

export function createTestnetBestPractices(): SolanaCookbookBestPractices {
  return createSolanaCookbookBestPractices('https://api.testnet.solana.com', 'confirmed');
}

export function createLocalBestPractices(): SolanaCookbookBestPractices {
  return createSolanaCookbookBestPractices('http://localhost:8899', 'confirmed');
}

// ==================== Export Default ====================

export default SolanaCookbookBestPractices;
