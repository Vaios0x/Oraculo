import { Connection, PublicKey, Commitment, RpcResponse } from '@solana/web3.js';

// Tipos para las respuestas RPC
export interface RpcResponseContext {
  slot: number;
  apiVersion?: string;
}

export interface AccountInfo {
  data: [string, string] | object;
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
}

export interface TokenAccountBalance {
  amount: string;
  decimals: number;
  uiAmount: number | null;
  uiAmountString: string;
}

export interface TransactionSignature {
  signature: string;
  slot: number;
  err: any;
  memo: string | null;
  blockTime: number | null;
  confirmationStatus: string | null;
}

export interface BlockInfo {
  blockHeight: number | null;
  blockTime: number | null;
  blockhash: string;
  parentSlot: number;
  previousBlockhash: string;
  transactions: any[];
}

export interface EpochInfo {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  transactionCount: number | null;
}

export interface SupplyInfo {
  total: number;
  circulating: number;
  nonCirculating: number;
  nonCirculatingAccounts: string[];
}

export interface PerformanceSample {
  slot: number;
  numTransactions: number;
  numSlots: number;
  samplePeriodSecs: number;
  numNonVoteTransactions: number;
}

export interface PrioritizationFee {
  slot: number;
  prioritizationFee: number;
}

export class OraculoRpcClient {
  private connection: Connection;
  private commitment: Commitment;

  constructor(connection: Connection, commitment: Commitment = 'confirmed') {
    this.connection = connection;
    this.commitment = commitment;
  }

  // ==================== Account Methods ====================

  /**
   * Obtener información de una cuenta
   */
  async getAccountInfo(pubkey: PublicKey): Promise<RpcResponse<AccountInfo | null>> {
    return await this.connection.getAccountInfo(pubkey, this.commitment);
  }

  /**
   * Obtener balance de una cuenta
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    return await this.connection.getBalance(pubkey, this.commitment);
  }

  /**
   * Obtener múltiples cuentas
   */
  async getMultipleAccounts(pubkeys: PublicKey[]): Promise<(AccountInfo | null)[]> {
    const response = await this.connection.getMultipleAccountsInfo(pubkeys, this.commitment);
    return response.value;
  }

  /**
   * Obtener cuentas de un programa
   */
  async getProgramAccounts(
    programId: PublicKey,
    filters?: any[]
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo }>> {
    return await this.connection.getProgramAccounts(programId, {
      commitment: this.commitment,
      filters,
    });
  }

  // ==================== Transaction Methods ====================

  /**
   * Obtener firmas de transacciones para una dirección
   */
  async getSignaturesForAddress(
    address: PublicKey,
    options?: {
      limit?: number;
      before?: string;
      until?: string;
    }
  ): Promise<TransactionSignature[]> {
    return await this.connection.getSignaturesForAddress(address, {
      commitment: this.commitment,
      ...options,
    });
  }

  /**
   * Obtener estado de firmas
   */
  async getSignatureStatuses(signatures: string[]): Promise<any[]> {
    const response = await this.connection.getSignatureStatuses(signatures);
    return response.value;
  }

  /**
   * Obtener transacción por firma (método moderno)
   */
  async getTransaction(signature: string): Promise<any> {
    return await this.connection.getTransaction(signature, {
      commitment: this.commitment,
      maxSupportedTransactionVersion: 0,
    });
  }

  /**
   * Obtener estado de firma (reemplaza confirmTransaction)
   */
  async getSignatureStatus(signature: string): Promise<any> {
    const statuses = await this.connection.getSignatureStatuses([signature]);
    return statuses[0];
  }

  /**
   * Obtener múltiples estados de firma
   */
  async getSignatureStatuses(signatures: string[]): Promise<any[]> {
    const statuses = await this.connection.getSignatureStatuses(signatures);
    return statuses;
  }

  /**
   * Obtener conteo de transacciones
   */
  async getTransactionCount(): Promise<number> {
    return await this.connection.getTransactionCount(this.commitment);
  }

  /**
   * Simular transacción
   */
  async simulateTransaction(transaction: string): Promise<{
    accounts: any[] | null;
    err: any;
    logs: string[] | null;
    unitsConsumed: number | undefined;
  }> {
    const response = await this.connection.simulateTransaction(transaction, {
      commitment: this.commitment,
      replaceRecentBlockhash: true,
    });
    return response.value;
  }

  /**
   * Enviar transacción
   */
  async sendTransaction(transaction: string): Promise<string> {
    return await this.connection.sendRawTransaction(transaction, {
      commitment: this.commitment,
      skipPreflight: false,
      preflightCommitment: this.commitment,
    });
  }

  /**
   * Verificar si un blockhash es válido
   */
  async isBlockhashValid(blockhash: string): Promise<boolean> {
    const response = await this.connection.isBlockhashValid(blockhash, this.commitment);
    return response.value;
  }

