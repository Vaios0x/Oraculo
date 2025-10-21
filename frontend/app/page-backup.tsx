"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Home, 
  Plus, 
  Wifi, 
  BarChart3, 
  Coins, 
  Shield, 
  TrendingUp,
  BookOpen,
  Code,
  Zap,
  Activity,
  Settings
} from 'lucide-react';
import { CreateMarketForm } from '../components/create-market-form-simple';
import { NeuralBackground } from '../components/neural-background';
import { NeuralCard } from '../components/neural-card';
import { NeuralButton } from '../components/neural-button';
import { NeuralNav } from '../components/neural-nav';
import { NeuralHeader } from '../components/neural-header';

// Mock data for demonstration
const mockMarkets = [
  {
    id: '1',
    title: 'Bitcoin Price Prediction',
    description: 'Will Bitcoin reach $100,000 by end of 2024?',
    endTime: new Date('2024-12-31'),
    totalStaked: 15000,
    isResolved: false,
    outcomes: ['Yes', 'No']
  },
  {
    id: '2',
    title: 'Ethereum Merge Success',
    description: 'Will Ethereum successfully complete the merge?',
    endTime: new Date('2024-06-30'),
    totalStaked: 25000,
    isResolved: true,
    winningOutcome: 'Yes',
    outcomes: ['Yes', 'No']
  },
  {
    id: '3',
    title: 'Solana TPS Milestone',
    description: 'Will Solana achieve 100,000 TPS in 2024?',
    endTime: new Date('2024-12-31'),
    totalStaked: 8000,
    isResolved: false,
    outcomes: ['Yes', 'No', 'Maybe']
  }
];

