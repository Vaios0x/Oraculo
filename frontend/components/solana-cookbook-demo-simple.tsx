"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { useCookbook } from './solana-cookbook-provider-simple';
import { 
  Wallet, 
  Send, 
  Coins, 
  TrendingUp, 
  Activity,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function SolanaCookbookDemo() {
  const { publicKey, signTransaction } = useWallet();
  const { cookbookClient } = useCookbook();
  const [newKeypair, setNewKeypair] = useState<string | null>(null);
  const [restoredKeypair, setRestoredKeypair] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [solAmount, setSolAmount] = useState<number>(0.1);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wallet Management
  const handleCreateKeypair = async () => {
    if (!cookbookClient) return;
    
    setLoading(true);
    setError(null);
    try {
      const keypair = await cookbookClient.createKeypair();
      setNewKeypair(keypair.publicKey.toBase58());
    } catch (err) {
      setError('Error creating keypair');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreKeypair = async () => {
    if (!cookbookClient) return;
    
    setLoading(true);
    setError(null);
    try {
      // Generate a random keypair for demo
      const keypair = await cookbookClient.createKeypair();
      setRestoredKeypair(keypair.publicKey.toBase58());
    } catch (err) {
      setError('Error restoring keypair');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyKeypair = async () => {
    if (!cookbookClient || !newKeypair) return;
    
    setLoading(true);
    setError(null);
    try {
      const keypair = Keypair.generate(); // Demo keypair
      const isValid = await cookbookClient.verifyKeypair(keypair);
      console.log('Keypair verification:', isValid);
    } catch (err) {
      setError('Error verifying keypair');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignMessage = async () => {
    if (!cookbookClient) return;
    
    setLoading(true);
    setError(null);
    try {
      const keypair = Keypair.generate(); // Demo keypair
      const signature = await cookbookClient.signMessage('Hello Solana!', keypair);
      console.log('Message signature:', signature);
    } catch (err) {
      setError('Error signing message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Transaction Operations
  const handleSendSOL = async () => {
    if (!cookbookClient || !publicKey || !recipientAddress) return;
    
    setLoading(true);
    setError(null);
    try {
      const keypair = Keypair.generate(); // Demo keypair
      const signature = await cookbookClient.sendSol(
        keypair,
        new PublicKey(recipientAddress),
        solAmount
      );
      setTransactionSignature(signature);
    } catch (err) {
      setError('Error sending SOL');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTokens = async () => {
    if (!cookbookClient || !publicKey || !recipientAddress) return;
    
    setLoading(true);
    setError(null);
    try {
      const keypair = Keypair.generate(); // Demo keypair
      const mint = new PublicKey('11111111111111111111111111111111'); // Demo mint
      const signature = await cookbookClient.sendTokens(
        keypair,
        new PublicKey(recipientAddress),
        mint,
        solAmount
      );
      setTransactionSignature(signature);
    } catch (err) {
      setError('Error sending tokens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateCost = async () => {
    if (!cookbookClient) return;
    
    setLoading(true);
    setError(null);
    try {
      const transaction = new (await import('@solana/web3.js')).Transaction();
      const cost = await cookbookClient.calculateTransactionCost(transaction);
      console.log('Transaction cost:', cost, 'lamports');
    } catch (err) {
      setError('Error calculating cost');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Account Management
  const handleCreateAccount = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const payer = Keypair.generate(); // Demo keypair
      const newAccount = Keypair.generate();
      const signature = await cookbookClient.createAccount(payer, newAccount, 1000);
      console.log('Account created:', signature);
    } catch (err) {
      setError('Error creating account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBalance = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const balance = await cookbookClient.getBalance(publicKey);
      setSolBalance(balance);
    } catch (err) {
      setError('Error getting balance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAccountInfo = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const accountInfo = await cookbookClient.getAccountInfo(publicKey);
      console.log('Account info:', accountInfo);
    } catch (err) {
      setError('Error getting account info');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Token Operations
  const handleGetMintInfo = async () => {
    if (!cookbookClient) return;
    
    setLoading(true);
    setError(null);
    try {
      const mint = new PublicKey('11111111111111111111111111111111'); // Demo mint
      const mintInfo = await cookbookClient.getMintInfo(mint);
      console.log('Mint info:', mintInfo);
    } catch (err) {
      setError('Error getting mint info');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTokenAccount = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const tokenAccount = new PublicKey('11111111111111111111111111111111'); // Demo token account
      const tokenAccountInfo = await cookbookClient.getTokenAccount(tokenAccount);
      console.log('Token account info:', tokenAccountInfo);
    } catch (err) {
      setError('Error getting token account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTokenBalance = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const tokenAccount = new PublicKey('11111111111111111111111111111111'); // Demo token account
      const balance = await cookbookClient.getTokenBalance(tokenAccount);
      console.log('Token balance:', balance);
    } catch (err) {
      setError('Error getting token balance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Airdrop & Testing
  const handleRequestAirdrop = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const signature = await cookbookClient.requestAirdrop(publicKey, 1);
      console.log('Airdrop signature:', signature);
    } catch (err) {
      setError('Error requesting airdrop');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBalance = async () => {
    if (!cookbookClient || !publicKey) return;
    
    setLoading(true);
    setError(null);
    try {
      const isValid = await cookbookClient.verifyBalance(publicKey, 1);
      console.log('Balance verification:', isValid);
    } catch (err) {
      setError('Error verifying balance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Solana Cookbook Demo</h2>
        <p className="text-gray-600">Explora las funcionalidades del Solana Cookbook</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Wallet Management */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          Wallet Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleCreateKeypair}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Keypair'}
          </button>
          <button
            onClick={handleRestoreKeypair}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Restoring...' : 'Restore Keypair'}
          </button>
          <button
            onClick={handleVerifyKeypair}
            disabled={loading || !newKeypair}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Keypair'}
          </button>
          <button
            onClick={handleSignMessage}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Signing...' : 'Sign Message'}
          </button>
        </div>
        {newKeypair && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">New Keypair:</p>
            <p className="text-xs font-mono break-all">{newKeypair}</p>
          </div>
        )}
      </section>

      {/* Transaction Operations */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Send className="h-5 w-5 mr-2" />
          Transaction Operations
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Amount (SOL)"
              value={solAmount}
              onChange={(e) => setSolAmount(parseFloat(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleSendSOL}
              disabled={loading || !publicKey || !recipientAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send SOL'}
            </button>
            <button
              onClick={handleSendTokens}
              disabled={loading || !publicKey || !recipientAddress}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Tokens'}
            </button>
            <button
              onClick={handleCalculateCost}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Cost'}
            </button>
          </div>
        </div>
      </section>

      {/* Account Management */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Account Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateAccount}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <button
            onClick={handleGetBalance}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Getting...' : 'Get Balance'}
          </button>
          <button
            onClick={handleGetAccountInfo}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Getting...' : 'Get Account Info'}
          </button>
        </div>
        {solBalance !== null && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">SOL Balance:</p>
            <p className="text-lg font-semibold">{solBalance} SOL</p>
          </div>
        )}
      </section>

      {/* Token Operations */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Coins className="h-5 w-5 mr-2" />
          Token Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleGetMintInfo}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Getting...' : 'Get Mint Info'}
          </button>
          <button
            onClick={handleGetTokenAccount}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Getting...' : 'Get Token Account'}
          </button>
          <button
            onClick={handleGetTokenBalance}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Getting...' : 'Get Token Balance'}
          </button>
        </div>
      </section>

      {/* Airdrop & Testing */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Airdrop & Testing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleRequestAirdrop}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Requesting...' : 'Get Test SOL'}
          </button>
          <button
            onClick={handleVerifyBalance}
            disabled={loading || !publicKey}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Balance'}
          </button>
        </div>
      </section>

      {transactionSignature && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700 font-semibold">Transaction Successful!</span>
          </div>
          <p className="text-sm text-green-600 mt-2">Signature: {transactionSignature}</p>
        </div>
      )}

      {!publicKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-yellow-700">Please connect your wallet to use all features</span>
          </div>
        </div>
      )}
    </div>
  );
}