  /**
   * Obtener slot mínimo del ledger
   */
  async getMinimumLedgerSlot(): Promise<number> {
    return await this.connection.getMinimumLedgerSlot();
  }

  /**
   * Obtener versión del nodo
   */
  async getVersion(): Promise<{
    'solana-core': string;
    'feature-set': number;
  }> {
    return await this.connection.getVersion();
  }

  /**
   * Obtener cuentas de voto
   */
  async getVoteAccounts(): Promise<{
    current: Array<{
      activatedStake: number;
      commission: number;
      epochCredits: number[][];
      epochVoteAccount: boolean;
      lastVote: number;
      nodePubkey: string;
      rootSlot: number;
      votePubkey: string;
    }>;
    delinquent: Array<{
      activatedStake: number;
      commission: number;
      epochCredits: number[][];
      epochVoteAccount: boolean;
      lastVote: number;
      nodePubkey: string;
      rootSlot: number;
      votePubkey: string;
    }>;
  }> {
    const response = await this.connection.getVoteAccounts(this.commitment);
    return response.value;
  }

  /**
   * Solicitar airdrop
   */
  async requestAirdrop(pubkey: PublicKey, lamports: number): Promise<string> {
    return await this.connection.requestAirdrop(pubkey, lamports, this.commitment);
  }

  // ==================== Block Methods ====================

  /**
   * Obtener información de un bloque
   */
  async getBlock(slot: number): Promise<BlockInfo | null> {
    return await this.connection.getBlock(slot, {
      commitment: this.commitment,
      maxSupportedTransactionVersion: 0,
    });
  }

  /**
   * Obtener altura del bloque actual
   */
  async getBlockHeight(): Promise<number> {
    return await this.connection.getBlockHeight(this.commitment);
  }

  /**
   * Obtener slot actual
   */
  async getSlot(): Promise<number> {
    return await this.connection.getSlot(this.commitment);
  }

  /**
   * Obtener slot líder
   */
  async getSlotLeader(): Promise<string> {
    return await this.connection.getSlotLeader(this.commitment);
  }

  /**
   * Obtener múltiples bloques (reemplaza getConfirmedBlocks)
   */
  async getBlocks(startSlot: number, endSlot?: number): Promise<number[]> {
    if (endSlot) {
      return await this.connection.getBlocks(startSlot, endSlot, this.commitment);
    }
    return await this.connection.getBlocks(startSlot, undefined, this.commitment);
  }

  /**
   * Obtener bloques con límite (reemplaza getConfirmedBlocksWithLimit)
   */
  async getBlocksWithLimit(startSlot: number, limit: number): Promise<number[]> {
    return await this.connection.getBlocksWithLimit(startSlot, limit, this.commitment);
  }

  /**
   * Obtener firmas por dirección (reemplaza getConfirmedSignaturesForAddress2)
   */
  async getSignaturesForAddress(address: PublicKey, options?: {
    limit?: number;
    before?: string;
    until?: string;
  }): Promise<any[]> {
    return await this.connection.getSignaturesForAddress(address, {
      limit: options?.limit,
      before: options?.before,
      until: options?.until,
      commitment: this.commitment,
    });
  }

  /**
   * Obtener líderes de slot
   */
  async getSlotLeaders(startSlot: number, limit: number): Promise<string[]> {
    return await this.connection.getSlotLeaders(startSlot, limit);
  }

  // ==================== Epoch Methods ====================

  /**
   * Obtener información de la época actual
   */
  async getEpochInfo(): Promise<EpochInfo> {
    return await this.connection.getEpochInfo(this.commitment);
  }

  /**
   * Obtener programación de épocas
   */
  async getEpochSchedule(): Promise<any> {
    return await this.connection.getEpochSchedule();
  }

  // ==================== Supply Methods ====================

  /**
   * Obtener información de suministro
   */
  async getSupply(): Promise<RpcResponse<SupplyInfo>> {
    return await this.connection.getSupply(this.commitment);
  }

  /**
   * Obtener cuentas más grandes
   */
  async getLargestAccounts(): Promise<Array<{ address: string; lamports: number }>> {
    const response = await this.connection.getLargestAccounts(this.commitment);
    return response.value;
  }

  // ==================== Token Methods ====================

  /**
   * Obtener balance de token
   */
  async getTokenAccountBalance(tokenAccount: PublicKey): Promise<RpcResponse<TokenAccountBalance>> {
    return await this.connection.getTokenAccountBalance(tokenAccount, this.commitment);
  }

  /**
   * Obtener cuentas de token por delegado
   */
  async getTokenAccountsByDelegate(
    delegate: PublicKey,
    programId: PublicKey
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo }>> {
    return await this.connection.getTokenAccountsByDelegate(delegate, { programId }, this.commitment);
  }

  /**
   * Obtener cuentas de token por propietario
   */
  async getTokenAccountsByOwner(
    owner: PublicKey,
    programId: PublicKey
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo }>> {
    return await this.connection.getTokenAccountsByOwner(owner, { programId }, this.commitment);
  }

