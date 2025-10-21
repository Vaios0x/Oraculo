"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, Commitment } from "@solana/web3.js";

// Optimized RPC endpoints configuration
const RPC_ENDPOINTS = {
  [WalletAdapterNetwork.Mainnet]: {
    primary: "https://api.mainnet-beta.solana.com",
    fallback: "https://solana-api.projectserum.com",
    rateLimit: {
      requestsPer10s: 100,
      requestsPer10sPerRPC: 40,
      maxConcurrent: 40,
      maxConnectionRate: 40,
      maxDataPer30s: 100 * 1024 * 1024, // 100 MB
    }
  },
  [WalletAdapterNetwork.Devnet]: {
    primary: "https://api.devnet.solana.com",
    fallback: "https://devnet.helius-rpc.com",
    rateLimit: {
      requestsPer10s: 100,
      requestsPer10sPerRPC: 40,
      maxConcurrent: 40,
      maxConnectionRate: 40,
      maxDataPer30s: 100 * 1024 * 1024, // 100 MB
    }
  },
  [WalletAdapterNetwork.Testnet]: {
    primary: "https://api.testnet.solana.com",
    fallback: "https://testnet.helius-rpc.com",
    rateLimit: {
      requestsPer10s: 100,
      requestsPer10sPerRPC: 40,
      maxConcurrent: 40,
      maxConnectionRate: 40,
      maxDataPer30s: 100 * 1024 * 1024, // 100 MB
    }
  }
};

// Get optimized endpoint with fallback support
function getOptimizedEndpoint(network: WalletAdapterNetwork): string {
  const config = RPC_ENDPOINTS[network];
  if (!config) {
    console.warn(`Unknown network: ${network}, falling back to devnet`);
    return RPC_ENDPOINTS[WalletAdapterNetwork.Devnet].primary;
  }
  
  // In production, you might want to implement load balancing
  // For now, we'll use the primary endpoint
  return config.primary;
}

// Create optimized connection with proper configuration
function createOptimizedConnection(endpoint: string, network: WalletAdapterNetwork): Connection {
  const config = RPC_ENDPOINTS[network];
  const commitment: Commitment = 'confirmed';
  
  return new Connection(endpoint, {
    commitment,
    confirmTransactionInitialTimeout: 60000, // 60 seconds
    wsEndpoint: network === WalletAdapterNetwork.Mainnet 
      ? 'wss://api.mainnet-beta.solana.com'
      : network === WalletAdapterNetwork.Devnet
      ? 'wss://api.devnet.solana.com'
      : 'wss://api.testnet.solana.com',
  });
}

// Import wallet adapter CSS
require("@solana/wallet-adapter-react-ui/styles.css");

interface SolanaContextType {
  network: WalletAdapterNetwork;
  setNetwork: (network: WalletAdapterNetwork) => void;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export function useSolana() {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);

  // Configure wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  // Configure RPC endpoint with optimized settings
  const endpoint = getOptimizedEndpoint(network);

  // Create optimized connection
  const connection = createOptimizedConnection(endpoint, network);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaContext.Provider value={{ network, setNetwork }}>
            {children}
          </SolanaContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
