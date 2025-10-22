import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { OracleInstruction } from '../programs/oracle-privacy-native/target/types/oracle_privacy_native';

/**
 * 🔮 Oracle Client - Cliente TypeScript para el programa Oracle
 * 
 * Cliente que permite interactuar con el programa Oracle desplegado en Solana
 * desde el frontend Next.js
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export class OracleClient {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection, programId: string) {
    this.connection = connection;
    this.programId = new PublicKey(programId);
  }

  /**
   * Crear un nuevo mercado de predicciones
   */
  async createMarket(
    creator: Keypair,
    title: string,
    description: string,
    endTime: number,
    outcomes: string[],
    privacyLevel: number = 1
  ): Promise<{ signature: string; marketAddress: PublicKey }> {
    const marketKeypair = Keypair.generate();
    
    const instructionData = this.serializeInstruction(OracleInstruction.CreateMarket({
      title,
      description,
      endTime: new anchor.BN(endTime),
      outcomes,
      privacyLevel
    }));

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [creator, marketKeypair]);

    return { signature, marketAddress: marketKeypair.publicKey };
  }

  /**
   * Colocar una apuesta en un mercado
   */
  async placeBet(
    bettor: Keypair,
    marketAddress: PublicKey,
    outcomeIndex: number,
    amount: number,
    commitmentHash: Uint8Array
  ): Promise<{ signature: string; betAddress: PublicKey }> {
    const betKeypair = Keypair.generate();
    
    const instructionData = this.serializeInstruction(OracleInstruction.PlaceBet({
      outcomeIndex,
      amount: new anchor.BN(amount),
      commitmentHash: Array.from(commitmentHash) as [number, ...number[]]
    }));

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: bettor.publicKey, isSigner: true, isWritable: true },
        { pubkey: betKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [bettor, betKeypair]);

    return { signature, betAddress: betKeypair.publicKey };
  }

  /**
   * Resolver un mercado
   */
  async resolveMarket(
    resolver: Keypair,
    marketAddress: PublicKey,
    winningOutcome: number,
    resolutionProof: Uint8Array
  ): Promise<string> {
    const instructionData = this.serializeInstruction(OracleInstruction.ResolveMarket({
      winningOutcome,
      resolutionProof: Array.from(resolutionProof) as [number, ...number[]]
    }));

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: resolver.publicKey, isSigner: true, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [resolver]);

    return signature;
  }

  /**
   * Reclamar ganancias
   */
  async claimWinnings(
    bettor: Keypair,
    marketAddress: PublicKey,
    betAddress: PublicKey,
    betProof: Uint8Array
  ): Promise<string> {
    const instructionData = this.serializeInstruction(OracleInstruction.ClaimWinnings({
      betProof: Array.from(betProof) as [number, ...number[]]
    }));

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: betAddress, isSigner: false, isWritable: true },
        { pubkey: bettor.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [bettor]);

    return signature;
  }

  /**
   * Obtener información de un mercado
   */
  async getMarketInfo(marketAddress: PublicKey): Promise<any> {
    const accountInfo = await this.connection.getAccountInfo(marketAddress);
    if (!accountInfo) {
      throw new Error('Market account not found');
    }

    // Deserializar los datos del mercado
    // Esto requeriría implementar la deserialización Borsh en TypeScript
    return accountInfo.data;
  }

  /**
   * Serializar instrucciones usando Borsh
   */
  private serializeInstruction(instruction: any): Buffer {
    // Implementar serialización Borsh
    // Por ahora, retornamos un buffer vacío
    // En producción, usarías una librería como @coral-xyz/borsh
    return Buffer.alloc(0);
  }
}

// Instrucciones del programa Oracle
export enum OracleInstruction {
  CreateMarket = 'CreateMarket',
  PlaceBet = 'PlaceBet',
  ResolveMarket = 'ResolveMarket',
  ClaimWinnings = 'ClaimWinnings',
}

// Tipos de datos del programa
export interface MarketAccount {
  creator: PublicKey;
  title: string;
  description: string;
  endTime: number;
  outcomes: string[];
  totalStaked: number;
  isResolved: boolean;
  winningOutcome?: number;
  privacyLevel: number;
  resolutionProof?: Uint8Array;
  resolvedAt: number;
}

export interface BetAccount {
  bettor: PublicKey;
  market: PublicKey;
  outcomeIndex: number;
  amount: number;
  commitmentHash: Uint8Array;
  timestamp: number;
}
