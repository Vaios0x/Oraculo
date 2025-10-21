// Program Analyzer Utilities
// ==========================
// Utilities for analyzing and managing Solana programs

import {
  Connection,
  PublicKey,
  AccountInfo,
  ParsedAccountData
} from "@solana/web3.js";

export interface ProgramInfo {
  programId: PublicKey;
  owner: PublicKey;
  executable: boolean;
  lamports: number;
  space: number;
  data: Buffer;
  upgradeAuthority?: PublicKey;
  isUpgradeable: boolean;
  loader: string;
  version?: string;
}

export interface ProgramAnalysis {
  programInfo: ProgramInfo;
  accountCount: number;
  totalLamports: number;
  isVerified: boolean;
  securityScore: number;
  performanceMetrics: {
    averageCuUsage: number;
    maxCuUsage: number;
    efficiency: number;
  };
  recommendations: string[];
}

export class ProgramAnalyzer {
  private connection: Connection;
  private cache: Map<string, ProgramInfo> = new Map();
  private cacheTimeout = 300000; // 5 minutes

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Analyze a program by its ID
   */
  async analyzeProgram(programId: PublicKey): Promise<ProgramAnalysis> {
    const programInfo = await this.getProgramInfo(programId);
    const accountCount = await this.getAccountCount(programId);
    const totalLamports = await this.getTotalLamports(programId);
    const isVerified = await this.isProgramVerified(programId);
    const securityScore = await this.calculateSecurityScore(programInfo);
    const performanceMetrics = await this.getPerformanceMetrics(programId);
    const recommendations = this.generateRecommendations(programInfo, securityScore, performanceMetrics);

    return {
      programInfo,
      accountCount,
      totalLamports,
      isVerified,
      securityScore,
      performanceMetrics,
      recommendations
    };
  }

  /**
   * Get detailed program information
   */
  async getProgramInfo(programId: PublicKey): Promise<ProgramInfo> {
    const cacheKey = programId.toString();
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached;
    }

