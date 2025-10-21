// SPL Token Manager Utilities
// ============================
// Utilities for managing SPL Tokens

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
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createInitializeAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  createApproveInstruction,
  createRevokeInstruction,
  createBurnInstruction,
  createCloseAccountInstruction,
  createFreezeAccountInstruction,
  createThawAccountInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getAccount,
  getMint,
  createSyncNativeInstruction
} from "@solana/spl-token";

export interface TokenMint {
  address: PublicKey;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  supply: bigint;
  decimals: number;
  isInitialized: boolean;
}

export interface TokenAccount {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegate: PublicKey | null;
  state: number;
  isNative: boolean;
  delegatedAmount: bigint;
  closeAuthority: PublicKey | null;
}

export interface TokenOperation {
  type: 'mint' | 'burn' | 'transfer' | 'approve' | 'revoke' | 'freeze' | 'thaw' | 'close';
  from: PublicKey;
  to?: PublicKey;
  amount: bigint;
  authority: PublicKey;
  delegate?: PublicKey;
}

export interface TokenMetrics {
  totalMints: number;
  totalAccounts: number;
  totalSupply: bigint;
  averageBalance: bigint;
  mostUsedMints: { [mint: string]: number };
  operationCounts: { [operation: string]: number };
}

export class SPLTokenManager {
  private connection: Connection;
  private cache: Map<string, any> = new Map();
  private metrics: TokenMetrics = {
    totalMints: 0,
    totalAccounts: 0,
    totalSupply: 0n,
    averageBalance: 0n,
    mostUsedMints: {},
    operationCounts: {}
  };
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Create a new token mint
   */
  async createTokenMint(
    payer: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    decimals: number,
    space?: number
  ): Promise<{ mint: Keypair; signature: string }> {
    try {
      const mint = Keypair.generate();
      const mintSpace = space || 82; // Default mint size
      
      // Get rent exemption
      const rentExemption = await this.connection.getMinimumBalanceForRentExemption(mintSpace);
      
      // Create account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint.publicKey,
        lamports: rentExemption,
        space: mintSpace,
        programId: TOKEN_PROGRAM_ID
      });

