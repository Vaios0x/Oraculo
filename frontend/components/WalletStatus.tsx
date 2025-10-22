"use client";

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolana } from './solana-provider';
import { 
  Wallet, 
  Wifi, 
  WifiOff, 
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

/**
 * 🔮 WalletStatus Component - Estado de la wallet
 * 
 * Componente que muestra el estado de conexión de la wallet
 * de forma compacta en la interfaz
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function WalletStatus() {
  const { publicKey, connected, connecting, disconnecting } = useWallet();
  const { network } = useSolana();

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'mainnet-beta':
        return 'text-green-600 bg-green-100';
      case 'devnet':
        return 'text-orange-600 bg-orange-100';
      case 'testnet':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'mainnet-beta':
        return 'Mainnet';
      case 'devnet':
        return 'Devnet';
      case 'testnet':
        return 'Testnet';
      default:
        return 'Unknown';
    }
  };

  if (connecting) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-blue-700 font-medium">Conectando...</span>
      </div>
    );
  }

  if (disconnecting) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-yellow-700 font-medium">Desconectando...</span>
      </div>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-700 font-medium">Wallet Conectada</span>
        </div>
        
        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Address:</span>
            </div>
            <div className="bg-black/20 p-1 rounded border border-green-400/20">
              <span className="text-xs font-mono matrix-text-green break-all leading-relaxed">
                {publicKey.toString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Network:</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getNetworkColor(network)}`}>
            {getNetworkName(network)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <span className="text-sm text-red-700 font-medium">Wallet No Conectada</span>
    </div>
  );
}

export default WalletStatus;
