"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  User,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface PrivacyLevel {
  level: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const PRIVACY_LEVELS: PrivacyLevel[] = [
  {
    level: 0,
    name: "Público",
    description: "Información visible para todos",
    icon: <Unlock className="h-5 w-5" />,
    features: ["Perfil visible", "Historial público", "Estadísticas compartidas"]
  },
  {
    level: 1,
    name: "Privado",
    description: "Solo información necesaria",
    icon: <Lock className="h-5 w-5" />,
    features: ["Wallet anónimo", "Datos mínimos", "Control selectivo"]
  },
  {
    level: 2,
    name: "Anónimo",
    description: "Máxima privacidad",
    icon: <Shield className="h-5 w-5" />,
    features: ["Completamente anónimo", "Sin datos personales", "Transacciones privadas"]
  }
];

export function PrivacyFirstMarket() {
  const { publicKey, connected } = useWallet();
  const [selectedPrivacy, setSelectedPrivacy] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useMixer, setUseMixer] = useState(false);
  const [commitmentHash, setCommitmentHash] = useState<string>('');

  const generateCommitmentHash = () => {
    // Generate commitment hash for privacy
    const hash = Math.random().toString(36).substring(2, 15);
    setCommitmentHash(hash);
  };

  const handleCreatePrivateMarket = async () => {
    if (!publicKey) return;
    
    console.log('Creating private market with privacy level:', selectedPrivacy);
    console.log('Using mixer:', useMixer);
    console.log('Commitment hash:', commitmentHash);
  };

  const handlePlaceAnonymousBet = async (outcome: string, amount: number) => {
    if (!publicKey) return;
    
    console.log('Placing anonymous bet:', { outcome, amount });
    console.log('Privacy level:', selectedPrivacy);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🔐 Oráculo Privado
        </h1>
        <p className="text-xl text-gray-600">
          Mercados de predicción con privacidad cypherpunk
        </p>
        <p className="text-sm text-gray-500 mt-2">
          "Privacy is the power to selectively reveal oneself to the world"
        </p>
      </div>

      {/* Privacy Level Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          Nivel de Privacidad
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRIVACY_LEVELS.map((level) => (
            <div
              key={level.level}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPrivacy === level.level
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPrivacy(level.level)}
            >
              <div className="flex items-center space-x-2 mb-2">
                {level.icon}
                <h3 className="font-semibold">{level.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{level.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {level.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Eye className="h-6 w-6 mr-2" />
          Características de Privacidad
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anonymous Transactions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Transacciones Anónimas</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Sin KYC requerido</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Wallets descentralizados</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Datos mínimos almacenados</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Privacy */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Privacidad Criptográfica</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Commitment schemes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Zero-knowledge proofs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Encrypted communications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Privacy Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Lock className="h-6 w-6 mr-2" />
            Opciones Avanzadas
          </h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-purple-600 hover:text-purple-800"
          >
            {showAdvanced ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4">
            {/* Mixer Option */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useMixer"
                checked={useMixer}
                onChange={(e) => setUseMixer(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useMixer" className="text-sm font-medium">
                Usar mixer para mayor privacidad
              </label>
            </div>

            {/* Commitment Hash */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Commitment Hash</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={commitmentHash}
                  onChange={(e) => setCommitmentHash(e.target.value)}
                  placeholder="Generar hash de compromiso"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={generateCommitmentHash}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Generar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Market Creation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Crear Mercado Privado
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Mercado
            </label>
            <input
              type="text"
              placeholder="¿Bitcoin alcanzará $100K en 2024?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Describe el evento a predecir..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <button
            onClick={handleCreatePrivateMarket}
            disabled={!connected}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {connected ? 'Crear Mercado Privado' : 'Conecta tu wallet'}
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">Aviso de Privacidad</h3>
            <p className="text-sm text-blue-700 mt-1">
              Oráculo respeta tu privacidad. Solo almacenamos la información mínima necesaria 
              para las transacciones. Tu identidad personal nunca es requerida.
            </p>
          </div>
        </div>
      </div>

      {/* Cypherpunk Manifesto Quote */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <blockquote className="text-sm text-gray-700 italic">
          "We the Cypherpunks are dedicated to building anonymous systems. 
          We are defending our privacy with cryptography, with anonymous mail 
          forwarding systems, with digital signatures, and with electronic money."
        </blockquote>
        <cite className="text-xs text-gray-500 mt-2 block">
          - Eric Hughes, A Cypherpunk's Manifesto (1993)
        </cite>
      </div>
    </div>
  );
}
