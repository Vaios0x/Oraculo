"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Save } from 'lucide-react';
import { MarketTemplate } from './MarketTemplates';

/**
 * 🔮 CreateMarketForm Component - Form to create markets
 * 
 * Component that allows creating prediction markets with templates
 * or custom form
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface CreateMarketFormProps {
  selectedTemplate?: MarketTemplate;
  onTemplateSelect?: (template: MarketTemplate) => void;
  onMarketCreate?: (marketData: any) => void;
}

export function CreateMarketForm({ 
  selectedTemplate, 
  onTemplateSelect, 
  onMarketCreate 
}: CreateMarketFormProps) {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    outcomes: ['Yes', 'No'],
    endDate: '',
    endTime: '',
    privacyLevel: 1
  });

  const [newOutcome, setNewOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const endTimestamp = Math.floor(endDateTime.getTime() / 1000);

      const marketData = {
        question: formData.question,
        description: formData.description,
        outcomes: formData.outcomes,
        endTime: endTimestamp,
        privacyLevel: formData.privacyLevel
      };

      if (onMarketCreate) {
        await onMarketCreate(marketData);
      }

      // Reset form
      setFormData({
        question: '',
        description: '',
        outcomes: ['Yes', 'No'],
        endDate: '',
        endTime: '',
        privacyLevel: 1
      });

    } catch (error) {
      console.error('Error creating market:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="neural-card neural-floating p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">
            Create New Market
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
              disabled={isSubmitting || !formData.question || !formData.endDate}
              className="neural-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Market</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
