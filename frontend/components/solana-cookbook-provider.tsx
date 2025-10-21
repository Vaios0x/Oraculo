"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  OraculoSolanaCookbookClient, 
  createOraculoDevnetClient,
  createOraculoMainnetClient,
  createOraculoTestnetClient,
  createOraculoLocalClient,
  OraculoKeypairInfo,
  OraculoNetworkInfo,
  OraculoTokenInfo,
  OraculoMarketInfo
} from '../lib/solana-cookbook-integration';

// ==================== Context Types ====================

interface OraculoCookbookContextType {
  // Client instance
  client: OraculoSolanaCookbookClient;
  
  // Network management
  network: 'devnet' | 'mainnet' | 'testnet' | 'local';
  setNetwork: (network: 'devnet' | 'mainnet' | 'testnet' | 'local') => void;
  networkInfo: OraculoNetworkInfo | null;
  
  // Wallet integration
  isWalletConnected: boolean;
  walletPublicKey: PublicKey | null;
  walletBalance: number;
  
  // Keypair management
  generatedKeypairs: Map<string, OraculoKeypairInfo>;
  createKeypair: () => Promise<OraculoKeypairInfo>;
  restoreKeypairFromBytes: (bytes: Uint8Array) => Promise<OraculoKeypairInfo>;
  restoreKeypairFromBase58: (base58: string) => Promise<OraculoKeypairInfo>;
  
  // Token operations
  tokenInfo: Map<string, OraculoTokenInfo>;
  getTokenInfo: (mintAddress: PublicKey) => Promise<OraculoTokenInfo>;
  getTokenBalance: (tokenAccount: PublicKey) => Promise<number>;
  
  // Market operations
  markets: Map<string, OraculoMarketInfo>;
  createMarket: (marketInfo: OraculoMarketInfo) => Promise<string>;
  placeBet: (marketId: PublicKey, outcomeIndex: number, amount: number) => Promise<string>;
  resolveMarket: (marketId: PublicKey, winningOutcome: number) => Promise<string>;
  
  // Transaction operations
  sendSOL: (recipient: PublicKey, amount: number) => Promise<string>;
  sendTokens: (recipient: PublicKey, mint: PublicKey, amount: number, decimals: number) => Promise<string>;
  addMemo: (memo: string) => Promise<string>;
  addPriorityFees: (microLamports: number) => Promise<string>;
  
  // Airdrop & testing
  requestAirdrop: (amount?: number) => Promise<string>;
  
  // Monitoring
  monitorBalance: (callback: (balance: number) => void) => Promise<number>;
  monitorTransactions: (callback: (signature: any) => void) => Promise<void>;
  
