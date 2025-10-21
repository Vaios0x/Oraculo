// Solana Account Utilities
// ========================
// Utilities for reading and managing Solana accounts

import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import { getMint, Mint } from "@solana/spl-token";

export interface SolanaAccount {
  data: Buffer;
  executable: boolean;
  lamports: number;
  owner: PublicKey;
  rentEpoch: number;
  space?: number;
}

export class SolanaAccountManager {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Fetch wallet account information
   * @param publicKey - The wallet's public key
   * @returns Account information
   */
  async fetchWalletAccount(publicKey: PublicKey): Promise<SolanaAccount | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      if (!accountInfo) return null;

      return {
        data: accountInfo.data,
        executable: accountInfo.executable,
        lamports: accountInfo.lamports,
        owner: accountInfo.owner,
        rentEpoch: accountInfo.rentEpoch,
        space: accountInfo.data.length
      };
    } catch (error) {
      console.error("Error fetching wallet account:", error);
      return null;
    }
  }

  /**
   * Fetch program account information
   * @param programId - The program's public key
   * @returns Program account information
   */
  async fetchProgramAccount(programId: PublicKey): Promise<SolanaAccount | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(programId);
      if (!accountInfo) return null;

      return {
        data: accountInfo.data,
        executable: accountInfo.executable,
        lamports: accountInfo.lamports,
        owner: accountInfo.owner,
        rentEpoch: accountInfo.rentEpoch,
        space: accountInfo.data.length
      };
    } catch (error) {
      console.error("Error fetching program account:", error);
      return null;
    }
  }

  /**
   * Fetch and deserialize mint account
   * @param mintAddress - The mint account's public key
   * @returns Deserialized mint data
   */
  async fetchMintAccount(mintAddress: PublicKey): Promise<Mint | null> {
    try {
      const mintData = await getMint(this.connection, mintAddress, "confirmed");
      return mintData;
    } catch (error) {
      console.error("Error fetching mint account:", error);
      return null;
    }
  }

  /**
   * Check if account is a wallet (System Program owned)
   * @param account - Account information
   * @returns True if account is a wallet
   */
  isWalletAccount(account: SolanaAccount): boolean {
    const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
    return account.owner.equals(SYSTEM_PROGRAM_ID) && !account.executable;
  }

  /**
   * Check if account is a program
   * @param account - Account information
   * @returns True if account is executable
   */
  isProgramAccount(account: SolanaAccount): boolean {
    return account.executable;
  }

  /**
   * Get account balance in SOL
   * @param account - Account information
   * @returns Balance in SOL
   */
  getAccountBalanceSOL(account: SolanaAccount): number {
    return account.lamports / 1_000_000_000; // Convert lamports to SOL
  }

  /**
   * Format account data for display
   * @param account - Account information
   * @returns Formatted account data
   */
  formatAccountData(account: SolanaAccount): any {
    return {
      owner: account.owner.toString(),
      executable: account.executable,
      lamports: account.lamports,
      balanceSOL: this.getAccountBalanceSOL(account),
      rentEpoch: account.rentEpoch,
      space: account.space,
      dataLength: account.data.length,
      isWallet: this.isWalletAccount(account),
      isProgram: this.isProgramAccount(account)
    };
  }
}

// Common Solana Program IDs
export const COMMON_PROGRAM_IDS = {
  SYSTEM_PROGRAM: new PublicKey("11111111111111111111111111111111"),
  TOKEN_PROGRAM: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  TOKEN_2022_PROGRAM: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
  ASSOCIATED_TOKEN_PROGRAM: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
  RENT_PROGRAM: new PublicKey("SysvarRent111111111111111111111111111111111"),
  CLOCK_PROGRAM: new PublicKey("SysvarC1ock11111111111111111111111111111111")
};

// Utility functions for common operations
export const AccountUtils = {
  /**
   * Create connection to Solana network
   */
  createConnection: (endpoint: string = "https://api.devnet.solana.com") => {
    return new Connection(endpoint, "confirmed");
  },

  /**
   * Validate public key
   */
  isValidPublicKey: (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Convert lamports to SOL
   */
  lamportsToSOL: (lamports: number): number => {
    return lamports / 1_000_000_000;
  },

  /**
   * Convert SOL to lamports
   */
  solToLamports: (sol: number): number => {
    return Math.floor(sol * 1_000_000_000);
  }
};
