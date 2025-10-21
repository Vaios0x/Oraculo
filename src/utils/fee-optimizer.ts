// Fee Optimizer Utilities
// =======================
// Utilities for optimizing transaction fees and compute units

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

export interface FeeRecommendation {
  cuLimit: number;
  cuPrice: number; // in micro-lamports
  estimatedFee: number; // in lamports
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NetworkConditions {
  congestion: 'low' | 'medium' | 'high' | 'extreme';
  averageFee: number;
  recommendedCuPrice: number;
  timestamp: number;
}

export class FeeOptimizer {
  private connection: Connection;
  private cache: Map<string, NetworkConditions> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Get fee recommendation based on network conditions
   */
  async getFeeRecommendation(
    cuLimit: number = 200_000,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<FeeRecommendation> {
    const networkConditions = await this.getNetworkConditions();
    
    const baseFee = 5000; // Base fee per signature
    const cuPrice = this.calculateCuPrice(networkConditions, priority);
    const priorityFee = cuLimit * cuPrice;
    const estimatedFee = baseFee + priorityFee;

    return {
      cuLimit,
      cuPrice,
      estimatedFee,
      priority
    };
  }

  /**
   * Get network conditions
   */
  async getNetworkConditions(): Promise<NetworkConditions> {
    const cacheKey = 'network_conditions';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached;
    }

    try {
      // Get recent blockhash to check network activity
      const { blockhash } = await this.connection.getLatestBlockhash();
      
      // Simulate a simple transaction to estimate fees
      const testKeypair = Keypair.generate();
      const testTransaction = new Transaction();
      
      // Add a simple transfer instruction
      testTransaction.add(
        SystemProgram.transfer({
          fromPubkey: testKeypair.publicKey,
          toPubkey: testKeypair.publicKey,
          lamports: 1
        })
      );

      // Estimate compute units
      const { value: simulation } = await this.connection.simulateTransaction(testTransaction);
      
      const conditions: NetworkConditions = {
        congestion: this.determineCongestion(simulation),
        averageFee: this.calculateAverageFee(simulation),
        recommendedCuPrice: this.calculateRecommendedCuPrice(simulation),
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, conditions);
      return conditions;

    } catch (error) {
      console.warn('Failed to get network conditions, using defaults:', error);
      return {
        congestion: 'medium',
        averageFee: 5000,
        recommendedCuPrice: 1,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Calculate CU price based on network conditions and priority
   */
  private calculateCuPrice(
    conditions: NetworkConditions,
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): number {
    const basePrice = conditions.recommendedCuPrice;
    
    const multipliers = {
      low: 0.5,
      medium: 1.0,
      high: 2.0,
      urgent: 5.0
    };

    const congestionMultipliers = {
      low: 0.8,
      medium: 1.0,
      high: 1.5,
      extreme: 3.0
    };

    return Math.ceil(
      basePrice * 
      multipliers[priority] * 
      congestionMultipliers[conditions.congestion]
    );
  }

  /**
   * Determine network congestion level
   */
  private determineCongestion(simulation: any): 'low' | 'medium' | 'high' | 'extreme' {
    if (!simulation || simulation.err) {
      return 'medium';
    }

    const computeUnitsUsed = simulation.unitsConsumed || 200_000;
    const computeUnitsLimit = simulation.unitsRequested || 200_000;
    const utilization = computeUnitsUsed / computeUnitsLimit;

    if (utilization < 0.5) return 'low';
    if (utilization < 0.8) return 'medium';
    if (utilization < 0.95) return 'high';
    return 'extreme';
  }

  /**
   * Calculate average fee from simulation
   */
  private calculateAverageFee(simulation: any): number {
    // This is a simplified calculation
    // In practice, you'd analyze multiple recent transactions
    return 5000; // Base fee
  }

  /**
   * Calculate recommended CU price
   */
  private calculateRecommendedCuPrice(simulation: any): number {
    // This is a simplified calculation
    // In practice, you'd use real-time fee APIs
    return 1; // 1 micro-lamport per CU
  }

  /**
   * Optimize transaction with fee settings
   */
  async optimizeTransaction(
    transaction: Transaction,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<Transaction> {
    const recommendation = await this.getFeeRecommendation(200_000, priority);
    
    // Add compute unit limit instruction
    const limitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: recommendation.cuLimit
    });

    // Add compute unit price instruction
    const priceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: recommendation.cuPrice
    });

    // Create optimized transaction
    const optimizedTransaction = new Transaction();
    
    // Add fee instructions first
    optimizedTransaction.add(limitInstruction);
    optimizedTransaction.add(priceInstruction);
    
    // Add original instructions
    transaction.instructions.forEach(instruction => {
      optimizedTransaction.add(instruction);
    });

    return optimizedTransaction;
  }

