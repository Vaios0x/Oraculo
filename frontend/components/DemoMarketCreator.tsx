'use client';

import React, { useState } from 'react';
import { useOracle } from '../hooks/useOracle';
import { useDemoMarkets } from '../hooks/useDemoMarkets';
import { WalletButton } from './WalletButton';
import { MarketTemplates, MarketTemplate } from './MarketTemplates';
import { MarketTemplatesMexico } from './MarketTemplatesMexico';
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
 * 🔮 DemoMarketCreator Component - Creador de mercados demo con plantillas
 * 
 * Componente que permite crear mercados de demostración usando
 * plantillas predefinidas con datos que sabemos que funcionan
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

  const handleCreateDemoMarket = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    setCreatedMarket(null);
    setShowSuccess(false);
    setRetryCount(prev => prev + 1);

    try {
      // Delay adicional basado en el número de reintentos para evitar duplicados
      const delay = Math.min(1000 + (retryCount * 500), 5000);
      console.log(`⏳ Delay de ${delay}ms para evitar duplicados...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log('🚀 Creando mercado demo con plantilla...');
      console.log('📊 Plantilla seleccionada:', selectedTemplate);

      // Calcular fecha de finalización basada en endTime (días desde hoy)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedTemplate.endTime);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      console.log('⏰ Timestamp de finalización:', endTimestamp);
      console.log('📅 Fecha de finalización:', endDate.toLocaleString());

      const result = await createMarket(
        selectedTemplate.title,
        selectedTemplate.description,
        endTimestamp,
        selectedTemplate.outcomes,
        1 // Privacy level público
      );

      console.log('✅ Mercado demo creado exitosamente:', result);
      setCreatedMarket(result);
      setShowSuccess(true);

      // Guardar el mercado demo en localStorage
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
      console.error('❌ Error creando mercado demo:', error);
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
              ¡Mercado Demo Creado Exitosamente!
            </h2>
            <p className="text-xl text-gray-600">
              Tu mercado de demostración ha sido creado en Solana Devnet
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Datos del Mercado Demo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Título</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedTemplate.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-gray-700">{selectedTemplate.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Pregunta</label>
                  <p className="text-gray-700 font-medium">{selectedTemplate.question}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Opciones</label>
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
                  <label className="text-sm font-medium text-gray-500">Dirección del Mercado</label>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-200 px-3 py-2 rounded font-mono flex-1">
                      {createdMarket.marketAddress.toString().substring(0, 16)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdMarket.marketAddress.toString())}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copiar dirección"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Transacción</label>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-200 px-3 py-2 rounded font-mono flex-1">
                      {createdMarket.signature.substring(0, 16)}...
                    </code>
                    <a
                      href={getSolanaExplorerUrl(createdMarket.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Ver en Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Finaliza</p>
                    <p className="font-semibold text-sm">
                      {new Date(Date.now() + selectedTemplate.endTime * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Opciones</p>
                    <p className="font-semibold text-sm">{selectedTemplate.outcomes.length}</p>
                  </div>
                  
                  <div className="text-center">
                    <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Categoría</p>
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
              className="neural-button-primary flex items-center justify-center space-x-2 px-6 py-3"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Ver en Solana Explorer</span>
            </a>
            
            <button
              onClick={handleBackToTemplates}
              className="neural-button-secondary px-6 py-3"
            >
              Crear Otro Mercado Demo
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
              <span>Volver a plantillas</span>
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
                  🔄 Creando mercado demo en Solana Devnet...
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
                    <p className="text-red-800 font-medium">❌ Error creando mercado demo</p>
                    <p className="text-red-700 text-sm">{error}</p>
                    {retryCount > 0 && (
                      <p className="text-red-600 text-xs mt-1">
                        Reintento #{retryCount}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCreateDemoMarket}
                  disabled={isCreating || loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  🔄 Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Market Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Vista Previa del Mercado</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Pregunta del Mercado</label>
                <p className="text-lg font-semibold text-gray-900">{selectedTemplate.question}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Opciones</label>
                  <div className="flex space-x-2 mt-1">
                    {selectedTemplate.outcomes.map((outcome, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Duración</label>
                  <p className="font-semibold">{selectedTemplate.endTime} días</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoría</label>
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
                  <span>Creando Mercado Demo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>🚀 Crear Mercado Demo Real</span>
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Este mercado será creado en Solana Devnet usando la plantilla seleccionada
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
              🎯 Mercados Demo con Plantillas
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Selecciona una plantilla para crear tu mercado de demostración
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
              🇲🇽 México ({MarketTemplatesMexico.length})
            </button>
            <button
              onClick={() => setUseMexicanTemplates(false)}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                !useMexicanTemplates
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌍 Global ({MarketTemplates.length})
            </button>
          </div>
        </div>

        {/* Templates */}
        {useMexicanTemplates ? (
          <MarketTemplatesMexico onSelectTemplate={handleSelectTemplate} />
        ) : (
          <MarketTemplates onSelectTemplate={handleSelectTemplate} />
        )}
      </div>
    </div>
  );
}

export default DemoMarketCreator;