      // Initialize mint instruction
      const initializeMintInstruction = createInitializeMintInstruction(
        mint.publicKey,
        decimals,
        mintAuthority,
        freezeAuthority,
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction()
        .add(createAccountInstruction)
        .add(initializeMintInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer.publicKey;

      // Sign and send transaction
      transaction.sign(payer, mint);
      const signature = await this.connection.sendTransaction(transaction, [payer, mint]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('mint', mint.publicKey.toString());

      return { mint, signature };

    } catch (error) {
      console.error('Error creating token mint:', error);
      throw error;
    }
  }

  /**
   * Create a token account
   */
  async createTokenAccount(
    payer: Keypair,
    mint: PublicKey,
    owner: PublicKey,
    space?: number
  ): Promise<{ tokenAccount: Keypair; signature: string }> {
    try {
      const tokenAccount = Keypair.generate();
      const accountSpace = space || 165; // Default token account size
      
      // Get rent exemption
      const rentExemption = await this.connection.getMinimumBalanceForRentExemption(accountSpace);
      
      // Create account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tokenAccount.publicKey,
        lamports: rentExemption,
        space: accountSpace,
        programId: TOKEN_PROGRAM_ID
      });

      // Initialize account instruction
      const initializeAccountInstruction = createInitializeAccountInstruction(
        tokenAccount.publicKey,
        mint,
        owner,
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction()
        .add(createAccountInstruction)
        .add(initializeAccountInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer.publicKey;

      // Sign and send transaction
      transaction.sign(payer, tokenAccount);
      const signature = await this.connection.sendTransaction(transaction, [payer, tokenAccount]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('account', tokenAccount.publicKey.toString());

      return { tokenAccount, signature };

    } catch (error) {
      console.error('Error creating token account:', error);
      throw error;
    }
  }

  /**
   * Create an associated token account
   */
  async createAssociatedTokenAccount(
    payer: Keypair,
    mint: PublicKey,
    owner: PublicKey
  ): Promise<{ ata: PublicKey; signature: string }> {
    try {
      // Get associated token address
      const ata = await getAssociatedTokenAddress(mint, owner, false, TOKEN_PROGRAM_ID);
      
      // Create ATA instruction
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        payer.publicKey,
        ata,
        owner,
        mint,
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(createATAInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer.publicKey;

      // Sign and send transaction
      transaction.sign(payer);
      const signature = await this.connection.sendTransaction(transaction, [payer]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('account', ata.toString());

      return { ata, signature };

    } catch (error) {
      console.error('Error creating associated token account:', error);
      throw error;
    }
  }

  /**
   * Mint tokens to an account
   */
  async mintTokens(
    mint: PublicKey,
    destination: PublicKey,
    authority: Keypair,
    amount: number
  ): Promise<string> {
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
      this.updateMetrics('mint', mint.toString());

      return signature;

    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens between accounts
   */
  async transferTokens(
    source: PublicKey,
    destination: PublicKey,
    authority: Keypair,
    amount: number
  ): Promise<string> {
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
      this.updateMetrics('transfer', source.toString());

      return signature;

    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Approve delegate for token account
   */
  async approveDelegate(
    account: PublicKey,
    delegate: PublicKey,
    owner: Keypair,
    amount: number
  ): Promise<string> {
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
      this.updateMetrics('approve', account.toString());

      return signature;

    } catch (error) {
      console.error('Error approving delegate:', error);
      throw error;
    }
  }

  /**
   * Revoke delegate for token account
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
      this.updateMetrics('revoke', account.toString());

      return signature;

    } catch (error) {
      console.error('Error revoking delegate:', error);
      throw error;
    }
  }

  /**
   * Burn tokens from an account
   */
  async burnTokens(
    account: PublicKey,
    mint: PublicKey,
    authority: Keypair,
    amount: number
  ): Promise<string> {
    try {
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        account,
        mint,
        authority.publicKey,
        amount,
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
      this.updateMetrics('burn', account.toString());

      return signature;

    } catch (error) {
      console.error('Error burning tokens:', error);
      throw error;
    }
  }

  /**
   * Close a token account
   */
  async closeTokenAccount(
    account: PublicKey,
    destination: PublicKey,
    authority: Keypair
  ): Promise<string> {
    try {
      // Create close instruction
      const closeInstruction = createCloseAccountInstruction(
        account,
        destination,
        authority.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(closeInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('close', account.toString());

      return signature;

    } catch (error) {
      console.error('Error closing token account:', error);
      throw error;
    }
  }

  /**
   * Freeze a token account
   */
  async freezeAccount(
    account: PublicKey,
    mint: PublicKey,
    freezeAuthority: Keypair
  ): Promise<string> {
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
      this.updateMetrics('freeze', account.toString());

      return signature;

    } catch (error) {
      console.error('Error freezing account:', error);
      throw error;
    }
  }

  /**
   * Thaw a frozen token account
   */
  async thawAccount(
    account: PublicKey,
    mint: PublicKey,
    freezeAuthority: Keypair
  ): Promise<string> {
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
      this.updateMetrics('thaw', account.toString());

      return signature;

    } catch (error) {
      console.error('Error thawing account:', error);
      throw error;
    }
  }

  /**
   * Set authority for mint or account
   */
  async setAuthority(
    account: PublicKey,
    currentAuthority: Keypair,
    newAuthority: PublicKey | null,
    authorityType: AuthorityType
  ): Promise<string> {
    try {
      // Create set authority instruction
      const setAuthorityInstruction = createSetAuthorityInstruction(
        account,
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
      this.updateMetrics('setAuthority', account.toString());

      return signature;

    } catch (error) {
      console.error('Error setting authority:', error);
      throw error;
    }
  }

  /**
   * Sync native SOL to wrapped SOL
   */
  async syncNative(account: PublicKey, authority: Keypair): Promise<string> {
    try {
      // Create sync native instruction
      const syncNativeInstruction = createSyncNativeInstruction(account, TOKEN_PROGRAM_ID);

      // Create transaction
      const transaction = new Transaction().add(syncNativeInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = authority.publicKey;

      // Sign and send transaction
      transaction.sign(authority);
      const signature = await this.connection.sendTransaction(transaction, [authority]);
      await this.connection.confirmTransaction(signature);

      // Update metrics
      this.updateMetrics('syncNative', account.toString());

      return signature;

    } catch (error) {
      console.error('Error syncing native:', error);
      throw error;
    }
  }

  /**
   * Get token account information
   */
  async getTokenAccount(account: PublicKey): Promise<TokenAccount | null> {
    try {
      const accountInfo = await getAccount(this.connection, account);
      
      return {
        address: account,
        mint: accountInfo.mint,
        owner: accountInfo.owner,
        amount: accountInfo.amount,
        delegate: accountInfo.delegate,
        state: accountInfo.state,
        isNative: accountInfo.isNative,
        delegatedAmount: accountInfo.delegatedAmount,
        closeAuthority: accountInfo.closeAuthority
      };
    } catch (error) {
      console.error('Error getting token account:', error);
      return null;
    }
  }

  /**
   * Get mint information
   */
  async getMintInfo(mint: PublicKey): Promise<TokenMint | null> {
    try {
      const mintInfo = await getMint(this.connection, mint);
      
      return {
        address: mint,
        mintAuthority: mintInfo.mintAuthority,
        freezeAuthority: mintInfo.freezeAuthority,
        supply: mintInfo.supply,
        decimals: mintInfo.decimals,
        isInitialized: mintInfo.isInitialized
      };
    } catch (error) {
      console.error('Error getting mint info:', error);
      return null;
    }
  }

  /**
   * Get associated token address
   */
  async getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey
  ): Promise<PublicKey> {
    return await getAssociatedTokenAddress(mint, owner, false, TOKEN_PROGRAM_ID);
  }

  /**
   * Check if associated token account exists
   */
  async associatedTokenAccountExists(
    mint: PublicKey,
    owner: PublicKey
  ): Promise<boolean> {
    try {
      const ata = await this.getAssociatedTokenAddress(mint, owner);
      const accountInfo = await this.connection.getAccountInfo(ata);
      return accountInfo !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get token metrics
   */
  getMetrics(): TokenMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalMints: 0,
      totalAccounts: 0,
      totalSupply: 0n,
      averageBalance: 0n,
      mostUsedMints: {},
      operationCounts: {}
    };
  }

  /**
   * Update metrics
   */
  private updateMetrics(operation: string, account: string): void {
    this.metrics.operationCounts[operation] = (this.metrics.operationCounts[operation] || 0) + 1;
    this.metrics.mostUsedMints[account] = (this.metrics.mostUsedMints[account] || 0) + 1;
  }
}

// Utility functions for SPL Token management
export const SPLTokenUtils = {
  /**
   * Format token amount with decimals
   */
  formatTokenAmount: (amount: bigint, decimals: number): string => {
    const divisor = BigInt(10 ** decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;
    
    if (fractionalPart === 0n) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    return `${wholePart}.${fractionalStr}`;
  },

  /**
   * Parse token amount from string
   */
  parseTokenAmount: (amount: string, decimals: number): bigint => {
    const [whole, fractional = ''] = amount.split('.');
    const wholePart = BigInt(whole);
    const fractionalPart = BigInt(fractional.padEnd(decimals, '0').slice(0, decimals));
    const divisor = BigInt(10 ** decimals);
    
    return wholePart * divisor + fractionalPart;
  },

  /**
   * Get token program ID
   */
  getTokenProgramId: (): PublicKey => TOKEN_PROGRAM_ID,

  /**
   * Get associated token program ID
   */
  getAssociatedTokenProgramId: (): PublicKey => ASSOCIATED_TOKEN_PROGRAM_ID,

  /**
   * Validate token account
   */
  validateTokenAccount: (account: TokenAccount): boolean => {
    return account.mint !== null && 
           account.owner !== null && 
           account.amount >= 0n;
  },

  /**
   * Validate mint account
   */
  validateMintAccount: (mint: TokenMint): boolean => {
    return mint.address !== null && 
           mint.decimals >= 0 && 
           mint.supply >= 0n;
  }
};
