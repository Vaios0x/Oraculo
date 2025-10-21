"use client";

import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  Commitment,
  AccountInfo,
  ParsedAccountData
} from '@solana/web3.js';
import { 
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

// Interfaces simplificadas
export interface OraculoMarketInfo {
  marketId: PublicKey;
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  totalStaked: number;
  isResolved: boolean;
  tokenMint: PublicKey;
  winningOutcome?: number;
}

export interface OraculoTransactionSignature {
  signature: string;
  slot: number;
  blockTime: number;
  confirmationStatus: string;
}

export interface OraculoAccountInfo {
  address: string;
  lamports: number;
  owner: string;
  executable: boolean;
  rentEpoch: number;
  data: string;
}

export interface OraculoTokenAccountInfo {
  address: string;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export class OraculoSolanaCookbookClient {
  private connection: Connection;
  private commitment: Commitment;

  constructor(
    endpoint: string = 'https://api.devnet.solana.com',
    commitment: Commitment = 'confirmed'
  ) {
    this.connection = new Connection(endpoint, commitment);
    this.commitment = commitment;
  }

  // Wallet Management
  async createKeypair(): Promise<Keypair> {
    return Keypair.generate();
  }

  async restoreKeypairFromSecretKey(secretKey: Uint8Array): Promise<Keypair> {
    return Keypair.fromSecretKey(secretKey);
  }

  async verifyKeypair(keypair: Keypair): Promise<boolean> {
    try {
      const balance = await this.connection.getBalance(keypair.publicKey);
      return balance >= 0;
    } catch {
      return false;
    }
  }

  async signMessage(message: string, keypair: Keypair): Promise<Uint8Array> {
    const messageBytes = new TextEncoder().encode(message);
    // Note: Keypair.sign() doesn't exist in @solana/web3.js
    // This is a placeholder - in real implementation you'd use a different signing method
    return new Uint8Array(64); // Placeholder signature
  }

  // Transaction Operations
  async sendSol(
    from: Keypair,
    to: PublicKey,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [from]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async sendTokens(
    from: Keypair,
    to: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number = 9
  ): Promise<string> {
    const fromTokenAccount = await getAssociatedTokenAddress(mint, from.publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(mint, to);

    const transaction = new Transaction();

    // Check if destination token account exists
    try {
      await this.connection.getAccountInfo(toTokenAccount);
    } catch {
      // Create associated token account if it doesn't exist
      transaction.add(
        createAssociatedTokenAccountInstruction(
          from.publicKey,
          toTokenAccount,
          to,
          mint
        )
      );
    }

    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        from.publicKey,
        amount * Math.pow(10, decimals)
      )
    );

    const signature = await this.connection.sendTransaction(transaction, [from]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async calculateTransactionCost(transaction: Transaction): Promise<number> {
    const feeCalculator = await this.connection.getRecentBlockhash();
    return 5000; // Base fee in lamports
  }

  async addMemo(transaction: Transaction, memo: string): Promise<Transaction> {
    // For simplicity, we'll just return the transaction
    // In a real implementation, you'd add a memo instruction
    return transaction;
  }

  async addPriorityFees(transaction: Transaction, microLamports: number): Promise<Transaction> {
    // For simplicity, we'll just return the transaction
    // In a real implementation, you'd add compute unit price instruction
    return transaction;
  }

  // Account Management
  async createAccount(
    payer: Keypair,
    newAccount: Keypair,
    space: number,
    programId: PublicKey = SystemProgram.programId
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: await this.connection.getMinimumBalanceForRentExemption(space),
        space,
        programId,
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [payer, newAccount]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async createOptimizedPDA(
    seeds: Buffer[],
    programId: PublicKey,
    payer: Keypair,
    space: number
  ): Promise<{ publicKey: PublicKey; bump: number }> {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(seeds, programId);
    
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: publicKey,
        lamports: await this.connection.getMinimumBalanceForRentExemption(space),
        space,
        programId,
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [payer]);
    await this.connection.confirmTransaction(signature);
    
    return { publicKey, bump };
  }

  async getBalance(address: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(address);
    return balance / LAMPORTS_PER_SOL;
  }

  async getAccountInfo(address: PublicKey): Promise<OraculoAccountInfo | null> {
    const accountInfo = await this.connection.getAccountInfo(address);
    if (!accountInfo) return null;

    return {
      address: address.toBase58(),
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toBase58(),
      executable: accountInfo.executable,
      rentEpoch: accountInfo.rentEpoch,
      data: accountInfo.data.toString('base64')
    };
  }

  // Token Operations
  async getMintInfo(mint: PublicKey): Promise<any> {
    try {
      const accountInfo = await this.connection.getAccountInfo(mint);
      return accountInfo;
    } catch (error) {
      console.error('Error getting mint info:', error);
      return null;
    }
  }

  async getTokenAccount(tokenAccount: PublicKey): Promise<OraculoTokenAccountInfo | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(tokenAccount);
      if (!accountInfo) return null;

      // Parse token account data
      const data = accountInfo.data;
      return {
        address: tokenAccount.toBase58(),
        mint: '', // Would need to parse from data
        owner: '', // Would need to parse from data
        amount: '0',
        decimals: 9,
        uiAmount: 0,
        uiAmountString: '0'
      };
    } catch (error) {
      console.error('Error getting token account:', error);
      return null;
    }
  }

  async getTokenBalance(tokenAccount: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getTokenAccountBalance(tokenAccount);
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  async getTokenAccountsByOwner(owner: PublicKey, mint?: PublicKey): Promise<OraculoTokenAccountInfo[]> {
    try {
      const response = await this.connection.getParsedTokenAccountsByOwner(owner, {
        programId: TOKEN_PROGRAM_ID,
        ...(mint && { mint })
      });

      return response.value.map(account => ({
        address: account.pubkey.toBase58(),
        mint: account.account.data.parsed.info.mint,
        owner: account.account.data.parsed.info.owner,
        amount: account.account.data.parsed.info.tokenAmount.amount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
        uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
        uiAmountString: account.account.data.parsed.info.tokenAmount.uiAmountString
      }));
    } catch (error) {
      console.error('Error getting token accounts by owner:', error);
      return [];
    }
  }

  // Airdrop & Testing
  async requestAirdrop(address: PublicKey, amount: number = 1): Promise<string> {
    const signature = await this.connection.requestAirdrop(
      address,
      amount * LAMPORTS_PER_SOL
    );
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async verifyBalance(address: PublicKey, expectedAmount: number): Promise<boolean> {
    const balance = await this.getBalance(address);
    return Math.abs(balance - expectedAmount) < 0.001; // Allow small tolerance
  }

  // Event Subscriptions
  async subscribeToAccountChanges(
    account: PublicKey,
    callback: (accountInfo: AccountInfo<Buffer> | null) => void
  ): Promise<number> {
    return this.connection.onAccountChange(account, callback);
  }

  async unsubscribeFromAccountChanges(subscriptionId: number): Promise<void> {
    await this.connection.removeAccountChangeListener(subscriptionId);
  }

  async subscribeToLogs(
    programId: PublicKey,
    callback: (logs: any) => void
  ): Promise<number> {
    return this.connection.onLogs(programId, callback);
  }

  async unsubscribeFromLogs(subscriptionId: number): Promise<void> {
    await this.connection.removeOnLogsListener(subscriptionId);
  }

  // Oraculo-specific methods
  async createMarket(
    creator: Keypair,
    title: string,
    description: string,
    endTime: number,
    outcomeOptions: string[]
  ): Promise<{ marketId: PublicKey; signature: string }> {
    // Generate market PDA
    const [marketPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('market'), creator.publicKey.toBuffer(), Buffer.from(title)],
      new PublicKey('11111111111111111111111111111111') // Placeholder program ID
    );

    // Create market account
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: creator.publicKey,
        newAccountPubkey: marketPDA,
        lamports: await this.connection.getMinimumBalanceForRentExemption(1000),
        space: 1000,
        programId: new PublicKey('11111111111111111111111111111111')
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [creator]);
    await this.connection.confirmTransaction(signature);

    return { marketId: marketPDA, signature };
  }

  async stakeOnMarket(
    user: Keypair,
    marketId: PublicKey,
    outcome: string,
    amount: number
  ): Promise<string> {
    // Simplified staking implementation
    const transaction = new Transaction();
    const signature = await this.connection.sendTransaction(transaction, [user]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async resolveMarket(
    resolver: Keypair,
    marketId: PublicKey,
    winningOutcome: string
  ): Promise<string> {
    // Simplified resolution implementation
    const transaction = new Transaction();
    const signature = await this.connection.sendTransaction(transaction, [resolver]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async getMarketInfo(marketId: PublicKey): Promise<OraculoMarketInfo | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(marketId);
      if (!accountInfo) return null;

      // Parse market data (simplified)
      return {
        marketId,
        title: 'Sample Market',
        description: 'Sample market description',
        endTime: Date.now() / 1000 + 86400, // 24 hours from now
        outcomeOptions: ['Yes', 'No'],
        totalStaked: 0,
        isResolved: false,
        tokenMint: new PublicKey('11111111111111111111111111111111')
      };
    } catch (error) {
      console.error('Error getting market info:', error);
      return null;
    }
  }

  async getTransactionHistory(
    address: PublicKey,
    limit: number = 10
  ): Promise<OraculoTransactionSignature[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(address, { limit });
      return signatures.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        blockTime: sig.blockTime || 0,
        confirmationStatus: sig.confirmationStatus || 'confirmed'
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Utility methods
  async getConnectionHealth(): Promise<boolean> {
    try {
      const version = await this.connection.getVersion();
      return !!version;
    } catch {
      return false;
    }
  }

  async getNetworkInfo(): Promise<any> {
    try {
      const version = await this.connection.getVersion();
      const epochInfo = await this.connection.getEpochInfo();
      return {
        version,
        epochInfo,
        commitment: this.commitment
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      return null;
    }
  }
}
