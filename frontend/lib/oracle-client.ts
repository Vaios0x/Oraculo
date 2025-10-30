import { Connection, PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function sha256U8(input: string): Promise<Uint8Array> {
  if (typeof window !== 'undefined' && (window as any).crypto?.subtle) {
    const enc = new TextEncoder();
    const digest = await (window as any).crypto.subtle.digest('SHA-256', enc.encode(input));
    return new Uint8Array(digest);
  }
  // Node.js fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('crypto');
  const hash = nodeCrypto.createHash('sha256').update(Buffer.from(input, 'utf8')).digest();
  return new Uint8Array(hash);
}

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
    privacyLevel: number = 0
  ): Promise<{ signature: string; marketAddress: PublicKey }> {
    // Derivar PDA usando hash del título (debe coincidir con el programa)
    const titleHash = await sha256U8(title);
    const [marketPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('market'), creator.publicKey.toBuffer(), Buffer.from(titleHash.slice(0, 32))],
      this.programId
    );

    // Serializar instrucción segun Borsh enum OracleInstruction::CreateMarket (variant index 0)
    const titleBuf = Buffer.from(title, 'utf8');
    const descBuf = Buffer.from(description, 'utf8');
    const endBuf = Buffer.alloc(8);
    endBuf.writeBigInt64LE(BigInt(endTime));

    const outcomesParts: Buffer[] = [];
    for (const o of outcomes) {
      const ob = Buffer.from(o, 'utf8');
      const olen = Buffer.alloc(4);
      olen.writeUInt32LE(ob.length);
      outcomesParts.push(olen, ob);
    }
    const outcomesLen = Buffer.alloc(4);
    outcomesLen.writeUInt32LE(outcomes.length);

    const payload = Buffer.concat([
      Buffer.from([0]), // variant index for CreateMarket
      (() => { const l = Buffer.alloc(4); l.writeUInt32LE(titleBuf.length); return l; })(),
      titleBuf,
      (() => { const l = Buffer.alloc(4); l.writeUInt32LE(descBuf.length); return l; })(),
      descBuf,
      endBuf,
      outcomesLen,
      ...outcomesParts,
      Buffer.from([privacyLevel & 0xff]),
    ]);

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: marketPDA, isSigner: false, isWritable: true },
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: payload,
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
      address: marketAddress.toBase58(),
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

  /**
   * Obtener todos los mercados creados
   * Busca todas las cuentas de mercado usando Program Derived Addresses
   * OPTIMIZADO: Sin filtros de tamaño para capturar TODOS los mercados
   */
  async getAllMarkets(): Promise<MarketAccount[]> {
    try {
      console.log('🔍 Buscando TODOS los mercados en el programa:', this.programId.toString());
      
      // Obtener todas las cuentas del programa sin filtros de tamaño
      // Esto asegura que capturemos todos los mercados independientemente de su tamaño
      const accounts = await this.connection.getProgramAccounts(this.programId, {
        commitment: 'confirmed'
      });

      console.log(`📊 Total de cuentas encontradas: ${accounts.length}`);

      const markets: MarketAccount[] = [];

      for (const account of accounts) {
        try {
          // Verificar que la cuenta tenga datos y sea un mercado válido
          if (account.account.data.length > 8) { // Mínimo: discriminator + creator
            const marketInfo = await this.getMarketInfo(account.pubkey);
            markets.push(marketInfo);
            console.log(`✅ Mercado encontrado: ${marketInfo.title} (Creator: ${marketInfo.creator})`);
          }
        } catch (error) {
          console.warn(`⚠️ Error parsing account ${account.pubkey.toString()}:`, error);
          // Continuar con el siguiente mercado
        }
      }

      console.log(`🎯 Total de mercados válidos encontrados: ${markets.length}`);

      // Ordenar por fecha de creación (más recientes primero)
      const sortedMarkets = markets.sort((a, b) => b.endTime - a.endTime);
      
      console.log('📋 Mercados ordenados por fecha de creación');
      return sortedMarkets;
    } catch (error) {
      console.error('❌ Error fetching all markets:', error);
      throw error;
    }
  }

  /**
   * Obtener mercados por creador
   */
  async getMarketsByCreator(creatorPubkey: PublicKey): Promise<MarketAccount[]> {
    try {
      const allMarkets = await this.getAllMarkets();
      return allMarkets.filter(market => market.creator === creatorPubkey.toString());
    } catch (error) {
      console.error('Error fetching markets by creator:', error);
      throw error;
    }
  }

  /**
   * Obtener mercados activos (no resueltos)
   */
  async getActiveMarkets(): Promise<MarketAccount[]> {
    try {
      const allMarkets = await this.getAllMarkets();
      const now = Math.floor(Date.now() / 1000);
      return allMarkets.filter(market => !market.isResolved && market.endTime > now);
    } catch (error) {
      console.error('Error fetching active markets:', error);
      throw error;
    }
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
  address: string;
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
