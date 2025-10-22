'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface StakingResult {
  success: boolean;
  signature?: string;
  error?: string;
}

interface StakeParams {
  marketId: string;
  outcome: string;
  amount: number; // in SOL
}

export function useStaking() {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stakeOnMarket = useCallback(async ({ marketId, outcome, amount }: StakeParams): Promise<StakingResult> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Conectar a Solana Devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Crear una cuenta derivada para el mercado (simulada)
      // En producción, esto sería una PDA (Program Derived Address) del programa de mercados
      const marketSeed = `market_${marketId}_${outcome}`;
      const [marketAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from(marketSeed)],
        new PublicKey('11111111111111111111111111111111') // System Program como placeholder
      );
      
      // Crear transacción de staking
      const transaction = new Transaction();
      
      // Calcular lamports (1 SOL = 1,000,000,000 lamports)
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      
      // Crear instrucción de transferencia SOL a la cuenta del mercado
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: marketAccount,
        lamports: lamports,
      });
      
      transaction.add(transferInstruction);
      
      // Obtener el último blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Firmar la transacción
      const signedTransaction = await signTransaction(transaction);
      
      // Enviar la transacción
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirmar la transacción
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log(`Staking transaction successful: ${signature}`);
      console.log(`Staked ${amount} SOL on market ${marketId} for outcome: ${outcome}`);
      
      return {
        success: true,
        signature,
      };
      
    } catch (err: any) {
      console.error('Staking error:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  const resolveMarket = useCallback(async (marketId: string, winningOutcome: string): Promise<StakingResult> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Conectar a Solana Devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Crear una cuenta derivada para el mercado (simulada)
      const marketSeed = `market_${marketId}_resolve`;
      const [marketAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from(marketSeed)],
        new PublicKey('11111111111111111111111111111111') // System Program como placeholder
      );
      
      // Crear transacción de resolución
      const transaction = new Transaction();
      
      // Crear instrucción de resolución (simulada) - solo fee mínimo
      const resolveInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: marketAccount,
        lamports: 1000, // Fee mínimo para la transacción
      });
      
      transaction.add(resolveInstruction);
      
      // Obtener el último blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Firmar la transacción
      const signedTransaction = await signTransaction(transaction);
      
      // Enviar la transacción
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirmar la transacción
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log(`Resolve transaction successful: ${signature}`);
      console.log(`Market ${marketId} resolved with outcome: ${winningOutcome}`);
      
      return {
        success: true,
        signature,
      };
      
    } catch (err: any) {
      console.error('Resolve error:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  return {
    stakeOnMarket,
    resolveMarket,
    isLoading,
    error,
  };
}
