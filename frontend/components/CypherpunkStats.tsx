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
 * 📊 CypherpunkStats Component - Cypherpunk Project Statistics
 * 
 * Component that displays project metrics and statistics
 * to demonstrate cypherpunk impact
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
    label: 'Privacy',
    value: '100%',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-green-400',
    description: 'Anonymous transactions',
    trend: 'up'
  },
  {
    id: 'decentralization',
    label: 'Decentralization',
    value: '100%',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-blue-400',
    description: 'No central servers',
    trend: 'up'
  },
  {
    id: 'transparency',
    label: 'Transparency',
    value: '100%',
    icon: <Eye className="w-6 h-6" />,
    color: 'text-yellow-400',
    description: 'Open source code',
    trend: 'up'
  },
  {
    id: 'markets',
    label: 'Markets',
    value: '30+',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-purple-400',
    description: 'Mexican templates',
    trend: 'up'
  },
  {
    id: 'transactions',
    label: 'Transactions',
    value: '100%',
    icon: <Activity className="w-6 h-6" />,
    color: 'text-cyan-400',
    description: 'Success rate',
    trend: 'stable'
  },
  {
    id: 'cost',
    label: 'Cost',
    value: '0.00008',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-red-400',
    description: 'SOL per transaction',
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
    <div className="matrix-card-enhanced p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Database className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 matrix-glow flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-bold matrix-text-green">
            📊 Cypherpunk Metrics
          </h2>
        </div>
        <p className="text-sm sm:text-base lg:text-lg matrix-text-white">
          Manifesto Implementation Metrics
        </p>
        <p className="text-xs sm:text-sm matrix-text-green italic">
          "Cypherpunks write code" - Eric Hughes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`matrix-card-enhanced p-4 sm:p-6 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className={`${stat.color} matrix-glow`}>
                  {stat.icon}
                </div>
                {getTrendIcon(stat.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-bold matrix-text-white">
                    {stat.value}
                  </span>
                  {stat.id === 'cost' && (
                    <span className="text-xs sm:text-sm matrix-text-white opacity-60">SOL</span>
                  )}
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold matrix-text-green">
                  {stat.label}
                </h3>
                
                <p className="text-xs sm:text-sm matrix-text-white opacity-80">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Stack */}
      <div className="matrix-card-enhanced p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold matrix-text-green text-center">
          🛠️ Cypherpunk Tech Stack
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold matrix-text-white">
              🔐 Blockchain & Privacy
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Solana Blockchain</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Anchor Framework</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Rust Smart Contracts</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Wallet Integration</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold matrix-text-white">
              🌐 Frontend & UX
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Next.js 14</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Network className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">TypeScript</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-sm sm:text-base matrix-text-white">Matrix Effects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="matrix-card-enhanced p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold matrix-text-green text-center">
          🎯 Cypherpunk Impact
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold matrix-text-green">🇲🇽</div>
            <h4 className="text-base sm:text-lg font-semibold matrix-text-white">
              México First
            </h4>
            <p className="text-xs sm:text-sm matrix-text-white opacity-80">
              Specific topics for the Mexican community
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold matrix-text-green">🌍</div>
            <h4 className="text-base sm:text-lg font-semibold matrix-text-white">
              Global Access
            </h4>
            <p className="text-xs sm:text-sm matrix-text-white opacity-80">
              No geographical restrictions
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold matrix-text-green">⚡</div>
            <h4 className="text-base sm:text-lg font-semibold matrix-text-white">
              Ultra Fast
            </h4>
            <p className="text-xs sm:text-sm matrix-text-white opacity-80">
              Transactions in seconds
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
