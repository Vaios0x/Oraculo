'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { OracleClient } from '../../src/oracle-client';

/**
 * 🔮 useStaking Hook - Hook para manejar staking on-chain
 * 
 * Hook que permite hacer stake en mercados de predicción usando
 * transacciones reales en Solana
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface StakingParams {
  marketId: string;
  outcome: string;
  amount: number; // en SOL
}

interface StakingResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export function useStaking() {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stakeOnMarket = useCallback(async ({
    marketId,
    outcome,
    amount
  }: StakingParams): Promise<StakingResult> => {
    if (!publicKey || !signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Configuración de conexión
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      );

      // ID del programa (debe coincidir con el desplegado)
      const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
      
      // Crear cliente Oracle
      const oracleClient = new OracleClient(connection, programId);

      // Convertir amount a lamports
      const amountInLamports = Math.floor(amount * LAMPORTS_PER_SOL);

      // Generar commitment hash para privacidad
      const commitmentHash = new Uint8Array(32);
      crypto.getRandomValues(commitmentHash);

      // Convertir outcome a índice
      const outcomeIndex = outcome === 'Yes' ? 0 : 1;

      // Crear keypair temporal para la transacción
      // En producción, esto debería usar el wallet del usuario
      const tempKeypair = {
        publicKey,
        signTransaction: async (tx: any) => {
          return await signTransaction(tx);
        }
      } as any;

      // Ejecutar stake
      const result = await oracleClient.placeBet(
        tempKeypair,
        new PublicKey(marketId),
        outcomeIndex,
        amountInLamports,
        commitmentHash
      );

      return {
        success: true,
        signature: result.signature
      };

    } catch (err: any) {
      console.error('Staking error:', err);
      const errorMessage = err.message || 'Failed to stake on market';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  const resolveMarket = useCallback(async (
    marketId: string,
    winningOutcome: string
  ): Promise<StakingResult> => {
    if (!publicKey || !signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Configuración de conexión
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      );

      const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || '7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2';
      const oracleClient = new OracleClient(connection, programId);

      // Convertir outcome a índice
      const outcomeIndex = winningOutcome === 'Yes' ? 0 : 1;

      // Generar proof de resolución (en producción sería un hash real)
      const resolutionProof = new Uint8Array(32);
      crypto.getRandomValues(resolutionProof);

      const tempKeypair = {
        publicKey,
        signTransaction: async (tx: any) => {
          return await signTransaction(tx);
        }
      } as any;

      // Ejecutar resolución
      const signature = await oracleClient.resolveMarket(
        tempKeypair,
        new PublicKey(marketId),
        outcomeIndex,
        resolutionProof
      );

      return {
        success: true,
        signature: signature
      };

    } catch (err: any) {
      console.error('Resolve error:', err);
      const errorMessage = err.message || 'Failed to resolve market';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  return {
    stakeOnMarket,
    resolveMarket,
    isLoading,
    error
  };
}
