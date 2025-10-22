"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useSolana } from './solana-provider';
import { useResponsive } from '../lib/responsive';
import { 
  Wallet, 
  Wifi, 
  WifiOff, 
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

/**
 * 🔮 WalletButton Component - Botón de conexión de wallet
 * 
 * Componente que maneja la conexión y desconexión de wallets
 * con integración completa del Solana Wallet Adapter
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function WalletButton() {
  const { publicKey, connected, connecting, disconnecting, connect, disconnect, select } = useWallet();
  const { network, setNetwork } = useSolana();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNetworkColor = (network: WalletAdapterNetwork) => {
    switch (network) {
      case WalletAdapterNetwork.Mainnet:
        return 'text-green-600 bg-green-100';
      case WalletAdapterNetwork.Devnet:
        return 'text-orange-600 bg-orange-100';
      case WalletAdapterNetwork.Testnet:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNetworkName = (network: WalletAdapterNetwork) => {
    switch (network) {
      case WalletAdapterNetwork.Mainnet:
        return 'Mainnet';
      case WalletAdapterNetwork.Devnet:
        return 'Devnet';
      case WalletAdapterNetwork.Testnet:
        return 'Testnet';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {/* Network Status */}
      <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Network:</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getNetworkColor(network)}`}>
          {getNetworkName(network)}
        </div>
      </div>

      {/* Wallet Connection Status */}
      {connected && publicKey ? (
        <div className="space-y-3">
          {/* Connected Status */}
          <div className="flex items-center space-x-2 p-3 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700 font-medium">Wallet Connected</span>
          </div>

          {/* Wallet Address */}
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="space-y-2">
              <span className="text-sm text-gray-500">Address:</span>
              <div className="bg-black/20 p-2 rounded border border-green-400/20">
                <span className="text-xs font-mono matrix-text-green break-all leading-relaxed">
                  {publicKey.toString()}
                </span>
              </div>
            </div>
          </div>

          {/* Disconnect Button */}
          {isClient && (
            <WalletDisconnectButton className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2" />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Not Connected Status */}
          <div className="flex items-center space-x-2 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700 font-medium">Wallet Not Connected</span>
          </div>

          {/* Connect Button */}
          {isClient && (
            <WalletMultiButton className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2" />
          )}
        </div>
      )}

      {/* Network Selector */}
      <div className="space-y-2">
        <label className={`font-medium text-gray-700 ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>Select Network:</label>
        <div className={`grid gap-2 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-3'
        }`}>
          {[
            { network: WalletAdapterNetwork.Devnet, label: 'Devnet', color: 'bg-orange-500' },
            { network: WalletAdapterNetwork.Testnet, label: 'Testnet', color: 'bg-blue-500' },
            { network: WalletAdapterNetwork.Mainnet, label: 'Mainnet', color: 'bg-green-500' }
          ].map(({ network: net, label, color }) => (
            <button
              key={net}
              onClick={() => setNetwork(net)}
              className={`px-3 py-2 font-medium rounded-lg transition-colors ${
                isMobile ? 'text-xs' : 'text-xs'
              } ${
                network === net
                  ? `${color} text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Info */}
      {isClient && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supported wallets: Phantom, Solflare</p>
          <p>• Network: {getNetworkName(network)}</p>
          <p>• Status: {connected ? 'Connected' : 'Disconnected'}</p>
        </div>
      )}
    </div>
  );
}

export default WalletButton;
