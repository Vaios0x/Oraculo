'use client';

import React, { useState } from 'react';
import { generateCompressedProof, calculateGasSavings, validateCompressedProof, BatchIdentityInput, CompressedProof } from '../lib/zk';
import { useWallet } from '@solana/wallet-adapter-react';
import { Key, ExternalLink } from 'lucide-react';
import { buildProvider, verifyIdentityProof } from '../lib/identityClient';

export default function ZKCompression() {
  const wallet = useWallet();
  const [identities, setIdentities] = useState<BatchIdentityInput[]>([
    { age: 25, threshold: 18, issuer: 'Government' },
    { age: 30, threshold: 21, issuer: 'Bank' },
    { age: 22, threshold: 18, issuer: 'University' },
    { age: 28, threshold: 25, issuer: 'Insurance' }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressedProof, setCompressedProof] = useState<CompressedProof | null>(null);
  const [lastTxSig, setLastTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIdentityChange = (index: number, field: keyof BatchIdentityInput, value: string | number) => {
    const newIdentities = [...identities];
    newIdentities[index] = {
      ...newIdentities[index],
      [field]: field === 'age' || field === 'threshold' ? Number(value) : value
    };
    setIdentities(newIdentities);
  };

  const addIdentity = () => {
    if (identities.length < 4) {
      setIdentities([...identities, { age: 18, threshold: 18, issuer: 'New' }]);
    }
  };

  const removeIdentity = (index: number) => {
    if (identities.length > 1) {
      const newIdentities = identities.filter((_, i) => i !== index);
      setIdentities(newIdentities);
    }
  };

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    setError(null);
    setCompressedProof(null);

    try {
      const proof = await generateCompressedProof(identities);
      setCompressedProof(proof);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitToSolana = async () => {
    if (!compressedProof || !wallet.publicKey) {
      setError('No proof available or wallet not connected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const provider = await buildProvider(rpcUrl, wallet);
      
      // For ZK Compression, we'll submit the first identity as a representative
      // In a real implementation, you'd have a batch verification function
      const firstIdentity = identities[0];
      
      // Generate mock data for the proof
      const vkId = new Uint8Array(32).fill(1);
      const predicateHash = new Uint8Array(32).fill(2);
      const issuerHash = new Uint8Array(32).fill(3);
      const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
      const nonce = new Uint8Array(16).fill(4);
      const publicInputs = [firstIdentity.age, firstIdentity.threshold];
      const proofBytes = new TextEncoder().encode(JSON.stringify(compressedProof.proof));

      const txSig = await verifyIdentityProof(provider, {
        vkId,
        predicateHash,
        issuerHash,
        expiresAt,
        nonce,
        publicInputs,
        proof: proofBytes,
      });

      setLastTxSig(txSig);
    } catch (err: any) {
      setError(err?.message || 'Error submitting to Solana');
    } finally {
      setIsSubmitting(false);
    }
  };

  const gasSavings = calculateGasSavings(identities.length);
  const isValid = compressedProof ? validateCompressedProof(compressedProof) : false;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          🚀 ZK Compression (2025)
        </h2>
        <p className="text-blue-200 text-lg">
          Compress multiple identity verifications into a single ZK proof
        </p>
        <div className="mt-4 p-4 bg-blue-800/30 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-300">Individual Cost:</span>
              <div className="text-white font-mono">{gasSavings.individualCost.toLocaleString()} gas</div>
            </div>
            <div>
              <span className="text-green-300">Compressed Cost:</span>
              <div className="text-white font-mono">{gasSavings.compressedCost.toLocaleString()} gas</div>
            </div>
            <div>
              <span className="text-yellow-300">Savings:</span>
              <div className="text-white font-mono">{gasSavings.savings.toLocaleString()} gas</div>
            </div>
            <div>
              <span className="text-purple-300">Efficiency:</span>
              <div className="text-white font-mono">{gasSavings.savingsPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Identity Inputs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Batch Identity Verification ({identities.length}/4)
          </h3>
          <div className="space-y-4">
            {identities.map((identity, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={identity.age}
                    onChange={(e) => handleIdentityChange(index, 'age', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 border border-blue-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Threshold
                  </label>
                  <input
                    type="number"
                    value={identity.threshold}
                    onChange={(e) => handleIdentityChange(index, 'threshold', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 border border-blue-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Issuer
                  </label>
                  <input
                    type="text"
                    value={identity.issuer || ''}
                    onChange={(e) => handleIdentityChange(index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-blue-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Government"
                  />
                </div>
                <div className="flex items-end">
                  {identities.length > 1 && (
                    <button
                      onClick={() => removeIdentity(index)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {identities.length < 4 && (
            <button
              onClick={addIdentity}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              + Add Identity
            </button>
          )}
        </div>

        {/* Generate Proof Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGenerateProof}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating ZK Compression...</span>
              </div>
            ) : (
              '🚀 Generate Compressed Proof'
            )}
          </button>

          {/* Submit to Solana Button */}
          {compressedProof && (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleSubmitToSolana}
                disabled={isSubmitting || !wallet.publicKey}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting to Solana...</span>
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Submit to Solana</span>
                  </>
                )}
              </button>
              
              {!wallet.publicKey && (
                <p className="text-yellow-400 text-sm">Connect wallet to submit to Solana</p>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">❌</span>
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Proof Results */}
        {compressedProof && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              ✅ ZK Compression Proof Generated
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-blue-200 mb-2">Proof Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Batch Size:</span>
                    <span className="text-white font-mono">{compressedProof.batchSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Compressed Hash:</span>
                    <span className="text-white font-mono text-xs break-all">
                      {compressedProof.compressedHash.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Proof Valid:</span>
                    <span className={`font-mono ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {isValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-blue-200 mb-2">Gas Savings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Individual Cost:</span>
                    <span className="text-white font-mono">{gasSavings.individualCost.toLocaleString()} gas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Compressed Cost:</span>
                    <span className="text-white font-mono">{gasSavings.compressedCost.toLocaleString()} gas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Savings:</span>
                    <span className="text-green-400 font-mono">{gasSavings.savings.toLocaleString()} gas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Efficiency Gain:</span>
                    <span className="text-purple-400 font-mono">{gasSavings.savingsPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
              <h4 className="text-lg font-medium text-blue-200 mb-2">Public Signals</h4>
              <div className="text-xs font-mono text-gray-300 break-all">
                {compressedProof.publicSignals.join(', ')}
              </div>
            </div>

            {/* Transaction Information */}
            {lastTxSig && (
              <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-500/50">
                <h4 className="text-lg font-medium text-green-200 mb-2 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Transaction Submitted</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Transaction Hash:</span>
                    <a
                      href={`https://explorer.solana.com/tx/${lastTxSig}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-mono text-sm break-all transition-colors"
                    >
                      {lastTxSig.slice(0, 8)}...{lastTxSig.slice(-8)}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-green-400 font-semibold">✅ Confirmed</span>
                  </div>
                  <div className="mt-3">
                    <a
                      href={`https://explorer.solana.com/tx/${lastTxSig}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View on Solana Explorer</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}