'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Code, 
  Zap, 
  Key,
  Cpu,
  Network,
  Database,
  Fingerprint,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

/**
 * 🔐 CypherpunkManifesto Component - Manifesto Cypherpunk Interactivo
 * 
 * Componente que muestra los valores cypherpunk del proyecto
 * para el Shipyard MX Award
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface CypherpunkValue {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  implementation: string;
  status: 'implemented' | 'partial' | 'planned';
}

const cypherpunkValues: CypherpunkValue[] = [
  {
    id: 'privacy',
    title: 'Privacidad Total',
    description: 'Transacciones completamente anónimas y privadas. Sin recolección de datos personales.',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-green-400',
    implementation: 'Wallets descentralizadas, transacciones anónimas en blockchain, sin KYC',
    status: 'implemented'
  },
  {
    id: 'decentralization',
    title: 'Descentralización Pura',
    description: 'Sin servidores centrales, control comunitario total, código abierto.',
    icon: <Globe className="w-8 h-8" />,
    color: 'text-blue-400',
    implementation: 'Arquitectura P2P, contratos inteligentes en Solana, governance descentralizado',
    status: 'implemented'
  },
  {
    id: 'transparency',
    title: 'Transparencia Radical',
    description: 'Código fuente público, transacciones auditables, procesos abiertos.',
    icon: <Eye className="w-8 h-8" />,
    color: 'text-yellow-400',
    implementation: 'Código 100% open source, transacciones públicas en blockchain, documentación completa',
    status: 'implemented'
  },
  {
    id: 'innovation',
    title: 'Innovación Tecnológica',
    description: 'Tecnología blockchain de vanguardia, integración Solana nativa.',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-purple-400',
    implementation: 'Solana blockchain, Anchor framework, Rust smart contracts, Next.js 14',
    status: 'implemented'
  },
  {
    id: 'freedom',
    title: 'Libertad Financiera',
    description: 'Acceso global a mercados de predicción sin restricciones geográficas.',
    icon: <Key className="w-8 h-8" />,
    color: 'text-red-400',
    implementation: 'Sin censura, acceso global, mercados 24/7, sin intermediarios',
    status: 'implemented'
  },
  {
    id: 'community',
    title: 'Control Comunitario',
    description: 'Decisión colectiva sobre resolución de mercados y governance.',
    icon: <Users className="w-8 h-8" />,
    color: 'text-cyan-400',
    implementation: 'Governance descentralizado, votación comunitaria, resolución automática',
    status: 'partial'
  }
];

export function CypherpunkManifesto() {
  const [selectedValue, setSelectedValue] = useState<CypherpunkValue | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'planned':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'Implementado';
      case 'partial':
        return 'Parcial';
      case 'planned':
        return 'Planificado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="matrix-card-enhanced p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="w-12 h-12 text-green-400 matrix-glow" />
          <h2 className="text-4xl font-bold matrix-text-green">
            🔐 Manifesto Cypherpunk
          </h2>
        </div>
        <p className="text-xl matrix-text-white">
          Valores fundamentales para el Shipyard MX Award
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm matrix-text-green">
          <Cpu className="w-4 h-4" />
          <span>Built with Cypherpunk Values</span>
          <Network className="w-4 h-4" />
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cypherpunkValues.map((value, index) => (
          <div
            key={value.id}
            className={`matrix-card-enhanced p-6 cursor-pointer transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onClick={() => setSelectedValue(value)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`${value.color} matrix-glow`}>
                  {value.icon}
                </div>
                {getStatusIcon(value.status)}
              </div>
              
              <div>
                <h3 className="text-xl font-bold matrix-text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm matrix-text-white opacity-80 mb-3">
                  {value.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    value.status === 'implemented' ? 'bg-green-900/30 text-green-400 border border-green-400/30' :
                    value.status === 'partial' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-400/30' :
                    'bg-red-900/30 text-red-400 border border-red-400/30'
                  }`}>
                    {getStatusText(value.status)}
                  </span>
                  <Database className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedValue && (
        <div className="matrix-card-enhanced p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`${selectedValue.color} matrix-glow`}>
                {selectedValue.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold matrix-text-white">
                  {selectedValue.title}
                </h3>
                <p className="matrix-text-white opacity-80">
                  {selectedValue.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedValue(null)}
              className="matrix-button-enhanced px-4 py-2"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold matrix-text-green mb-2">
                🚀 Implementación Técnica
              </h4>
              <p className="matrix-text-white">
                {selectedValue.implementation}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedValue.status)}
                <span className="matrix-text-white">
                  Estado: {getStatusText(selectedValue.status)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-gray-400" />
                <span className="text-sm matrix-text-white opacity-60">
                  ID: {selectedValue.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4 text-sm matrix-text-green">
          <span>🔐 Privacy First</span>
          <span>🌍 Decentralized</span>
          <span>👁️ Transparent</span>
          <span>⚡ Innovative</span>
        </div>
        <p className="text-xs matrix-text-white opacity-60">
          Oráculo - Prediction Markets on Solana | Built for Shipyard MX Award
        </p>
      </div>
    </div>
  );
}

export default CypherpunkManifesto;
