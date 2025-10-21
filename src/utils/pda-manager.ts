// PDA Manager Utilities
// =====================
// Utilities for managing Program Derived Addresses

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

export interface PDADerivation {
  pda: PublicKey;
  bump: number;
  seeds: Buffer[];
  programId: PublicKey;
  canonical: boolean;
}

export interface PDAAccount {
  address: PublicKey;
  owner: PublicKey;
  lamports: number;
  space: number;
  data: Buffer;
  bump: number;
  seeds: Buffer[];
  programId: PublicKey;
}

export interface PDAPattern {
  name: string;
  description: string;
  seeds: string[];
  example: string;
  useCase: string;
}

export class PDAManager {
  private connection: Connection;
  private cache: Map<string, PDADerivation> = new Map();
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Derive a PDA with optional seeds
   */
  async derivePDA(
    programId: PublicKey,
    seeds: (string | Buffer | PublicKey)[],
    canonical: boolean = true
  ): Promise<PDADerivation> {
    const cacheKey = `${programId.toString()}-${seeds.map(s => s.toString()).join('-')}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached;
    }

    try {
      const seedBuffers = seeds.map(seed => {
        if (typeof seed === 'string') {
          return Buffer.from(seed);
        } else if (seed instanceof PublicKey) {
          return seed.toBuffer();
        } else {
          return seed;
        }
      });

      let bump = 255;
      let pda: PublicKey;
      let found = false;

      // Try to find canonical bump
      while (bump >= 0) {
        try {
          const allSeeds = [...seedBuffers, Buffer.from([bump])];
          pda = PublicKey.createProgramAddressSync(allSeeds, programId);
          found = true;
          break;
        } catch (error) {
          bump--;
        }
      }

      if (!found) {
        throw new Error('Could not derive PDA with given seeds');
      }

      const derivation: PDADerivation = {
        pda,
        bump,
        seeds: seedBuffers,
        programId,
        canonical: canonical && bump === 255
      };

      this.cache.set(cacheKey, { ...derivation, timestamp: Date.now() });
      return derivation;

    } catch (error) {
      console.error('Error deriving PDA:', error);
      throw error;
    }
  }

  /**
   * Derive multiple PDAs
   */
  async deriveMultiplePDAs(
    programId: PublicKey,
    seedSets: (string | Buffer | PublicKey)[][]
  ): Promise<PDADerivation[]> {
    return Promise.all(
      seedSets.map(seeds => this.derivePDA(programId, seeds))
    );
  }

  /**
   * Get PDA account information
   */
  async getPDAAccount(pda: PublicKey): Promise<PDAAccount | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(pda);
      
      if (!accountInfo) {
        return null;
      }

      return {
        address: pda,
        owner: accountInfo.owner,
        lamports: accountInfo.lamports,
        space: accountInfo.data.length,
        data: accountInfo.data,
        bump: 0, // Will be set by caller
        seeds: [], // Will be set by caller
        programId: accountInfo.owner
      };
    } catch (error) {
      console.error('Error getting PDA account:', error);
      return null;
    }
  }

  /**
   * Check if PDA exists
   */
  async pdaExists(pda: PublicKey): Promise<boolean> {
    try {
      const accountInfo = await this.connection.getAccountInfo(pda);
      return accountInfo !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate PDA derivation
   */
  validatePDADerivation(
    pda: PublicKey,
    programId: PublicKey,
    seeds: Buffer[],
    bump: number
  ): boolean {
    try {
      const allSeeds = [...seeds, Buffer.from([bump])];
      const derivedPDA = PublicKey.createProgramAddressSync(allSeeds, programId);
      return derivedPDA.equals(pda);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get common PDA patterns
   */
  getCommonPatterns(): PDAPattern[] {
    return [
      {
        name: "User Profile",
        description: "One PDA per user for personal data",
        seeds: ["profile", "user_address"],
        example: "profile + user.publicKey",
        useCase: "User profiles, personal data storage"
      },
      {
        name: "Global State",
        description: "Single global PDA for program state",
        seeds: ["global"],
        example: "global",
        useCase: "Program configuration, global settings"
      },
      {
        name: "User Token Account",
        description: "User-specific token account PDA",
        seeds: ["token", "user_address", "mint_address"],
        example: "token + user.publicKey + mint.publicKey",
        useCase: "Token balances, token-specific data"
      },
      {
        name: "Relationship",
        description: "PDA for relationship between two entities",
        seeds: ["relationship", "entity1", "entity2"],
        example: "relationship + user1.publicKey + user2.publicKey",
        useCase: "Friendships, partnerships, connections"
      },
      {
        name: "Hierarchical",
        description: "Nested PDA structure",
        seeds: ["parent", "child", "user_address"],
        example: "parent + child + user.publicKey",
        useCase: "Organized data, tree structures"
      },
      {
        name: "Time-based",
        description: "Time-specific PDA",
        seeds: ["data", "user_address", "timestamp"],
        example: "data + user.publicKey + currentTimestamp",
        useCase: "Time-sensitive data, logs"
      }
    ];
  }

  /**
   * Generate PDA for pattern
   */
  async generatePDAForPattern(
    programId: PublicKey,
    pattern: PDAPattern,
    userAddress?: PublicKey,
    additionalSeeds: (string | Buffer | PublicKey)[] = []
  ): Promise<PDADerivation> {
    const seeds: (string | Buffer | PublicKey)[] = [];
    
    // Add pattern seeds
    for (const seed of pattern.seeds) {
      if (seed === "user_address" && userAddress) {
        seeds.push(userAddress);
      } else if (seed === "mint_address" && additionalSeeds.length > 0) {
        seeds.push(additionalSeeds[0]);
      } else if (seed === "timestamp") {
        seeds.push(Date.now().toString());
      } else {
        seeds.push(seed);
      }
    }
    
    // Add additional seeds
    seeds.push(...additionalSeeds);
    
    return this.derivePDA(programId, seeds);
  }

  /**
   * Analyze PDA usage
   */
  async analyzePDAUsage(programId: PublicKey): Promise<{
    totalPDAs: number;
    activePDAs: number;
    totalLamports: number;
    averageSize: number;
    patterns: { [pattern: string]: number };
  }> {
    try {
      const accounts = await this.connection.getProgramAccounts(programId);
      
      const totalPDAs = accounts.length;
      const activePDAs = accounts.filter(acc => acc.account.lamports > 0).length;
      const totalLamports = accounts.reduce((sum, acc) => sum + acc.account.lamports, 0);
      const averageSize = accounts.reduce((sum, acc) => sum + acc.account.data.length, 0) / totalPDAs;
      
      // Analyze patterns (simplified)
      const patterns: { [pattern: string]: number } = {
        'user-specific': 0,
        'global': 0,
        'relationship': 0,
        'other': 0
      };
      
      for (const account of accounts) {
        const data = account.account.data;
        if (data.length > 0) {
          // Simple pattern detection based on data size and content
          if (data.length < 100) {
            patterns['global']++;
          } else if (data.length > 500) {
            patterns['relationship']++;
          } else {
            patterns['user-specific']++;
          }
        } else {
          patterns['other']++;
        }
      }
      
      return {
        totalPDAs,
        activePDAs,
        totalLamports,
        averageSize,
        patterns
      };
    } catch (error) {
      console.error('Error analyzing PDA usage:', error);
      throw error;
    }
  }

  /**
   * Optimize PDA operations
   */
  async optimizePDAOperations(programId: PublicKey): Promise<{
    recommendations: string[];
    optimizations: {
      cacheDerivations: boolean;
      batchOperations: boolean;
      reduceSeeds: boolean;
      optimizeSpace: boolean;
    };
  }> {
    const analysis = await this.analyzePDAUsage(programId);
    const recommendations: string[] = [];
    const optimizations = {
      cacheDerivations: false,
      batchOperations: false,
      reduceSeeds: false,
      optimizeSpace: false
    };

    // Analyze and provide recommendations
    if (analysis.totalPDAs > 100) {
      recommendations.push('Consider caching PDA derivations for better performance');
      optimizations.cacheDerivations = true;
    }

    if (analysis.totalPDAs > 50) {
      recommendations.push('Use batch operations to reduce transaction count');
      optimizations.batchOperations = true;
    }

    if (analysis.averageSize > 1000) {
      recommendations.push('Consider optimizing data structures to reduce space usage');
      optimizations.optimizeSpace = true;
    }

    if (analysis.patterns['other'] > analysis.totalPDAs * 0.3) {
      recommendations.push('Review seed patterns for better organization');
      optimizations.reduceSeeds = true;
    }

    return { recommendations, optimizations };
  }

  /**
   * Get PDA statistics
   */
  async getPDAStatistics(programId: PublicKey): Promise<{
    derivationCount: number;
    averageDerivationTime: number;
    cacheHitRate: number;
    mostUsedPatterns: string[];
  }> {
    // This is a simplified implementation
    // In practice, you'd track these metrics over time
    return {
      derivationCount: this.cache.size,
      averageDerivationTime: 5, // milliseconds
      cacheHitRate: 0.85, // 85%
      mostUsedPatterns: ['user-specific', 'global', 'relationship']
    };
  }
}

// Utility functions for PDA management
export const PDAUtils = {
  /**
   * Format PDA derivation for display
   */
  formatPDADerivation: (derivation: PDADerivation): string => {
    return `
PDA: ${derivation.pda.toString()}
Bump: ${derivation.bump}
Seeds: ${derivation.seeds.map(s => s.toString('hex')).join(', ')}
Program ID: ${derivation.programId.toString()}
Canonical: ${derivation.canonical}
    `.trim();
  },

  /**
   * Validate PDA pattern
   */
  validatePDAPattern: (pattern: PDAPattern): boolean => {
    if (!pattern.name || !pattern.description) {
      return false;
    }
    
    if (pattern.seeds.length === 0) {
      return false;
    }
    
    return true;
  },

  /**
   * Get PDA pattern by name
   */
  getPatternByName: (patterns: PDAPattern[], name: string): PDAPattern | null => {
    return patterns.find(pattern => pattern.name === name) || null;
  },

  /**
   * Generate PDA seeds from template
   */
  generateSeedsFromTemplate: (
    template: string,
    userAddress?: PublicKey,
    additionalData: { [key: string]: string | Buffer | PublicKey } = {}
  ): (string | Buffer | PublicKey)[] => {
    const seeds: (string | Buffer | PublicKey)[] = [];
    const parts = template.split('+').map(part => part.trim());
    
    for (const part of parts) {
      if (part === 'user_address' && userAddress) {
        seeds.push(userAddress);
      } else if (additionalData[part]) {
        seeds.push(additionalData[part]);
      } else {
        seeds.push(part);
      }
    }
    
    return seeds;
  },

  /**
   * Compare PDA derivations
   */
  comparePDADerivations: (derivation1: PDADerivation, derivation2: PDADerivation): {
    samePDA: boolean;
    sameSeeds: boolean;
    sameProgram: boolean;
    bumpDifference: number;
  } => {
    return {
      samePDA: derivation1.pda.equals(derivation2.pda),
      sameSeeds: derivation1.seeds.length === derivation2.seeds.length &&
                derivation1.seeds.every((seed, index) => seed.equals(derivation2.seeds[index])),
      sameProgram: derivation1.programId.equals(derivation2.programId),
      bumpDifference: Math.abs(derivation1.bump - derivation2.bump)
    };
  }
};
