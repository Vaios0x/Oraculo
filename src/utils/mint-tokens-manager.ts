// Mint Tokens Manager Utilities
// ==============================
// Utilities for managing token minting operations

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  AccountInfo,
  TransactionInstruction
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createSetAuthorityInstruction,
  createInitializeMintInstruction,
  createInitializeAccountInstruction,
  createAssociatedTokenAccountInstruction,
  AuthorityType,
  getAccount,
  getMint,
  Mint,
  Account
} from "@solana/spl-token";

export interface MintingOperation {
  mint: PublicKey;
  destination: PublicKey;
  amount: bigint;
  authority: PublicKey;
  signature?: string;
  timestamp?: number;
}

export interface MintingAuthority {
  mint: PublicKey;
  authority: PublicKey | null;
  authorityType: AuthorityType;
  newAuthority: PublicKey | null;
}

export interface TokenSupply {
  mint: PublicKey;
  currentSupply: bigint;
  maxSupply?: bigint;
  decimals: number;
  isInitialized: boolean;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
}

export interface MintingMetrics {
  totalMints: number;
  totalAmountMinted: bigint;
  averageMintAmount: bigint;
  mostActiveMints: { [mint: string]: number };
  authorityChanges: number;
  supplyGrowth: { [mint: string]: bigint };
}

