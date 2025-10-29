"use client";

import React, { useEffect } from 'react';
import { useRealMarkets } from '../hooks/useRealMarkets';
import { useOracle } from '../hooks/useOracle';
import { MarketNotification, useMarketNotifications } from './MarketNotification';
import { 
  ExternalLink,
  Copy,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  TrendingUp,
  BarChart3
} from 'lucide-react';

/**
 * 🔮 RealMarketList Component - Lista de mercados reales
 * 
 * Componente que muestra los mercados reales creados en Solana
 * con información en tiempo real
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface RealMarket {
  address: string;
  title: string;
  description: string;
  endTime: number;
  outcomes: string[];
  totalStaked: number;
  isResolved: boolean;
  winningOutcome?: number;
  privacyLevel: number;
  creator: string;
}

export function RealMarketList() {
  const {
    markets,
    loading,
    error,
    showActiveOnly,
    setShowActiveOnly,
    loadMarkets,
    refreshMarkets,
    totalMarkets,
    activeMarkets,
    resolvedMarkets,
    totalStaked
  } = useRealMarkets();

  // Obtener programId del hook useOracle
  const { programId } = useOracle();

  // Notificaciones
  const {
    notifications,
    removeNotification,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification
  } = useMarketNotifications();

  // Detectar cambios en los mercados y mostrar notificaciones
  useEffect(() => {
    if (totalMarkets > 0 && !loading) {
      addInfoNotification(
        'Mercados Actualizados',
        `Se encontraron ${totalMarkets} mercados. ${activeMarkets} activos, ${resolvedMarkets} resueltos.`
      );
    }
  }, [totalMarkets, activeMarkets, resolvedMarkets, loading]);

  // Mostrar notificación de error
  useEffect(() => {
    if (error) {
      addErrorNotification(
        'Error Cargando Mercados',
        error
      );
    }
  }, [error]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSolanaExplorerUrl = (address: string) => {
    return `https://explorer.solana.com/address/${address}?cluster=devnet`;
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) return "Finalizado";
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPrivacyLevelText = (level: number) => {
    switch (level) {
      case 1: return "Público";
      case 2: return "Semi-privado";
      case 3: return "Privado";
      default: return "Desconocido";
    }
  };

  const getPrivacyLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 neural-text-glow mb-2">
          🔮 Mercados Reales de Predicciones
        </h1>
        <p className="text-gray-600">
          Mercados de predicciones creados en Solana con transacciones reales
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Program ID:</strong> {programId} | <strong>Red:</strong> Solana Devnet
          </p>
        </div>
      </div>

      {/* Controles de filtro y carga */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showActiveOnly 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {showActiveOnly ? 'Solo Activos' : '🌍 Todos los Mercados Públicos'}
          </button>
          
          <button
            onClick={refreshMarkets}
            disabled={loading}
            className="neural-button-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {loading ? 'Cargando...' : `🌐 ${totalMarkets} mercados públicos encontrados`}
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-800">
              🔄 Cargando mercados desde Solana...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">
              ❌ Error cargando mercados: {error}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {markets.map((market, index) => (
          <div 
            key={market.address} 
            className="neural-card neural-floating"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 neural-text-glow line-clamp-2">
                      {market.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500/80 rounded-full">
                      🌐 PÚBLICO
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {market.description}
                  </p>
                </div>
                {market.isResolved ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Resuelto</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-neural-pulse"></div>
                    <span className="text-sm text-orange-600 font-medium">Activo</span>
                  </div>
                )}
              </div>

              {/* Outcomes */}
              <div className="space-y-2">
                {market.outcomes.map((outcome, outcomeIndex) => (
                  <div key={outcomeIndex} className="neural-glass p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{outcome}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-neural-primary">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                        {market.isResolved && market.winningOutcome === outcomeIndex && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="neural-glass p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-gray-500">Total Apostado</span>
                  </div>
                  <span className="text-neural-primary font-semibold">
                    {market.totalStaked.toLocaleString()} SOL
                  </span>
                </div>
                <div className="neural-glass p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-500">Tiempo Restante</span>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {getTimeRemaining(market.endTime)}
                  </span>
                </div>
              </div>

              {/* Creator and Privacy Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Creador:</span>
                  <span className="text-sm font-mono text-gray-600 truncate max-w-32">
                    {market.creator.slice(0, 8)}...{market.creator.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Privacidad:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPrivacyLevelColor(market.privacyLevel)}`}>
                    {getPrivacyLevelText(market.privacyLevel)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="neural-button flex-1 text-sm">
                  {market.isResolved ? 'Ver Resultado' : 'Apostar'}
                </button>
                <button
                  onClick={() => copyToClipboard(market.address)}
                  className="neural-glass px-3 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
                  title="Copiar dirección"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={getSolanaExplorerUrl(market.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neural-glass px-3 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
                  title="Ver en Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Market Address */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Dirección:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {market.address.substring(0, 8)}...{market.address.slice(-8)}
                  </code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay mercados */}
      {totalMarkets === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay mercados disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            {showActiveOnly 
              ? 'No se encontraron mercados activos. Intenta cambiar el filtro o crear un nuevo mercado.'
              : 'No se encontraron mercados. Crea el primer mercado de predicciones.'
            }
          </p>
          <button
            onClick={refreshMarkets}
            disabled={loading}
            className="neural-button-primary"
          >
            Recargar Mercados
          </button>
        </div>
      )}

      {/* Info Panel */}
      {totalMarkets > 0 && (
        <div className="mt-8 neural-card neural-floating p-6">
          <h3 className="text-lg font-semibold text-gray-900 neural-text-glow mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total de Mercados:</span>
              <span className="ml-2 font-semibold">{totalMarkets}</span>
            </div>
            <div>
              <span className="text-gray-500">Mercados Activos:</span>
              <span className="ml-2 font-semibold text-orange-600">
                {activeMarkets}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Mercados Resueltos:</span>
              <span className="ml-2 font-semibold text-green-600">
                {resolvedMarkets}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Apostado:</span>
              <span className="ml-2 font-semibold text-purple-600">
                {totalStaked.toLocaleString()} SOL
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Última actualización: {new Date().toLocaleTimeString()}</span>
              <span>Red: Solana Devnet</span>
            </div>
          </div>
        </div>
      )}

      {/* Notificaciones */}
      <MarketNotification 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
