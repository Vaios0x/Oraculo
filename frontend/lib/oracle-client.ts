import { Connection, PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';

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
    // Generar PDA para el mercado usando seeds
    const [marketPDA, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('market'),
        creator.publicKey.toBuffer(),
        Buffer.from(title.slice(0, 32)) // Limitar título para evitar seeds muy largos
      ],
      this.programId
    );

    // Crear instrucción para crear mercado
    const instructionData = Buffer.alloc(8 + 4 + title.length + 4 + description.length + 8 + 4 + outcomes.length * 32 + 1);
    let offset = 0;

    // Discriminator para create_private_market (8 bytes)
    const discriminator = Buffer.from([0x8a, 0x8b, 0x8c, 0x8d, 0x8e, 0x8f, 0x90, 0x91]);
    instructionData.set(discriminator, offset);
    offset += 8;

    // Title length (4 bytes) + title
    instructionData.set(new Uint32Array([title.length]), offset);
    offset += 4;
    instructionData.set(Buffer.from(title), offset);
    offset += title.length;

    // Description length (4 bytes) + description
    instructionData.set(new Uint32Array([description.length]), offset);
    offset += 4;
    instructionData.set(Buffer.from(description), offset);
    offset += description.length;

    // End time (8 bytes)
    const endTimeBuffer = Buffer.alloc(8);
    endTimeBuffer.writeBigUInt64LE(BigInt(endTime), 0);
    instructionData.set(endTimeBuffer, offset);
    offset += 8;

    // Outcomes length (4 bytes) + outcomes
    instructionData.set(new Uint32Array([outcomes.length]), offset);
    offset += 4;
    for (const outcome of outcomes) {
      const outcomeBuffer = Buffer.from(outcome);
      instructionData.set(new Uint32Array([outcomeBuffer.length]), offset);
      offset += 4;
      instructionData.set(outcomeBuffer, offset);
      offset += outcomeBuffer.length;
    }

    // Privacy level (1 byte)
    instructionData.set([privacyLevel], offset);

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketPDA, isSigner: false, isWritable: true },
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [creator]);

    return { signature, marketAddress: marketPDA };
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
    // Generar PDA para la apuesta
    const [betPDA, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('bet'),
        bettor.publicKey.toBuffer(),
        marketAddress.toBuffer()
      ],
      this.programId
    );

    // Crear instrucción para colocar apuesta
    const instructionData = Buffer.alloc(8 + 1 + 8 + 32); // discriminator + outcome_index + amount + commitment_hash
    let offset = 0;

    // Discriminator para place_anonymous_bet (8 bytes)
    const discriminator = Buffer.from([0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99]);
    instructionData.set(discriminator, offset);
    offset += 8;

    // Outcome index (1 byte)
    instructionData.set([outcomeIndex], offset);
    offset += 1;

    // Amount (8 bytes)
    const amountBuffer = Buffer.alloc(8);
    amountBuffer.writeBigUInt64LE(BigInt(amount), 0);
    instructionData.set(amountBuffer, offset);
    offset += 8;

    // Commitment hash (32 bytes)
    instructionData.set(commitmentHash, offset);

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: betPDA, isSigner: false, isWritable: true },
        { pubkey: bettor.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [bettor]);

    return { signature, betAddress: betPDA };
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
    // Crear instrucción para resolver mercado
    const instructionData = Buffer.alloc(8 + 1 + 32); // discriminator + winning_outcome + resolution_proof
    let offset = 0;

    // Discriminator para resolve_private_market (8 bytes)
    const discriminator = Buffer.from([0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f, 0xa0, 0xa1]);
    instructionData.set(discriminator, offset);
    offset += 8;

    // Winning outcome (1 byte)
    instructionData.set([winningOutcome], offset);
    offset += 1;

    // Resolution proof (32 bytes)
    instructionData.set(resolutionProof, offset);

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
    // Crear instrucción para reclamar ganancias
    const instructionData = Buffer.alloc(8 + 32); // discriminator + bet_proof
    let offset = 0;

    // Discriminator para claim_anonymous_winnings (8 bytes)
    const discriminator = Buffer.from([0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9]);
    instructionData.set(discriminator, offset);
    offset += 8;

    // Bet proof (32 bytes)
    instructionData.set(betProof, offset);

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: betAddress, isSigner: false, isWritable: true },
        { pubkey: marketAddress, isSigner: false, isWritable: true },
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
  async getMarketInfo(marketAddress: PublicKey): Promise<MarketAccount> {
    const accountInfo = await this.connection.getAccountInfo(marketAddress);
    if (!accountInfo) {
      throw new Error('Market account not found');
    }

    // Parsear datos del mercado desde el buffer
    const data = accountInfo.data;
    let offset = 0;

    // Discriminator (8 bytes) - saltar
    offset += 8;

    // Creator (32 bytes)
    const creator = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    // Title length (4 bytes) + title
    const titleLength = data.readUInt32LE(offset);
    offset += 4;
    const title = data.slice(offset, offset + titleLength).toString();
    offset += titleLength;

    // Description length (4 bytes) + description
    const descriptionLength = data.readUInt32LE(offset);
    offset += 4;
    const description = data.slice(offset, offset + descriptionLength).toString();
    offset += descriptionLength;

    // End time (8 bytes)
    const endTime = Number(data.readBigUInt64LE(offset));
    offset += 8;

    // Outcomes length (4 bytes) + outcomes
    const outcomesLength = data.readUInt32LE(offset);
    offset += 4;
    const outcomes: string[] = [];
    for (let i = 0; i < outcomesLength; i++) {
      const outcomeLength = data.readUInt32LE(offset);
      offset += 4;
      const outcome = data.slice(offset, offset + outcomeLength).toString();
      offset += outcomeLength;
      outcomes.push(outcome);
    }

    // Total staked (8 bytes)
    const totalStaked = Number(data.readBigUInt64LE(offset));
    offset += 8;

    // Is resolved (1 byte)
    const isResolved = data[offset] === 1;
    offset += 1;

    // Winning outcome (1 byte, optional)
    let winningOutcome: number | undefined;
    if (isResolved) {
      winningOutcome = data[offset];
      offset += 1;
    }

    // Privacy level (1 byte)
    const privacyLevel = data[offset];
    offset += 1;

    // Resolution proof (32 bytes, optional)
    let resolutionProof: Uint8Array | undefined;
    if (isResolved) {
      resolutionProof = data.slice(offset, offset + 32);
      offset += 32;
    }

    // Resolved at (8 bytes)
    const resolvedAt = Number(data.readBigUInt64LE(offset));
    offset += 8;

    // Bump (1 byte)
    const bump = data[offset];

    return {
      creator: creator.toString(),
      title,
      description,
      endTime,
      outcomes,
      totalStaked,
      isResolved,
      winningOutcome,
      privacyLevel,
      resolutionProof,
      resolvedAt,
    };
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
  creator: string;
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
  bettor: string;
  market: string;
  outcomeIndex: number;
  amount: number;
  commitmentHash: Uint8Array;
  timestamp: number;
}