  // Utility functions
  calculateTransactionCost: (transaction: any) => Promise<{ computeUnits: number; fee: number; totalCost: number }>;
  getNetworkHealth: () => Promise<string>;
  getAccountInfo: (pubkey: PublicKey) => Promise<any>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

// ==================== Context Creation ====================

const OraculoCookbookContext = createContext<OraculoCookbookContextType | undefined>(undefined);

// ==================== Hook ====================

export function useOraculoCookbook() {
  const context = useContext(OraculoCookbookContext);
  if (context === undefined) {
    throw new Error('useOraculoCookbook must be used within an OraculoCookbookProvider');
  }
  return context;
}

// ==================== Provider Component ====================

interface OraculoCookbookProviderProps {
  children: ReactNode;
  initialNetwork?: 'devnet' | 'mainnet' | 'testnet' | 'local';
}

export function OraculoCookbookProvider({ 
  children, 
  initialNetwork = 'devnet' 
}: OraculoCookbookProviderProps) {
  // ==================== State Management ====================
  
  const [network, setNetworkState] = useState<'devnet' | 'mainnet' | 'testnet' | 'local'>(initialNetwork);
  const [client, setClient] = useState<OraculoSolanaCookbookClient | null>(null);
  const [networkInfo, setNetworkInfo] = useState<OraculoNetworkInfo | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [generatedKeypairs, setGeneratedKeypairs] = useState<Map<string, OraculoKeypairInfo>>(new Map());
  const [tokenInfo, setTokenInfo] = useState<Map<string, OraculoTokenInfo>>(new Map());
  const [markets, setMarkets] = useState<Map<string, OraculoMarketInfo>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Wallet integration
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // ==================== Client Initialization ====================

  useEffect(() => {
    const initializeClient = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let newClient: OraculoSolanaCookbookClient;
        
        switch (network) {
          case 'mainnet':
            newClient = createOraculoMainnetClient();
            break;
          case 'testnet':
            newClient = createOraculoTestnetClient();
            break;
          case 'local':
            newClient = createOraculoLocalClient();
            break;
          default:
            newClient = createOraculoDevnetClient();
        }

        setClient(newClient);

        // Load network info
        const info = await newClient.getNetworkInfo();
        setNetworkInfo(info);

        console.log(`✅ Oraculo Cookbook Client initialized for ${network}`);
      } catch (err) {
        console.error('❌ Error initializing Oraculo Cookbook Client:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();
  }, [network]);

  // ==================== Wallet Balance Monitoring ====================

  useEffect(() => {
    if (publicKey && client) {
      const updateBalance = async () => {
        try {
          const balance = await client.getAccountBalance(publicKey);
          setWalletBalance(balance / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error('Error updating wallet balance:', err);
        }
      };

      updateBalance();
      
      // Update balance every 10 seconds
      const interval = setInterval(updateBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [publicKey, client]);

  // ==================== Network Management ====================

  const setNetwork = (newNetwork: 'devnet' | 'mainnet' | 'testnet' | 'local') => {
    setNetworkState(newNetwork);
  };

  // ==================== Keypair Management ====================

  const createKeypair = async (): Promise<OraculoKeypairInfo> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setIsLoading(true);
      const keypair = await client.createKeypair();
      
      setGeneratedKeypairs(prev => {
        const newMap = new Map(prev);
        newMap.set(keypair.address, keypair);
        return newMap;
      });
      
      return keypair;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create keypair');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreKeypairFromBytes = async (bytes: Uint8Array): Promise<OraculoKeypairInfo> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setIsLoading(true);
      const keypair = await client.restoreKeypairFromBytes(bytes);
      
      setGeneratedKeypairs(prev => {
        const newMap = new Map(prev);
        newMap.set(keypair.address, keypair);
        return newMap;
      });
      
      return keypair;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore keypair');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreKeypairFromBase58 = async (base58: string): Promise<OraculoKeypairInfo> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setIsLoading(true);
      const keypair = await client.restoreKeypairFromBase58(base58);
      
      setGeneratedKeypairs(prev => {
        const newMap = new Map(prev);
        newMap.set(keypair.address, keypair);
        return newMap;
      });
      
      return keypair;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore keypair');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Token Operations ====================

  const getTokenInfo = async (mintAddress: PublicKey): Promise<OraculoTokenInfo> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      const info = await client.getTokenMint(mintAddress);
      
      setTokenInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(mintAddress.toString(), info);
        return newMap;
      });
      
      return info;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token info');
      throw err;
    }
  };

  const getTokenBalance = async (tokenAccount: PublicKey): Promise<number> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      const balance = await client.getTokenAccountBalance(tokenAccount);
      return balance.uiAmount || 0;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token balance');
      throw err;
    }
  };

  // ==================== Market Operations ====================

  const createMarket = async (marketInfo: OraculoMarketInfo): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.createPredictionMarket(
        { address: publicKey.toString() }, // Mock signer
        marketInfo
      );
      
