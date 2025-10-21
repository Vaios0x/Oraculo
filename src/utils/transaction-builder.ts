// Advanced Transaction Builder
// ============================
// Utilities for building complex transactions with proper structure

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  AccountMeta
} from "@solana/web3.js";

export interface TransactionBuilderOptions {
  connection: Connection;
  feePayer: Keypair;
  recentBlockhash?: string;
}

export interface InstructionBuilder {
  programId: PublicKey;
  accounts: AccountMeta[];
  data: Buffer;
}

export class AdvancedTransactionBuilder {
  private connection: Connection;
  private feePayer: Keypair;
  private recentBlockhash?: string;
  private instructions: TransactionInstruction[] = [];
  private signers: Keypair[] = [];

  constructor(options: TransactionBuilderOptions) {
    this.connection = options.connection;
    this.feePayer = options.feePayer;
    this.recentBlockhash = options.recentBlockhash;
    this.signers.push(options.feePayer);
  }

  /**
   * Add an instruction to the transaction
   */
  addInstruction(instruction: TransactionInstruction): this {
    this.instructions.push(instruction);
    return this;
  }

  /**
   * Add a signer to the transaction
   */
  addSigner(signer: Keypair): this {
    this.signers.push(signer);
    return this;
  }

  /**
   * Build the transaction
   */
  async build(): Promise<Transaction> {
    const transaction = new Transaction();

    // Add all instructions
    this.instructions.forEach(instruction => {
      transaction.add(instruction);
    });

    // Set recent blockhash if not provided
    if (!this.recentBlockhash) {
      const { blockhash } = await this.connection.getLatestBlockhash();
      this.recentBlockhash = blockhash;
    }

    transaction.recentBlockhash = this.recentBlockhash;
    transaction.feePayer = this.feePayer.publicKey;

    return transaction;
  }

