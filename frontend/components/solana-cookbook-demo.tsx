"use client";

import React, { useState, useEffect } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { useOraculoCookbook } from './solana-cookbook-provider';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap, 
  Activity, 
  BarChart3, 
  Settings,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Plus,
  Send,
  Download,
  Upload
} from 'lucide-react';

// ==================== Demo Component ====================

export function OraculoSolanaCookbookDemo() {
  const {
    // Client & Network
    client,
    network,
    setNetwork,
    networkInfo,
    
    // Wallet
    isWalletConnected,
    walletPublicKey,
    walletBalance,
    
    // Keypair management
    generatedKeypairs,
    createKeypair,
    restoreKeypairFromBytes,
    restoreKeypairFromBase58,
    
    // Token operations
    tokenInfo,
    getTokenInfo,
    getTokenBalance,
    
    // Market operations
    markets,
    createMarket,
    placeBet,
    resolveMarket,
    
    // Transaction operations
    sendSOL,
    sendTokens,
    addMemo,
    addPriorityFees,
    
    // Airdrop & testing
    requestAirdrop,
    
    // Monitoring
    monitorBalance,
    monitorTransactions,
    
    // Utility functions
    calculateTransactionCost,
    getNetworkHealth,
    getAccountInfo,
    
    // Loading states
    isLoading,
    error
  } = useOraculoCookbook();

  // ==================== Local State ====================
  
  const [activeTab, setActiveTab] = useState<'wallet' | 'tokens' | 'markets' | 'transactions' | 'monitoring'>('wallet');
  const [demoResults, setDemoResults] = useState<string[]>([]);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [selectedKeypair, setSelectedKeypair] = useState<string | null>(null);
  const [newMarketTitle, setNewMarketTitle] = useState('');
  const [newMarketDescription, setNewMarketDescription] = useState('');
  const [newMarketOutcomes, setNewMarketOutcomes] = useState<string[]>(['']);

  // ==================== Demo Functions ====================

  const addDemoResult = (result: string) => {
    setDemoResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const clearDemoResults = () => {
    setDemoResults([]);
  };

  // ==================== Wallet Management Demos ====================

  const runWalletDemo = async () => {
    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Wallet Management Demo...');

    try {
      // 1. Create new keypair
      addDemoResult('📝 Creating new keypair...');
      const newKeypair = await createKeypair();
      addDemoResult(`✅ Created keypair: ${newKeypair.address}`);
      setSelectedKeypair(newKeypair.address);

      // 2. Restore keypair from bytes (simulated)
      addDemoResult('🔄 Testing keypair restoration...');
      const testBytes = new Uint8Array(64).fill(1);
      const restoredKeypair = await restoreKeypairFromBytes(testBytes);
      addDemoResult(`✅ Restored keypair: ${restoredKeypair.address}`);

      // 3. Restore keypair from Base58 (simulated)
      addDemoResult('🔑 Testing Base58 restoration...');
      const testBase58 = '5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG';
      const base58Keypair = await restoreKeypairFromBase58(testBase58);
      addDemoResult(`✅ Base58 keypair: ${base58Keypair.address}`);

      // 4. Sign and verify message
      addDemoResult('✍️ Testing message signing...');
      const message = 'Hello Oraculo!';
      const { signature, verified } = await client.signAndVerifyMessage(testBytes, message);
      addDemoResult(`✅ Signature: ${signature.substring(0, 20)}...`);
      addDemoResult(`✅ Verified: ${verified}`);

      addDemoResult('🎉 Wallet Management Demo completed successfully!');
    } catch (err) {
      addDemoResult(`❌ Error in wallet demo: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Token Operations Demos ====================

  const runTokenDemo = async () => {
    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Token Operations Demo...');

    try {
      // 1. Get token info for a known mint
      addDemoResult('🪙 Getting token information...');
      const testMint = new PublicKey('So11111111111111111111111111111111111111112'); // Wrapped SOL
      const tokenInfo = await getTokenInfo(testMint);
      addDemoResult(`✅ Token decimals: ${tokenInfo.decimals}`);
      addDemoResult(`✅ Token supply: ${tokenInfo.supply}`);

      // 2. Get token balance (if wallet connected)
      if (isWalletConnected && walletPublicKey) {
        addDemoResult('💰 Getting token balance...');
        try {
          const balance = await getTokenBalance(walletPublicKey);
          addDemoResult(`✅ Token balance: ${balance}`);
        } catch (err) {
          addDemoResult(`ℹ️ No token account found for this mint`);
        }
      }

      // 3. Send SOL (if wallet connected)
      if (isWalletConnected && walletPublicKey) {
        addDemoResult('💸 Testing SOL transfer...');
        try {
          const recipient = new PublicKey('11111111111111111111111111111111');
          const signature = await sendSOL(recipient, 0.001);
          addDemoResult(`✅ SOL transfer signature: ${signature.substring(0, 20)}...`);
        } catch (err) {
          addDemoResult(`ℹ️ SOL transfer test skipped: ${err}`);
        }
      }

      addDemoResult('🎉 Token Operations Demo completed successfully!');
    } catch (err) {
      addDemoResult(`❌ Error in token demo: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Market Operations Demos ====================

  const runMarketDemo = async () => {
    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Market Operations Demo...');

    try {
      // 1. Create a new market
      addDemoResult('📊 Creating new prediction market...');
      const marketInfo = {
        marketId: new PublicKey(Keypair.generate().publicKey),
        title: newMarketTitle || 'Demo Market',
        description: newMarketDescription || 'This is a demo market for testing',
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        outcomeOptions: newMarketOutcomes.filter(o => o.trim() !== '') || ['Yes', 'No'],
        totalStaked: 0,
        isResolved: false
      };

      const marketSignature = await createMarket(marketInfo);
      addDemoResult(`✅ Market created: ${marketSignature.substring(0, 20)}...`);

      // 2. Place a bet (simulated)
      addDemoResult('🎯 Placing bet on market...');
      try {
        const betSignature = await placeBet(marketInfo.marketId, 0, 100);
        addDemoResult(`✅ Bet placed: ${betSignature.substring(0, 20)}...`);
      } catch (err) {
        addDemoResult(`ℹ️ Bet placement simulated: ${err}`);
      }

      // 3. Resolve market (simulated)
      addDemoResult('🏁 Resolving market...');
      try {
        const resolveSignature = await resolveMarket(marketInfo.marketId, 0);
        addDemoResult(`✅ Market resolved: ${resolveSignature.substring(0, 20)}...`);
      } catch (err) {
        addDemoResult(`ℹ️ Market resolution simulated: ${err}`);
      }

      addDemoResult('🎉 Market Operations Demo completed successfully!');
    } catch (err) {
      addDemoResult(`❌ Error in market demo: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Transaction Operations Demos ====================

  const runTransactionDemo = async () => {
    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Transaction Operations Demo...');

    try {
      // 1. Calculate transaction cost
      addDemoResult('💰 Calculating transaction cost...');
      const mockTransaction = { version: 0 };
      const cost = await calculateTransactionCost(mockTransaction);
      addDemoResult(`✅ Compute units: ${cost.computeUnits}`);
      addDemoResult(`✅ Fee: ${cost.fee} lamports`);
      addDemoResult(`✅ Total cost: ${cost.totalCost} lamports`);

      // 2. Add memo to transaction
      addDemoResult('📝 Adding memo to transaction...');
      const memoSignature = await addMemo('Oraculo Cookbook Demo');
      addDemoResult(`✅ Memo added: ${memoSignature.substring(0, 20)}...`);

      // 3. Add priority fees
      addDemoResult('⚡ Adding priority fees...');
      const prioritySignature = await addPriorityFees(5000);
      addDemoResult(`✅ Priority fees added: ${prioritySignature.substring(0, 20)}...`);

      // 4. Get network health
      addDemoResult('🏥 Checking network health...');
      const health = await getNetworkHealth();
      addDemoResult(`✅ Network health: ${health}`);

      addDemoResult('🎉 Transaction Operations Demo completed successfully!');
    } catch (err) {
      addDemoResult(`❌ Error in transaction demo: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Monitoring Demos ====================

  const runMonitoringDemo = async () => {
    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Monitoring Demo...');

    try {
      if (isWalletConnected && walletPublicKey) {
        // 1. Monitor balance
        addDemoResult('👀 Starting balance monitoring...');
        const balanceInterval = await monitorBalance((balance) => {
          addDemoResult(`💰 Balance update: ${balance.toFixed(4)} SOL`);
        });
        addDemoResult(`✅ Balance monitoring started (interval: ${balanceInterval})`);

        // 2. Monitor transactions
        addDemoResult('📊 Starting transaction monitoring...');
        await monitorTransactions((signature) => {
          addDemoResult(`📝 New transaction: ${signature.signature.substring(0, 20)}...`);
        });
        addDemoResult('✅ Transaction monitoring started');

        // 3. Get account info
        addDemoResult('🔍 Getting account information...');
        const accountInfo = await getAccountInfo(walletPublicKey);
        addDemoResult(`✅ Account lamports: ${accountInfo?.lamports || 'N/A'}`);
        addDemoResult(`✅ Account owner: ${accountInfo?.owner || 'N/A'}`);
      } else {
        addDemoResult('ℹ️ Wallet not connected - monitoring demo skipped');
      }

      addDemoResult('🎉 Monitoring Demo completed successfully!');
    } catch (err) {
      addDemoResult(`❌ Error in monitoring demo: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Airdrop Demo ====================

  const runAirdropDemo = async () => {
    if (!isWalletConnected) {
      addDemoResult('❌ Wallet not connected - cannot request airdrop');
      return;
    }

    setIsRunningDemo(true);
    addDemoResult('🚀 Starting Airdrop Demo...');

    try {
      const result = await requestAirdrop(1);
      addDemoResult(`✅ ${result}`);
      addDemoResult(`💰 New balance: ${walletBalance.toFixed(4)} SOL`);
    } catch (err) {
      addDemoResult(`❌ Airdrop failed: ${err}`);
    } finally {
      setIsRunningDemo(false);
    }
  };

  // ==================== Network Info Display ====================

  const renderNetworkInfo = () => {
    if (!networkInfo) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-purple-600" />
          Network Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Network</p>
            <p className="text-lg font-semibold capitalize">{network}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Slot</p>
            <p className="text-lg font-semibold">{networkInfo.slot.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Block Height</p>
            <p className="text-lg font-semibold">{networkInfo.blockHeight.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Health</p>
            <p className="text-lg font-semibold text-green-600">{networkInfo.health}</p>
          </div>
        </div>
      </div>
    );
  };

  // ==================== Wallet Info Display ====================

  const renderWalletInfo = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-purple-600" />
          Wallet Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Connection Status</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              isWalletConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isWalletConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {walletPublicKey && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Public Key</span>
              <span className="text-sm font-mono text-gray-900">
                {walletPublicKey.toString().substring(0, 20)}...
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Balance</span>
            <span className="text-sm font-semibold text-gray-900">
              {walletBalance.toFixed(4)} SOL
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ==================== Generated Keypairs Display ====================

  const renderGeneratedKeypairs = () => {
    if (generatedKeypairs.size === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-purple-600" />
          Generated Keypairs
        </h3>
        <div className="space-y-2">
          {Array.from(generatedKeypairs.values()).map((keypair, index) => (
            <div key={keypair.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-mono text-gray-900">
                  {keypair.address.substring(0, 20)}...
                </p>
                <p className="text-xs text-gray-500">Keypair #{index + 1}</p>
              </div>
              <button
                onClick={() => setSelectedKeypair(keypair.address)}
                className={`px-3 py-1 rounded-full text-xs ${
                  selectedKeypair === keypair.address
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {selectedKeypair === keypair.address ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== Demo Results Display ====================

  const renderDemoResults = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Demo Results
          </h3>
          <button
            onClick={clearDemoResults}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {demoResults.length === 0 ? (
            <p className="text-gray-500">No demo results yet. Run a demo to see output here.</p>
          ) : (
            demoResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ==================== Main Render ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Oráculo Solana Cookbook Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Network:</span>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="devnet">Devnet</option>
                  <option value="mainnet">Mainnet</option>
                  <option value="testnet">Testnet</option>
                  <option value="local">Local</option>
                </select>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 text-purple-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network & Wallet Info */}
        {renderNetworkInfo()}
        {renderWalletInfo()}
        {renderGeneratedKeypairs()}

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-600" />
            Demo Controls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={runWalletDemo}
              disabled={isRunningDemo}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Wallet Demo
            </button>
            <button
              onClick={runTokenDemo}
              disabled={isRunningDemo}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="h-4 w-4 mr-2" />
              Token Demo
            </button>
            <button
              onClick={runMarketDemo}
              disabled={isRunningDemo}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Market Demo
            </button>
            <button
              onClick={runTransactionDemo}
              disabled={isRunningDemo}
              className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4 mr-2" />
              Transaction Demo
            </button>
            <button
              onClick={runMonitoringDemo}
              disabled={isRunningDemo}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Activity className="h-4 w-4 mr-2" />
              Monitoring Demo
            </button>
          </div>
          
          {isWalletConnected && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={runAirdropDemo}
                disabled={isRunningDemo}
                className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-2" />
                Request Airdrop (1 SOL)
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Error:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Demo Results */}
        {renderDemoResults()}
      </div>
    </div>
  );
}

export default OraculoSolanaCookbookDemo;
