// Solana Transaction Utilities
// ============================
// Utilities for building and sending transactions to Solana network

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  SystemProgram,
  ComputeBudgetProgram
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  createMintToInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export interface TransferParams {
  from: PublicKey;
  to: PublicKey;
  amount: number; // in SOL
  signer: Keypair;
}

export interface CreateTokenParams {
  wallet: Keypair;
  decimals: number;
  mintAuthority?: PublicKey;
  freezeAuthority?: PublicKey;
}

export class SolanaTransactionManager {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Transfer SOL between accounts
   * @param params - Transfer parameters
   * @returns Transaction result
   */
  async transferSOL(params: TransferParams): Promise<TransactionResult> {
    try {
      const { from, to, amount, signer } = params;
      
      // Create transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL)
      });

      // Create and send transaction
      const transaction = new Transaction().add(transferInstruction);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [signer]
      );

      return {
        signature,
        success: true
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Create a new token (mint account)
   * @param params - Token creation parameters
   * @returns Transaction result with mint address
   */
  async createToken(params: CreateTokenParams): Promise<TransactionResult & { mintAddress?: PublicKey }> {
    try {
      const { wallet, decimals, mintAuthority, freezeAuthority } = params;
      
      // Generate mint keypair
      const mint = Keypair.generate();
      
      // Calculate rent exemption
      const rentExemptionLamports = await getMinimumBalanceForRentExemptMint(this.connection);
      
      // Create account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: rentExemptionLamports,
        programId: TOKEN_2022_PROGRAM_ID
      });

      // Initialize mint instruction
      const initializeMintInstruction = createInitializeMint2Instruction(
        mint.publicKey,
        decimals,
        mintAuthority || wallet.publicKey,
        freezeAuthority || wallet.publicKey,
        TOKEN_2022_PROGRAM_ID
      );

      // Build transaction
      const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMintInstruction
      );

      // Send transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [wallet, mint]
      );

      return {
        signature,
        success: true,
        mintAddress: mint.publicKey
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Mint tokens to a specific account
   * @param mintAddress - Token mint address
   * @param destination - Destination token account
   * @param amount - Amount to mint
   * @param authority - Mint authority keypair
   * @returns Transaction result
   */
  async mintTokens(
    mintAddress: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: Keypair
  ): Promise<TransactionResult> {
    try {
      const mintInstruction = createMintToInstruction(
        mintAddress,
        destination,
        authority.publicKey,
        amount
      );

      const transaction = new Transaction().add(mintInstruction);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [authority]
      );

      return {
        signature,
        success: true
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Transfer tokens between accounts
   * @param source - Source token account
   * @param destination - Destination token account
   * @param amount - Amount to transfer
   * @param authority - Token account authority
   * @returns Transaction result
   */
  async transferTokens(
    source: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: Keypair
  ): Promise<TransactionResult> {
    try {
      const transferInstruction = createTransferInstruction(
        source,
        destination,
        authority.publicKey,
        amount
      );

      const transaction = new Transaction().add(transferInstruction);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [authority]
      );

      return {
        signature,
        success: true
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Create associated token account
   * @param wallet - Wallet to create account for
   * @param mintAddress - Token mint address
   * @param payer - Account to pay for creation
   * @returns Transaction result
   */
  async createAssociatedTokenAccount(
    wallet: PublicKey,
    mintAddress: PublicKey,
    payer: Keypair
  ): Promise<TransactionResult> {
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintAddress,
        wallet,
        true,
        TOKEN_2022_PROGRAM_ID
      );

      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        payer.publicKey,
        associatedTokenAddress,
        wallet,
        mintAddress,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = new Transaction().add(createAccountInstruction);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer]
      );

      return {
        signature,
        success: true
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Build custom transaction with multiple instructions
   * @param instructions - Array of instructions
   * @param signers - Array of signers
   * @param computeUnits - Optional compute units limit
   * @returns Transaction result
   */
  async sendCustomTransaction(
    instructions: TransactionInstruction[],
    signers: Keypair[],
    computeUnits?: number
  ): Promise<TransactionResult> {
    try {
      const transaction = new Transaction();

      // Add compute budget instruction if specified
      if (computeUnits) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits })
        );
      }

      // Add all instructions
      instructions.forEach(instruction => {
        transaction.add(instruction);
      });

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        signers
      );

      return {
        signature,
        success: true
      };
    } catch (error) {
      return {
        signature: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Get transaction details
   * @param signature - Transaction signature
   * @returns Transaction details
   */
  async getTransactionDetails(signature: string) {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: "confirmed"
      });
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }

  /**
   * Check if transaction was successful
   * @param signature - Transaction signature
   * @returns Success status
   */
  async isTransactionSuccessful(signature: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction?.meta?.err === null;
    } catch (error) {
      return false;
    }
  }
}

// Utility functions for common operations
export const TransactionUtils = {
  /**
   * Convert SOL to lamports
   */
  solToLamports: (sol: number): number => {
    return Math.floor(sol * LAMPORTS_PER_SOL);
  },

  /**
   * Convert lamports to SOL
   */
  lamportsToSol: (lamports: number): number => {
    return lamports / LAMPORTS_PER_SOL;
  },

  /**
   * Calculate transaction fee
   */
  getTransactionFee: (): number => {
    return 5000; // Base fee in lamports
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
   * Generate keypair
   */
  generateKeypair: (): Keypair => {
    return Keypair.generate();
  },

  /**
   * Get account balance
   */
  getAccountBalance: async (connection: Connection, publicKey: PublicKey): Promise<number> => {
    try {
      const balance = await connection.getBalance(publicKey);
      return TransactionUtils.lamportsToSol(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  }
};
