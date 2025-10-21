"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

interface Market {
  id: string;
  title: string;
  description: string;
  endTime: number;
  outcomes: string[];
  totalStaked: number;
  outcomeStakes: number[];
  isResolved: boolean;
  winningOutcome?: number;
}

interface MarketCardProps {
  market: Market;
  onStake: (marketId: string, outcomeIndex: number, amount: number) => Promise<void>;
  onResolve: (marketId: string, winningOutcome: number) => Promise<void>;
}

export function MarketCard({ market, onStake, onResolve }: MarketCardProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStake = async () => {
    if (!publicKey || !selectedOutcome || !stakeAmount) return;
    
    setIsLoading(true);
    try {
      await onStake(market.id, selectedOutcome, parseFloat(stakeAmount));
      setStakeAmount("");
      setSelectedOutcome(null);
    } catch (error) {
      console.error("Error staking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      // For demo purposes, resolve with outcome 0
      await onResolve(market.id, 0);
    } catch (error) {
      console.error("Error resolving market:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return (amount / 1_000_000).toFixed(2) + " SOL";
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{market.title}</CardTitle>
            <CardDescription className="mt-2">{market.description}</CardDescription>
          </div>
          <Badge variant={market.isResolved ? "secondary" : "default"}>
            {market.isResolved ? "Resolved" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Staked</p>
              <p className="font-semibold">{formatAmount(market.totalStaked)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-semibold">{market.outcomeStakes.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Ends</p>
              <p className="font-semibold text-sm">{formatTime(market.endTime)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold">{market.isResolved ? "Closed" : "Open"}</p>
            </div>
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Outcomes</h3>
          <div className="grid gap-2">
            {market.outcomes.map((outcome, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedOutcome === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedOutcome(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{outcome}</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Staked: {formatAmount(market.outcomeStakes[index] || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {market.totalStaked > 0 
                        ? `${((market.outcomeStakes[index] || 0) / market.totalStaked * 100).toFixed(1)}%`
                        : "0%"
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stake Section */}
        {!market.isResolved && publicKey && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">Place Your Stake</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Amount (SOL)"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleStake}
                disabled={!selectedOutcome || !stakeAmount || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Staking..." : "Stake"}
              </Button>
            </div>
          </div>
        )}

        {/* Resolve Button (for market creator) */}
        {!market.isResolved && publicKey && (
          <div className="flex justify-end">
            <Button
              onClick={handleResolve}
              variant="outline"
              disabled={isLoading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              {isLoading ? "Resolving..." : "Resolve Market"}
            </Button>
          </div>
        )}

        {/* Winner Display */}
        {market.isResolved && market.winningOutcome !== undefined && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Market Resolved!</h3>
            <p className="text-green-700">
              Winning outcome: <strong>{market.outcomes[market.winningOutcome]}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
