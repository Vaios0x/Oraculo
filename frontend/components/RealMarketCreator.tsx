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
 * 🔮 RealMarketCreator Component - Creador de mercados reales
 * 
 * Componente que permite crear mercados reales de predicciones
 * integrado con el programa Oracle desplegado en Solana
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
    outcomes: ['Sí', 'No'],
    endDate: '',
    endTime: '',
    privacyLevel: 1
  });

  const [newOutcome, setNewOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMarket, setCreatedMarket] = useState<any>(null);
  const [marketInfo, setMarketInfo] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar datos de la plantilla seleccionada
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
      console.log('🚀 Iniciando creación de mercado...');
      console.log('📋 Datos del formulario:', formData);

      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const endTimestamp = Math.floor(endDateTime.getTime() / 1000);

      console.log('⏰ Timestamp de finalización:', endTimestamp);
      console.log('📅 Fecha de finalización:', endDateTime.toLocaleString());

      const marketData = {
        question: formData.question,
        description: formData.description,
        outcomes: formData.outcomes,
        endTime: endTimestamp,
        privacyLevel: formData.privacyLevel
      };

      console.log('📊 Datos del mercado a crear:', marketData);

      // Crear mercado real en Solana
      console.log('🔮 Llamando a createMarket...');
      const result = await createMarket(
        formData.question,
        formData.description,
        endTimestamp,
        formData.outcomes,
        formData.privacyLevel
      );

      console.log('✅ Mercado creado exitosamente:', result);
      setCreatedMarket(result);
      setShowSuccess(true);

      // Obtener información del mercado creado
      try {
        console.log('📊 Obteniendo información del mercado...');
        const info = await getMarketInfo(result.marketAddress.toString());
        console.log('📋 Información del mercado:', info);
        setMarketInfo(info);
      } catch (err) {
        console.warn('⚠️ No se pudo obtener información del mercado:', err);
      }

      if (onMarketCreate) {
        await onMarketCreate(marketData);
      }

      // Reset form después de un delay
      setTimeout(() => {
        setFormData({
          question: '',
          description: '',
          outcomes: ['Sí', 'No'],
          endDate: '',
          endTime: '',
          privacyLevel: 1
        });
        setCreatedMarket(null);
        setMarketInfo(null);
        setShowSuccess(false);
      }, 10000); // Aumentar tiempo para ver el resultado

    } catch (error) {
      console.error('❌ Error creando mercado:', error);
      alert(`Error creando mercado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
              ¡Mercado Creado Exitosamente!
            </h2>
            <p className="text-gray-600">
              Tu mercado de predicciones ha sido creado en Solana
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Mercado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="text-sm font-medium text-gray-500">Dirección del Mercado</label>
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
                <label className="text-sm font-medium text-gray-500">Transacción</label>
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
                  <p className="text-sm text-gray-500">Finaliza</p>
                  <p className="font-semibold">
                    {new Date(marketInfo.endTime * 1000).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-center">
                  <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Opciones</p>
                  <p className="font-semibold">{marketInfo.outcomes.length}</p>
                </div>
                
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Total Apostado</p>
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
              <span>Ver en Explorer</span>
            </a>
            
            <button
              onClick={() => {
                setShowSuccess(false);
                setCreatedMarket(null);
                setMarketInfo(null);
              }}
              className="neural-button-secondary"
            >
              Crear Otro Mercado
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
            Crear Mercado Real
          </h2>
          {selectedTemplate && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Plantilla:</span>
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
                  Wallet No Conectada
                </h3>
              </div>
              <p className="text-yellow-700">
                Necesitas conectar tu wallet para crear mercados reales en Solana
              </p>
              <div className="flex justify-center">
                <WalletButton />
              </div>
              <p className="text-sm text-yellow-600">
                Soporta Phantom, Solflare y otras wallets de Solana
              </p>
            </div>
          </div>
        )}

        {connected && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                ✅ Wallet conectada: {publicKey?.toString().substring(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-800">
                🔄 Procesando transacción en Solana...
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
          {/* Pregunta del Mercado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pregunta del Mercado *
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="e.g., ¿Llegará Bitcoin a $200,000 para finales de 2026?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el contexto y detalles del mercado..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
            />
          </div>

          {/* Opciones de Resultado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Opciones de Resultado *
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
              
              {/* Agregar nueva opción */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="Nueva opción..."
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

          {/* Fecha y Hora de Finalización */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Fecha de Finalización *
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
                Hora de Finalización *
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

          {/* Nivel de Privacidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nivel de Privacidad
            </label>
            <select
              value={formData.privacyLevel}
              onChange={(e) => handleInputChange('privacyLevel', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent neural-glass"
            >
              <option value={1}>Público</option>
              <option value={2}>Semi-privado</option>
              <option value={3}>Privado</option>
            </select>
          </div>

          {/* Información del Programa */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Información del Programa</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Program ID: {programId}</p>
              <p>Red: Solana Devnet</p>
              <p>Estado: {connected ? 'Conectado' : 'No conectado'}</p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  question: '',
                  description: '',
                  outcomes: ['Sí', 'No'],
                  endDate: '',
                  endTime: '',
                  privacyLevel: 1
                });
              }}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.question || !formData.endDate || !connected}
              className="neural-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creando en Solana...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Crear Mercado Real</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
