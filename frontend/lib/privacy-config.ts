/**
 * Privacy Configuration for Oráculo
 * Based on A Cypherpunk's Manifesto principles
 */

export interface PrivacyConfig {
  level: PrivacyLevel;
  features: PrivacyFeatures;
  dataRetention: DataRetention;
  encryption: EncryptionConfig;
  anonymity: AnonymityConfig;
}

export enum PrivacyLevel {
  PUBLIC = 0,     // "Privacy is not secrecy"
  PRIVATE = 1,    // "Privacy is the power to selectively reveal oneself"
  ANONYMOUS = 2   // "Anonymous transaction systems"
}

export interface PrivacyFeatures {
  kycRequired: boolean;
  personalDataStored: boolean;
  transactionTracking: boolean;
  profileVisibility: 'public' | 'private' | 'anonymous';
  dataSharing: 'none' | 'minimal' | 'selective';
}

export interface DataRetention {
  personalData: number; // days, 0 = never stored
  transactionData: number; // days
  analyticsData: number; // days
  autoDelete: boolean;
}

export interface EncryptionConfig {
  inTransit: boolean;
  atRest: boolean;
  endToEnd: boolean;
  keyManagement: 'user' | 'system' | 'hybrid';
}

export interface AnonymityConfig {
  mixerEnabled: boolean;
  commitmentSchemes: boolean;
  zeroKnowledgeProofs: boolean;
  torSupport: boolean;
}

// Default privacy configurations
export const PRIVACY_CONFIGS: Record<PrivacyLevel, PrivacyConfig> = {
  [PrivacyLevel.PUBLIC]: {
    level: PrivacyLevel.PUBLIC,
    features: {
      kycRequired: false,
      personalDataStored: true,
      transactionTracking: true,
      profileVisibility: 'public',
      dataSharing: 'selective'
    },
    dataRetention: {
      personalData: 365,
      transactionData: 2555, // 7 years
      analyticsData: 90,
      autoDelete: false
    },
    encryption: {
      inTransit: true,
      atRest: false,
      endToEnd: false,
      keyManagement: 'system'
    },
    anonymity: {
      mixerEnabled: false,
      commitmentSchemes: false,
      zeroKnowledgeProofs: false,
      torSupport: false
    }
  },
  
  [PrivacyLevel.PRIVATE]: {
    level: PrivacyLevel.PRIVATE,
    features: {
      kycRequired: false,
      personalDataStored: false,
      transactionTracking: false,
      profileVisibility: 'private',
      dataSharing: 'minimal'
    },
    dataRetention: {
      personalData: 0, // Never stored
      transactionData: 30,
      analyticsData: 7,
      autoDelete: true
    },
    encryption: {
      inTransit: true,
      atRest: true,
      endToEnd: true,
      keyManagement: 'user'
    },
    anonymity: {
      mixerEnabled: false,
      commitmentSchemes: true,
      zeroKnowledgeProofs: false,
      torSupport: false
    }
  },
  
  [PrivacyLevel.ANONYMOUS]: {
    level: PrivacyLevel.ANONYMOUS,
    features: {
      kycRequired: false,
      personalDataStored: false,
      transactionTracking: false,
      profileVisibility: 'anonymous',
      dataSharing: 'none'
    },
    dataRetention: {
      personalData: 0, // Never stored
      transactionData: 0, // Never stored
      analyticsData: 0, // Never stored
      autoDelete: true
    },
    encryption: {
      inTransit: true,
      atRest: true,
      endToEnd: true,
      keyManagement: 'user'
    },
    anonymity: {
      mixerEnabled: true,
      commitmentSchemes: true,
      zeroKnowledgeProofs: true,
      torSupport: true
    }
  }
};

// Privacy utilities
export class PrivacyManager {
  private config: PrivacyConfig;

  constructor(level: PrivacyLevel = PrivacyLevel.PRIVATE) {
    this.config = PRIVACY_CONFIGS[level];
  }

  /**
   * Check if personal data can be stored
   */
  canStorePersonalData(): boolean {
    return this.config.features.personalDataStored;
  }

  /**
   * Check if transaction tracking is allowed
   */
  canTrackTransactions(): boolean {
    return this.config.features.transactionTracking;
  }

  /**
   * Get data retention policy
   */
  getDataRetentionPolicy(): DataRetention {
    return this.config.dataRetention;
  }

  /**
   * Check if encryption is required
   */
  isEncryptionRequired(): boolean {
    return this.config.encryption.inTransit || this.config.encryption.atRest;
  }

