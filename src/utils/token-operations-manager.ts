// Token Operations Manager Utilities
// ===================================
// Utilities for managing token transfer, delegation, burning, and account operations

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  AccountInfo,
  TransactionInstruction,
  Signer
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  createTransferCheckedInstruction,
  createApproveInstruction,
  createApproveCheckedInstruction,
  createRevokeInstruction,
  createBurnInstruction,
  createBurnCheckedInstruction,
  createCloseAccountInstruction,
  createFreezeAccountInstruction,
  createThawAccountInstruction,
  createSyncNativeInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getAccount,
  getMint,
  Mint,
  Account,
  NATIVE_MINT
} from "@solana/spl-token";

export interface TransferOperation {
  source: PublicKey;
  destination: PublicKey;
  amount: bigint;
  authority: PublicKey;
  signature?: string;
  timestamp?: number;
}

export interface DelegationOperation {
  account: PublicKey;
  delegate: PublicKey;
  amount: bigint;
  owner: PublicKey;
  signature?: string;
  timestamp?: number;
}

export interface BurnOperation {
  account: PublicKey;
  mint: PublicKey;
  amount: bigint;
  authority: PublicKey;
  signature?: string;
  timestamp?: number;
}

export interface FreezeOperation {
  account: PublicKey;
  mint: PublicKey;
  freezeAuthority: PublicKey;
  signature?: string;
  timestamp?: number;
}

export interface TokenAccountInfo {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegate: PublicKey | null;
  delegatedAmount: bigint;
  isInitialized: boolean;
  isFrozen: boolean;
  isNative: boolean;
  rentExemptReserve: bigint | null;
  closeAuthority: PublicKey | null;
}

export interface TokenOperationsMetrics {
  totalTransfers: number;
  totalBurns: number;
  totalDelegations: number;
  totalFreezes: number;
  totalThaws: number;
  totalAmountTransferred: bigint;
  totalAmountBurned: bigint;
  averageTransferAmount: bigint;
  averageBurnAmount: bigint;
  mostActiveAccounts: { [account: string]: number };
  operationHistory: Array<{
    type: 'transfer' | 'burn' | 'delegate' | 'freeze' | 'thaw';
    account: string;
    amount: bigint;
    timestamp: number;
  }>;
}

