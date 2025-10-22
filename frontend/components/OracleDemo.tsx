"use client";

import React, { useState } from 'react';
import { useOracle } from '../hooks/useOracle';

/**
 * 🔮 OracleDemo Component - Componente de demostración de Oracle
 * 
 * Componente que demuestra todas las funcionalidades del programa Oracle
 * incluyendo creación de mercados, apuestas, resolución y reclamación de ganancias
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function OracleDemo() {
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

  const [marketAddress, setMarketAddress] = useState<string>('');
  const [betAddress, setBetAddress] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleCreateMarket = async () => {
    try {
      addResult('🚀 Creando mercado de predicciones...');
      
      const title = "¿Llegará Bitcoin a $100k en 2024?";
      const description = "Un mercado de predicciones sobre el precio de Bitcoin";
      const endTime = Math.floor(Date.now() / 1000) + 86400; // 24 horas
      const outcomes = ["Sí", "No"];
      
      const result = await createMarket(title, description, endTime, outcomes, 1);
      
      setMarketAddress(result.marketAddress.toString());
      addResult(`✅ Mercado creado: ${result.marketAddress.toString()}`);
      addResult(`📝 Transacción: ${result.signature}`);
    } catch (err) {
      addResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handlePlaceBet = async () => {
    if (!marketAddress) {
      addResult('❌ Primero crea un mercado');
      return;
    }

    try {
      addResult('🎯 Colocando apuesta...');
      
      const result = await placeBet(marketAddress, 0, 1000000); // 0.001 SOL
      
      setBetAddress(result.betAddress.toString());
      addResult(`✅ Apuesta colocada: ${result.betAddress.toString()}`);
      addResult(`📝 Transacción: ${result.signature}`);
    } catch (err) {
      addResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleResolveMarket = async () => {
    if (!marketAddress) {
      addResult('❌ Primero crea un mercado');
      return;
    }

    try {
      addResult('🏁 Resolviendo mercado...');
      
      const signature = await resolveMarket(marketAddress, 0); // Ganador: "Sí"
      
      addResult(`✅ Mercado resuelto con resultado: Sí`);
      addResult(`📝 Transacción: ${signature}`);
    } catch (err) {
      addResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleClaimWinnings = async () => {
    if (!marketAddress || !betAddress) {
      addResult('❌ Primero crea un mercado y coloca una apuesta');
      return;
    }

    try {
      addResult('💰 Reclamando ganancias...');
      
      const signature = await claimWinnings(marketAddress, betAddress);
      
      addResult(`✅ Ganancias reclamadas exitosamente`);
      addResult(`📝 Transacción: ${signature}`);
    } catch (err) {
      addResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleGetMarketInfo = async () => {
    if (!marketAddress) {
      addResult('❌ Primero crea un mercado');
      return;
    }

    try {
      addResult('📊 Obteniendo información del mercado...');
      
      const info = await getMarketInfo(marketAddress);
      
      addResult(`✅ Información del mercado obtenida`);
      addResult(`📄 Datos: ${JSON.stringify(info)}`);
    } catch (err) {
      addResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          🔮 Oracle Demo - Mercados de Predicciones
        </h1>
        <p className="text-gray-300">
          Demostración completa del programa Oracle en Solana
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Program ID: {programId}
        </p>
        <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-sm text-gray-300">
            Wallet Status: {connected ? (
              <span className="text-green-400 font-medium">✅ Conectada</span>
            ) : (
              <span className="text-red-400 font-medium">❌ No conectada</span>
            )}
          </p>
          {publicKey && (
            <p className="text-xs mt-1">
              <span className="text-gray-400">Address: </span>
              <span className="matrix-text-green font-mono">
                {publicKey.toString().substring(0, 8)}...{publicKey.toString().slice(-8)}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Control */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Panel de Control</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateMarket}
              disabled={loading || !connected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? '⏳ Procesando...' : '🚀 Crear Mercado'}
            </button>

            <button
              onClick={handlePlaceBet}
              disabled={loading || !marketAddress || !connected}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? '⏳ Procesando...' : '🎯 Colocar Apuesta'}
            </button>

            <button
              onClick={handleResolveMarket}
              disabled={loading || !marketAddress || !connected}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? '⏳ Procesando...' : '🏁 Resolver Mercado'}
            </button>

            <button
              onClick={handleClaimWinnings}
              disabled={loading || !marketAddress || !betAddress || !connected}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? '⏳ Procesando...' : '💰 Reclamar Ganancias'}
            </button>

            <button
              onClick={handleGetMarketInfo}
              disabled={loading || !marketAddress || !connected}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? '⏳ Procesando...' : '📊 Info del Mercado'}
            </button>

            <button
              onClick={clearResults}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Limpiar Logs
            </button>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Log de Actividad</h2>
          
          <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400 text-center">No hay actividad aún...</p>
            ) : (
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-300">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!connected && (
            <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ Conecta tu wallet para usar todas las funcionalidades
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">Error: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Información del Estado */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Estado Actual</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Mercado</h3>
            <p className="text-gray-300 text-sm">
              {marketAddress ? (
                <span className="font-mono break-all">{marketAddress}</span>
              ) : (
                'No creado'
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Apuesta</h3>
            <p className="text-gray-300 text-sm">
              {betAddress ? (
                <span className="font-mono break-all">{betAddress}</span>
              ) : (
                'No colocada'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