  /**
   * Check if anonymity features are enabled
   */
  isAnonymityEnabled(): boolean {
    return this.config.anonymity.mixerEnabled || 
           this.config.anonymity.commitmentSchemes ||
           this.config.anonymity.zeroKnowledgeProofs;
  }

  /**
   * Generate commitment hash for privacy
   */
  generateCommitmentHash(data: string): string {
    if (!this.config.anonymity.commitmentSchemes) {
      return '';
    }
    
    // Simple hash implementation (in production, use proper cryptographic hash)
    return btoa(data + Date.now().toString()).substring(0, 32);
  }

  /**
   * Validate privacy compliance
   */
  validatePrivacyCompliance(data: any): boolean {
    if (!this.canStorePersonalData() && data.personalInfo) {
      return false;
    }
    
    if (!this.canTrackTransactions() && data.transactionHistory) {
      return false;
    }
    
    return true;
  }

  /**
   * Get privacy level description
   */
  getPrivacyDescription(): string {
    switch (this.config.level) {
      case PrivacyLevel.PUBLIC:
        return "Información visible para todos los usuarios";
      case PrivacyLevel.PRIVATE:
        return "Solo información necesaria, control selectivo de datos";
      case PrivacyLevel.ANONYMOUS:
        return "Máxima privacidad, completamente anónimo";
      default:
        return "Configuración de privacidad personalizada";
    }
  }

  /**
   * Get privacy features list
   */
  getPrivacyFeatures(): string[] {
    const features: string[] = [];
    
    if (this.config.features.kycRequired) {
      features.push("KYC requerido");
    } else {
      features.push("Sin KYC");
    }
    
    if (this.config.features.personalDataStored) {
      features.push("Datos personales almacenados");
    } else {
      features.push("Sin datos personales");
    }
    
    if (this.config.encryption.endToEnd) {
      features.push("Encriptación end-to-end");
    }
    
    if (this.config.anonymity.mixerEnabled) {
      features.push("Mixer habilitado");
    }
    
    if (this.config.anonymity.zeroKnowledgeProofs) {
      features.push("Zero-knowledge proofs");
    }
    
    return features;
  }
}

// Privacy constants based on Cypherpunk Manifesto
export const CYPHERPUNK_PRINCIPLES = {
  PRIVACY_IS_RIGHT: "Privacy is necessary for an open society in the electronic age",
  SELECTIVE_REVELATION: "Privacy is the power to selectively reveal oneself to the world",
  ANONYMOUS_SYSTEMS: "Privacy in an open society requires anonymous transaction systems",
  CRYPTOGRAPHY_REQUIRED: "Privacy in an open society also requires cryptography",
  DEFEND_PRIVACY: "We must defend our own privacy if we expect to have any",
  WRITE_CODE: "Cypherpunks write code",
  FREE_SOFTWARE: "Our code is free for all to use, worldwide"
};

// Privacy compliance checker
export class PrivacyComplianceChecker {
  static checkCypherpunkCompliance(config: PrivacyConfig): boolean {
    // Check if configuration follows Cypherpunk principles
    
    // 1. Privacy is a right
    if (config.features.kycRequired && config.level !== PrivacyLevel.PUBLIC) {
      return false; // KYC violates privacy principle
    }
    
    // 2. Selective revelation
    if (config.features.dataSharing === 'none' && config.level === PrivacyLevel.PUBLIC) {
      return false; // Public level should allow selective sharing
    }
    
    // 3. Anonymous systems
    if (config.level === PrivacyLevel.ANONYMOUS && !config.anonymity.mixerEnabled) {
      return false; // Anonymous level should have mixer
    }
    
    // 4. Cryptography required
    if (config.level !== PrivacyLevel.PUBLIC && !config.encryption.inTransit) {
      return false; // Private/Anonymous should have encryption
    }
    
    return true;
  }
  
  static getComplianceScore(config: PrivacyConfig): number {
    let score = 0;
    const maxScore = 10;
    
    // Privacy level score
    score += config.level;
    
    // Encryption score
    if (config.encryption.inTransit) score += 1;
    if (config.encryption.atRest) score += 1;
    if (config.encryption.endToEnd) score += 1;
    
    // Anonymity score
    if (config.anonymity.mixerEnabled) score += 1;
    if (config.anonymity.commitmentSchemes) score += 1;
    if (config.anonymity.zeroKnowledgeProofs) score += 1;
    
    // Data minimization score
    if (!config.features.personalDataStored) score += 1;
    if (config.dataRetention.autoDelete) score += 1;
    
    return Math.min(score, maxScore);
  }
}
