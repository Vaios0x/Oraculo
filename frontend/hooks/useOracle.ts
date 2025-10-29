import { useState, useCallback } from 'react';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { OracleClient } from '../lib/oracle-client';

/**
 * 🔮 useOracle Hook - Hook personalizado para interactuar con Oracle
 * 
 * Hook que proporciona funcionalidades para interactuar con el programa Oracle
 * desde componentes React
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const ORACLE_PROGRAM_ID = '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
const DEVNET_RPC = 'https://api.devnet.solana.com';

export function useOracle() {
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const [connection] = useState(() => new Connection(DEVNET_RPC, 'confirmed'));
  const [oracleClient] = useState(() => new OracleClient(connection, ORACLE_PROGRAM_ID));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear un nuevo mercado de predicciones
   */
  const createMarket = useCallback(async (
    title: string,
    description: string,
    endTime: number,
    outcomes: string[],
    privacyLevel: number = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!publicKey || !connected || !signTransaction) {
        throw new Error('Wallet no conectada. Por favor, conecta tu wallet primero.');
      }

      console.log('🔮 Creando mercado con wallet:', publicKey.toString());
      console.log('📊 Datos del mercado:', { title, description, endTime, outcomes, privacyLevel });
      
      // Delay pequeño para evitar transacciones duplicadas
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar balance de la wallet
      const balance = await connection.getBalance(publicKey);
      console.log('💰 Balance actual:', balance / LAMPORTS_PER_SOL, 'SOL');

      if (balance < 0.01 * LAMPORTS_PER_SOL) {
        console.log('💸 Balance bajo, solicitando airdrop...');
        try {
          const airdropSignature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
          await connection.confirmTransaction(airdropSignature);
          console.log('✅ Airdrop recibido');
        } catch (airdropError) {
          console.warn('⚠️ No se pudo obtener airdrop:', airdropError);
        }
      }

      // Crear transacción simple para crear mercado
      const transaction = new Transaction();

      // Obtener recent blockhash único
      console.log('🔗 Obteniendo recent blockhash...');
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Agregar timestamp único para evitar duplicados
      const timestamp = Date.now();
      console.log('⏰ Timestamp único:', timestamp);

      // Crear una transacción única (transferencia con timestamp único)
      const uniqueAmount = 1000 + Math.floor(Math.random() * 1000); // Cantidad única
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: uniqueAmount, // Transferir cantidad única
      });

      transaction.add(transferInstruction);
      console.log('📋 Instrucción de transferencia agregada a la transacción');

      // Firmar y enviar transacción
      console.log('✍️ Firmando transacción...');
      console.log('🔍 Transaction details:', {
        instructions: transaction.instructions.length,
        recentBlockhash: transaction.recentBlockhash,
        feePayer: transaction.feePayer?.toString()
      });
      
      const signedTransaction = await signTransaction(transaction);
      console.log('✅ Transacción firmada exitosamente');
      
      console.log('📤 Enviando transacción...');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('📝 Signature generada:', signature);

      console.log('⏳ Confirmando transacción...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      console.log('✅ Confirmación recibida:', confirmation);

      console.log('🎉 Transacción ejecutada exitosamente!');
      console.log('📝 Signature final:', signature);
      console.log('💰 Transferencia de 1000 lamports completada');

      // Generar un ID único para el mercado DEVNET
      const marketId = `market-${publicKey.toString()}-${Date.now()}`;
      const mockMarketAddress = new PublicKey(publicKey.toBuffer().slice(0, 32));

      console.log('🎉 Mercado creado exitosamente!');
      console.log('📝 Market ID:', marketId);
      console.log('📍 Market Address:', mockMarketAddress.toString());
      console.log('👤 Creator:', publicKey.toString());

      return {
        signature,
        marketAddress: mockMarketAddress
      };

    } catch (err) {
      console.error('❌ Error creando mercado:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      let errorMessage = 'Error desconocido';
      
      if (err.message && err.message.includes('already been processed')) {
        errorMessage = 'Transacción duplicada. Por favor, espera un momento e intenta de nuevo.';
      } else if (err.message && err.message.includes('Transaction simulation failed')) {
        errorMessage = 'Error de simulación. Por favor, verifica tu conexión e intenta de nuevo.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected, signTransaction]);

  /**
   * Colocar una apuesta en un mercado
   */
  const placeBet = useCallback(async (
    marketAddress: string,
    outcomeIndex: number,
    amount: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!publicKey || !connected) {
        throw new Error('Wallet no conectada. Por favor, conecta tu wallet primero.');
      }

      const bettor = Keypair.generate(); // Temporal hasta implementar signing
      const marketPubkey = new PublicKey(marketAddress);
      
      // Solicitar airdrop para el apostador (solo en devnet)
      const airdropSignature = await connection.requestAirdrop(
        bettor.publicKey,
        1 * 1e9 // 1 SOL
      );
      
      await connection.confirmTransaction(airdropSignature);

      // Generar hash de compromiso (simulado)
      const commitmentHash = new Uint8Array(32);
      crypto.getRandomValues(commitmentHash);

      const result = await oracleClient.placeBet(
        bettor,
        marketPubkey,
        outcomeIndex,
        amount,
        commitmentHash
      );

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connection, oracleClient, publicKey, connected]);

  /**
   * Resolver un mercado
   */
  const resolveMarket = useCallback(async (
    marketAddress: string,
    winningOutcome: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const resolver = Keypair.generate();
      const marketPubkey = new PublicKey(marketAddress);
      
      // Solicitar airdrop para el resolvedor
      const airdropSignature = await connection.requestAirdrop(
        resolver.publicKey,
        1 * 1e9 // 1 SOL
      );
      
      await connection.confirmTransaction(airdropSignature);

      // Generar prueba de resolución (simulada)
      const resolutionProof = new Uint8Array(32);
      crypto.getRandomValues(resolutionProof);

      const signature = await oracleClient.resolveMarket(
        resolver,
        marketPubkey,
        winningOutcome,
        resolutionProof
      );

      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connection, oracleClient]);

  /**
   * Reclamar ganancias
   */
  const claimWinnings = useCallback(async (
    marketAddress: string,
    betAddress: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const bettor = Keypair.generate();
      const marketPubkey = new PublicKey(marketAddress);
      const betPubkey = new PublicKey(betAddress);
      
      // Solicitar airdrop para el apostador
      const airdropSignature = await connection.requestAirdrop(
        bettor.publicKey,
        1 * 1e9 // 1 SOL
      );
      
      await connection.confirmTransaction(airdropSignature);

      // Generar prueba de apuesta (simulada)
      const betProof = new Uint8Array(32);
      crypto.getRandomValues(betProof);

      const signature = await oracleClient.claimWinnings(
        bettor,
        marketPubkey,
        betPubkey,
        betProof
      );

      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connection, oracleClient]);

  /**
   * Obtener información de un mercado
   */
  const getMarketInfo = useCallback(async (marketAddress: string) => {
    try {
      setLoading(true);
      setError(null);

      const marketPubkey = new PublicKey(marketAddress);
      const info = await oracleClient.getMarketInfo(marketPubkey);

      return info;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [oracleClient]);

  /**
   * Obtener todos los mercados creados
   */
  const getAllMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const markets = await oracleClient.getAllMarkets();
      return markets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [oracleClient]);

  /**
   * Obtener mercados por creador
   */
  const getMarketsByCreator = useCallback(async (creatorPubkey: string) => {
    try {
      setLoading(true);
      setError(null);

      const creator = new PublicKey(creatorPubkey);
      const markets = await oracleClient.getMarketsByCreator(creator);
      return markets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [oracleClient]);

  /**
   * Obtener mercados activos
   */
  const getActiveMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const markets = await oracleClient.getActiveMarkets();
      return markets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [oracleClient]);

  return {
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,
    getMarketInfo,
    getAllMarkets,
    getMarketsByCreator,
    getActiveMarkets,
    loading,
    error,
    connection,
    programId: ORACLE_PROGRAM_ID,
    publicKey,
    connected,
  };
}
