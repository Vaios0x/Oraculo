'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Globe, 
  Code, 
  Zap, 
  Users,
  Database,
  Cpu,
  Network,
  Activity,
  TrendingUp,
  BarChart3,
  Eye,
  Key,
  Fingerprint
} from 'lucide-react';

/**
 * 📊 CypherpunkStats Component - Estadísticas del Proyecto Cypherpunk
 * 
 * Componente que muestra métricas y estadísticas del proyecto
 * para demostrar el impacto cypherpunk
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

const stats: StatItem[] = [
  {
    id: 'privacy',
    label: 'Privacidad',
    value: '100%',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-green-400',
    description: 'Transacciones anónimas',
    trend: 'up'
  },
  {
    id: 'decentralization',
    label: 'Descentralización',
    value: '100%',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-blue-400',
    description: 'Sin servidores centrales',
    trend: 'up'
  },
  {
    id: 'transparency',
    label: 'Transparencia',
    value: '100%',
    icon: <Eye className="w-6 h-6" />,
    color: 'text-yellow-400',
    description: 'Código abierto',
    trend: 'up'
  },
  {
    id: 'markets',
    label: 'Mercados',
    value: '30+',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-purple-400',
    description: 'Plantillas mexicanas',
    trend: 'up'
  },
  {
    id: 'transactions',
    label: 'Transacciones',
    value: '100%',
    icon: <Activity className="w-6 h-6" />,
    color: 'text-cyan-400',
    description: 'Tasa de éxito',
    trend: 'stable'
  },
  {
    id: 'cost',
    label: 'Costo',
    value: '0.00008',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-red-400',
    description: 'SOL por transacción',
    trend: 'down'
  }
];

export function CypherpunkStats() {
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const intervals: NodeJS.Timeout[] = [];
      
      stats.forEach((stat, index) => {
        const timer = setTimeout(() => {
          setAnimatedStats(prev => ({
            ...prev,
            [stat.id]: 1
          }));
        }, index * 200);
        intervals.push(timer);
      });

      return () => intervals.forEach(clearTimeout);
    }
  }, [isVisible]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="matrix-card-enhanced p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Database className="w-10 h-10 text-green-400 matrix-glow" />
          <h2 className="text-3xl font-bold matrix-text-green">
            📊 Métricas Cypherpunk
          </h2>
        </div>
        <p className="text-lg matrix-text-white">
          Estadísticas que demuestran los valores cypherpunk del proyecto
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`matrix-card-enhanced p-6 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`${stat.color} matrix-glow`}>
                  {stat.icon}
                </div>
                {getTrendIcon(stat.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold matrix-text-white">
                    {stat.value}
                  </span>
                  {stat.id === 'cost' && (
                    <span className="text-sm matrix-text-white opacity-60">SOL</span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold matrix-text-green">
                  {stat.label}
                </h3>
                
                <p className="text-sm matrix-text-white opacity-80">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Stack */}
      <div className="matrix-card-enhanced p-6 space-y-6">
        <h3 className="text-2xl font-bold matrix-text-green text-center">
          🛠️ Stack Tecnológico Cypherpunk
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold matrix-text-white">
              🔐 Blockchain & Privacidad
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Cpu className="w-5 h-5 text-green-400" />
                <span className="matrix-text-white">Solana Blockchain</span>
              </div>
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="matrix-text-white">Anchor Framework</span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="matrix-text-white">Rust Smart Contracts</span>
              </div>
              <div className="flex items-center space-x-3">
                <Key className="w-5 h-5 text-yellow-400" />
                <span className="matrix-text-white">Wallet Integration</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold matrix-text-white">
              🌐 Frontend & UX
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="matrix-text-white">Next.js 14</span>
              </div>
              <div className="flex items-center space-x-3">
                <Network className="w-5 h-5 text-blue-400" />
                <span className="matrix-text-white">TypeScript</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-purple-400" />
                <span className="matrix-text-white">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-3">
                <Fingerprint className="w-5 h-5 text-yellow-400" />
                <span className="matrix-text-white">Matrix Effects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="matrix-card-enhanced p-6 space-y-6">
        <h3 className="text-2xl font-bold matrix-text-green text-center">
          🎯 Impacto Cypherpunk
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold matrix-text-green">🇲🇽</div>
            <h4 className="text-lg font-semibold matrix-text-white">
              México First
            </h4>
            <p className="text-sm matrix-text-white opacity-80">
              Temas específicos para la comunidad mexicana
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold matrix-text-green">🌍</div>
            <h4 className="text-lg font-semibold matrix-text-white">
              Acceso Global
            </h4>
            <p className="text-sm matrix-text-white opacity-80">
              Sin restricciones geográficas
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold matrix-text-green">⚡</div>
            <h4 className="text-lg font-semibold matrix-text-white">
              Ultra Rápido
            </h4>
            <p className="text-sm matrix-text-white opacity-80">
              Transacciones en segundos
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm matrix-text-green">
          <span>🔐 Privacy by Design</span>
          <span>🌍 Decentralized</span>
          <span>👁️ Transparent</span>
          <span>⚡ Fast</span>
        </div>
        <p className="text-xs matrix-text-white opacity-60">
          Oráculo - Shipyard MX Award Submission | Cypherpunk Values
        </p>
      </div>
    </div>
  );
}

export default CypherpunkStats;
