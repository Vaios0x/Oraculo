/**
 * 🔮 Oráculo Advanced Solana Operations
 * 
 * Implementación avanzada de operaciones Solana basadas en las mejores prácticas
 * del Solana Cookbook para el proyecto Oráculo
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
  SYSVAR_CLOCK_PUBKEY
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
  createInitializeMintInstruction,
  createInitializeAccountInstruction,
  createTransferInstruction,
  createBurnInstruction,
  createFreezeAccountInstruction,
  createThawAccountInstruction,
  createSetAuthorityInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccountLenForMint,
  MINT_SIZE,
  ACCOUNT_SIZE
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

// ==================== Advanced Types ====================

export interface AdvancedTransactionConfig {
  skipPreflight?: boolean;
  preflightCommitment?: Commitment;
  maxRetries?: number;
  minContextSlot?: number;
  replaceRecentBlockhash?: boolean;
}

export interface AdvancedAccountInfo {
  pubkey: PublicKey;
  account: AccountInfo;
  executable: boolean;
  lamports: number;
  owner: PublicKey;
  rentEpoch: number;
  space: number;
  data: Buffer | [string, string] | object;
}

export interface AdvancedTokenAccount {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: string;
  decimals: number;
  uiAmount: number | null;
  uiAmountString: string;
  state: 'initialized' | 'uninitialized' | 'frozen';
}

export interface AdvancedMarketData {
  marketId: PublicKey;
  creator: PublicKey;
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  totalStaked: number;
  outcomeStakes: number[];
  isResolved: boolean;
  winningOutcome?: number;
  tokenMint: PublicKey;
  marketTokenAccount: PublicKey;
  createdAt: number;
  lastUpdated: number;
}

export interface AdvancedTransactionResult {
  signature: string;
  slot: number;
  blockTime: number | null;
  confirmationStatus: string | null;
  err: any;
  computeUnitsConsumed?: number;
  fee: number;
  logs: string[];
}

export interface AdvancedNetworkStats {
  slot: number;
  blockHeight: number;
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  transactionCount: number | null;
  supply: SupplyInfo;
  health: string;
  performance: PerformanceSample[];
  prioritizationFees: PrioritizationFee[];
}

// ==================== Advanced Solana Operations Class ====================

export class AdvancedSolanaOperations {
  private connection: Connection;
  private rpc: any;
  private rpcSubscriptions: any;
  private client: SolanaClient;
  private commitment: Commitment;

  constructor(
    endpoint: string = 'https://api.devnet.solana.com',
    commitment: Commitment = 'confirmed'
  ) {
    this.connection = new Connection(endpoint, commitment);
    this.rpc = createSolanaRpc(endpoint);
    this.rpcSubscriptions = createSolanaRpcSubscriptions(
      endpoint.replace('https://', 'wss://').replace('http://', 'ws://')
    );
    this.client = createSolanaClient({ urlOrMoniker: endpoint });
    this.commitment = commitment;
  }

  // ==================== Advanced Transaction Operations ====================

  /**
   * Crear transacción optimizada con compute budget
   */
  async createOptimizedTransaction(
    instructions: any[],
    payer: any,
    options?: {
      computeUnitLimit?: number;
      computeUnitPrice?: number;
      priorityFee?: number;
      memo?: string;
    }
  ): Promise<any> {
    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    
    let transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(payer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx)
    );

    // Agregar compute budget instructions si se especifican
    if (options?.computeUnitLimit || options?.computeUnitPrice) {
      const computeInstructions = [];
      
      if (options.computeUnitLimit) {
        computeInstructions.push(
          getSetComputeUnitLimitInstruction({ units: options.computeUnitLimit })
        );
      }
      
      if (options.computeUnitPrice) {
        computeInstructions.push(
          getSetComputeUnitPriceInstruction({ microLamports: BigInt(options.computeUnitPrice) })
        );
      }
      
      transactionMessage = pipe(
        transactionMessage,
        (tx) => prependTransactionMessageInstructions(computeInstructions, tx)
      );
    }

    // Agregar memo si se especifica
    if (options?.memo) {
      const memoInstruction = getAddMemoInstruction({ memo: options.memo });
      transactionMessage = pipe(
        transactionMessage,
        (tx) => appendTransactionMessageInstructions([memoInstruction], tx)
      );
    }

    // Agregar instrucciones principales
    transactionMessage = pipe(
      transactionMessage,
      (tx) => appendTransactionMessageInstructions(instructions, tx)
    );

    return transactionMessage;
  }

  /**
   * Enviar transacción con configuración avanzada
   */
  async sendAdvancedTransaction(
    transactionMessage: any,
    signers: any[],
    config?: AdvancedTransactionConfig
  ): Promise<AdvancedTransactionResult> {
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
      rpc: this.rpc,
      rpcSubscriptions: this.rpcSubscriptions
    });

    const result = await sendAndConfirmTransaction(
      signedTransaction,
      {
        commitment: this.commitment,
        skipPreflight: config?.skipPreflight || false,
        preflightCommitment: config?.preflightCommitment || this.commitment,
        maxRetries: config?.maxRetries || 3,
        minContextSlot: config?.minContextSlot
      }
    );

    const signature = getSignatureFromTransaction(signedTransaction);
    
    // Obtener información detallada de la transacción
    const transactionInfo = await this.connection.getTransaction(signature, {
      commitment: this.commitment,
      maxSupportedTransactionVersion: 0
    });

    return {
      signature,
      slot: transactionInfo?.slot || 0,
      blockTime: transactionInfo?.blockTime || null,
      confirmationStatus: 'confirmed',
      err: transactionInfo?.meta?.err || null,
      computeUnitsConsumed: transactionInfo?.meta?.computeUnitsConsumed,
      fee: transactionInfo?.meta?.fee || 0,
      logs: transactionInfo?.meta?.logMessages || []
    };
  }

  /**
   * Simular transacción antes de enviar
   */
  async simulateTransaction(
    transactionMessage: any,
    signers: any[] = []
  ): Promise<{
    success: boolean;
    computeUnitsConsumed?: number;
    logs: string[];
    err?: any;
  }> {
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    
    const simulation = await this.connection.simulateTransaction(signedTransaction, {
      commitment: this.commitment,
      replaceRecentBlockhash: true
    });

    return {
      success: !simulation.value.err,
      computeUnitsConsumed: simulation.value.unitsConsumed,
      logs: simulation.value.logs || [],
      err: simulation.value.err
    };
  }

  /**
   * Crear transacción en lote para múltiples operaciones
   */
  async createBatchTransaction(
    operations: Array<{
      instructions: any[];
      signers: any[];
    }>,
    payer: any,
    options?: {
      maxInstructionsPerTransaction?: number;
      computeUnitLimit?: number;
      computeUnitPrice?: number;
    }
  ): Promise<AdvancedTransactionResult[]> {
    const maxInstructions = options?.maxInstructionsPerTransaction || 10;
    const results: AdvancedTransactionResult[] = [];
    
    // Dividir operaciones en lotes
    const batches: any[][] = [];
    let currentBatch: any[] = [];
    
    for (const operation of operations) {
      if (currentBatch.length + operation.instructions.length > maxInstructions) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
        }
      }
      currentBatch.push(operation);
    }
    
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    // Procesar cada lote
    for (const batch of batches) {
      const allInstructions = batch.flatMap(op => op.instructions);
      const allSigners = batch.flatMap(op => op.signers);
      
      const transactionMessage = await this.createOptimizedTransaction(
        allInstructions,
        payer,
        {
          computeUnitLimit: options?.computeUnitLimit,
          computeUnitPrice: options?.computeUnitPrice
        }
      );

      const result = await this.sendAdvancedTransaction(transactionMessage, allSigners);
      results.push(result);
    }

    return results;
  }

  // ==================== Advanced Account Operations ====================

  /**
   * Crear cuenta con PDA (Program Derived Address)
   */
  async createPDAAccount(
    seeds: (Buffer | Uint8Array)[],
    programId: PublicKey,
    payer: any,
    space: number,
    owner: PublicKey = programId
  ): Promise<{ address: PublicKey; bump: number }> {
    const [pda, bump] = PublicKey.findProgramAddressSync(seeds, programId);
    
    const createAccountInstruction = getCreateAccountInstruction({
      payer,
      newAccount: { address: pda },
      lamports: await this.rpc.getMinimumBalanceForRentExemption(space).send(),
      programAddress: owner,
      space: BigInt(space)
    });

    const transactionMessage = await this.createOptimizedTransaction(
      [createAccountInstruction],
      payer
    );

    await this.sendAdvancedTransaction(transactionMessage, [payer]);
    
    return { address: pda, bump };
  }

  /**
   * Obtener información detallada de cuenta
   */
  async getAdvancedAccountInfo(pubkey: PublicKey): Promise<AdvancedAccountInfo | null> {
    const accountInfo = await this.connection.getAccountInfo(pubkey, this.commitment);
    
    if (!accountInfo) return null;
    
    return {
      pubkey,
      account: accountInfo,
      executable: accountInfo.executable,
      lamports: accountInfo.lamports,
      owner: accountInfo.owner,
      rentEpoch: accountInfo.rentEpoch,
      space: accountInfo.space,
      data: accountInfo.data
    };
  }

  /**
   * Obtener múltiples cuentas con información detallada
   */
  async getMultipleAdvancedAccountInfo(pubkeys: PublicKey[]): Promise<AdvancedAccountInfo[]> {
    const accountInfos = await this.connection.getMultipleAccountsInfo(pubkeys, this.commitment);
    
    return accountInfos.value.map((accountInfo, index) => ({
      pubkey: pubkeys[index],
      account: accountInfo!,
      executable: accountInfo!.executable,
      lamports: accountInfo!.lamports,
      owner: accountInfo!.owner,
      rentEpoch: accountInfo!.rentEpoch,
      space: accountInfo!.space,
      data: accountInfo!.data
    }));
  }

  // ==================== Advanced Token Operations ====================

  /**
   * Crear mint de token con extensiones avanzadas
   */
  async createAdvancedTokenMint(
    payer: any,
    mint: any,
    decimals: number,
    mintAuthority: PublicKey,
    freezeAuthority?: PublicKey
  ): Promise<string> {
    const createMintInstruction = createInitializeMintInstruction(
      mint.address,
      decimals,
      mintAuthority,
      freezeAuthority || null
    );

    const transactionMessage = await this.createOptimizedTransaction(
      [createMintInstruction],
      payer
    );

    const result = await this.sendAdvancedTransaction(transactionMessage, [payer, mint]);
    return result.signature;
  }

  /**
   * Crear cuenta de token asociada
   */
  async createAssociatedTokenAccount(
    payer: any,
    owner: PublicKey,
    mint: PublicKey
  ): Promise<{ address: PublicKey; signature: string }> {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);
    
    const createATAInstruction = createAssociatedTokenAccountInstruction(
      payer.address,
      associatedTokenAddress,
      owner,
      mint
    );

    const transactionMessage = await this.createOptimizedTransaction(
      [createATAInstruction],
      payer
    );

    const result = await this.sendAdvancedTransaction(transactionMessage, [payer]);
    
    return {
      address: associatedTokenAddress,
      signature: result.signature
    };
  }

  /**
   * Transferir tokens con verificación
   */
  async transferTokensChecked(
    sender: any,
    from: PublicKey,
    to: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number
  ): Promise<string> {
    const transferInstruction = createTransferCheckedInstruction(
      from,
      mint,
      to,
      sender.address,
      amount * Math.pow(10, decimals),
      decimals
    );

    const transactionMessage = await this.createOptimizedTransaction(
      [transferInstruction],
      sender
    );

    const result = await this.sendAdvancedTransaction(transactionMessage, [sender]);
    return result.signature;
  }

  /**
   * Obtener información avanzada de cuenta de token
   */
  async getAdvancedTokenAccount(tokenAccount: PublicKey): Promise<AdvancedTokenAccount | null> {
    try {
      const account = await getAccount(this.connection, tokenAccount);
      
      return {
        address: tokenAccount,
        mint: account.mint,
        owner: account.owner,
        amount: account.amount.toString(),
        decimals: account.mint.toString(), // Necesitarías obtener los decimals del mint
        uiAmount: account.amount.toNumber(),
        uiAmountString: account.amount.toString(),
        state: account.state
      };
    } catch (error) {
      console.error('Error getting token account:', error);
      return null;
    }
  }

  /**
   * Obtener todas las cuentas de token de un propietario
   */
  async getAllTokenAccountsByOwner(owner: PublicKey): Promise<AdvancedTokenAccount[]> {
    const response = await this.connection.getTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID
    });

    const tokenAccounts: AdvancedTokenAccount[] = [];
    
    for (const { pubkey, account } of response.value) {
      try {
        const tokenAccount = await this.getAdvancedTokenAccount(pubkey);
        if (tokenAccount) {
          tokenAccounts.push(tokenAccount);
        }
      } catch (error) {
        console.error(`Error processing token account ${pubkey.toString()}:`, error);
      }
    }

    return tokenAccounts;
  }

  // ==================== Advanced Market Operations ====================

  /**
   * Crear mercado de predicción avanzado
   */
  async createAdvancedMarket(
    creator: any,
    marketData: Omit<AdvancedMarketData, 'marketId' | 'createdAt' | 'lastUpdated'>
  ): Promise<{ marketId: PublicKey; signature: string }> {
    const marketId = new PublicKey(Keypair.generate().publicKey);
    
    // Crear token mint para el mercado
    const tokenMint = new PublicKey(Keypair.generate().publicKey);
    const mintKeypair = Keypair.generate();
    
    // Crear mint
    const createMintSignature = await this.createAdvancedTokenMint(
      creator,
      { address: tokenMint },
      6, // 6 decimals
      creator.address
    );

    // Crear cuenta de token del mercado
    const { address: marketTokenAccount } = await this.createAssociatedTokenAccount(
      creator,
      marketId,
      tokenMint
    );

    // Crear instrucción para inicializar el mercado
    const initializeMarketInstruction = {
      programId: new PublicKey('11111111111111111111111111111111'), // Program ID del mercado
      accounts: [
        { pubkey: marketId, isSigner: false, isWritable: true },
        { pubkey: creator.address, isSigner: true, isWritable: false },
        { pubkey: tokenMint, isSigner: false, isWritable: false },
        { pubkey: marketTokenAccount, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data: Buffer.from([]) // Datos de inicialización del mercado
    };

    const transactionMessage = await this.createOptimizedTransaction(
      [initializeMarketInstruction],
      creator,
      { memo: `Creating market: ${marketData.title}` }
    );

    const result = await this.sendAdvancedTransaction(transactionMessage, [creator]);
    
    return {
      marketId,
      signature: result.signature
    };
  }

  /**
   * Hacer apuesta avanzada en mercado
   */
  async placeAdvancedBet(
    bettor: any,
    marketId: PublicKey,
    outcomeIndex: number,
    amount: number,
    options?: {
      priorityFee?: number;
      memo?: string;
    }
  ): Promise<string> {
    // Obtener información del mercado
    const marketInfo = await this.getAdvancedAccountInfo(marketId);
    if (!marketInfo) {
      throw new Error('Market not found');
    }

    // Crear instrucción de apuesta
    const betInstruction = {
      programId: new PublicKey('11111111111111111111111111111111'),
      accounts: [
        { pubkey: marketId, isSigner: false, isWritable: true },
        { pubkey: bettor.address, isSigner: true, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data: Buffer.from([]) // Datos de la apuesta
    };

    const transactionMessage = await this.createOptimizedTransaction(
      [betInstruction],
      bettor,
      {
        computeUnitPrice: options?.priorityFee,
        memo: options?.memo || `Betting ${amount} on outcome ${outcomeIndex}`
      }
    );

    const result = await this.sendAdvancedTransaction(transactionMessage, [bettor]);
    return result.signature;
  }

  // ==================== Advanced Monitoring ====================

  /**
   * Monitorear transacciones con filtros avanzados
   */
  async monitorTransactionsAdvanced(
    filters: {
      addresses?: PublicKey[];
      signatures?: string[];
      programs?: PublicKey[];
    },
    callback: (transaction: any) => void
  ): Promise<number> {
    const subscriptionId = await this.connection.onLogs(
      'all',
      (logs, context) => {
        // Filtrar por direcciones si se especifican
        if (filters.addresses && filters.addresses.length > 0) {
          const hasMatchingAddress = filters.addresses.some(addr => 
            logs.logs.some(log => log.includes(addr.toString()))
          );
          if (!hasMatchingAddress) return;
        }

        // Filtrar por programas si se especifican
        if (filters.programs && filters.programs.length > 0) {
          const hasMatchingProgram = filters.programs.some(program => 
            logs.logs.some(log => log.includes(program.toString()))
          );
          if (!hasMatchingProgram) return;
        }

        callback({
          signature: logs.signature,
          slot: context.slot,
          logs: logs.logs,
          err: logs.err
        });
      },
      this.commitment
    );

    return subscriptionId;
  }

  /**
   * Obtener estadísticas avanzadas de la red
   */
  async getAdvancedNetworkStats(): Promise<AdvancedNetworkStats> {
    const [
      slot,
      blockHeight,
      epochInfo,
      supply,
      health,
      performance,
      prioritizationFees
    ] = await Promise.all([
      this.connection.getSlot(this.commitment),
      this.connection.getBlockHeight(this.commitment),
      this.connection.getEpochInfo(this.commitment),
      this.connection.getSupply(this.commitment),
      this.connection.getHealth(),
      this.connection.getRecentPerformanceSamples(5),
      this.connection.getRecentPrioritizationFees()
    ]);

    return {
      slot,
      blockHeight,
      epoch: epochInfo.epoch,
      slotIndex: epochInfo.slotIndex,
      slotsInEpoch: epochInfo.slotsInEpoch,
      transactionCount: epochInfo.transactionCount,
      supply: supply.value,
      health,
      performance,
      prioritizationFees
    };
  }

  /**
   * Monitorear salud de la red en tiempo real
   */
  async monitorNetworkHealth(
    callback: (health: string, stats: AdvancedNetworkStats) => void,
    interval: number = 30000
  ): Promise<number> {
    const intervalId = setInterval(async () => {
      try {
        const health = await this.connection.getHealth();
        const stats = await this.getAdvancedNetworkStats();
        callback(health, stats);
      } catch (error) {
        console.error('Error monitoring network health:', error);
        callback('unhealthy', {} as AdvancedNetworkStats);
      }
    }, interval);

    return intervalId;
  }

  // ==================== Utility Methods ====================

  /**
   * Calcular fees de prioridad óptimos
   */
  async calculateOptimalPriorityFees(accounts: PublicKey[] = []): Promise<number> {
    const fees = await this.connection.getRecentPrioritizationFees(accounts);
    
    if (fees.length === 0) return 1000; // Fee por defecto
    
    // Calcular percentil 50 de los fees
    const sortedFees = fees.map(f => f.prioritizationFee).sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedFees.length / 2);
    
    return sortedFees[medianIndex] || 1000;
  }

  /**
   * Verificar si una transacción es válida
   */
  async validateTransaction(transaction: any): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    try {
      // Simular la transacción
      const simulation = await this.simulateTransaction(transaction);
      
      if (simulation.err) {
        errors.push(`Transaction simulation failed: ${JSON.stringify(simulation.err)}`);
      }
      
      if (simulation.computeUnitsConsumed && simulation.computeUnitsConsumed > 200000) {
        errors.push('Transaction exceeds compute unit limit');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Transaction validation failed: ${error}`);
      return {
        isValid: false,
        errors
      };
    }
  }

  /**
   * Obtener información de rendimiento de la red
   */
  async getNetworkPerformance(): Promise<{
    tps: number;
    averageSlotTime: number;
    confirmationTime: number;
  }> {
    const performance = await this.connection.getRecentPerformanceSamples(10);
    
    if (performance.length === 0) {
      return { tps: 0, averageSlotTime: 0, confirmationTime: 0 };
    }
    
    const totalTransactions = performance.reduce((sum, sample) => sum + sample.numTransactions, 0);
    const totalTime = performance.reduce((sum, sample) => sum + sample.samplePeriodSecs, 0);
    const tps = totalTransactions / totalTime;
    
    const averageSlotTime = performance.reduce((sum, sample) => sum + sample.samplePeriodSecs, 0) / performance.length;
    
    return {
      tps,
      averageSlotTime,
      confirmationTime: averageSlotTime * 32 // Aproximadamente 32 slots para confirmación
    };
  }
}

// ==================== Factory Functions ====================

export function createAdvancedSolanaOperations(
  endpoint: string = 'https://api.devnet.solana.com',
  commitment: Commitment = 'confirmed'
): AdvancedSolanaOperations {
  return new AdvancedSolanaOperations(endpoint, commitment);
}

export function createAdvancedDevnetOperations(): AdvancedSolanaOperations {
  return createAdvancedSolanaOperations('https://api.devnet.solana.com', 'confirmed');
}

export function createAdvancedMainnetOperations(): AdvancedSolanaOperations {
  return createAdvancedSolanaOperations('https://api.mainnet-beta.solana.com', 'confirmed');
}

export function createAdvancedTestnetOperations(): AdvancedSolanaOperations {
  return createAdvancedSolanaOperations('https://api.testnet.solana.com', 'confirmed');
}

export function createAdvancedLocalOperations(): AdvancedSolanaOperations {
  return createAdvancedSolanaOperations('http://localhost:8899', 'confirmed');
}

// ==================== Export Default ====================

export default AdvancedSolanaOperations;