  /**
   * Obtener cuentas más grandes de un token
   */
  async getTokenLargestAccounts(mint: PublicKey): Promise<Array<{
    address: string;
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  }>> {
    const response = await this.connection.getTokenLargestAccounts(mint, this.commitment);
    return response.value;
  }

  /**
   * Obtener suministro de un token
   */
  async getTokenSupply(mint: PublicKey): Promise<{
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  }> {
    const response = await this.connection.getTokenSupply(mint, this.commitment);
    return response.value;
  }

  // ==================== Performance Methods ====================

  /**
   * Obtener muestras de rendimiento recientes
   */
  async getRecentPerformanceSamples(limit?: number): Promise<PerformanceSample[]> {
    return await this.connection.getRecentPerformanceSamples(limit);
  }

  /**
   * Obtener tarifas de priorización recientes
   */
  async getRecentPrioritizationFees(accounts?: PublicKey[]): Promise<PrioritizationFee[]> {
    return await this.connection.getRecentPrioritizationFees(accounts);
  }

  // ==================== Health Methods ====================

  /**
   * Verificar salud del nodo
   */
  async getHealth(): Promise<string> {
    return await this.connection.getHealth();
  }

  /**
   * Obtener identidad del nodo
   */
  async getIdentity(): Promise<{ identity: string }> {
    return await this.connection.getIdentity();
  }

  // ==================== Utility Methods ====================

  /**
   * Obtener hash de bloque más reciente
   */
  async getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
    const response = await this.connection.getLatestBlockhash(this.commitment);
    return response.value;
  }

  /**
   * Obtener tiempo de bloque
   */
  async getBlockTime(slot: number): Promise<number | null> {
    return await this.connection.getBlockTime(slot);
  }

  /**
   * Obtener mínimo balance para exención de renta
   */
  async getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    return await this.connection.getMinimumBalanceForRentExemption(dataLength, this.commitment);
  }

  /**
   * Obtener tarifa para mensaje
   */
  async getFeeForMessage(message: string): Promise<number | null> {
    const response = await this.connection.getFeeForMessage(message, this.commitment);
    return response.value;
  }

  // ==================== Batch Methods ====================

  /**
   * Ejecutar múltiples llamadas RPC en lote
   */
  async batchRequest<T>(requests: (() => Promise<T>)[]): Promise<T[]> {
    return await Promise.all(requests.map(request => request()));
  }

  /**
   * Obtener información completa de la red
   */
  async getNetworkInfo(): Promise<{
    slot: number;
    blockHeight: number;
    epoch: number;
    supply: SupplyInfo;
    health: string;
    performance: PerformanceSample[];
  }> {
    const [slot, blockHeight, epochInfo, supply, health, performance] = await Promise.all([
      this.getSlot(),
      this.getBlockHeight(),
      this.getEpochInfo(),
      this.getSupply(),
      this.getHealth(),
      this.getRecentPerformanceSamples(5),
    ]);

    return {
      slot,
      blockHeight,
      epoch: epochInfo.epoch,
      supply: supply.value,
      health,
      performance,
    };
  }

  // ==================== Monitoring Methods ====================

  /**
   * Monitorear transacciones de una dirección
   */
  async monitorTransactions(
    address: PublicKey,
    callback: (signature: TransactionSignature) => void,
    options?: {
      limit?: number;
      before?: string;
    }
  ): Promise<void> {
    const signatures = await this.getSignaturesForAddress(address, options);
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
        const balance = await this.getBalance(pubkey);
        callback(balance);
      } catch (error) {
        console.error('Error monitoring balance:', error);
      }
    }, interval);

    return intervalId;
  }

  /**
   * Monitorear salud de la red
   */
  async monitorNetworkHealth(
    callback: (health: string) => void,
    interval: number = 10000
  ): Promise<number> {
    const intervalId = setInterval(async () => {
      try {
        const health = await this.getHealth();
        callback(health);
      } catch (error) {
        console.error('Error monitoring network health:', error);
        callback('unhealthy');
      }
    }, interval);

    return intervalId;
  }
}

// Utilidades para crear clientes RPC
export function createRpcClient(
  endpoint: string,
  commitment: Commitment = 'confirmed'
): OraculoRpcClient {
  const connection = new Connection(endpoint, commitment);
  return new OraculoRpcClient(connection, commitment);
}

export function createDevnetRpcClient(): OraculoRpcClient {
  return createRpcClient('https://api.devnet.solana.com', 'confirmed');
}

export function createMainnetRpcClient(): OraculoRpcClient {
  return createRpcClient('https://api.mainnet-beta.solana.com', 'confirmed');
}

export function createTestnetRpcClient(): OraculoRpcClient {
  return createRpcClient('https://api.testnet.solana.com', 'confirmed');
}