export class TokenOperationsManager {
  private connection: Connection;
  private cache: Map<string, any> = new Map();
  private metrics: TokenOperationsMetrics = {
    totalTransfers: 0,
    totalBurns: 0,
    totalDelegations: 0,
    totalFreezes: 0,
    totalThaws: 0,
    totalAmountTransferred: BigInt(0),
    totalAmountBurned: BigInt(0),
    averageTransferAmount: BigInt(0),
    averageBurnAmount: BigInt(0),
    mostActiveAccounts: {},
    operationHistory: []
  };
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Transfer tokens between accounts
   */
  async transferTokens(
    source: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: Keypair,
    decimals: number = 9
  ): Promise<TransferOperation> {
    try {
      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        source,
        destination,
        authority.publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('transfer', source.toString(), BigInt(amount));

      const operation: TransferOperation = {
        source,
        destination,
        amount: BigInt(amount),
        authority: authority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens with checked amounts
   */
  async transferTokensChecked(
    source: PublicKey,
    destination: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number,
    authority: Keypair
  ): Promise<TransferOperation> {
    try {
      // Create transfer checked instruction
      const transferInstruction = createTransferCheckedInstruction(
        source,
        mint,
        destination,
        authority.publicKey,
        amount,
        decimals,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('transfer', source.toString(), BigInt(amount));

      const operation: TransferOperation = {
        source,
        destination,
        amount: BigInt(amount),
        authority: authority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error transferring tokens (checked):', error);
      throw error;
    }
  }

  /**
   * Approve delegate for token account
   */
  async approveDelegate(
    account: PublicKey,
    delegate: PublicKey,
    amount: number,
    owner: Keypair
  ): Promise<DelegationOperation> {
    try {
      // Create approve instruction
      const approveInstruction = createApproveInstruction(
        account,
        delegate,
        owner.publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(approveInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = owner.publicKey;

      // Sign and send transaction
      transaction.sign(owner);
      const signature = await this.connection.sendTransaction(transaction, [owner]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('delegate', account.toString(), BigInt(amount));

      const operation: DelegationOperation = {
        account,
        delegate,
        amount: BigInt(amount),
        owner: owner.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error approving delegate:', error);
      throw error;
    }
  }

  /**
   * Approve delegate with checked amounts
   */
  async approveDelegateChecked(
    account: PublicKey,
    mint: PublicKey,
    delegate: PublicKey,
    amount: number,
    decimals: number,
    owner: Keypair
  ): Promise<DelegationOperation> {
    try {
      // Create approve checked instruction
      const approveInstruction = createApproveCheckedInstruction(
        account,
        mint,
        delegate,
        owner.publicKey,
        amount,
        decimals,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(approveInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = owner.publicKey;

      // Sign and send transaction
      transaction.sign(owner);
      const signature = await this.connection.sendTransaction(transaction, [owner]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('delegate', account.toString(), BigInt(amount));

      const operation: DelegationOperation = {
        account,
        delegate,
        amount: BigInt(amount),
        owner: owner.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error approving delegate (checked):', error);
      throw error;
    }
  }

  /**
   * Revoke delegate
   */
  async revokeDelegate(
    account: PublicKey,
    owner: Keypair
  ): Promise<string> {
    try {
      // Create revoke instruction
      const revokeInstruction = createRevokeInstruction(
        account,
        owner.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(revokeInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = owner.publicKey;

      // Sign and send transaction
      transaction.sign(owner);
      const signature = await this.connection.sendTransaction(transaction, [owner]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('revoke', account.toString(), BigInt(0));

      return signature;

    } catch (error) {
      console.error('Error revoking delegate:', error);
      throw error;
    }
  }

  /**
   * Burn tokens
   */
  async burnTokens(
    account: PublicKey,
    mint: PublicKey,
    amount: number,
    authority: Keypair
  ): Promise<BurnOperation> {
    try {
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        account,
        mint,
        authority.publicKey,
        BigInt(amount),
        [authority],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(burnInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('burn', account.toString(), BigInt(amount));

      const operation: BurnOperation = {
        account,
        mint,
        amount: BigInt(amount),
        authority: authority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error burning tokens:', error);
      throw error;
    }
  }

  /**
   * Burn tokens with checked amounts
   */
  async burnTokensChecked(
    account: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number,
    authority: Keypair
  ): Promise<BurnOperation> {
    try {
      // Create burn checked instruction
      const burnInstruction = createBurnCheckedInstruction(
        account,
        mint,
        authority.publicKey,
        amount,
        decimals,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(burnInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('burn', account.toString(), BigInt(amount));

      const operation: BurnOperation = {
        account,
        mint,
        amount: BigInt(amount),
        authority: authority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error burning tokens (checked):', error);
      throw error;
    }
  }

  /**
   * Freeze token account
   */
  async freezeAccount(
    account: PublicKey,
    mint: PublicKey,
    freezeAuthority: Keypair
  ): Promise<FreezeOperation> {
    try {
      // Create freeze instruction
      const freezeInstruction = createFreezeAccountInstruction(
        account,
        mint,
        freezeAuthority.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(freezeInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = freezeAuthority.publicKey;

      // Sign and send transaction
      transaction.sign(freezeAuthority);
      const signature = await this.connection.sendTransaction(transaction, [freezeAuthority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('freeze', account.toString(), BigInt(0));

      const operation: FreezeOperation = {
        account,
        mint,
        freezeAuthority: freezeAuthority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error freezing account:', error);
      throw error;
    }
  }

  /**
   * Thaw token account
   */
  async thawAccount(
    account: PublicKey,
    mint: PublicKey,
    freezeAuthority: Keypair
  ): Promise<FreezeOperation> {
    try {
      // Create thaw instruction
      const thawInstruction = createThawAccountInstruction(
        account,
        mint,
        freezeAuthority.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(thawInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = freezeAuthority.publicKey;

      // Sign and send transaction
      transaction.sign(freezeAuthority);
      const signature = await this.connection.sendTransaction(transaction, [freezeAuthority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('thaw', account.toString(), BigInt(0));

      const operation: FreezeOperation = {
        account,
        mint,
        freezeAuthority: freezeAuthority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error thawing account:', error);
      throw error;
    }
  }

  /**
   * Close token account
   */
  async closeAccount(
    account: PublicKey,
    destination: PublicKey,
    owner: Keypair
  ): Promise<string> {
    try {
      // Create close account instruction
      const closeInstruction = createCloseAccountInstruction(
        account,
        destination,
        owner.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(closeInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = owner.publicKey;

      // Sign and send transaction
      transaction.sign(owner);
      const signature = await this.connection.sendTransaction(transaction, [owner]);
      await this.connection.confirmTransaction(signature);

      return signature;

    } catch (error) {
      console.error('Error closing account:', error);
      throw error;
    }
  }

  /**
   * Sync native SOL (for wrapped SOL)
   */
  async syncNative(
    account: PublicKey
  ): Promise<string> {
    try {
      // Create sync native instruction
      const syncInstruction = createSyncNativeInstruction(
        account,
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(syncInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Send transaction (no signers needed for sync native)
      const signature = await this.connection.sendTransaction(transaction, []);
      await this.connection.confirmTransaction(signature);

      return signature;

    } catch (error) {
      console.error('Error syncing native:', error);
      throw error;
    }
  }

  /**
   * Get token account information
   */
  async getTokenAccountInfo(account: PublicKey): Promise<TokenAccountInfo | null> {
    try {
      const accountInfo = await getAccount(this.connection, account);
      
      return {
        address: account,
        mint: accountInfo.mint,
        owner: accountInfo.owner,
        amount: accountInfo.amount,
        delegate: accountInfo.delegate,
        delegatedAmount: accountInfo.delegatedAmount,
        isInitialized: accountInfo.isInitialized,
        isFrozen: accountInfo.isFrozen,
        isNative: accountInfo.isNative,
        rentExemptReserve: accountInfo.rentExemptReserve,
        closeAuthority: accountInfo.closeAuthority
      };
    } catch (error) {
      console.error('Error getting token account info:', error);
      return null;
    }
  }

  /**
   * Check if account can be transferred from
   */
  async canTransfer(account: PublicKey, authority: PublicKey): Promise<boolean> {
    try {
      const accountInfo = await this.getTokenAccountInfo(account);
      if (!accountInfo) return false;
      
      return accountInfo.isInitialized && 
             !accountInfo.isFrozen && 
             accountInfo.owner.equals(authority) &&
             accountInfo.amount > BigInt(0);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if account is frozen
   */
  async isAccountFrozen(account: PublicKey): Promise<boolean> {
    try {
      const accountInfo = await this.getTokenAccountInfo(account);
      return accountInfo ? accountInfo.isFrozen : false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get operation history
   */
  getOperationHistory(): Array<{
    type: 'transfer' | 'burn' | 'delegate' | 'freeze' | 'thaw';
    account: string;
    amount: bigint;
    timestamp: number;
  }> {
    return [...this.metrics.operationHistory];
  }

  /**
   * Get metrics
   */
  getMetrics(): TokenOperationsMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalTransfers: 0,
      totalBurns: 0,
      totalDelegations: 0,
      totalFreezes: 0,
      totalThaws: 0,
      totalAmountTransferred: BigInt(0),
      totalAmountBurned: BigInt(0),
      averageTransferAmount: BigInt(0),
      averageBurnAmount: BigInt(0),
      mostActiveAccounts: {},
      operationHistory: []
    };
  }

  /**
   * Update metrics
   */
  private updateMetrics(operation: string, account: string, amount: bigint): void {
    const timestamp = Date.now();
    
    if (operation === 'transfer') {
      this.metrics.totalTransfers++;
      this.metrics.totalAmountTransferred += amount;
      this.metrics.averageTransferAmount = this.metrics.totalAmountTransferred / BigInt(this.metrics.totalTransfers);
    } else if (operation === 'burn') {
      this.metrics.totalBurns++;
      this.metrics.totalAmountBurned += amount;
      this.metrics.averageBurnAmount = this.metrics.totalAmountBurned / BigInt(this.metrics.totalBurns);
    } else if (operation === 'delegate') {
      this.metrics.totalDelegations++;
    } else if (operation === 'freeze') {
      this.metrics.totalFreezes++;
    } else if (operation === 'thaw') {
      this.metrics.totalThaws++;
    }
    
    this.metrics.mostActiveAccounts[account] = (this.metrics.mostActiveAccounts[account] || 0) + 1;
    
    this.metrics.operationHistory.push({
      type: operation as any,
      account,
      amount,
      timestamp
    });
    
    // Keep only last 1000 operations
    if (this.metrics.operationHistory.length > 1000) {
      this.metrics.operationHistory = this.metrics.operationHistory.slice(-1000);
    }
  }
}

// Utility functions for token operations
export const TokenOperationsUtils = {
  /**
   * Format transfer operation for display
   */
  formatTransferOperation: (operation: TransferOperation): string => {
    return `
Source: ${operation.source.toString()}
Destination: ${operation.destination.toString()}
Amount: ${operation.amount.toString()}
Authority: ${operation.authority.toString()}
Signature: ${operation.signature || 'N/A'}
Timestamp: ${operation.timestamp ? new Date(operation.timestamp).toISOString() : 'N/A'}
    `.trim();
  },

  /**
   * Format delegation operation for display
   */
  formatDelegationOperation: (operation: DelegationOperation): string => {
    return `
Account: ${operation.account.toString()}
Delegate: ${operation.delegate.toString()}
Amount: ${operation.amount.toString()}
Owner: ${operation.owner.toString()}
Signature: ${operation.signature || 'N/A'}
Timestamp: ${operation.timestamp ? new Date(operation.timestamp).toISOString() : 'N/A'}
    `.trim();
  },

  /**
   * Format burn operation for display
   */
  formatBurnOperation: (operation: BurnOperation): string => {
    return `
Account: ${operation.account.toString()}
Mint: ${operation.mint.toString()}
Amount: ${operation.amount.toString()}
Authority: ${operation.authority.toString()}
Signature: ${operation.signature || 'N/A'}
Timestamp: ${operation.timestamp ? new Date(operation.timestamp).toISOString() : 'N/A'}
    `.trim();
  },

  /**
   * Format token account info for display
   */
  formatTokenAccountInfo: (info: TokenAccountInfo): string => {
    return `
Address: ${info.address.toString()}
Mint: ${info.mint.toString()}
Owner: ${info.owner.toString()}
Amount: ${info.amount.toString()}
Delegate: ${info.delegate?.toString() || 'None'}
Delegated Amount: ${info.delegatedAmount.toString()}
Initialized: ${info.isInitialized}
Frozen: ${info.isFrozen}
Native: ${info.isNative}
Rent Exempt Reserve: ${info.rentExemptReserve?.toString() || 'N/A'}
Close Authority: ${info.closeAuthority?.toString() || 'None'}
    `.trim();
  },

  /**
   * Calculate operation efficiency
   */
  calculateOperationEfficiency: (operations: Array<{
    type: 'transfer' | 'burn' | 'delegate' | 'freeze' | 'thaw';
    account: string;
    amount: bigint;
    timestamp: number;
  }>): {
    totalOperations: number;
    totalAmount: bigint;
    averageAmount: bigint;
    operationFrequency: number;
    efficiency: number;
  } => {
    if (operations.length === 0) {
      return { totalOperations: 0, totalAmount: BigInt(0), averageAmount: BigInt(0), operationFrequency: 0, efficiency: 0 };
    }
    
    const totalAmount = operations.reduce((sum, op) => sum + op.amount, BigInt(0));
    const averageAmount = totalAmount / BigInt(operations.length);
    
    // Calculate time span
    const timestamps = operations
      .map(op => op.timestamp)
      .filter(ts => ts > 0)
      .sort((a, b) => a - b);
    
    const timeSpan = timestamps.length > 1 
      ? (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60) // minutes
      : 1;
    
    const operationFrequency = operations.length / Math.max(timeSpan, 1);
    const efficiency = operationFrequency > 0 ? 1 / operationFrequency : 0;
    
    return {
      totalOperations: operations.length,
      totalAmount,
      averageAmount,
      operationFrequency,
      efficiency
    };
  },

  /**
   * Validate transfer operation
   */
  validateTransferOperation: (
    source: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: PublicKey
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!source || source.equals(PublicKey.default)) {
      errors.push('Invalid source address');
    }
    
    if (!destination || destination.equals(PublicKey.default)) {
      errors.push('Invalid destination address');
    }
    
    if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    
    if (!authority || authority.equals(PublicKey.default)) {
      errors.push('Invalid authority address');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Compare operations
   */
  compareOperations: (op1: any, op2: any): {
    sameType: boolean;
    sameAccount: boolean;
    sameAuthority: boolean;
    amountDifference: bigint;
  } => {
    return {
      sameType: op1.type === op2.type,
      sameAccount: op1.account === op2.account,
      sameAuthority: op1.authority?.equals(op2.authority) || false,
      amountDifference: BigInt(op1.amount) > BigInt(op2.amount) ? BigInt(op1.amount) - BigInt(op2.amount) : BigInt(op2.amount) - BigInt(op1.amount)
    };
  }
};
