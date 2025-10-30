'use client';

import React, { useState, useEffect } from 'react';
import { useOracle } from '../hooks/useOracle';
import { useDemoMarkets } from '../hooks/useDemoMarkets';
import { WalletButton } from './WalletButton';
import { MarketTemplates, MarketTemplate, templates as globalTemplates } from './MarketTemplates';
import { MarketTemplatesMexico, templates as mexicoTemplates } from './MarketTemplatesMexico';
import { countTemplatesByCategory, getTotalTemplateCount } from '../lib/templateCounter';
import { 
  Play, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  Clock,
  Users,
  DollarSign,
  Zap,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

/**
 * 🔮 DemoMarketCreator Component - Demo market creator with templates
 * 
 * Component that allows creating demo markets using
 * predefined templates with data we know work
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 2.0.0
 */

export function DemoMarketCreator() {
  const { createMarket, loading, error } = useOracle();
  const { addDemoMarket } = useDemoMarkets();
  const [isCreating, setIsCreating] = useState(false);
  const [createdMarket, setCreatedMarket] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [useMexicanTemplates, setUseMexicanTemplates] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectTemplate = (template: MarketTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setShowTemplates(true);
    setCreatedMarket(null);
    setShowSuccess(false);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  // Clear category filter when switching between Mexican and Global templates
  useEffect(() => {
    setSelectedCategory(null);
  }, [useMexicanTemplates]);

  const handleCreateDemoMarket = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    setCreatedMarket(null);
    setShowSuccess(false);
    setRetryCount(prev => prev + 1);

    try {
      // Additional delay based on retry count to avoid duplicates
      const delay = Math.min(1000 + (retryCount * 500), 5000);
      console.log(`⏳ Delay of ${delay}ms to avoid duplicates...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log('🚀 Creating DEVNET market with template...');
      console.log('📊 Selected template:', selectedTemplate);

      // Calculate end date based on endTime (days from today)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedTemplate.endTime);
      let endTimestamp = Math.floor(endDate.getTime() / 1000);
      
      // Ensure date is from November 2025 onwards
      const november2025 = Math.floor(new Date('2025-11-01').getTime() / 1000);
      if (endTimestamp < november2025) {
        // If date is before November 2025, set to December 2025
        endDate.setFullYear(2025);
        endDate.setMonth(11); // December (0-indexed)
        endDate.setDate(31);
        endTimestamp = Math.floor(endDate.getTime() / 1000);
        console.log('⚠️ Date corrected to December 2025:', new Date(endTimestamp * 1000).toLocaleString());
      }

      console.log('⏰ End timestamp:', endTimestamp);
      console.log('📅 End date:', endDate.toLocaleString());

      const result = await createMarket(
        selectedTemplate.title,
        selectedTemplate.description,
        endTimestamp,
        selectedTemplate.outcomes,
        0 // Public privacy level (0=public)
      );

      console.log('✅ DEVNET market created successfully:', result);
      setCreatedMarket(result);
      setShowSuccess(true);

      // Save demo market to localStorage
      addDemoMarket({
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        question: selectedTemplate.question,
        outcomes: selectedTemplate.outcomes,
        category: selectedTemplate.category,
        signature: result.signature,
        marketAddress: result.marketAddress,
        endTime: endTimestamp,
      });

    } catch (error) {
      console.error('❌ Error creating DEVNET market:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSolanaExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  if (showSuccess && createdMarket && selectedTemplate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="neural-card neural-floating p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 neural-text-glow mb-4">
              DEVNET Market Created Successfully!
            </h2>
            <p className="text-xl text-gray-600">
              Your DEVNET market has been created on Solana Devnet
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 DEVNET Market Data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedTemplate.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700">{selectedTemplate.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Question</label>
                  <p className="text-gray-700 font-medium">{selectedTemplate.question}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Options</label>
                  <div className="flex space-x-2">
                    {selectedTemplate.outcomes.map((outcome, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Market Address</label>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-200 px-3 py-2 rounded font-mono flex-1">
                      {createdMarket.marketAddress.toString().substring(0, 16)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdMarket.marketAddress.toString())}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction</label>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-200 px-3 py-2 rounded font-mono flex-1">
                      {createdMarket.signature.substring(0, 16)}...
                    </code>
                    <a
                      href={getSolanaExplorerUrl(createdMarket.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Ends</p>
                    <p className="font-semibold text-sm">
                      {new Date(Date.now() + selectedTemplate.endTime * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Options</p>
                    <p className="font-semibold text-sm">{selectedTemplate.outcomes.length}</p>
                  </div>
                  
                  <div className="text-center">
                    <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold text-sm">{selectedTemplate.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getSolanaExplorerUrl(createdMarket.signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="matrix-button-enhanced flex items-center justify-center space-x-2 px-6 py-3"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="matrix-text-green font-semibold">View on Solana Explorer</span>
            </a>
            
            <button
              onClick={handleBackToTemplates}
              className="matrix-button-enhanced px-6 py-3"
            >
              <span className="matrix-text-green font-semibold">Create Another Demo Market</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTemplate && !showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="neural-card neural-floating p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToTemplates}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to templates</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${selectedTemplate.color} text-white`}>
                {selectedTemplate.icon}
              </div>
              <span className="text-sm text-gray-500">{selectedTemplate.category}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 neural-text-glow mb-4">
              {selectedTemplate.title}
            </h2>
            <p className="text-lg text-gray-600">
              {selectedTemplate.description}
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="mb-8">
            <WalletButton />
          </div>

          {/* Loading State */}
          {(loading || isCreating) && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-800 text-lg font-medium">
                  🔄 Creating DEVNET market on Solana Devnet...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">❌ Error creating DEVNET market</p>
                    <p className="text-red-700 text-sm">{error}</p>
                    {retryCount > 0 && (
                      <p className="text-red-600 text-xs mt-1">
                        Retry #{retryCount}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCreateDemoMarket}
                  disabled={isCreating || loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          )}

          {/* Market Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Market Preview</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Market Question</label>
                <p className="text-lg font-semibold text-gray-900">{selectedTemplate.question}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Options</label>
                  <div className="flex space-x-2 mt-1">
                    {selectedTemplate.outcomes.map((outcome, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="font-semibold">{selectedTemplate.endTime} days</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="font-semibold">{selectedTemplate.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="text-center">
            <button
              onClick={handleCreateDemoMarket}
              disabled={loading || isCreating}
              className={`neural-button-primary flex items-center justify-center space-x-3 px-8 py-4 text-lg ${
                loading || isCreating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 transition-transform'
              }`}
            >
              {loading || isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating DEVNET Market...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>🚀 Create DEVNET Market</span>
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              This DEVNET market will be created on Solana Devnet using the selected template
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="neural-card neural-floating p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 neural-text-glow">
              🎯 DEVNET Markets with Templates
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Select a template to create your market on Solana Devnet
          </p>
        </div>

        {/* Wallet Connection Status */}
        <div className="mb-8">
          <WalletButton />
        </div>

        {/* Template Type Selector */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setUseMexicanTemplates(true)}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                useMexicanTemplates
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🇲🇽 México ({getTotalTemplateCount(mexicoTemplates)})
            </button>
            <button
              onClick={() => setUseMexicanTemplates(false)}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                !useMexicanTemplates
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌍 Global ({getTotalTemplateCount(globalTemplates)})
            </button>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <div className="neural-card neural-floating p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">
                📊 Templates by Category
              </h3>
              {selectedCategory && (
                <button
                  onClick={clearCategoryFilter}
                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                >
                  ✕ Clear filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(countTemplatesByCategory(useMexicanTemplates ? mexicoTemplates : globalTemplates))
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div 
                    key={category} 
                    onClick={() => handleCategoryFilter(category)}
                    className={`rounded-lg p-3 text-center cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCategory === category 
                        ? 'bg-green-100 border-2 border-green-400 shadow-lg' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`text-2xl font-bold neural-text-glow ${
                      selectedCategory === category ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {count}
                    </div>
                    <div className={`text-sm ${
                      selectedCategory === category ? 'text-green-800 font-semibold' : 'text-gray-600'
                    }`}>
                      {category}
                    </div>
                    {selectedCategory === category && (
                      <div className="text-xs text-green-600 mt-1 font-medium">
                        ✓ Filtered
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">
                {selectedCategory ? (
                  <>
                    Showing: <span className="font-semibold text-gray-900">{selectedCategory}</span> 
                    <span className="text-gray-400"> | </span>
                    <button 
                      onClick={clearCategoryFilter}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View all categories
                    </button>
                  </>
                ) : (
                  <>
                    Total: <span className="font-semibold text-gray-900">
                      {getTotalTemplateCount(useMexicanTemplates ? mexicoTemplates : globalTemplates)}
                    </span> templates available
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Templates */}
        {useMexicanTemplates ? (
          <MarketTemplatesMexico 
            onSelectTemplate={handleSelectTemplate} 
            selectedCategory={selectedCategory}
          />
        ) : (
          <MarketTemplates 
            onSelectTemplate={handleSelectTemplate} 
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </div>
  );
}

export default DemoMarketCreator;