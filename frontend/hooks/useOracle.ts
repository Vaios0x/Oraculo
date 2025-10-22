import { useState, useCallback } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { OracleClient } from '../../src/oracle-client';

/**
 * 🔮 useOracle Hook - Hook personalizado para interactuar con Oracle
 * 
 * Hook que proporciona funcionalidades para interactuar con el programa Oracle
 * desde componentes React
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

const ORACLE_PROGRAM_ID = 'DPdNmG6KptafxXNpeTX2UEnuVqikTh5WWjumsrnzoGo1';
const DEVNET_RPC = 'https://api.devnet.solana.com';

export function useOracle() {
  const { publicKey, signTransaction, connected } = useWallet();
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

      if (!publicKey || !connected) {
        throw new Error('Wallet no conectada. Por favor, conecta tu wallet primero.');
      }

      // Usar la wallet conectada en lugar de generar keypair temporal
      const creator = Keypair.generate(); // Temporal hasta implementar signing
      
      // Solicitar airdrop para el creador (solo en devnet)
      const airdropSignature = await connection.requestAirdrop(
        creator.publicKey,
        2 * 1e9 // 2 SOL
      );
      
      await connection.confirmTransaction(airdropSignature);

      const result = await oracleClient.createMarket(
        creator,
        title,
        description,
        endTime,
        outcomes,
        privacyLevel
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

  return {
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,
    getMarketInfo,
    loading,
    error,
    connection,
    programId: ORACLE_PROGRAM_ID,
    publicKey,
    connected,
  };
}
