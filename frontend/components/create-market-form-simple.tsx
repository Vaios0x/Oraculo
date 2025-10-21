"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useCookbook } from './solana-cookbook-provider-simple';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Target, 
  Clock, 
  Users,
  TrendingUp
} from 'lucide-react';

export function CreateMarketForm() {
  const { publicKey, sendTransaction } = useWallet();
  const { cookbookClient } = useCookbook();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [outcomeOptions, setOutcomeOptions] = useState<string[]>(['Yes', 'No']);
  const [loading, setLoading] = useState(false);

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !cookbookClient) {
      console.error('Please connect your wallet.');
      return;
    }
    setLoading(true);
    try {
      // For demonstration, we'll use a mock program ID and a generated keypair for the market
      const marketKeypair = Keypair.generate();
      const tokenMintKeypair = Keypair.generate();
      const marketTokenAccountKeypair = Keypair.generate(); // This would typically be an ATA

      const marketInfo = {
        marketId: marketKeypair.publicKey,
        title,
        description,
        endTime: new Date(endDate).getTime() / 1000, // Unix timestamp
        outcomeOptions,
        totalStaked: 0,
        isResolved: false,
        tokenMint: tokenMintKeypair.publicKey, // Mock token mint
        // winningOutcome will be set on resolution
      };

      // In a real scenario, you would call your Anchor program's create_market instruction
      // For now, we'll simulate a successful creation and log the market info
      console.log('Creating market with info:', marketInfo);

      // Example of using cookbookClient to create an account (if needed for market PDA)
      // const marketPda = await cookbookClient.createOptimizedPDA(
      //   [Buffer.from("market"), publicKey.toBuffer(), Buffer.from(title)],
      //   new PublicKey("YOUR_PROGRAM_ID"), // Replace with your actual program ID
      //   publicKey,
      //   1000 // Example space
      // );

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      console.log('Market created successfully!');
      setTitle('');
      setDescription('');
      setEndDate('');
      setOutcomeOptions(['Yes', 'No']);
    } catch (error) {
      console.error('Error creating market:', error);
      console.error('Failed to create market.');
    } finally {
      setLoading(false);
    }
  };

  const addOutcomeOption = () => {
    setOutcomeOptions([...outcomeOptions, '']);
  };

  const removeOutcomeOption = (index: number) => {
    if (outcomeOptions.length > 2) {
      setOutcomeOptions(outcomeOptions.filter((_, i) => i !== index));
    }
  };

  const updateOutcomeOption = (index: number, value: string) => {
    const newOptions = [...outcomeOptions];
    newOptions[index] = value;
    setOutcomeOptions(newOptions);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Prediction Market</h2>
        <p className="text-gray-600">Create a new prediction market for users to bet on future events</p>
      </div>

      <form onSubmit={handleCreateMarket} className="space-y-6">
        {/* Market Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline h-4 w-4 mr-2" />
            Market Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
            required
          />
        </div>

        {/* Market Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="inline h-4 w-4 mr-2" />
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Provide more details about the prediction market..."
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Outcome Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline h-4 w-4 mr-2" />
            Outcome Options
          </label>
          <div className="space-y-2">
            {outcomeOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOutcomeOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {outcomeOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOutcomeOption(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOutcomeOption}
              className="flex items-center px-3 py-2 text-purple-600 hover:text-purple-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
          disabled={loading || !publicKey}
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Market
            </>
          )}
        </button>

        {!publicKey && (
          <div className="text-center text-gray-500 text-sm">
            Please connect your wallet to create a market
          </div>
        )}
      </form>
    </div>
  );
}
