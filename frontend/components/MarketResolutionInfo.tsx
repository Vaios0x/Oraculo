"use client";

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Crown, Shield, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * 🔒 MarketResolutionInfo Component - Información sobre resolución de mercados
 * 
 * Componente que muestra información sobre quién puede resolver un mercado
 * y las reglas de resolución
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface MarketResolutionInfoProps {
  marketCreator: string;
  isResolved: boolean;
  endTime: number;
}

export function MarketResolutionInfo({ marketCreator, isResolved, endTime }: MarketResolutionInfoProps) {
  const { publicKey } = useWallet();
  const now = Math.floor(Date.now() / 1000);
  const isExpired = now > endTime;
  const isCreator = publicKey?.toString() === marketCreator;

  const canResolve = !isResolved && isExpired && isCreator;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {canResolve ? (
            <Crown className="w-6 h-6 text-yellow-600" />
          ) : (
            <Shield className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {canResolve ? '👑 Puedes Resolver este Mercado' : '🔒 Reglas de Resolución'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {isCreator ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-sm ${isCreator ? 'text-green-700' : 'text-gray-600'}`}>
                {isCreator ? 'Eres el creador de este mercado' : 'No eres el creador de este mercado'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isExpired ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-500" />
              )}
              <span className={`text-sm ${isExpired ? 'text-green-700' : 'text-orange-600'}`}>
                {isExpired ? 'El mercado ha expirado' : 'El mercado aún está activo'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isResolved ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-sm ${!isResolved ? 'text-green-700' : 'text-gray-600'}`}>
                {!isResolved ? 'El mercado no ha sido resuelto' : 'El mercado ya ha sido resuelto'}
              </span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Regla importante:</strong> Solo el creador del mercado puede resolverlo una vez que haya expirado. 
              Esto garantiza la integridad y evita resolución maliciosa por terceros.
            </p>
          </div>

          {canResolve && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                ✅ Cumples todos los requisitos para resolver este mercado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketResolutionInfo;


