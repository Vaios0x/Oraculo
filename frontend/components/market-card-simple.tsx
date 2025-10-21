"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { formatDateWithTime } from '../lib/date-utils';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MarketCardProps {
  market: {
    id: string;
    title: string;
    description: string;
    outcomes: string[];
    totalStaked: number;
    endTime: number;
    isResolved: boolean;
    winningOutcome?: number;
  };
  onStake: (marketId: string, outcome: string, amount: number) => void;
  onResolve: (marketId: string, winningOutcome: string) => void;
}

export function MarketCard({ market, onStake, onResolve }: MarketCardProps) {
  const { publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [randomPercentage, setRandomPercentage] = useState(0);
  const [randomParticipants, setRandomParticipants] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setRandomPercentage(Math.floor(Math.random() * 100));
    setRandomParticipants(Math.floor(Math.random() * 100));
  }, []);

  const handleStakeClick = () => {
    // Placeholder for staking logic
    console.log(`Staking on market ${market.id}`);
    onStake(market.id, market.outcomes[0], 10); // Example stake
  };

  const handleResolveClick = () => {
    // Placeholder for resolve logic
    console.log(`Resolving market ${market.id}`);
    onResolve(market.id, market.outcomes[0]); // Example resolution
  };

  const formatTime = (timestamp: number) => {
    return formatDateWithTime(timestamp * 1000);
  };

  const getTimeRemaining = (timestamp: number) => {
    const now = Date.now() / 1000;
    const remaining = timestamp - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{market.title}</h3>
        {market.isResolved ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Resolved</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-orange-600 font-medium">
              {getTimeRemaining(market.endTime)}
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{market.description}</p>
      
      <div className="space-y-3 mb-4">
        {market.outcomes.map((outcome, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {outcome}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {/* Mock percentage for now */}
              {isClient ? randomPercentage : 0}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Total Staked</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {market.totalStaked.toLocaleString()} SOL
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {isClient ? randomParticipants : 0} participants
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Ends</span>
        <span className="text-sm font-medium text-gray-900">
          {formatTime(market.endTime)}
        </span>
      </div>
      
      {market.isResolved ? (
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-700">
            Resolved: {market.winningOutcome !== undefined ? market.outcomes[market.winningOutcome] : 'N/A'}
          </span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button 
            onClick={handleStakeClick}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
          >
            Stake
          </button>
          {publicKey && (
            <button 
              onClick={handleResolveClick}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
            >
              Resolve
            </button>
          )}
        </div>
      )}

      {!publicKey && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700">Connect wallet to participate</span>
          </div>
        </div>
      )}
    </div>
  );
}
