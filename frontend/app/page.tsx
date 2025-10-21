"use client";

import React, { useState } from 'react';
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

  const handleResolve = async (marketId: string, winningOutcome: string) => {
    // Mock resolve functionality
    console.log(`Resolving market ${marketId} with outcome: ${winningOutcome}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Oráculo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Network:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Devnet
                </span>
              </div>
              {publicKey ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {publicKey.toString().substring(0, 8)}...
                  </span>
                </div>
              ) : (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'markets'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <Home />
              </div>
              <span>Markets</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <Plus />
              </div>
              <span>Create</span>
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'network'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <Wifi />
              </div>
              <span>Network</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <BarChart3 />
              </div>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tokens'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <Coins />
              </div>
              <span>Tokens</span>
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'migration'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <Shield />
              </div>
              <span>Migration</span>
            </button>
            <button
              onClick={() => setActiveTab('cookbook')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'cookbook'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4">
                <BookOpen />
              </div>
              <span>Cookbook</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Prediction Markets</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create Market
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMarkets.map((market) => (
                <div key={market.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{market.title}</h3>
                  <p className="text-gray-600 mb-4">{market.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {market.outcomes.map((outcome, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{outcome}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Total Staked</span>
                    <span className="text-sm font-medium text-gray-900">
                      {market.totalStaked.toLocaleString()} SOL
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Ends</span>
                    <span className="text-sm font-medium text-gray-900">
                      {market.endTime.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {market.isResolved ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">
                        Resolved: {market.winningOutcome}
                      </span>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        Stake
                      </button>
                      {publicKey && (
                        <button 
                          onClick={() => handleResolve(market.id, 'Yes')}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Prediction Market</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide more details about your prediction market..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome Options
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Yes"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="No"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Market
              </button>
            </form>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Network Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Slot</h3>
                <p className="text-3xl font-bold text-purple-600">2,847,392</p>
                <p className="text-sm text-gray-500">Last updated: 2 seconds ago</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">TPS</h3>
                <p className="text-3xl font-bold text-green-600">3,247</p>
                <p className="text-sm text-gray-500">Transactions per second</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Health</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg font-medium text-green-600">Healthy</span>
                </div>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Markets</h3>
                <p className="text-3xl font-bold text-purple-600">24</p>
                <p className="text-sm text-gray-500">+3 this week</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Volume</h3>
                <p className="text-3xl font-bold text-green-600">1,247 SOL</p>
                <p className="text-sm text-gray-500">+15% from last month</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-blue-600">1,892</p>
                <p className="text-sm text-gray-500">+8% from last week</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-orange-600">94.2%</p>
                <p className="text-sm text-gray-500">Markets resolved correctly</p>
              </div>
                        </div>
                      </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Token Management</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tokens</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                    <p className="font-medium text-gray-900">SOL</p>
                    <p className="text-sm text-gray-500">Native Solana token</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">2.5 SOL</p>
                    <p className="text-sm text-gray-500">$125.00</p>
                        </div>
                      </div>
                      
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                    <p className="font-medium text-gray-900">USDC</p>
                    <p className="text-sm text-gray-500">USD Coin</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">500 USDC</p>
                    <p className="text-sm text-gray-500">$500.00</p>
                  </div>
                </div>
                        </div>
                      </div>
          </div>
        )}

        {activeTab === 'migration' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Migration Status</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RPC Methods Migration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">getSignatureStatuses</span>
                  </div>
                  <span className="text-sm text-green-600">Migrated</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">getBlock</span>
                  </div>
                  <span className="text-sm text-green-600">Migrated</span>
                    </div>
                    
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">getTransaction</span>
                  </div>
                  <span className="text-sm text-green-600">Migrated</span>
                    </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cookbook' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Solana Cookbook Integration</h2>
              <a
                href="/solana-cookbook"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <div className="w-4 h-4">
                <BookOpen />
              </div>
                <span>Open Demo</span>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Wallet Management</h3>
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
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Operations</h3>
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
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
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
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Coins className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Token Operations</h3>
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
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Settings className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Best Practices</h3>
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
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Monitoring</h3>
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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}