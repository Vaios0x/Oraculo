import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Tipos para las instrucciones (generados desde nuestro programa Rust)
export interface CreateTokenMarketData {
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  tokenDecimals: number;
}

export interface StakeTokensData {
  marketId: PublicKey;
  outcomeIndex: number;
  amount: number;
}

export interface DistributeWinningsData {
  marketId: PublicKey;
  winningOutcome: number;
}

export interface TokenMarket {
  creator: PublicKey;
  title: string;
  description: string;
  endTime: number;
  outcomeOptions: string[];
  tokenMint: PublicKey;
  totalStaked: number;
  outcomeStakes: number[];
  isResolved: boolean;
  winningOutcome?: number;
}

export class OraculoClient {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey) {
    this.connection = connection;
    this.programId = programId;
  }

  /**
   * Crear un mercado de predicción
   */
  async createMarket(
    payer: PublicKey,
    marketAccount: PublicKey,
    tokenMint: PublicKey,
    marketTokenAccount: PublicKey,
    data: CreateTokenMarketData
  ): Promise<string> {
    const instruction = new Transaction().add({
      programId: this.programId,
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: marketAccount, isSigner: false, isWritable: true },
        { pubkey: tokenMint, isSigner: false, isWritable: true },
        { pubkey: marketTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: this.serializeCreateTokenMarket(data),
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [payer]);
    return signature;
  }

  /**
   * Hacer una apuesta en un mercado
   */
  async stakeTokens(
    bettor: PublicKey,
    marketAccount: PublicKey,
    bettorTokenAccount: PublicKey,
    marketTokenAccount: PublicKey,
    data: StakeTokensData
  ): Promise<string> {
    const instruction = new Transaction().add({
      programId: this.programId,
      keys: [
        { pubkey: bettor, isSigner: true, isWritable: true },
        { pubkey: marketAccount, isSigner: false, isWritable: true },
        { pubkey: bettorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: marketTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: this.serializeStakeTokens(data),
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [bettor]);
    return signature;
  }

  /**
   * Distribuir ganancias de un mercado
   */
  async distributeWinnings(
    creator: PublicKey,
    marketAccount: PublicKey,
    marketTokenAccount: PublicKey,
    data: DistributeWinningsData
  ): Promise<string> {
    const instruction = new Transaction().add({
      programId: this.programId,
      keys: [
        { pubkey: creator, isSigner: true, isWritable: true },
        { pubkey: marketAccount, isSigner: false, isWritable: true },
        { pubkey: marketTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: this.serializeDistributeWinnings(data),
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [creator]);
    return signature;
  }

  /**
   * Obtener información de un mercado
   */
  async getMarket(marketAccount: PublicKey): Promise<TokenMarket> {
    const accountInfo = await this.connection.getAccountInfo(marketAccount);
    if (!accountInfo) {
      throw new Error('Market account not found');
    }
    
    return this.deserializeTokenMarket(accountInfo.data);
  }

  /**
   * Obtener el balance de una cuenta
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    return await this.connection.getBalance(pubkey);
  }

  /**
   * Obtener información de una transacción
   */
  async getTransaction(signature: string) {
    return await this.connection.getTransaction(signature);
  }

  // Métodos de serialización (implementar según el formato de nuestro programa Rust)
  private serializeCreateTokenMarket(data: CreateTokenMarketData): Buffer {
    // Implementar serialización Borsh
    // Esto debe coincidir con la estructura de nuestro programa Rust
    const buffer = Buffer.alloc(1024); // Tamaño aproximado
    let offset = 0;
    
    // Discriminador para CreateTokenMarket (1 byte)
    buffer.writeUInt8(0, offset);
    offset += 1;
    
    // Serializar campos
    // Implementar serialización completa según Borsh
    return buffer.slice(0, offset);
  }

  private serializeStakeTokens(data: StakeTokensData): Buffer {
    const buffer = Buffer.alloc(1024);
    let offset = 0;
    
    // Discriminador para StakeTokens (1 byte)
    buffer.writeUInt8(1, offset);
    offset += 1;
    
    // Serializar campos
    return buffer.slice(0, offset);
  }

  private serializeDistributeWinnings(data: DistributeWinningsData): Buffer {
    const buffer = Buffer.alloc(1024);
    let offset = 0;
    
    // Discriminador para DistributeWinnings (1 byte)
    buffer.writeUInt8(2, offset);
    offset += 1;
    
    // Serializar campos
    return buffer.slice(0, offset);
  }

  private deserializeTokenMarket(data: Buffer): TokenMarket {
    // Implementar deserialización Borsh
    // Esto debe coincidir con la estructura TokenMarket de nuestro programa Rust
    return {
      creator: PublicKey.default,
      title: '',
      description: '',
      endTime: 0,
      outcomeOptions: [],
      tokenMint: PublicKey.default,
      totalStaked: 0,
      outcomeStakes: [],
      isResolved: false,
    };
  }
}

// Utilidades para crear clientes
export function createDevnetClient(programId: string): OraculoClient {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const programPubkey = new PublicKey(programId);
  return new OraculoClient(connection, programPubkey);
}

export function createMainnetClient(programId: string): OraculoClient {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const programPubkey = new PublicKey(programId);
  return new OraculoClient(connection, programPubkey);
}

export function createLocalClient(programId: string): OraculoClient {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const programPubkey = new PublicKey(programId);
  return new OraculoClient(connection, programPubkey);
}
