// CPI Manager Utilities
// =====================
// Utilities for managing Cross Program Invocations

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

export interface CPICall {
  programId: PublicKey;
  accounts: PublicKey[];
  data: Buffer;
  signers: PublicKey[];
  pdaSeeds?: Buffer[][];
}

export interface CPIResult {
  success: boolean;
  signature?: string;
  error?: string;
  computeUnitsUsed?: number;
  accountsModified?: PublicKey[];
}

export interface CPIPattern {
  name: string;
  description: string;
  programId: PublicKey;
  instruction: string;
  accounts: string[];
  data: any;
  example: string;
  useCase: string;
}

export interface CPIMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageExecutionTime: number;
  totalComputeUnits: number;
  mostUsedPrograms: { [programId: string]: number };
  errorRates: { [error: string]: number };
}

export class CPIManager {
  private connection: Connection;
  private cache: Map<string, any> = new Map();
  private metrics: CPIMetrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageExecutionTime: 0,
    totalComputeUnits: 0,
    mostUsedPrograms: {},
    errorRates: {}
  };
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Execute a CPI call
   */
  async executeCPI(
    cpiCall: CPICall,
    payer: Keypair,
    recentBlockhash?: string
  ): Promise<CPIResult> {
    const startTime = Date.now();
    
    try {
      // Create instruction
      const instruction = new TransactionInstruction({
        programId: cpiCall.programId,
        keys: cpiCall.accounts.map(account => ({
          pubkey: account,
          isSigner: cpiCall.signers.includes(account),
          isWritable: true // Simplified for example
        })),
        data: cpiCall.data
      });

      // Create transaction
      const transaction = new Transaction();
      transaction.add(instruction);

      // Set recent blockhash
      if (recentBlockhash) {
        transaction.recentBlockhash = recentBlockhash;
      } else {
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
      }

      // Set fee payer
      transaction.feePayer = payer.publicKey;

      // Sign transaction
      transaction.sign(payer);

      // Send transaction
      const signature = await this.connection.sendTransaction(transaction, [payer]);
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      // Update metrics
      this.updateMetrics(true, Date.now() - startTime, 0);

      return {
        success: true,
        signature,
        computeUnitsUsed: 0 // Would be extracted from transaction logs
      };

    } catch (error) {
      // Update metrics
      this.updateMetrics(false, Date.now() - startTime, 0);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Execute multiple CPI calls in batch
   */
  async executeBatchCPI(
    cpiCalls: CPICall[],
    payer: Keypair,
    recentBlockhash?: string
  ): Promise<CPIResult[]> {
    const results: CPIResult[] = [];
    
    try {
      // Create transaction with multiple instructions
      const transaction = new Transaction();
      
      for (const cpiCall of cpiCalls) {
        const instruction = new TransactionInstruction({
          programId: cpiCall.programId,
          keys: cpiCall.accounts.map(account => ({
            pubkey: account,
            isSigner: cpiCall.signers.includes(account),
            isWritable: true
          })),
          data: cpiCall.data
        });
        
        transaction.add(instruction);
      }

      // Set recent blockhash
      if (recentBlockhash) {
        transaction.recentBlockhash = recentBlockhash;
      } else {
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
      }

      // Set fee payer
      transaction.feePayer = payer.publicKey;

      // Sign transaction
      transaction.sign(payer);

      // Send transaction
      const signature = await this.connection.sendTransaction(transaction, [payer]);
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      // All CPIs succeeded
      for (let i = 0; i < cpiCalls.length; i++) {
        results.push({
          success: true,
          signature,
          computeUnitsUsed: 0
        });
      }

    } catch (error) {
      // All CPIs failed
      for (let i = 0; i < cpiCalls.length; i++) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Create CPI call for SOL transfer
   */
  createSOLTransferCPI(
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): CPICall {
    return {
      programId: SystemProgram.programId,
      accounts: [from, to],
      data: Buffer.from([2, 0, 0, 0, ...Buffer.from(amount.toString(16).padStart(16, '0'), 'hex')]),
      signers: [from]
    };
  }

  /**
   * Create CPI call for token transfer
   */
  createTokenTransferCPI(
    source: PublicKey,
    destination: PublicKey,
    authority: PublicKey,
    amount: number,
    tokenProgramId: PublicKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  ): CPICall {
    return {
      programId: tokenProgramId,
      accounts: [source, destination, authority],
      data: Buffer.from([3, ...Buffer.from(amount.toString(16).padStart(16, '0'), 'hex')]),
      signers: [authority]
    };
  }

  /**
   * Create CPI call with PDA signer
   */
  createPDACPICall(
    programId: PublicKey,
    accounts: PublicKey[],
    data: Buffer,
    pdaSeeds: Buffer[][],
    pdaBump: number
  ): CPICall {
    return {
      programId,
      accounts,
      data,
      signers: [],
      pdaSeeds: pdaSeeds.map(seeds => [...seeds, Buffer.from([pdaBump])])
    };
  }

  /**
   * Get common CPI patterns
   */
  getCommonPatterns(): CPIPattern[] {
    return [
      {
        name: "SOL Transfer",
        description: "Transfer SOL between accounts",
        programId: SystemProgram.programId,
        instruction: "transfer",
        accounts: ["from", "to"],
        data: { amount: "u64" },
        example: "SystemProgram.transfer({ from, to, lamports })",
        useCase: "Basic SOL transfers, payment processing"
      },
      {
        name: "Token Transfer",
        description: "Transfer SPL tokens between accounts",
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        instruction: "transfer",
        accounts: ["source", "destination", "authority"],
        data: { amount: "u64" },
        example: "TokenProgram.transfer({ source, destination, authority, amount })",
        useCase: "Token transfers, DeFi operations"
      },
      {
        name: "Account Creation",
        description: "Create new accounts",
        programId: SystemProgram.programId,
        instruction: "createAccount",
        accounts: ["payer", "newAccount", "owner"],
        data: { lamports: "u64", space: "u64" },
        example: "SystemProgram.createAccount({ from, to, lamports, space, programId })",
        useCase: "Account initialization, program deployment"
      },
      {
        name: "PDA Transfer",
        description: "Transfer from PDA account",
        programId: SystemProgram.programId,
        instruction: "transfer",
        accounts: ["pdaAccount", "recipient"],
        data: { amount: "u64" },
        example: "SystemProgram.transfer({ from: pda, to, lamports })",
        useCase: "Program-controlled transfers, automated payments"
      }
    ];
  }

  /**
   * Validate CPI call
   */
  validateCPICall(cpiCall: CPICall): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!cpiCall.programId) {
      errors.push('Program ID is required');
    }

    if (!cpiCall.accounts || cpiCall.accounts.length === 0) {
      errors.push('At least one account is required');
    }

    if (!cpiCall.data || cpiCall.data.length === 0) {
      errors.push('Instruction data is required');
    }

    if (cpiCall.signers && cpiCall.signers.length > 0) {
      const invalidSigners = cpiCall.signers.filter(signer => 
        !cpiCall.accounts.includes(signer)
      );
      if (invalidSigners.length > 0) {
        errors.push('All signers must be in the accounts list');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Analyze CPI performance
   */
  analyzeCPIPerformance(): {
    recommendations: string[];
    optimizations: {
      batchOperations: boolean;
      accountReuse: boolean;
      instructionOptimization: boolean;
      caching: boolean;
    };
  } {
    const recommendations: string[] = [];
    const optimizations = {
      batchOperations: false,
      accountReuse: false,
      instructionOptimization: false,
      caching: false
    };

    // Analyze metrics and provide recommendations
    if (this.metrics.totalCalls > 100) {
      recommendations.push('Consider batching CPI calls to reduce transaction count');
      optimizations.batchOperations = true;
    }

    if (this.metrics.averageExecutionTime > 1000) {
      recommendations.push('Optimize CPI execution time by reusing accounts');
      optimizations.accountReuse = true;
    }

    if (this.metrics.totalComputeUnits > 1000000) {
      recommendations.push('Optimize instruction data to reduce compute unit usage');
      optimizations.instructionOptimization = true;
    }

    if (this.metrics.failedCalls > this.metrics.totalCalls * 0.1) {
      recommendations.push('Implement caching to reduce failed CPI calls');
      optimizations.caching = true;
    }

    return { recommendations, optimizations };
  }

  /**
   * Get CPI metrics
   */
  getMetrics(): CPIMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageExecutionTime: 0,
      totalComputeUnits: 0,
      mostUsedPrograms: {},
      errorRates: {}
    };
  }

  /**
   * Update metrics
   */
  private updateMetrics(success: boolean, executionTime: number, computeUnits: number): void {
    this.metrics.totalCalls++;
    
    if (success) {
      this.metrics.successfulCalls++;
    } else {
      this.metrics.failedCalls++;
    }

    // Update average execution time
    this.metrics.averageExecutionTime = 
      (this.metrics.averageExecutionTime * (this.metrics.totalCalls - 1) + executionTime) / 
      this.metrics.totalCalls;

    this.metrics.totalComputeUnits += computeUnits;
  }

  /**
   * Monitor CPI calls
   */
  async monitorCPICalls(
    programId: PublicKey,
    duration: number = 60000 // 1 minute
  ): Promise<{
    totalCalls: number;
    successRate: number;
    averageTime: number;
    errors: string[];
  }> {
    const startTime = Date.now();
    const initialMetrics = { ...this.metrics };
    const errors: string[] = [];

    // Monitor for specified duration
    await new Promise(resolve => setTimeout(resolve, duration));

    const finalMetrics = this.metrics;
    const callsDuringPeriod = finalMetrics.totalCalls - initialMetrics.totalCalls;
    const successesDuringPeriod = finalMetrics.successfulCalls - initialMetrics.successfulCalls;
    const failuresDuringPeriod = finalMetrics.failedCalls - initialMetrics.failedCalls;

    return {
      totalCalls: callsDuringPeriod,
      successRate: callsDuringPeriod > 0 ? successesDuringPeriod / callsDuringPeriod : 0,
      averageTime: finalMetrics.averageExecutionTime,
      errors: errors
    };
  }
}

// Utility functions for CPI management
export const CPIUtils = {
  /**
   * Format CPI call for display
   */
  formatCPICall: (cpiCall: CPICall): string => {
    return `
Program ID: ${cpiCall.programId.toString()}
Accounts: ${cpiCall.accounts.map(acc => acc.toString()).join(', ')}
Data: ${cpiCall.data.toString('hex')}
Signers: ${cpiCall.signers.map(sig => sig.toString()).join(', ')}
PDA Seeds: ${cpiCall.pdaSeeds?.map(seeds => seeds.map(s => s.toString('hex')).join(', ')).join(' | ') || 'None'}
    `.trim();
  },

  /**
   * Create CPI instruction
   */
  createCPIInstruction: (cpiCall: CPICall): TransactionInstruction => {
    return new TransactionInstruction({
      programId: cpiCall.programId,
      keys: cpiCall.accounts.map(account => ({
        pubkey: account,
        isSigner: cpiCall.signers.includes(account),
        isWritable: true
      })),
      data: cpiCall.data
    });
  },

  /**
   * Validate CPI pattern
   */
  validateCPIPattern: (pattern: CPIPattern): boolean => {
    if (!pattern.name || !pattern.description) {
      return false;
    }
    
    if (!pattern.programId) {
      return false;
    }
    
    if (!pattern.accounts || pattern.accounts.length === 0) {
      return false;
    }
    
    return true;
  },

  /**
   * Get CPI pattern by name
   */
  getPatternByName: (patterns: CPIPattern[], name: string): CPIPattern | null => {
    return patterns.find(pattern => pattern.name === name) || null;
  },

  /**
   * Compare CPI calls
   */
  compareCPICalls: (cpi1: CPICall, cpi2: CPICall): {
    sameProgram: boolean;
    sameAccounts: boolean;
    sameData: boolean;
    sameSigners: boolean;
  } => {
    return {
      sameProgram: cpi1.programId.equals(cpi2.programId),
      sameAccounts: cpi1.accounts.length === cpi2.accounts.length &&
                   cpi1.accounts.every((acc, index) => acc.equals(cpi2.accounts[index])),
      sameData: cpi1.data.equals(cpi2.data),
      sameSigners: cpi1.signers.length === cpi2.signers.length &&
                  cpi1.signers.every((sig, index) => sig.equals(cpi2.signers[index]))
    };
  }
};
