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
 * 🗺️ CypherpunkRoadmap Component - Cypherpunk Project Roadmap
 * 
 * Component that displays the project roadmap
 * for the Shipyard MX Award
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
    phase: 'Phase 1',
    title: 'Cypherpunk Foundation',
    description: 'Implementation of fundamental cypherpunk values',
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
    cypherpunkValues: ['Privacy', 'Decentralization', 'Transparency']
  },
  {
    id: 'phase2',
    phase: 'Phase 2',
    title: 'Privacy Expansion',
    description: 'Advanced privacy and decentralization improvements',
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
    cypherpunkValues: ['Privacy', 'Innovation', 'Freedom']
  },
  {
    id: 'phase3',
    phase: 'Phase 3',
    title: 'Global Revolution',
    description: 'Global scaling while maintaining cypherpunk values',
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
    cypherpunkValues: ['Decentralization', 'Innovation', 'Community']
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
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="matrix-card-enhanced p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 matrix-glow flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-bold matrix-text-green">
            🗺️ Cypherpunk Roadmap
          </h2>
        </div>
        <p className="text-sm sm:text-base lg:text-lg matrix-text-white">
          Roadmap towards the cypherpunk revolution of prediction markets
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm matrix-text-green">
          <Rocket className="w-4 h-4" />
          <span>Eric Hughes Manifesto Implementation</span>
        </div>
        <p className="text-xs matrix-text-green italic">
          "We must defend our own privacy if we expect to have any" - Eric Hughes
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-6 sm:space-y-8">
        {roadmapItems.map((item, index) => (
          <div
            key={item.id}
            className={`matrix-card-enhanced p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
              item.status === 'current' ? 'border-green-400' : ''
            }`}
            onClick={() => setSelectedPhase(item)}
          >
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Phase Icon */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className={`${item.color} matrix-glow`}>
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm font-semibold matrix-text-green">
                        {item.phase}
                      </span>
                      <span className="text-xs sm:text-sm matrix-text-white opacity-60">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold matrix-text-white mt-1">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs sm:text-sm matrix-text-white">
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base matrix-text-white opacity-80 text-center sm:text-left">
                  {item.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm matrix-text-white">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cypherpunk Values */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-xs sm:text-sm matrix-text-green font-semibold text-center sm:text-left">
                    Values:
                  </span>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
        <div className="matrix-card-enhanced p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className={`${selectedPhase.color} matrix-glow`}>
                {selectedPhase.icon}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold matrix-text-white">
                  {selectedPhase.title}
                </h3>
                <p className="text-sm sm:text-base matrix-text-white opacity-80">
                  {selectedPhase.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPhase(null)}
              className="matrix-button-enhanced px-3 py-2 sm:px-4 sm:py-2 mx-auto sm:mx-0"
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-base sm:text-lg font-semibold matrix-text-green mb-3">
                🚀 Características Principales
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {selectedPhase.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base matrix-text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-base sm:text-lg font-semibold matrix-text-green mb-3">
                  📅 Cronograma
                </h4>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base matrix-text-white">{selectedPhase.date}</span>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold matrix-text-green mb-3">
                  🔐 Cypherpunk Values
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPhase.cypherpunkValues.map((value, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 sm:px-3 py-1 bg-green-900/30 text-green-400 border border-green-400/30 rounded-full"
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
      <div className="matrix-card-enhanced p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold matrix-text-green text-center">
          🎯 Cypherpunk Vision
        </h3>
        <p className="text-center matrix-text-white text-sm sm:text-base lg:text-lg leading-relaxed">
          "Create a completely decentralized, private and transparent prediction markets ecosystem 
          that empowers the Mexican and global community, 
          implementing Eric Hughes' cypherpunk manifesto through 
          anonymous transaction systems, cryptography, and community-driven code."
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm matrix-text-green">
          <span>🔐 Privacy First</span>
          <span>🌍 Global Access</span>
          <span>⚡ Lightning Fast</span>
          <span>🇲🇽 Mexico Focus</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm matrix-text-green">
          <span>🚀 Shipyard MX Award</span>
          <span>📜 Eric Hughes Manifesto</span>
          <span>🔐 Cypherpunk Values</span>
          <span>🇲🇽 Mexican Innovation</span>
        </div>
        <p className="text-xs matrix-text-white opacity-60">
          Oráculo - Implementing A Cypherpunk's Manifesto on Solana
        </p>
      </div>
    </div>
  );
}

export default CypherpunkRoadmap;