    try {
      const accountInfo = await this.connection.getAccountInfo(programId);
      
      if (!accountInfo) {
        throw new Error('Program not found');
      }

      const programInfo: ProgramInfo = {
        programId,
        owner: accountInfo.owner,
        executable: accountInfo.executable,
        lamports: accountInfo.lamports,
        space: accountInfo.data.length,
        data: accountInfo.data,
        isUpgradeable: await this.isProgramUpgradeable(programId),
        loader: this.getLoaderName(accountInfo.owner),
        upgradeAuthority: await this.getUpgradeAuthority(programId)
      };

      this.cache.set(cacheKey, { ...programInfo, timestamp: Date.now() });
      return programInfo;

    } catch (error) {
      console.error('Error getting program info:', error);
      throw error;
    }
  }

  /**
   * Check if program is upgradeable
   */
  private async isProgramUpgradeable(programId: PublicKey): Promise<boolean> {
    try {
      const upgradeAuthority = await this.getUpgradeAuthority(programId);
      return upgradeAuthority !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get upgrade authority
   */
  private async getUpgradeAuthority(programId: PublicKey): Promise<PublicKey | null> {
    try {
      // This is a simplified implementation
      // In practice, you'd need to parse the program data account
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get loader name from owner
   */
  private getLoaderName(owner: PublicKey): string {
    const loaderMap: { [key: string]: string } = {
      'NativeLoader1111111111111111111111111111111': 'Native Loader',
      'BPFLoader1111111111111111111111111111111111': 'BPF Loader v1',
      'BPFLoader2111111111111111111111111111111111': 'BPF Loader v2',
      'BPFLoaderUpgradeab1e11111111111111111111111': 'BPF Loader v3',
      'LoaderV411111111111111111111111111111111111': 'Loader v4'
    };

    return loaderMap[owner.toString()] || 'Unknown Loader';
  }

  /**
   * Get account count for program
   */
  private async getAccountCount(programId: PublicKey): Promise<number> {
    try {
      const accounts = await this.connection.getProgramAccounts(programId);
      return accounts.length;
    } catch (error) {
      console.warn('Error getting account count:', error);
      return 0;
    }
  }

  /**
   * Get total lamports for program
   */
  private async getTotalLamports(programId: PublicKey): Promise<number> {
    try {
      const accounts = await this.connection.getProgramAccounts(programId);
      return accounts.reduce((total, account) => total + account.account.lamports, 0);
    } catch (error) {
      console.warn('Error getting total lamports:', error);
      return 0;
    }
  }

  /**
   * Check if program is verified
   */
  private async isProgramVerified(programId: PublicKey): Promise<boolean> {
    try {
      // This is a simplified implementation
      // In practice, you'd check against verification services
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate security score
   */
  private async calculateSecurityScore(programInfo: ProgramInfo): Promise<number> {
    let score = 0;
    
    // Base score
    score += 20;
    
    // Upgradeable programs get lower score (potential risk)
    if (programInfo.isUpgradeable) {
      score -= 10;
    }
    
    // Verified programs get higher score
    if (await this.isProgramVerified(programInfo.programId)) {
      score += 30;
    }
    
    // Built-in programs get higher score
    if (this.isBuiltInProgram(programInfo.programId)) {
      score += 40;
    }
    
    // Recent programs get lower score (less battle-tested)
    if (programInfo.lamports < 1000000) { // Less than 0.001 SOL
      score -= 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check if program is built-in
   */
  private isBuiltInProgram(programId: PublicKey): boolean {
    const builtInPrograms = [
      '11111111111111111111111111111111', // System Program
      'Vote111111111111111111111111111111111111111', // Vote Program
      'Stake11111111111111111111111111111111111111', // Stake Program
      'Config1111111111111111111111111111111111111', // Config Program
      'ComputeBudget111111111111111111111111111111', // Compute Budget Program
      'AddressLookupTab1e1111111111111111111111111', // Address Lookup Table Program
      'Ed25519SigVerify111111111111111111111111111', // Ed25519 Program
      'KeccakSecp256k11111111111111111111111111111', // Secp256k1 Program
      'Secp256r1SigVerify1111111111111111111111111' // Secp256r1 Program
    ];

    return builtInPrograms.includes(programId.toString());
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(programId: PublicKey): Promise<{
    averageCuUsage: number;
    maxCuUsage: number;
    efficiency: number;
  }> {
    // This is a simplified implementation
    // In practice, you'd analyze transaction logs and compute unit usage
    return {
      averageCuUsage: 150000, // Average CU usage
      maxCuUsage: 200000, // Maximum CU usage
      efficiency: 0.75 // Efficiency score (0-1)
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    programInfo: ProgramInfo,
    securityScore: number,
    performanceMetrics: any
  ): string[] {
    const recommendations: string[] = [];

    if (securityScore < 50) {
      recommendations.push('Consider verifying the program source code');
    }

    if (programInfo.isUpgradeable && securityScore < 70) {
      recommendations.push('Consider making the program immutable for better security');
    }

    if (performanceMetrics.efficiency < 0.5) {
      recommendations.push('Optimize compute unit usage for better performance');
    }

    if (programInfo.space > 1000000) { // More than 1MB
      recommendations.push('Consider optimizing program size');
    }

    if (!this.isBuiltInProgram(programInfo.programId)) {
      recommendations.push('Audit the program before using in production');
    }

    return recommendations;
  }

  /**
   * Get program statistics
   */
  async getProgramStatistics(programId: PublicKey): Promise<{
    totalAccounts: number;
    totalLamports: number;
    averageAccountSize: number;
    largestAccount: number;
    smallestAccount: number;
  }> {
    try {
      const accounts = await this.connection.getProgramAccounts(programId);
      
      if (accounts.length === 0) {
        return {
          totalAccounts: 0,
          totalLamports: 0,
          averageAccountSize: 0,
          largestAccount: 0,
          smallestAccount: 0
        };
      }

      const totalLamports = accounts.reduce((total, account) => total + account.account.lamports, 0);
      const accountSizes = accounts.map(account => account.account.data.length);
      const averageAccountSize = accountSizes.reduce((sum, size) => sum + size, 0) / accountSizes.length;
      const largestAccount = Math.max(...accountSizes);
      const smallestAccount = Math.min(...accountSizes);

      return {
        totalAccounts: accounts.length,
        totalLamports,
        averageAccountSize,
        largestAccount,
        smallestAccount
      };
    } catch (error) {
      console.error('Error getting program statistics:', error);
      throw error;
    }
  }

  /**
   * Compare programs
   */
  async comparePrograms(programIds: PublicKey[]): Promise<{
    programs: ProgramInfo[];
    comparison: {
      mostSecure: PublicKey;
      mostEfficient: PublicKey;
      largestProgram: PublicKey;
      mostUpgradeable: PublicKey;
    };
  }> {
    const programs = await Promise.all(
      programIds.map(id => this.getProgramInfo(id))
    );

    const analyses = await Promise.all(
      programIds.map(id => this.analyzeProgram(id))
    );

    const mostSecure = programIds[analyses.findIndex(a => a.securityScore === Math.max(...analyses.map(a => a.securityScore)))];
    const mostEfficient = programIds[analyses.findIndex(a => a.performanceMetrics.efficiency === Math.max(...analyses.map(a => a.performanceMetrics.efficiency)))];
    const largestProgram = programIds[programs.findIndex(p => p.space === Math.max(...programs.map(p => p.space)))];
    const mostUpgradeable = programIds[programs.findIndex(p => p.isUpgradeable === true)];

    return {
      programs,
      comparison: {
        mostSecure,
        mostEfficient,
        largestProgram,
        mostUpgradeable
      }
    };
  }
}

// Utility functions for program management
export const ProgramUtils = {
  /**
   * Get built-in program IDs
   */
  getBuiltInProgramIds: (): { [key: string]: string } => ({
    SystemProgram: '11111111111111111111111111111111',
    VoteProgram: 'Vote111111111111111111111111111111111111111',
    StakeProgram: 'Stake11111111111111111111111111111111111111',
    ConfigProgram: 'Config1111111111111111111111111111111111111',
    ComputeBudgetProgram: 'ComputeBudget111111111111111111111111111111',
    AddressLookupTableProgram: 'AddressLookupTab1e1111111111111111111111111',
    Ed25519Program: 'Ed25519SigVerify111111111111111111111111111',
    Secp256k1Program: 'KeccakSecp256k11111111111111111111111111111',
    Secp256r1Program: 'Secp256r1SigVerify1111111111111111111111111'
  }),

  /**
   * Check if program is built-in
   */
  isBuiltInProgram: (programId: PublicKey): boolean => {
    const builtInIds = Object.values(ProgramUtils.getBuiltInProgramIds());
    return builtInIds.includes(programId.toString());
  },

  /**
   * Get program type
   */
  getProgramType: (programId: PublicKey): string => {
    const builtInPrograms = ProgramUtils.getBuiltInProgramIds();
    const programIdString = programId.toString();
    
    for (const [name, id] of Object.entries(builtInPrograms)) {
      if (id === programIdString) {
        return name;
      }
    }
    
    return 'Custom Program';
  },

  /**
   * Format program info for display
   */
  formatProgramInfo: (programInfo: ProgramInfo): string => {
    return `
Program ID: ${programInfo.programId.toString()}
Owner: ${programInfo.owner.toString()}
Executable: ${programInfo.executable}
Lamports: ${programInfo.lamports}
Space: ${programInfo.space} bytes
Upgradeable: ${programInfo.isUpgradeable}
Loader: ${programInfo.loader}
    `.trim();
  }
};