export default function OraculoApp() {
  const { publicKey, signTransaction } = useWallet();
  const [activeTab, setActiveTab] = useState('markets');
  const [isClient, setIsClient] = useState(false);
  const [randomPercentages, setRandomPercentages] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Generate random percentages for client-side only
    setRandomPercentages(mockMarkets.map(() => Math.floor(Math.random() * 100)));
  }, []);

  const handleResolve = async (marketId: string, winningOutcome: string) => {
    // Mock resolve functionality
    console.log(`Resolving market ${marketId} with outcome: ${winningOutcome}`);
  };

  const navItems = [
    { id: 'markets', label: 'Markets', icon: <Home className="w-4 h-4" /> },
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tokens', label: 'Tokens', icon: <Coins className="w-4 h-4" /> },
    { id: 'migration', label: 'Migration', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookbook', label: 'Cookbook', icon: <BookOpen className="w-4 h-4" /> }
  ];

  return (
    <NeuralBackground intensity="medium" className="min-h-screen">
      {/* Neural Header */}
      <NeuralHeader
        title="Oráculo"
        subtitle="Prediction Markets on Solana"
        logo={<TrendingUp className="h-8 w-8 text-neural-primary" />}
        glow={true}
        shimmer={true}
        aiBrain={true}
        actions={
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Network:</span>
              <span className="neural-status">
                Devnet
              </span>
            </div>
            {publicKey ? (
              <div className="neural-connection">
                <div className="neural-pulse-dot"></div>
                <span className="text-sm text-gray-600">
                  {publicKey.toString().substring(0, 8)}...
                </span>
              </div>
            ) : (
              <NeuralButton
                onClick={() => console.log('Connect wallet')}
                glow={true}
                shimmer={true}
                aiBrain={true}
              >
                Connect Wallet
              </NeuralButton>
            )}
          </div>
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Neural Navigation */}
        <div className="mb-8">
          <NeuralNav
            items={navItems}
            activeItem={activeTab}
            onItemClick={(item) => setActiveTab(item.id)}
            glow={true}
            shimmer={true}
            hologram={true}
            aiBrain={true}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Prediction Markets</h2>
              <NeuralButton
                onClick={() => setActiveTab('create')}
                glow={true}
                shimmer={true}
                aiBrain={true}
              >
                Create Market
              </NeuralButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMarkets.map((market, index) => (
                <NeuralCard
                  key={market.id}
                  hover={true}
                  glow={true}
                  shimmer={true}
                  hologram={true}
                  aiBrain={true}
                  className="neural-floating"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">{market.title}</h3>
                      {market.isResolved ? (
                        <div className="flex items-center space-x-2">
                          <div className="neural-pulse-dot bg-green-500"></div>
                          <span className="text-sm text-green-600 font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-neural-pulse"></div>
                          <span className="text-sm text-orange-600 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2">{market.description}</p>
                    
                    <div className="space-y-3">
                      {market.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex justify-between items-center p-2 neural-glass rounded-lg">
                          <span className="text-sm text-gray-600">{outcome}</span>
                          <span className="text-sm font-medium text-neural-primary">
                            {isClient ? (randomPercentages[outcomeIndex] || 0) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="neural-glass p-3 rounded-lg">
                        <span className="text-gray-500 block">Total Staked</span>
                        <span className="text-neural-primary font-semibold">
                          {market.totalStaked.toLocaleString()} SOL
                        </span>
                      </div>
                      <div className="neural-glass p-3 rounded-lg">
                        <span className="text-gray-500 block">Ends</span>
                        <span className="text-gray-900 font-semibold">
                          {market.endTime.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {market.isResolved ? (
                      <div className="neural-connection p-3 rounded-lg">
                        <span className="text-sm text-green-700">
                          Resolved: {market.winningOutcome}
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <NeuralButton
                          onClick={() => console.log(`Stake on ${market.id}`)}
                          size="sm"
                          glow={true}
                          shimmer={true}
                          className="flex-1"
                        >
                          Stake
                        </NeuralButton>
                        {publicKey && (
                          <NeuralButton
                            onClick={() => handleResolve(market.id, 'Yes')}
                            variant="secondary"
                            size="sm"
                            glow={true}
                          >
                            Resolve
                          </NeuralButton>
                        )}
                      </div>
                    )}
                  </div>
                </NeuralCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <CreateMarketForm />
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Network Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Current Slot</h3>
                  <p className="text-4xl font-bold text-neural-primary neural-text-glow">2,847,392</p>
                  <p className="text-sm text-gray-500 mt-2">Last updated: 2 seconds ago</p>
                </div>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">TPS</h3>
                  <p className="text-4xl font-bold text-green-600 neural-text-glow">3,247</p>
                  <p className="text-sm text-gray-500 mt-2">Transactions per second</p>
                </div>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Health</h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="neural-pulse-dot bg-green-500"></div>
                    <span className="text-lg font-medium text-green-600 neural-text-glow">Healthy</span>
                  </div>
                  <p className="text-sm text-gray-500">All systems operational</p>
                </div>
              </NeuralCard>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Total Markets</h3>
                  <p className="text-4xl font-bold text-neural-primary neural-text-glow">24</p>
                  <p className="text-sm text-gray-500 mt-2">+3 this week</p>
                </div>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Total Volume</h3>
                  <p className="text-4xl font-bold text-green-600 neural-text-glow">1,247 SOL</p>
                  <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
                </div>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Active Users</h3>
                  <p className="text-4xl font-bold text-blue-600 neural-text-glow">1,892</p>
                  <p className="text-sm text-gray-500 mt-2">+8% from last week</p>
                </div>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Success Rate</h3>
                  <p className="text-4xl font-bold text-orange-600 neural-text-glow">94.2%</p>
                  <p className="text-sm text-gray-500 mt-2">Markets resolved correctly</p>
                </div>
              </NeuralCard>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Token Management</h2>
            
            <NeuralCard
              hover={true}
              glow={true}
              shimmer={true}
              aiBrain={true}
              className="neural-floating"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 neural-text-glow">Your Tokens</h3>
              <div className="space-y-4">
                <div className="neural-glass p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 neural-text-glow">SOL</p>
                      <p className="text-sm text-gray-500">Native Solana token</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neural-primary neural-text-glow">2.5 SOL</p>
                      <p className="text-sm text-gray-500">$125.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="neural-glass p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 neural-text-glow">USDC</p>
                      <p className="text-sm text-gray-500">USD Coin</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neural-primary neural-text-glow">500 USDC</p>
                      <p className="text-sm text-gray-500">$500.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </NeuralCard>
          </div>
        )}

        {activeTab === 'migration' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Migration Status</h2>
            
            <NeuralCard
              hover={true}
              glow={true}
              shimmer={true}
              aiBrain={true}
              className="neural-floating"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 neural-text-glow">RPC Methods Migration</h3>
              <div className="space-y-4">
                <div className="neural-connection p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="neural-pulse-dot bg-green-500"></div>
                      <span className="font-medium text-gray-900 neural-text-glow">getSignatureStatuses</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Migrated</span>
                  </div>
                </div>
                
                <div className="neural-connection p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="neural-pulse-dot bg-green-500"></div>
                      <span className="font-medium text-gray-900 neural-text-glow">getBlock</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Migrated</span>
                  </div>
                </div>
                
                <div className="neural-connection p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="neural-pulse-dot bg-green-500"></div>
                      <span className="font-medium text-gray-900 neural-text-glow">getTransaction</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Migrated</span>
                  </div>
                </div>
              </div>
            </NeuralCard>
          </div>
        )}

        {activeTab === 'cookbook' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">Solana Cookbook Integration</h2>
              <NeuralButton
                onClick={() => window.open('/solana-cookbook', '_blank')}
                glow={true}
                shimmer={true}
                aiBrain={true}
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Demo</span>
              </NeuralButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <Code className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Wallet Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create, restore, and manage Solana wallets with advanced keypair operations.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Create keypairs</li>
                  <li>• Restore from bytes/Base58</li>
                  <li>• Sign and verify messages</li>
                  <li>• Mnemonic support</li>
                </ul>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Transaction Operations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Advanced transaction handling with optimization and monitoring.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Send SOL and tokens</li>
                  <li>• Calculate transaction costs</li>
                  <li>• Add memos and priority fees</li>
                  <li>• Optimize compute units</li>
                </ul>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <Activity className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Account Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Comprehensive account operations with PDA support and optimization.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Create accounts</li>
                  <li>• Calculate creation costs</li>
                  <li>• PDA operations</li>
                  <li>• Account validation</li>
                </ul>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <Coins className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Token Operations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Advanced token management with SPL token support and extensions.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Get token info and balances</li>
                  <li>• Filter by owner/mint</li>
                  <li>• Advanced token operations</li>
                  <li>• Token extensions support</li>
                </ul>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <Settings className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Best Practices</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Industry best practices for security, performance, and optimization.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Security validations</li>
                  <li>• Performance monitoring</li>
                  <li>• Error handling</li>
                  <li>• Optimization strategies</li>
                </ul>
              </NeuralCard>
              
              <NeuralCard
                hover={true}
                glow={true}
                shimmer={true}
                hologram={true}
                aiBrain={true}
                className="neural-floating"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 neural-glass rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Monitoring</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Real-time monitoring and analytics for network and transaction health.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Network health monitoring</li>
                  <li>• Transaction tracking</li>
                  <li>• Performance metrics</li>
                  <li>• Event subscriptions</li>
                </ul>
              </NeuralCard>
            </div>
          </div>
        )}
      </main>
    </NeuralBackground>
  );
}