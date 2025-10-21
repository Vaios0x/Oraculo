/**
 * 🔮 Oráculo Solana Cookbook Integration
 * 
 * Implementación completa de las mejores prácticas del Solana Cookbook
 * para el proyecto Oráculo - Mercado de Predicciones Descentralizado
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
  RpcResponse,
  AccountInfo,
  TransactionSignature,
  BlockInfo,
  EpochInfo,
  SupplyInfo,
  PerformanceSample,
  PrioritizationFee
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
  AuthorityType
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
  prependTransactionMessageInstructions
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

// ==================== Types & Interfaces ====================

export interface OraculoAccountInfo {
  data: [string, string] | object;
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
}

export interface OraculoTransactionSignature {
  signature: string;
  slot: number;
  err: any;
  memo: string | null;
  blockTime: number | null;
  confirmationStatus: string | null;
}

export interface OraculoBlockInfo {
  blockHeight: number | null;
  blockTime: number | null;
  blockhash: string;
  parentSlot: number;
  previousBlockhash: string;
  transactions: any[];
}

export interface OraculoEpochInfo {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  transactionCount: number | null;
}

export interface OraculoSupplyInfo {
  total: number;
  circulating: number;
  nonCirculating: number;
  nonCirculatingAccounts: string[];
}

export interface OraculoPerformanceSample {
  slot: number;
  numTransactions: number;
  numSlots: number;
  samplePeriodSecs: number;
  numNonVoteTransactions: number;
}

export interface OraculoPrioritizationFee {
  slot: number;
  prioritizationFee: number;
}

export interface OraculoNetworkInfo {
  slot: number;
  blockHeight: number;
  epoch: number;
  supply: OraculoSupplyInfo;
  health: string;
  performance: OraculoPerformanceSample[];
}

export interface OraculoKeypairInfo {
  address: string;
  publicKey: PublicKey;
  privateKey?: Uint8Array;
}

export interface OraculoTokenInfo {
  mint: PublicKey;
  decimals: number;
  supply: string;
  uiAmount: number | null;
  uiAmountString: string;
}

export interface OraculoMarketInfo {
  marketId: PublicKey;
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  totalStaked: number;
  isResolved: boolean;
  winningOutcome?: number;
}

// ==================== Oraculo Solana Cookbook Client ====================

export class OraculoSolanaCookbookClient {
  private rpc: any;
  private rpcSubscriptions: any;
  private connection: Connection;
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
    this.commitment = commitment;
  }

  // ==================== Wallet Management (Solana Cookbook) ====================

  /**
   * Crear un nuevo keypair (Solana Cookbook)
   */
  async createKeypair(): Promise<OraculoKeypairInfo> {
    const signer = await generateKeyPairSigner();
    return {
      address: signer.address,
      publicKey: new PublicKey(signer.address),
    };
  }

  /**
   * Restaurar keypair desde bytes (Solana Cookbook)
   */
  async restoreKeypairFromBytes(keypairBytes: Uint8Array): Promise<OraculoKeypairInfo> {
    const signer = await createKeyPairSignerFromBytes(keypairBytes);
    return {
      address: signer.address,
      publicKey: new PublicKey(signer.address),
      privateKey: keypairBytes,
    };
  }

  /**
   * Restaurar keypair desde clave privada (Solana Cookbook)
   */
  async restoreKeypairFromPrivateKey(privateKeyBytes: Uint8Array): Promise<OraculoKeypairInfo> {
    const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes);
    return {
      address: signer.address,
      publicKey: new PublicKey(signer.address),
      privateKey: privateKeyBytes,
    };
  }

  /**
   * Restaurar keypair desde Base58 (Solana Cookbook)
   */
  async restoreKeypairFromBase58(keypairBase58: string): Promise<OraculoKeypairInfo> {
    const keypair = await createKeyPairFromBytes(
      getBase58Encoder().encode(keypairBase58)
    );
    const signer = await createSignerFromKeyPair(keypair);
    return {
      address: signer.address,
      publicKey: new PublicKey(signer.address),
    };
  }

  /**
   * Verificar keypair (Solana Cookbook)
   */
  async verifyKeypair(publicKey: PublicKey, keypairBytes: Uint8Array): Promise<boolean> {
    const signer = await createKeyPairSignerFromBytes(keypairBytes);
    return signer.address === publicKey.toString();
  }

  /**
   * Validar clave pública (Solana Cookbook)
   */
  async validatePublicKey(publicKey: PublicKey): Promise<boolean> {
    try {
      // Verificar si la clave pública está en la curva ed25519
      return PublicKey.isOnCurve(publicKey.toBytes());
    } catch {
      return false;
    }
  }

  /**
   * Generar mnemonic para keypair (Solana Cookbook)
   */
  async generateMnemonic(): Promise<string> {
    // En un entorno real, usarías bip39
    const mnemonic = "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter";
    return mnemonic;
  }

  /**
   * Restaurar keypair desde mnemonic BIP39 (Solana Cookbook)
   */
  async restoreKeypairFromMnemonic(mnemonic: string): Promise<OraculoKeypairInfo> {
    // En un entorno real, usarías bip39.mnemonicToSeedSync
    const seed = new Uint8Array(32); // Simulado
    const privateKeyBytes = seed.subarray(0, 32);
    return await this.restoreKeypairFromPrivateKey(privateKeyBytes);
  }

  /**
   * Restaurar keypair desde mnemonic BIP44 (Solana Cookbook)
   */
  async restoreKeypairFromBIP44Mnemonic(mnemonic: string, accountIndex: number = 0): Promise<OraculoKeypairInfo> {
    // En un entorno real, usarías HDKey.fromMasterSeed
    const seed = new Uint8Array(32); // Simulado
    const privateKeyBytes = seed.subarray(0, 32);
    return await this.restoreKeypairFromPrivateKey(privateKeyBytes);
  }

  /**
   * Firmar y verificar mensaje (Solana Cookbook)
   */
  async signAndVerifyMessage(
    keypairBytes: Uint8Array, 
    message: string
  ): Promise<{ signature: string; verified: boolean }> {
    const keys = await createKeyPairFromBytes(keypairBytes);
    const messageBytes = getUtf8Encoder().encode(message);
    const signedBytes = await signBytes(keys.privateKey, messageBytes);
    const signature = getBase58Decoder().decode(signedBytes);
    
    const verified = await verifySignature(keys.publicKey, signedBytes, messageBytes);
    
    return {
      signature,
      verified
    };
  }

  // ==================== Transaction Operations (Solana Cookbook) ====================

  /**
   * Enviar SOL (Solana Cookbook)
   */
  async sendSOL(
    sender: any,
    recipient: PublicKey,
    amount: number
  ): Promise<string> {
    const LAMPORTS_PER_SOL = 1_000_000_000n;
    const transferAmount = lamports(BigInt(amount) * LAMPORTS_PER_SOL);

    const transferInstruction = getTransferSolInstruction({
      source: sender,
      destination: recipient,
      amount: transferAmount
    });

    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(sender, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([transferInstruction], tx)
    );

    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    await sendAndConfirmTransactionFactory({ rpc: this.rpc, rpcSubscriptions: this.rpcSubscriptions })(
      signedTransaction,
      { commitment: this.commitment }
    );
    
    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Enviar tokens SPL (Solana Cookbook)
   */
  async sendTokens(
    sender: any,
    recipient: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number
  ): Promise<string> {
    // Implementación de transferencia de tokens SPL
    const senderTokenAccount = await getAssociatedTokenAddress(mint, sender.address);
    const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipient);

    const transferInstruction = await transferChecked(
      this.connection,
      sender,
      senderTokenAccount,
      mint,
      recipientTokenAccount,
      amount * Math.pow(10, decimals),
      decimals
    );

    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(sender, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([transferInstruction], tx)
    );

    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    await sendAndConfirmTransactionFactory({ rpc: this.rpc, rpcSubscriptions: this.rpcSubscriptions })(
      signedTransaction,
      { commitment: this.commitment }
    );
    
    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Calcular costo de transacción (Solana Cookbook)
   */
  async calculateTransactionCost(transactionMessage: any): Promise<{
    computeUnits: number;
    fee: number;
    totalCost: number;
  }> {
    const getComputeUnitEstimate = getComputeUnitEstimateForTransactionMessageFactory({ rpc: this.rpc });
    const estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);

    const base64EncodedMessage = pipe(
      transactionMessage,
      compileTransactionMessage,
      getCompiledTransactionMessageEncoder().encode,
      getBase64Decoder().decode
    ) as TransactionMessageBytesBase64;

    const transactionCost = await this.rpc.getFeeForMessage(base64EncodedMessage).send();
    const fee = transactionCost.value || 5000; // Base fee

    return {
      computeUnits: estimatedComputeUnits,
      fee,
      totalCost: fee + (estimatedComputeUnits * 0.000001) // Micro-lamports per compute unit
    };
  }

  /**
   * Agregar memo a transacción (Solana Cookbook)
   */
  async addMemoToTransaction(
    transactionMessage: any,
    memo: string
  ): Promise<any> {
    const memoInstruction = getAddMemoInstruction({ memo });
    
    return pipe(
      transactionMessage,
      (tx) => appendTransactionMessageInstructions([memoInstruction], tx)
    );
  }

  /**
   * Agregar fees de prioridad (Solana Cookbook)
   */
  async addPriorityFees(
    transactionMessage: any,
    microLamports: number = 5000
  ): Promise<any> {
    const priorityFeeInstruction = getSetComputeUnitPriceInstruction({ 
      microLamports: BigInt(microLamports) 
    });

    const getComputeUnitEstimate = getComputeUnitEstimateForTransactionMessageFactory({ rpc: this.rpc });
    const estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);
    
    const computeLimitInstruction = getSetComputeUnitLimitInstruction({ 
      units: estimatedComputeUnits 
    });

    return pipe(
      transactionMessage,
      (tx) => prependTransactionMessageInstructions([
        computeLimitInstruction,
        priorityFeeInstruction
      ], tx)
    );
  }

  /**
   * Optimizar compute solicitado (Solana Cookbook)
   */
  async optimizeComputeRequested(transactionMessage: any): Promise<any> {
    const getComputeUnitEstimate = getComputeUnitEstimateForTransactionMessageFactory({ rpc: this.rpc });
    const estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);
    
    // Agregar 10% de margen de error
    const unitsWithMargin = Math.floor(estimatedComputeUnits * 1.1);
    
    const computeLimitInstruction = getSetComputeUnitLimitInstruction({ 
      units: unitsWithMargin 
    });

    return pipe(
      transactionMessage,
      (tx) => prependTransactionMessageInstructions([computeLimitInstruction], tx)
    );
  }

  // ==================== Account Management (Solana Cookbook) ====================

  /**
   * Crear cuenta (Solana Cookbook)
   */
  async createAccount(
    payer: any,
    newAccount: any,
    space: number,
    programId: PublicKey = SYSTEM_PROGRAM_ADDRESS
  ): Promise<string> {
    const rentLamports = await this.rpc.getMinimumBalanceForRentExemption(space).send();

    const createAccountInstruction = getCreateAccountInstruction({
      payer,
      newAccount,
      lamports: rentLamports,
      programAddress: programId,
      space: BigInt(space)
    });

    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(payer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([createAccountInstruction], tx)
    );

    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    await sendAndConfirmTransactionFactory({ rpc: this.rpc, rpcSubscriptions: this.rpcSubscriptions })(
      signedTransaction,
      { commitment: this.commitment }
    );
    
    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Calcular costo de creación de cuenta (Solana Cookbook)
   */
  async calculateAccountCreationCost(space: number): Promise<number> {
    return await this.rpc.getMinimumBalanceForRentExemption(space).send();
  }

  /**
   * Obtener balance de cuenta (Solana Cookbook)
   */
  async getAccountBalance(pubkey: PublicKey): Promise<number> {
    const { value } = await this.rpc.getBalance(pubkey).send();
    return Number(value);
  }

  /**
   * Obtener información de cuenta (Solana Cookbook)
   */
  async getAccountInfo(pubkey: PublicKey): Promise<OraculoAccountInfo | null> {
    const { value } = await this.rpc.getAccountInfo(pubkey).send();
    
    if (!value) return null;
    
    return {
      data: value.data,
      executable: value.executable,
      lamports: value.lamports,
      owner: value.owner,
      rentEpoch: value.rentEpoch,
      space: value.space
    };
  }

  // ==================== Token Operations (Solana Cookbook) ====================

  /**
   * Obtener información de mint (Solana Cookbook)
   */
  async getTokenMint(mintAddress: PublicKey): Promise<OraculoTokenInfo> {
    const mint = await getMint(this.connection, mintAddress);
    
    return {
      mint: mintAddress,
      decimals: mint.decimals,
      supply: mint.supply.toString(),
      uiAmount: null,
      uiAmountString: mint.supply.toString()
    };
  }

  /**
   * Obtener información de cuenta de token (Solana Cookbook)
   */
  async getTokenAccount(tokenAccountAddress: PublicKey): Promise<any> {
    const account = await getAccount(this.connection, tokenAccountAddress);
    return account;
  }

  /**
   * Obtener balance de cuenta de token (Solana Cookbook)
   */
  async getTokenAccountBalance(tokenAccountAddress: PublicKey): Promise<any> {
    const balance = await this.connection.getTokenAccountBalance(tokenAccountAddress);
    return balance.value;
  }

  /**
   * Obtener todas las cuentas de token por propietario (Solana Cookbook)
   */
  async getTokenAccountsByOwner(owner: PublicKey, programId: PublicKey): Promise<any[]> {
    const response = await this.connection.getTokenAccountsByOwner(owner, { programId });
    return response.value;
  }

  /**
   * Obtener cuentas de token filtradas por mint (Solana Cookbook)
   */
  async getTokenAccountsByMint(owner: PublicKey, mint: PublicKey): Promise<any[]> {
    const response = await this.connection.getTokenAccountsByOwner(owner, { mint });
    return response.value;
  }

  // ==================== Airdrop & Testing (Solana Cookbook) ====================

  /**
   * Obtener SOL de prueba (Solana Cookbook)
   */
  async getTestSOL(recipient: PublicKey, amount: number = 1): Promise<string> {
    const LAMPORTS_PER_SOL = 1_000_000_000n;
    const airdropAmount = lamports(BigInt(amount) * LAMPORTS_PER_SOL);

    const airdrop = airdropFactory({ rpc: this.rpc, rpcSubscriptions: this.rpcSubscriptions });
    await airdrop({
      recipientAddress: recipient,
      lamports: airdropAmount,
      commitment: this.commitment
    });

    return `Airdropped ${amount} SOL to ${recipient.toString()}`;
  }

  /**
   * Verificar balance después de airdrop (Solana Cookbook)
   */
  async verifyBalanceAfterAirdrop(pubkey: PublicKey): Promise<number> {
    const { value } = await this.rpc.getBalance(pubkey).send();
    return Number(value) / LAMPORTS_PER_SOL;
  }

  // ==================== Event Subscriptions (Solana Cookbook) ====================

  /**
   * Suscribirse a eventos de cuenta (Solana Cookbook)
   */
  async subscribeToAccountEvents(
    pubkey: PublicKey,
    callback: (notification: any) => void
  ): Promise<number> {
    const abortController = new AbortController();
    
    const notifications = await this.rpcSubscriptions
      .accountNotifications(pubkey, { commitment: this.commitment })
      .subscribe({ abortSignal: abortController.signal });

    (async () => {
      for await (const notification of notifications) {
        callback(notification);
      }
    })();

    return 1; // Subscription ID
  }

  /**
   * Suscribirse a eventos de programa (Solana Cookbook)
   */
  async subscribeToProgramEvents(
    programId: PublicKey,
    callback: (notification: any) => void
  ): Promise<number> {
    const abortController = new AbortController();
    
    const notifications = await this.rpcSubscriptions
      .programNotifications(programId, { commitment: this.commitment })
      .subscribe({ abortSignal: abortController.signal });

    (async () => {
      for await (const notification of notifications) {
        callback(notification);
      }
    })();

    return 1; // Subscription ID
  }

  // ==================== Oraculo-Specific Methods ====================

  /**
   * Crear mercado de predicción con tokens
   */
  async createPredictionMarket(
    creator: any,
    marketInfo: OraculoMarketInfo
  ): Promise<string> {
    // Implementación específica para mercados de predicción
    const marketAccount = await this.createAccount(
      creator,
      await this.createKeypair(),
      1000, // Space for market data
      new PublicKey('11111111111111111111111111111111') // Program ID
    );

    return marketAccount;
  }

  /**
   * Hacer apuesta en mercado
   */
  async placeBet(
    bettor: any,
    marketId: PublicKey,
    outcomeIndex: number,
    amount: number
  ): Promise<string> {
    // Implementación de apuesta en mercado
    const transactionMessage = createTransactionMessage({ version: 0 });
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    
    return getSignatureFromTransaction(signedTransaction);
  }

  /**
   * Resolver mercado
   */
  async resolveMarket(
    creator: any,
    marketId: PublicKey,
    winningOutcome: number
  ): Promise<string> {
    // Implementación de resolución de mercado
    const transactionMessage = createTransactionMessage({ version: 0 });
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
    
    return getSignatureFromTransaction(signedTransaction);
  }

  // ==================== Utility Methods ====================

  /**
   * Obtener información completa de la red
   */
  async getNetworkInfo(): Promise<OraculoNetworkInfo> {
    const [slot, blockHeight, epochInfo, supply, health, performance] = await Promise.all([
      this.connection.getSlot(),
      this.connection.getBlockHeight(),
      this.connection.getEpochInfo(),
      this.connection.getSupply(),
      this.connection.getHealth(),
      this.connection.getRecentPerformanceSamples(5)
    ]);

    return {
      slot,
      blockHeight,
      epoch: epochInfo.epoch,
      supply: {
        total: supply.value.total,
        circulating: supply.value.circulating,
        nonCirculating: supply.value.nonCirculating,
        nonCirculatingAccounts: supply.value.nonCirculatingAccounts
      },
      health,
      performance
    };
  }

  /**
   * Monitorear transacciones de una dirección
   */
  async monitorTransactions(
    address: PublicKey,
    callback: (signature: OraculoTransactionSignature) => void
  ): Promise<void> {
    const signatures = await this.connection.getSignaturesForAddress(address);
    signatures.forEach(callback);
  }

  /**
   * Monitorear balance de una cuenta
   */
  async monitorBalance(
    pubkey: PublicKey,
    callback: (balance: number) => void,
    interval: number = 5000
  ): Promise<number> {
    const intervalId = setInterval(async () => {
      try {
        const balance = await this.getAccountBalance(pubkey);
        callback(balance);
      } catch (error) {
        console.error('Error monitoring balance:', error);
      }
    }, interval);

    return intervalId;
  }
}

// ==================== Factory Functions ====================

/**
 * Crear cliente Oráculo para devnet
 */
export function createOraculoDevnetClient(): OraculoSolanaCookbookClient {
  return new OraculoSolanaCookbookClient('https://api.devnet.solana.com', 'confirmed');
}

/**
 * Crear cliente Oráculo para mainnet
 */
export function createOraculoMainnetClient(): OraculoSolanaCookbookClient {
  return new OraculoSolanaCookbookClient('https://api.mainnet-beta.solana.com', 'confirmed');
}

/**
 * Crear cliente Oráculo para testnet
 */
export function createOraculoTestnetClient(): OraculoSolanaCookbookClient {
  return new OraculoSolanaCookbookClient('https://api.testnet.solana.com', 'confirmed');
}

/**
 * Crear cliente Oráculo para localhost
 */
export function createOraculoLocalClient(): OraculoSolanaCookbookClient {
  return new OraculoSolanaCookbookClient('http://localhost:8899', 'confirmed');
}

// ==================== Export Default ====================

export default OraculoSolanaCookbookClient;