  /**
   * Send and confirm the transaction
   */
  async sendAndConfirm(): Promise<string> {
    const transaction = await this.build();
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      this.signers
    );
  }

  /**
   * Analyze transaction structure
   */
  async analyzeTransaction(): Promise<TransactionAnalysis> {
    const transaction = await this.build();
    
    const analysis: TransactionAnalysis = {
      totalSize: this.calculateTransactionSize(transaction),
      instructionCount: this.instructions.length,
      signerCount: this.signers.length,
      accountCount: this.getUniqueAccountCount(),
      isWithinSizeLimit: this.calculateTransactionSize(transaction) <= 1232,
      accounts: this.getAccountAnalysis(),
      instructions: this.getInstructionAnalysis()
    };

    return analysis;
  }

  /**
   * Calculate transaction size
   */
  private calculateTransactionSize(transaction: Transaction): number {
    // Signatures: 64 bytes each
    const signatureSize = this.signers.length * 64;
    
    // Message header: 3 bytes
    const headerSize = 3;
    
    // Account keys: 32 bytes each
    const accountKeys = this.getUniqueAccounts();
    const accountKeysSize = accountKeys.length * 32;
    
    // Recent blockhash: 32 bytes
    const blockhashSize = 32;
    
    // Instructions: variable size
    const instructionSize = this.calculateInstructionSize();
    
    return signatureSize + headerSize + accountKeysSize + blockhashSize + instructionSize;
  }

  /**
   * Get unique accounts from all instructions
   */
  private getUniqueAccounts(): PublicKey[] {
    const accounts = new Set<string>();
    
    // Add fee payer
    accounts.add(this.feePayer.publicKey.toString());
    
    // Add accounts from instructions
    this.instructions.forEach(instruction => {
      instruction.keys.forEach(account => {
        accounts.add(account.pubkey.toString());
      });
      accounts.add(instruction.programId.toString());
    });
    
    return Array.from(accounts).map(addr => new PublicKey(addr));
  }

  /**
   * Get unique account count
   */
  private getUniqueAccountCount(): number {
    return this.getUniqueAccounts().length;
  }

  /**
   * Calculate instruction size
   */
  private calculateInstructionSize(): number {
    let totalSize = 0;
    
    // Compact array length for instructions
    totalSize += this.getCompactU16Size(this.instructions.length);
    
    this.instructions.forEach(instruction => {
      // Program ID index (1 byte)
      totalSize += 1;
      
      // Account indices compact array
      totalSize += this.getCompactU16Size(instruction.keys.length);
      totalSize += instruction.keys.length;
      
      // Instruction data compact array
      totalSize += this.getCompactU16Size(instruction.data.length);
      totalSize += instruction.data.length;
    });
    
    return totalSize;
  }

  /**
   * Get compact-u16 size
   */
  private getCompactU16Size(value: number): number {
    if (value < 128) return 1;
    if (value < 16384) return 2;
    return 3;
  }

  /**
   * Get account analysis
   */
  private getAccountAnalysis(): AccountAnalysis[] {
    const accounts = this.getUniqueAccounts();
    const analysis: AccountAnalysis[] = [];
    
    accounts.forEach(account => {
      const isSigner = this.signers.some(signer => signer.publicKey.equals(account));
      const isWritable = this.isAccountWritable(account);
      
      analysis.push({
        pubkey: account,
        isSigner,
        isWritable,
        role: this.getAccountRole(account, isSigner, isWritable)
      });
    });
    
    return analysis;
  }

  /**
   * Check if account is writable
   */
  private isAccountWritable(account: PublicKey): boolean {
    // Fee payer is always writable
    if (account.equals(this.feePayer.publicKey)) return true;
    
    // Check instruction accounts
    for (const instruction of this.instructions) {
      for (const key of instruction.keys) {
        if (key.pubkey.equals(account) && key.isWritable) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get account role
   */
  private getAccountRole(account: PublicKey, isSigner: boolean, isWritable: boolean): string {
    if (isSigner && isWritable) return "Writable Signer";
    if (isSigner && !isWritable) return "Read-only Signer";
    if (!isSigner && isWritable) return "Writable Non-signer";
    return "Read-only Non-signer";
  }

  /**
   * Get instruction analysis
   */
  private getInstructionAnalysis(): InstructionAnalysis[] {
    return this.instructions.map((instruction, index) => ({
      index,
      programId: instruction.programId,
      accountCount: instruction.keys.length,
      dataSize: instruction.data.length,
      accounts: instruction.keys.map(key => ({
        pubkey: key.pubkey,
        isSigner: key.isSigner,
        isWritable: key.isWritable
      }))
    }));
  }
}

// Utility functions for transaction building
export const TransactionBuilderUtils = {
  /**
   * Create a SOL transfer instruction
   */
  createTransferInstruction: (
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): TransactionInstruction => {
    return SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount
    });
  },

  /**
   * Create a create account instruction
   */
  createCreateAccountInstruction: (
    from: PublicKey,
    newAccount: PublicKey,
    space: number,
    programId: PublicKey,
    lamports: number
  ): TransactionInstruction => {
    return SystemProgram.createAccount({
      fromPubkey: from,
      newAccountPubkey: newAccount,
      space,
      lamports,
      programId
    });
  },

  /**
   * Create a custom instruction
   */
  createCustomInstruction: (
    programId: PublicKey,
    accounts: AccountMeta[],
    data: Buffer
  ): TransactionInstruction => {
    return new TransactionInstruction({
      programId,
      keys: accounts,
      data
    });
  },

  /**
   * Validate transaction size
   */
  validateTransactionSize: (transaction: Transaction): boolean => {
    // This is a simplified validation
    // In practice, you'd need to serialize the transaction to get exact size
    return true; // Placeholder
  },

  /**
   * Get transaction fee estimate
   */
  getTransactionFee: (signatureCount: number): number => {
    return signatureCount * 5000; // Base fee per signature
  }
};

// Type definitions
export interface TransactionAnalysis {
  totalSize: number;
  instructionCount: number;
  signerCount: number;
  accountCount: number;
  isWithinSizeLimit: boolean;
  accounts: AccountAnalysis[];
  instructions: InstructionAnalysis[];
}

export interface AccountAnalysis {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
  role: string;
}

export interface InstructionAnalysis {
  index: number;
  programId: PublicKey;
  accountCount: number;
  dataSize: number;
  accounts: {
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }[];
}
