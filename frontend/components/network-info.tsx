"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface NetworkInfo {
  network: string;
  endpoint: string;
  isConnected: boolean;
  blockHeight: number;
  slot: number;
  epoch: number;
  commitment: string;
  latency: number;
}

export function NetworkInfo() {
  const { connection } = useConnection();
  const { connected } = useWallet();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      if (!connection) return;
      
      try {
        setIsLoading(true);
        setError(null);

        const startTime = Date.now();
        
        // Fetch network information
        const [blockHeight, slot, epoch, commitment] = await Promise.all([
          connection.getBlockHeight(),
          connection.getSlot(),
          connection.getEpochInfo(),
          connection.getCommitment(),
        ]);

        const latency = Date.now() - startTime;

        setNetworkInfo({
          network: connection.rpcEndpoint.includes('mainnet') ? 'Mainnet' : 
                  connection.rpcEndpoint.includes('devnet') ? 'Devnet' : 
                  connection.rpcEndpoint.includes('testnet') ? 'Testnet' : 'Unknown',
          endpoint: connection.rpcEndpoint,
          isConnected: true,
          blockHeight,
          slot,
          epoch: epoch.epoch,
          commitment: commitment.toString(),
          latency,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setNetworkInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkInfo();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNetworkInfo, 30000);
    return () => clearInterval(interval);
  }, [connection]);

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'mainnet':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'devnet':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testnet':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 200) return 'text-green-600';
    if (latency < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm text-gray-600">Loading network info...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!networkInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Network Status</CardTitle>
            <CardDescription>Current Solana network information</CardDescription>
          </div>
          <Badge className={getNetworkColor(networkInfo.network)}>
            {networkInfo.network}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {networkInfo.isConnected ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm font-medium">
            {networkInfo.isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span className={`text-xs ${getLatencyColor(networkInfo.latency)}`}>
            ({networkInfo.latency}ms)
          </span>
        </div>

        {/* Network Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-600">Block Height</p>
              <p className="font-mono text-xs">{networkInfo.blockHeight.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-600">Slot</p>
              <p className="font-mono text-xs">{networkInfo.slot.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-600">Epoch</p>
              <p className="font-mono text-xs">{networkInfo.epoch}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-600">Commitment</p>
              <p className="font-mono text-xs">{networkInfo.commitment}</p>
            </div>
          </div>
        </div>

        {/* Endpoint Info */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-1">Endpoint:</p>
          <p className="font-mono text-xs break-all text-gray-700">
            {networkInfo.endpoint}
          </p>
        </div>

        {/* Wallet Status */}
        {connected && (
          <div className="pt-2 border-t">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Wallet Connected</span>
            </div>
          </div>
        )}

        {/* Network Warnings */}
        {networkInfo.network === 'Testnet' && (
          <div className="pt-2 border-t">
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Testnet may have intermittent downtime</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
