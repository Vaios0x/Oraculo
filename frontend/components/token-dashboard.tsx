"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { OraculoRpcClient, createDevnetRpcClient } from "@/lib/rpc-client";
import { OraculoWebSocketClient, createDevnetWebSocketClient } from "@/lib/websocket-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: {
    amount: string;
    uiAmount: number | null;
    uiAmountString: string;
  };
  largestAccounts: Array<{
    address: string;
    amount: string;
    uiAmount: number | null;
    uiAmountString: string;
  }>;
  ownerAccounts: Array<{
    pubkey: string;
    account: {
      data: any;
      lamports: number;
      owner: string;
    };
  }>;
}

export function TokenDashboard() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [rpcClient] = useState(() => createDevnetRpcClient());
  const [wsClient] = useState(() => createDevnetWebSocketClient());
  
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);

  // Tokens de ejemplo para demostración
  const exampleTokens = [
    {
      mint: "So11111111111111111111111111111111111111112", // Wrapped SOL
      name: "Wrapped SOL",
      symbol: "WSOL",
    },
    {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      name: "USD Coin",
      symbol: "USDC",
    },
    {
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      name: "Tether USD",
      symbol: "USDT",
    },
  ];

  const fetchTokenInfo = async (mint: string, name: string, symbol: string): Promise<TokenInfo> => {
    const mintPubkey = new PublicKey(mint);
    
    const [supply, largestAccounts] = await Promise.all([
      rpcClient.getTokenSupply(mintPubkey),
      rpcClient.getTokenLargestAccounts(mintPubkey),
    ]);

    let ownerAccounts: any[] = [];
    if (publicKey) {
      try {
        ownerAccounts = await rpcClient.getTokenAccountsByOwner(
          publicKey,
          new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        );
      } catch (error) {
        console.warn("Could not fetch owner accounts:", error);
      }
    }

    return {
      mint,
      name,
      symbol,
      decimals: supply.decimals,
      supply,
      largestAccounts,
      ownerAccounts,
    };
  };

  const loadTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenPromises = exampleTokens.map(token => 
        fetchTokenInfo(token.mint, token.name, token.symbol)
      );

      const tokenData = await Promise.all(tokenPromises);
      setTokens(tokenData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, [publicKey]);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatTokenAmount = (amount: string, decimals: number): string => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return formatNumber(num);
  };

  if (isLoading && tokens.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <Activity className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Token Dashboard</h2>
          <p className="text-gray-600">
            Real-time token information and balances
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadTokens}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowPrivateInfo(!showPrivateInfo)}
            size="sm"
            variant="outline"
          >
            {showPrivateInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPrivateInfo ? 'Hide' : 'Show'} Private
          </Button>
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Token Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => (
          <Card key={token.mint}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{token.name}</CardTitle>
                  <CardDescription>{token.symbol}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {token.decimals} decimals
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Supply Information */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Supply</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatTokenAmount(token.supply.amount, token.decimals)} {token.symbol}
                </div>
                <p className="text-xs text-gray-500">
                  Raw: {token.supply.amount}
                </p>
              </div>

              {/* Largest Holders */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Top Holders</span>
                </div>
                <div className="space-y-1">
                  {token.largestAccounts.slice(0, 3).map((holder, index) => (
                    <div key={holder.address} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        #{index + 1} {holder.address.slice(0, 8)}...
                      </span>
                      <span className="font-medium">
                        {formatTokenAmount(holder.amount, token.decimals)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User's Token Accounts */}
              {showPrivateInfo && publicKey && token.ownerAccounts.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Your Accounts</span>
                  </div>
                  <div className="space-y-1">
                    {token.ownerAccounts.map((account, index) => (
                      <div key={account.pubkey} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Account {index + 1}
                        </span>
                        <span className="font-medium">
                          {account.account.lamports / 1e9} SOL
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Network Stats */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Decimals</p>
                    <p className="font-semibold">{token.decimals}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Holders</p>
                    <p className="font-semibold">{token.largestAccounts.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Token Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tokens.length}
              </div>
              <div className="text-sm text-gray-600">Tokens Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tokens.reduce((sum, token) => sum + token.largestAccounts.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Holders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {publicKey ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-sm text-gray-600">Wallet Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
