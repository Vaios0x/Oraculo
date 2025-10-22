'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield,
  Globe,
  Code,
  Users,
  Database,
  Cpu,
  Network,
  Eye,
  Key,
  Lock,
  Star,
  XCircle,
  Target,
  Rocket
} from 'lucide-react';

/**
 * 🗺️ CypherpunkRoadmap Component - Roadmap del Proyecto Cypherpunk
 * 
 * Componente que muestra la hoja de ruta del proyecto
 * para el Shipyard MX Award
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  status: 'completed' | 'current' | 'upcoming';
  date: string;
  cypherpunkValues: string[];
}

const roadmapItems: RoadmapItem[] = [
  {
    id: 'phase1',
    phase: 'Fase 1',
    title: 'Fundación Cypherpunk',
    description: 'Implementación de valores cypherpunk fundamentales',
    features: [
      'Arquitectura descentralizada en Solana',
      'Transacciones anónimas sin KYC',
      'Código fuente completamente abierto',
      'Interfaz Matrix cyberpunk',
      '30+ plantillas mexicanas'
    ],
    icon: <Shield className="w-8 h-8" />,
    color: 'text-green-400',
    status: 'completed',
    date: 'Q4 2025',
    cypherpunkValues: ['Privacidad', 'Descentralización', 'Transparencia']
  },
  {
    id: 'phase2',
    phase: 'Fase 2',
    title: 'Expansión de Privacidad',
    description: 'Mejoras avanzadas de privacidad y descentralización',
    features: [
      'Zero-knowledge proofs para resolución',
      'Governance descentralizado',
      'Oracles privados',
      'Mercados confidenciales',
      'Integración con más wallets'
    ],
    icon: <Lock className="w-8 h-8" />,
    color: 'text-blue-400',
    status: 'current',
    date: 'Q1 2026',
    cypherpunkValues: ['Privacidad', 'Innovación', 'Libertad']
  },
  {
    id: 'phase3',
    phase: 'Fase 3',
    title: 'Revolución Global',
    description: 'Escalamiento global manteniendo valores cypherpunk',
    features: [
      'Mainnet deployment',
      'API pública para desarrolladores',
      'SDK para integraciones',
      'Mercados cross-chain',
      'Ecosistema completo'
    ],
    icon: <Globe className="w-8 h-8" />,
    color: 'text-purple-400',
    status: 'upcoming',
    date: 'Q2 2026',
    cypherpunkValues: ['Descentralización', 'Innovación', 'Comunidad']
  }
];

export function CypherpunkRoadmap() {
  const [selectedPhase, setSelectedPhase] = useState<RoadmapItem | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'current':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'upcoming':
        return <Target className="w-6 h-6 text-blue-400" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'current':
        return 'En Progreso';
      case 'upcoming':
        return 'Próximo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="matrix-card-enhanced p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <MapPin className="w-10 h-10 text-green-400 matrix-glow" />
          <h2 className="text-3xl font-bold matrix-text-green">
            🗺️ Roadmap Cypherpunk
          </h2>
        </div>
        <p className="text-lg matrix-text-white">
          Hoja de ruta hacia la revolución cypherpunk de los mercados de predicción
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm matrix-text-green">
          <Rocket className="w-4 h-4" />
          <span>Shipyard MX Award Vision</span>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-8">
        {roadmapItems.map((item, index) => (
          <div
            key={item.id}
            className={`matrix-card-enhanced p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
              item.status === 'current' ? 'border-green-400' : ''
            }`}
            onClick={() => setSelectedPhase(item)}
          >
            <div className="flex items-start space-x-6">
              {/* Phase Icon */}
              <div className="flex-shrink-0">
                <div className={`${item.color} matrix-glow`}>
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold matrix-text-green">
                        {item.phase}
                      </span>
                      <span className="text-sm matrix-text-white opacity-60">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold matrix-text-white mt-1">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm matrix-text-white">
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>

                <p className="matrix-text-white opacity-80">
                  {item.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-sm matrix-text-white">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cypherpunk Values */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm matrix-text-green font-semibold">
                    Valores:
                  </span>
                  <div className="flex items-center space-x-2">
                    {item.cypherpunkValues.map((value, valueIndex) => (
                      <span
                        key={valueIndex}
                        className="text-xs px-2 py-1 bg-green-900/30 text-green-400 border border-green-400/30 rounded-full"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Phase View */}
      {selectedPhase && (
        <div className="matrix-card-enhanced p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`${selectedPhase.color} matrix-glow`}>
                {selectedPhase.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold matrix-text-white">
                  {selectedPhase.title}
                </h3>
                <p className="matrix-text-white opacity-80">
                  {selectedPhase.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPhase(null)}
              className="matrix-button-enhanced px-4 py-2"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold matrix-text-green mb-3">
                🚀 Características Principales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPhase.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="matrix-text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold matrix-text-green mb-3">
                  📅 Cronograma
                </h4>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="matrix-text-white">{selectedPhase.date}</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold matrix-text-green mb-3">
                  🔐 Valores Cypherpunk
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPhase.cypherpunkValues.map((value, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-green-900/30 text-green-400 border border-green-400/30 rounded-full"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vision Statement */}
      <div className="matrix-card-enhanced p-6 space-y-4">
        <h3 className="text-2xl font-bold matrix-text-green text-center">
          🎯 Visión Cypherpunk
        </h3>
        <p className="text-center matrix-text-white text-lg leading-relaxed">
          "Crear un ecosistema de mercados de predicción completamente descentralizado, 
          privado y transparente que empodere a la comunidad mexicana y global, 
          manteniendo los valores cypherpunk fundamentales de privacidad, 
          descentralización y libertad financiera."
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm matrix-text-green">
          <span>🔐 Privacy First</span>
          <span>🌍 Global Access</span>
          <span>⚡ Lightning Fast</span>
          <span>🇲🇽 Mexico Focus</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm matrix-text-green">
          <span>🚀 Shipyard MX Award</span>
          <span>🔐 Cypherpunk Values</span>
          <span>🇲🇽 Mexican Innovation</span>
        </div>
        <p className="text-xs matrix-text-white opacity-60">
          Oráculo - The Future of Decentralized Prediction Markets
        </p>
      </div>
    </div>
  );
}

export default CypherpunkRoadmap;
