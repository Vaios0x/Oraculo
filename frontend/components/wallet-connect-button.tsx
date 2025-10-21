"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User } from "lucide-react";

export function WalletConnectButton() {
  const { wallet, connect, disconnect, connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
        <Button
          onClick={handleConnect}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </Button>
  );
}
