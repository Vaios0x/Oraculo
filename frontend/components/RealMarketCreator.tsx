"use client";

import React, { useState, useEffect } from 'react';
import { useOracle } from '../hooks/useOracle';
import { MarketTemplate } from './MarketTemplates';
import { WalletButton } from './WalletButton';
import { 
  Calendar, 
  Plus, 
  X, 
  Save, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';

/**
 * 🔮 RealMarketCreator Component - Real market creator
 * 
 * Component that allows creating real prediction markets
 * integrated with the Oracle program deployed on Solana
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface RealMarketCreatorProps {
  selectedTemplate?: MarketTemplate;
  onTemplateSelect?: (template: MarketTemplate) => void;
  onMarketCreate?: (marketData: any) => void;
}

export function RealMarketCreator({ 
  selectedTemplate, 
  onTemplateSelect, 
  onMarketCreate 
}: RealMarketCreatorProps) {
  const {
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,
    getMarketInfo,
    loading,
    error,
    programId,
    publicKey,
    connected
  } = useOracle();

  const [formData, setFormData] = useState({
    question: '',
    description: '',
    outcomes: ['Yes', 'No'],
    endDate: '',
    endTime: '',
    privacyLevel: 0
  });

  const [newOutcome, setNewOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMarket, setCreatedMarket] = useState<any>(null);
  const [marketInfo, setMarketInfo] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data from selected template
  useEffect(() => {
    if (selectedTemplate) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedTemplate.endTime);
      
      setFormData({
        question: selectedTemplate.question,
        description: selectedTemplate.description,
        outcomes: selectedTemplate.outcomes,
        endDate: endDate.toISOString().split('T')[0],
        endTime: '23:59',
        privacyLevel: 1
      });
    }
  }, [selectedTemplate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOutcome = () => {
    if (newOutcome.trim() && !formData.outcomes.includes(newOutcome.trim())) {
      setFormData(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, newOutcome.trim()]
      }));
      setNewOutcome('');
    }
  };

  const removeOutcome = (index: number) => {
    if (formData.outcomes.length > 2) {
      setFormData(prev => ({
        ...prev,
        outcomes: prev.outcomes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Starting market creation...');
      console.log('📋 Form data:', formData);

      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      let endTimestamp = Math.floor(endDateTime.getTime() / 1000);
      
      // Ensure date is from November 2025 onwards
      const november2025 = Math.floor(new Date('2025-11-01').getTime() / 1000);
      if (endTimestamp < november2025) {
        // If date is before November 2025, set to December 2025
        const futureDate = new Date('2025-12-31');
        endTimestamp = Math.floor(futureDate.getTime() / 1000);
        console.log('⚠️ Date corrected to December 2025:', futureDate.toLocaleString());
      }

      console.log('⏰ End timestamp:', endTimestamp);
      console.log('📅 End date:', new Date(endTimestamp * 1000).toLocaleString());

      const marketData = {
        question: formData.question,
        description: formData.description,
        outcomes: formData.outcomes,
        endTime: endTimestamp,
        privacyLevel: formData.privacyLevel
      };

      console.log('📊 Market data to create:', marketData);

      // Create real market on Solana
      console.log('🔮 Calling createMarket...');
      const result = await createMarket(
        formData.question,
        formData.description,
        endTimestamp,
        formData.outcomes,
        formData.privacyLevel
      );

      console.log('✅ Market created successfully:', result);
      setCreatedMarket(result);
      setShowSuccess(true);

      // Get created market information
      try {
        console.log('📊 Getting market information...');
        const info = await getMarketInfo(result.marketAddress.toString());
        console.log('📋 Market information:', info);
        setMarketInfo(info);
      } catch (err) {
        console.warn('⚠️ Could not get market information:', err);
      }

      if (onMarketCreate) {
        await onMarketCreate(marketData);
      }

      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          question: '',
          description: '',
          outcomes: ['Yes', 'No'],
          endDate: '',
          endTime: '',
        privacyLevel: 0
        });
        setCreatedMarket(null);
        setMarketInfo(null);
        setShowSuccess(false);
      }, 10000); // Increase time to see result

    } catch (error) {
      console.error('❌ Error creating market:', error);
      alert(`Error creating market: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSolanaExplorerUrl = (address: string) => {
    return `https://explorer.solana.com/address/${address}?cluster=devnet`;
  };

  if (showSuccess && createdMarket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="neural-card neural-floating p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 neural-text-glow mb-2">
              Market Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your prediction market has been created on Solana
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="text-sm font-medium text-gray-500">Market Address</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-sm bg-gray-200 px-2 py-1 rounded font-mono">
                    {createdMarket.marketAddress.toString().substring(0, 8)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdMarket.marketAddress.toString())}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Transaction</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-sm bg-gray-200 px-2 py-1 rounded font-mono">
                    {createdMarket.signature.substring(0, 8)}...
                  </code>
                  <a
                    href={getSolanaExplorerUrl(createdMarket.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {marketInfo && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Ends</p>
                  <p className="font-semibold">
                    {new Date(marketInfo.endTime * 1000).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-center">
                  <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Options</p>
                  <p className="font-semibold">{marketInfo.outcomes.length}</p>
                </div>
                
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Total Staked</p>
                  <p className="font-semibold">{marketInfo.totalStaked} SOL</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 justify-center">
            <a
              href={getSolanaExplorerUrl(createdMarket.marketAddress.toString())}
              target="_blank"
              rel="noopener noreferrer"
              className="neural-button-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </a>
            
            <button
              onClick={() => {
                setShowSuccess(false);
                setCreatedMarket(null);
                setMarketInfo(null);
              }}
              className="neural-button-secondary"
            >
              Create Another Market
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="neural-card neural-floating p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">
            Create Real Market
          </h2>
          {selectedTemplate && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Template:</span>
              <span className="neural-status">{selectedTemplate.title}</span>
              <button
                onClick={() => onTemplateSelect?.(undefined as any)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!connected && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">
                  Wallet Not Connected
                </h3>
              </div>
              <p className="text-yellow-700">
                You need to connect your wallet to create real markets on Solana
              </p>
              <div className="flex justify-center">
                <WalletButton />
              </div>
              <p className="text-sm text-yellow-600">
                Supports Phantom, Solflare and other Solana wallets
              </p>
            </div>
          </div>
        )}

        {connected && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                ✅ Wallet connected: {publicKey?.toString().substring(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-800">
                🔄 Processing transaction on Solana...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                ❌ Error: {error}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Market Question */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Market Question *
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="e.g., Will Bitcoin reach $200,000 by the end of 2026?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the context and details of the market..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
            />
          </div>

          {/* Outcome Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Outcome Options *
            </label>
            <div className="space-y-2">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...formData.outcomes];
                      newOutcomes[index] = e.target.value;
                      handleInputChange('outcomes', newOutcomes);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
                    required
                  />
                  {formData.outcomes.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Add new option */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="New option..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
                />
                <button
                  type="button"
                  onClick={addOutcome}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* End Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
                  required
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
                required
              />
            </div>
          </div>

          {/* Privacy Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Privacy Level
            </label>
            <select
              value={formData.privacyLevel}
              onChange={(e) => handleInputChange('privacyLevel', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
            >
              <option value={1}>Public</option>
              <option value={2}>Semi-private</option>
              <option value={3}>Private</option>
            </select>
          </div>

          {/* Program Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Program Information</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Program ID: {programId}</p>
              <p>Network: Solana Devnet</p>
              <p>Status: {connected ? 'Connected' : 'Not connected'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  question: '',
                  description: '',
                  outcomes: ['Yes', 'No'],
                  endDate: '',
                  endTime: '',
                  privacyLevel: 1
                });
              }}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.question || !formData.endDate || !connected}
              className="neural-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating on Solana...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Real Market</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