export class MintTokensManager {
  private connection: Connection;
  private cache: Map<string, any> = new Map();
  private metrics: MintingMetrics = {
    totalMints: 0,
    totalAmountMinted: 0n,
    averageMintAmount: 0n,
    mostActiveMints: {},
    authorityChanges: 0,
    supplyGrowth: {}
  };
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Mint tokens to a destination account
   */
  async mintTokens(
    mint: PublicKey,
    destination: PublicKey,
    authority: Keypair,
    amount: number,
    decimals: number = 9
  ): Promise<MintingOperation> {
    try {
      // Create mint instruction
      const mintInstruction = createMintToInstruction(
        mint,
        destination,
        authority.publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(mintInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('mint', mint.toString(), BigInt(amount));

      const operation: MintingOperation = {
        mint,
        destination,
        amount: BigInt(amount),
        authority: authority.publicKey,
        signature,
        timestamp: Date.now()
      };

      return operation;

    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  /**
   * Batch mint tokens to multiple destinations
   */
  async batchMintTokens(
    mint: PublicKey,
    destinations: { account: PublicKey; amount: number }[],
    authority: Keypair,
    decimals: number = 9
  ): Promise<MintingOperation[]> {
    try {
      const operations: MintingOperation[] = [];
      
      // Create multiple mint instructions
      const instructions = destinations.map(dest => 
        createMintToInstruction(
          mint,
          dest.account,
          authority.publicKey,
          dest.amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Create transaction with all instructions
      const transaction = new Transaction().add(...instructions);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Create operation records
      for (const dest of destinations) {
        const operation: MintingOperation = {
          mint,
          destination: dest.account,
          amount: BigInt(dest.amount),
          authority: authority.publicKey,
          signature,
          timestamp: Date.now()
        };
        operations.push(operation);
        
        // Update metrics
        this.updateMetrics('mint', mint.toString(), BigInt(dest.amount));
      }

      return operations;

    } catch (error) {
      console.error('Error batch minting tokens:', error);
      throw error;
    }
  }

  /**
   * Set mint authority
   */
  async setMintAuthority(
    mint: PublicKey,
    currentAuthority: Keypair,
    newAuthority: PublicKey | null,
    authorityType: AuthorityType = AuthorityType.MintTokens
  ): Promise<string> {
    try {
      // Create set authority instruction
      const setAuthorityInstruction = createSetAuthorityInstruction(
        mint,
        currentAuthority.publicKey,
        authorityType,
        newAuthority,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(setAuthorityInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = currentAuthority.publicKey;

      // Sign and send transaction
      transaction.sign(currentAuthority);
      const signature = await this.connection.sendTransaction(transaction, [currentAuthority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('authority', mint.toString(), 0n);

      return signature;

    } catch (error) {
      console.error('Error setting mint authority:', error);
      throw error;
    }
  }

  /**
   * Revoke mint authority
   */
  async revokeMintAuthority(
    mint: PublicKey,
    currentAuthority: Keypair
  ): Promise<string> {
    return this.setMintAuthority(mint, currentAuthority, null, AuthorityType.MintTokens);
  }

  /**
   * Get token supply information
   */
  async getTokenSupply(mint: PublicKey): Promise<TokenSupply | null> {
    try {
      const mintInfo = await getMint(this.connection, mint);
      
      return {
        mint,
        currentSupply: mintInfo.supply,
        decimals: mintInfo.decimals,
        isInitialized: mintInfo.isInitialized,
        mintAuthority: mintInfo.mintAuthority,
        freezeAuthority: mintInfo.freezeAuthority
      };
    } catch (error) {
      console.error('Error getting token supply:', error);
      return null;
    }
  }

  /**
   * Check if minting is allowed
   */
  async canMint(mint: PublicKey, authority: PublicKey): Promise<boolean> {
    try {
      const supply = await this.getTokenSupply(mint);
      if (!supply) return false;
      
      // Check if mint authority exists and matches
      return supply.mintAuthority !== null && 
             supply.mintAuthority.equals(authority) &&
             supply.isInitialized;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get minting history for a mint
   */
  async getMintingHistory(
    mint: PublicKey,
    limit: number = 100
  ): Promise<MintingOperation[]> {
    try {
      // This is a simplified implementation
      // In practice, you'd query transaction history or maintain a database
      const history: MintingOperation[] = [];
      
      // Get recent transactions for the mint
      const signatures = await this.connection.getSignaturesForAddress(mint, { limit });
      
      for (const sig of signatures) {
        try {
          const tx = await this.connection.getTransaction(sig.signature);
          if (tx && tx.meta && tx.meta.logMessages) {
            // Check if this is a mint transaction
            const isMintTx = tx.meta.logMessages.some(log => 
              log.includes('Program log: Instruction: MintTo')
            );
            
            if (isMintTx) {
              // Extract minting information from transaction
              const operation: MintingOperation = {
                mint,
                destination: PublicKey.default, // Would extract from transaction
                amount: 0n, // Would extract from transaction
                authority: PublicKey.default, // Would extract from transaction
                signature: sig.signature,
                timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now()
              };
              history.push(operation);
            }
          }
        } catch (error) {
          // Skip invalid transactions
          continue;
        }
      }
      
      return history;
    } catch (error) {
      console.error('Error getting minting history:', error);
      return [];
    }
  }

  /**
   * Calculate minting rate
   */
  async calculateMintingRate(
    mint: PublicKey,
    timeWindow: number = 24 * 60 * 60 * 1000 // 24 hours
  ): Promise<{
    rate: number;
    totalMinted: bigint;
    timeWindow: number;
  }> {
    try {
      const history = await this.getMintingHistory(mint, 1000);
      const now = Date.now();
      const cutoff = now - timeWindow;
      
      const recentMints = history.filter(op => 
        op.timestamp && op.timestamp > cutoff
      );
      
      const totalMinted = recentMints.reduce((sum, op) => sum + op.amount, 0n);
      const rate = recentMints.length / (timeWindow / (60 * 60 * 1000)); // mints per hour
      
      return {
        rate,
        totalMinted,
        timeWindow
      };
    } catch (error) {
      console.error('Error calculating minting rate:', error);
      return { rate: 0, totalMinted: 0n, timeWindow };
    }
  }

  /**
   * Monitor minting activity
   */
  async monitorMintingActivity(
    mint: PublicKey,
    duration: number = 60000 // 1 minute
  ): Promise<{
    mintsInPeriod: number;
    totalAmountMinted: bigint;
    averageMintAmount: bigint;
    mintingRate: number;
  }> {
    const startTime = Date.now();
    const initialMetrics = { ...this.metrics };
    
    // Monitor for specified duration
    await new Promise(resolve => setTimeout(resolve, duration));
    
    const finalMetrics = this.metrics;
    const mintsInPeriod = finalMetrics.totalMints - initialMetrics.totalMints;
    const totalAmountMinted = finalMetrics.totalAmountMinted - initialMetrics.totalAmountMinted;
    const averageMintAmount = mintsInPeriod > 0 ? totalAmountMinted / BigInt(mintsInPeriod) : 0n;
    const mintingRate = mintsInPeriod / (duration / 1000); // mints per second
    
    return {
      mintsInPeriod,
      totalAmountMinted,
      averageMintAmount,
      mintingRate
    };
  }

  /**
   * Validate minting operation
   */
  validateMintingOperation(
    mint: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: PublicKey
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!mint || mint.equals(PublicKey.default)) {
      errors.push('Invalid mint address');
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
  }

  /**
   * Get minting metrics
   */
  getMetrics(): MintingMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalMints: 0,
      totalAmountMinted: 0n,
      averageMintAmount: 0n,
      mostActiveMints: {},
      authorityChanges: 0,
      supplyGrowth: {}
    };
  }

  /**
   * Update metrics
   */
  private updateMetrics(operation: string, mint: string, amount: bigint): void {
    if (operation === 'mint') {
      this.metrics.totalMints++;
      this.metrics.totalAmountMinted += amount;
      this.metrics.averageMintAmount = this.metrics.totalAmountMinted / BigInt(this.metrics.totalMints);
      this.metrics.mostActiveMints[mint] = (this.metrics.mostActiveMints[mint] || 0) + 1;
      this.metrics.supplyGrowth[mint] = (this.metrics.supplyGrowth[mint] || 0n) + amount;
    } else if (operation === 'authority') {
      this.metrics.authorityChanges++;
    }
  }
}

// Utility functions for mint tokens management
export const MintTokensUtils = {
  /**
   * Format minting operation for display
   */
  formatMintingOperation: (operation: MintingOperation): string => {
    return `
Mint: ${operation.mint.toString()}
Destination: ${operation.destination.toString()}
Amount: ${operation.amount.toString()}
Authority: ${operation.authority.toString()}
Signature: ${operation.signature || 'N/A'}
Timestamp: ${operation.timestamp ? new Date(operation.timestamp).toISOString() : 'N/A'}
    `.trim();
  },

  /**
   * Calculate minting efficiency
   */
  calculateMintingEfficiency: (operations: MintingOperation[]): {
    totalMinted: bigint;
    averageAmount: bigint;
    mintingFrequency: number;
    efficiency: number;
  } => {
    if (operations.length === 0) {
      return { totalMinted: 0n, averageAmount: 0n, mintingFrequency: 0, efficiency: 0 };
    }
    
    const totalMinted = operations.reduce((sum, op) => sum + op.amount, 0n);
    const averageAmount = totalMinted / BigInt(operations.length);
    
    // Calculate time span
    const timestamps = operations
      .map(op => op.timestamp || 0)
      .filter(ts => ts > 0)
      .sort((a, b) => a - b);
    
    const timeSpan = timestamps.length > 1 
      ? (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60) // minutes
      : 1;
    
    const mintingFrequency = operations.length / Math.max(timeSpan, 1);
    const efficiency = mintingFrequency > 0 ? 1 / mintingFrequency : 0;
    
    return {
      totalMinted,
      averageAmount,
      mintingFrequency,
      efficiency
    };
  },

  /**
   * Validate mint authority
   */
  validateMintAuthority: (authority: MintingAuthority): boolean => {
    return authority.mint !== null && 
           authority.authority !== null && 
           authority.newAuthority !== null;
  },

  /**
   * Format token supply for display
   */
  formatTokenSupply: (supply: TokenSupply): string => {
    return `
Mint: ${supply.mint.toString()}
Current Supply: ${supply.currentSupply.toString()}
Max Supply: ${supply.maxSupply?.toString() || 'Unlimited'}
Decimals: ${supply.decimals}
Initialized: ${supply.isInitialized}
Mint Authority: ${supply.mintAuthority?.toString() || 'None'}
Freeze Authority: ${supply.freezeAuthority?.toString() || 'None'}
    `.trim();
  },

  /**
   * Compare minting operations
   */
  compareMintingOperations: (op1: MintingOperation, op2: MintingOperation): {
    sameMint: boolean;
    sameDestination: boolean;
    sameAuthority: boolean;
    amountDifference: bigint;
  } => {
    return {
      sameMint: op1.mint.equals(op2.mint),
      sameDestination: op1.destination.equals(op2.destination),
      sameAuthority: op1.authority.equals(op2.authority),
      amountDifference: op1.amount > op2.amount ? op1.amount - op2.amount : op2.amount - op1.amount
    };
  }
};
