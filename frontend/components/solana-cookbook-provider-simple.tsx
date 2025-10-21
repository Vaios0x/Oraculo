"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { OraculoSolanaCookbookClient } from '../lib/solana-cookbook-integration-simple';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface CookbookContextType {
  cookbookClient: OraculoSolanaCookbookClient | null;
}

const CookbookContext = createContext<CookbookContextType | undefined>(undefined);

export function useCookbook() {
  const context = useContext(CookbookContext);
  if (context === undefined) {
    throw new Error('useCookbook must be used within a CookbookProvider');
  }
  return context;
}

export function CookbookProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();

  const cookbookClient = useMemo(() => {
    if (!connection) return null;

    // Use the connection's endpoint
    const endpoint = connection.rpcEndpoint;
    return new OraculoSolanaCookbookClient(endpoint, connection.commitment);
  }, [connection]);

  return (
    <CookbookContext.Provider value={{ cookbookClient }}>
      {children}
    </CookbookContext.Provider>
  );
}