      setMarkets(prev => {
        const newMap = new Map(prev);
        newMap.set(marketInfo.marketId.toString(), marketInfo);
        return newMap;
      });
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const placeBet = async (marketId: PublicKey, outcomeIndex: number, amount: number): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.placeBet(
        { address: publicKey.toString() }, // Mock signer
        marketId,
        outcomeIndex,
        amount
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resolveMarket = async (marketId: PublicKey, winningOutcome: number): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.resolveMarket(
        { address: publicKey.toString() }, // Mock signer
        marketId,
        winningOutcome
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve market');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Transaction Operations ====================

  const sendSOL = async (recipient: PublicKey, amount: number): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.sendSOL(
        { address: publicKey.toString() }, // Mock signer
        recipient,
        amount
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send SOL');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTokens = async (recipient: PublicKey, mint: PublicKey, amount: number, decimals: number): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.sendTokens(
        { address: publicKey.toString() }, // Mock signer
        recipient,
        mint,
        amount,
        decimals
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tokens');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMemo = async (memo: string): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.addMemoToTransaction(
        { version: 0 }, // Mock transaction
        memo
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addPriorityFees = async (microLamports: number): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const signature = await client.addPriorityFees(
        { version: 0 }, // Mock transaction
        microLamports
      );
      
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add priority fees');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Airdrop & Testing ====================

  const requestAirdrop = async (amount: number = 1): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      const result = await client.getTestSOL(publicKey, amount);
      
      // Update balance after airdrop
      const balance = await client.getAccountBalance(publicKey);
      setWalletBalance(balance / LAMPORTS_PER_SOL);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request airdrop');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Monitoring ====================

  const monitorBalance = async (callback: (balance: number) => void): Promise<number> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    return await client.monitorBalance(publicKey, callback);
  };

  const monitorTransactions = async (callback: (signature: any) => void): Promise<void> => {
    if (!client) throw new Error('Client not initialized');
    if (!publicKey) throw new Error('Wallet not connected');
    
    await client.monitorTransactions(publicKey, callback);
  };

  // ==================== Utility Functions ====================

  const calculateTransactionCost = async (transaction: any): Promise<{ computeUnits: number; fee: number; totalCost: number }> => {
    if (!client) throw new Error('Client not initialized');
    
    return await client.calculateTransactionCost(transaction);
  };

  const getNetworkHealth = async (): Promise<string> => {
    if (!client) throw new Error('Client not initialized');
    
    return await client.connection.getHealth();
  };

  const getAccountInfo = async (pubkey: PublicKey): Promise<any> => {
    if (!client) throw new Error('Client not initialized');
    
    return await client.getAccountInfo(pubkey);
  };

  // ==================== Context Value ====================

  const contextValue: OraculoCookbookContextType = {
    // Client instance
    client: client!,
    
    // Network management
    network,
    setNetwork,
    networkInfo,
    
    // Wallet integration
    isWalletConnected: connected,
    walletPublicKey: publicKey,
    walletBalance,
    
    // Keypair management
    generatedKeypairs,
    createKeypair,
    restoreKeypairFromBytes,
    restoreKeypairFromBase58,
    
    // Token operations
    tokenInfo,
    getTokenInfo,
    getTokenBalance,
    
    // Market operations
    markets,
    createMarket,
    placeBet,
    resolveMarket,
    
    // Transaction operations
    sendSOL,
    sendTokens,
    addMemo,
    addPriorityFees,
    
    // Airdrop & testing
    requestAirdrop,
    
    // Monitoring
    monitorBalance,
    monitorTransactions,
    
    // Utility functions
    calculateTransactionCost,
    getNetworkHealth,
    getAccountInfo,
    
    // Loading states
    isLoading,
    error
  };

  // ==================== Render ====================

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Initializing Oraculo Cookbook Client...</p>
        </div>
      </div>
    );
  }

  return (
    <OraculoCookbookContext.Provider value={contextValue}>
      {children}
    </OraculoCookbookContext.Provider>
  );
}

// ==================== Export ====================

export default OraculoCookbookProvider;