  /**
   * Estimate transaction fees
   */
  async estimateFees(
    transaction: Transaction,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<{
    baseFee: number;
    priorityFee: number;
    totalFee: number;
    cuLimit: number;
    cuPrice: number;
  }> {
    const recommendation = await this.getFeeRecommendation(200_000, priority);
    
    const baseFee = 5000; // Base fee per signature
    const priorityFee = recommendation.cuLimit * recommendation.cuPrice;
    const totalFee = baseFee + priorityFee;

    return {
      baseFee,
      priorityFee,
      totalFee,
      cuLimit: recommendation.cuLimit,
      cuPrice: recommendation.cuPrice
    };
  }

  /**
   * Get fee breakdown for display
   */
  getFeeBreakdown(fees: {
    baseFee: number;
    priorityFee: number;
    totalFee: number;
  }): {
    baseFeeSOL: number;
    priorityFeeSOL: number;
    totalFeeSOL: number;
    breakdown: string;
  } {
    const baseFeeSOL = fees.baseFee / LAMPORTS_PER_SOL;
    const priorityFeeSOL = fees.priorityFee / LAMPORTS_PER_SOL;
    const totalFeeSOL = fees.totalFee / LAMPORTS_PER_SOL;

    const breakdown = `
Base Fee: ${fees.baseFee} lamports (${baseFeeSOL.toFixed(9)} SOL)
Priority Fee: ${fees.priorityFee} lamports (${priorityFeeSOL.toFixed(9)} SOL)
Total Fee: ${fees.totalFee} lamports (${totalFeeSOL.toFixed(9)} SOL)
    `.trim();

    return {
      baseFeeSOL,
      priorityFeeSOL,
      totalFeeSOL,
      breakdown
    };
  }

  /**
   * Monitor fee trends
   */
  async monitorFeeTrends(duration: number = 300000): Promise<{
    averageFee: number;
    maxFee: number;
    minFee: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    const startTime = Date.now();
    const fees: number[] = [];

    while (Date.now() - startTime < duration) {
      try {
        const conditions = await this.getNetworkConditions();
        fees.push(conditions.averageFee);
        
        // Wait 10 seconds before next measurement
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        console.warn('Error monitoring fees:', error);
      }
    }

    if (fees.length === 0) {
      return {
        averageFee: 5000,
        maxFee: 5000,
        minFee: 5000,
        trend: 'stable'
      };
    }

    const averageFee = fees.reduce((sum, fee) => sum + fee, 0) / fees.length;
    const maxFee = Math.max(...fees);
    const minFee = Math.min(...fees);

    // Determine trend
    const firstHalf = fees.slice(0, Math.floor(fees.length / 2));
    const secondHalf = fees.slice(Math.floor(fees.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, fee) => sum + fee, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, fee) => sum + fee, 0) / secondHalf.length;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (secondHalfAvg > firstHalfAvg * 1.1) trend = 'increasing';
    else if (secondHalfAvg < firstHalfAvg * 0.9) trend = 'decreasing';

    return {
      averageFee,
      maxFee,
      minFee,
      trend
    };
  }
}

// Utility functions for fee management
export const FeeUtils = {
  /**
   * Convert lamports to SOL
   */
  lamportsToSOL: (lamports: number): number => {
    return lamports / LAMPORTS_PER_SOL;
  },

  /**
   * Convert SOL to lamports
   */
  solToLamports: (sol: number): number => {
    return Math.floor(sol * LAMPORTS_PER_SOL);
  },

  /**
   * Calculate base fee for number of signatures
   */
  calculateBaseFee: (signatureCount: number): number => {
    return signatureCount * 5000; // 5000 lamports per signature
  },

  /**
   * Calculate priority fee
   */
  calculatePriorityFee: (cuLimit: number, cuPrice: number): number => {
    return cuLimit * cuPrice;
  },

  /**
   * Calculate total fee
   */
  calculateTotalFee: (signatureCount: number, cuLimit: number, cuPrice: number): number => {
    const baseFee = FeeUtils.calculateBaseFee(signatureCount);
    const priorityFee = FeeUtils.calculatePriorityFee(cuLimit, cuPrice);
    return baseFee + priorityFee;
  },

  /**
   * Format fee for display
   */
  formatFee: (lamports: number): string => {
    const sol = FeeUtils.lamportsToSOL(lamports);
    if (sol < 0.000001) {
      return `${lamports} lamports`;
    }
    return `${sol.toFixed(9)} SOL`;
  },

  /**
   * Get priority level from fee
   */
  getPriorityLevel: (cuPrice: number): 'low' | 'medium' | 'high' | 'urgent' => {
    if (cuPrice <= 0.5) return 'low';
    if (cuPrice <= 1) return 'medium';
    if (cuPrice <= 2) return 'high';
    return 'urgent';
  }
};
