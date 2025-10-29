'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useResponsive } from '../lib/responsive';
import { 
  ExternalLink,
  Heart,
  Zap,
  Shield,
  Globe,
  Code,
  BookOpen,
  Users,
  TrendingUp,
  X,
  ChevronRight,
  Star,
  GitBranch,
  FileText,
  Calendar,
  Target,
  Award,
  Lightbulb
} from 'lucide-react';

/**
 * 🔮 Footer Component - Glassmorphism Footer for Oráculo
 * 
 * Modern footer with glassmorphism design that includes
 * links, statistics and project information
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function Footer() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const socialLinks = [
    {
      name: 'X',
      icon: <X className="w-5 h-5" />,
      href: 'https://x.com/Oraculosolana',
      color: 'hover:text-blue-400'
    }
  ];

  const quickLinks = [
    { name: 'Documentation', id: 'documentation', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'API Reference', id: 'api', icon: <Code className="w-4 h-4" /> },
    { name: 'Community', id: 'community', icon: <Users className="w-4 h-4" /> },
    { name: 'Roadmap', id: 'roadmap', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const features = [
    { name: 'Decentralized', icon: <Shield className="w-4 h-4" /> },
    { name: 'Fast', icon: <Zap className="w-4 h-4" /> },
    { name: 'Global', icon: <Globe className="w-4 h-4" /> }
  ];

  return (
    <footer className="relative mt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className={`matrix-card-enhanced neural-floating mb-6 ${
          isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
        }`}>
          <div className={`grid gap-6 ${
            isMobile ? 'grid-cols-1' : 
            isTablet ? 'grid-cols-1 md:grid-cols-2' : 
            'grid-cols-1 lg:grid-cols-4'
          }`}>
            {/* Brand Section */}
            <div className={`space-y-6 ${
              isMobile ? 'col-span-1' : 
              isTablet ? 'col-span-1 md:col-span-2' : 
              'lg:col-span-2'
            }`}>
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-2xl font-bold matrix-text-green neural-text-glow">
                    ORÁCULO
                  </h3>
                  <p className="text-sm matrix-text-white text-opacity-80">
                    Decentralized Prediction Markets
                  </p>
                </div>
              </div>
              
              <p className="matrix-text-white text-opacity-90 max-w-md">
                The most advanced platform to create, participate and resolve prediction markets 
                on Solana. Predict the future, earn rewards, build tomorrow.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="glass-status px-3 py-2 flex items-center space-x-2">
                    {feature.icon}
                    <span className="text-sm matrix-text-green font-medium">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold matrix-text-green">Quick Links</h4>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveModal(link.id)}
                    className="flex items-center space-x-2 matrix-text-white text-opacity-80 hover:text-green-400 hover:text-opacity-100 transition-colors group w-full text-left"
                  >
                    {link.icon}
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold matrix-text-green">Connect</h4>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 matrix-text-white text-opacity-80 ${social.color} hover:text-opacity-100 transition-colors group`}
                  >
                    {social.icon}
                    <span className="group-hover:translate-x-1 transition-transform">
                      {social.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid gap-4 mb-6 ${
          isMobile ? 'grid-cols-2' : 
          isTablet ? 'grid-cols-2 md:grid-cols-4' : 
          'grid-cols-2 md:grid-cols-4'
        }`}>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">$2.5M+</div>
            <div className="text-xs matrix-text-white text-opacity-70">Total Volume</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">1,247</div>
            <div className="text-xs matrix-text-white text-opacity-70">Markets</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">52K+</div>
            <div className="text-xs matrix-text-white text-opacity-70">Users</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">94.2%</div>
            <div className="text-xs matrix-text-white text-opacity-70">Accuracy</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`matrix-card-enhanced neural-floating ${
          isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'
        }`}>
          <div className={`flex justify-between items-center ${
            isMobile ? 'flex-col space-y-4' : 
            isTablet ? 'flex-col md:flex-row space-y-4 md:space-y-0' : 
            'flex-col md:flex-row space-y-4 md:space-y-0'
          }`}>
            <div className="flex items-center space-x-2 matrix-text-white text-opacity-80">
              <span>© {currentYear} Oráculo. Made by</span>
              <span className="matrix-text-green font-bold">Vaiosx</span>
              <span>and</span>
              <span className="matrix-text-green font-bold">M0nsxx</span>
              <span>with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>on Solana</span>
            </div>
            
            {/* Let's Fruta Build Section */}
            <div className="flex items-center space-x-2 matrix-text-white text-opacity-80">
              <span>Let&apos;s</span>
              <span className="matrix-text-green font-bold">Fruta</span>
              <span>Build</span>
              <span className="text-lg">🍒</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm matrix-text-white text-opacity-60">
                Powered by Solana Blockchain
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-neural-pulse matrix-glow"></div>
                <span className="text-sm matrix-text-green font-medium">Network: Devnet</span>
              </div>
            </div>
            
            {/* México Flag and Text */}
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                {/* México Flag - Correct Design */}
                <div className="flex border border-gray-300 rounded-sm">
                  <div className="w-4 h-3 bg-green-600"></div>
                  <div className="w-4 h-3 bg-white relative flex items-center justify-center">
                    {/* Mexican Eagle Shield */}
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-4 h-3 bg-red-600"></div>
                </div>
                <span className="text-sm matrix-text-white font-medium">
                  🇲🇽 Made in Mexico
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="matrix-card-enhanced neural-floating max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {activeModal === 'documentation' && <BookOpen className="w-6 h-6 text-green-400" />}
                  {activeModal === 'api' && <Code className="w-6 h-6 text-green-400" />}
                  {activeModal === 'community' && <Users className="w-6 h-6 text-green-400" />}
                  {activeModal === 'roadmap' && <TrendingUp className="w-6 h-6 text-green-400" />}
                  <h2 className="text-2xl font-bold matrix-text-green">
                    {activeModal === 'documentation' && 'Documentation'}
                    {activeModal === 'api' && 'API Reference'}
                    {activeModal === 'community' && 'Community'}
                    {activeModal === 'roadmap' && 'Roadmap'}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="space-y-6">
                {activeModal === 'documentation' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Getting Started Guide</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Learn the basics of prediction markets and how to use Oráculo.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Read Guide
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Target className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Tutorials</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Step-by-step tutorials to create and participate in markets.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          View Tutorials
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Shield className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Security</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Security best practices and fund protection.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Security Guide
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Award className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Strategies</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Advanced strategies to maximize profits in markets.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          View Strategies
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'api' && (
                  <div className="space-y-6">
                    <div className="matrix-card-enhanced neural-floating p-6">
                      <h3 className="text-xl font-bold matrix-text-green mb-4">API Endpoints</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div>
                            <code className="text-green-400 font-mono">GET /api/markets</code>
                            <p className="text-sm matrix-text-white text-opacity-70">Get list of markets</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Test</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div>
                            <code className="text-green-400 font-mono">POST /api/markets</code>
                            <p className="text-sm matrix-text-white text-opacity-70">Create new market</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Test</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div>
                            <code className="text-green-400 font-mono">GET /api/markets/:id</code>
                            <p className="text-sm matrix-text-white text-opacity-70">Get specific market</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Test</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <h4 className="text-lg font-bold matrix-text-green mb-3">SDK JavaScript</h4>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Official SDK to integrate Oráculo in JavaScript/TypeScript applications.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          View Documentation
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <h4 className="text-lg font-bold matrix-text-green mb-3">Webhooks</h4>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Receive real-time notifications of important events.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Configure Webhooks
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'community' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-1">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <X className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">X (Twitter)</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Stay updated with the latest news and project updates on X.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm matrix-text-green">15.2K followers</span>
                        </div>
                        <a 
                          href="https://x.com/Oraculosolana" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="matrix-button-enhanced text-sm mt-3 inline-block"
                        >
                          Follow on X
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'roadmap' && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Phase 1 - Cypherpunk Foundation ✅</h3>
                        </div>
                        <p className="text-sm matrix-text-white text-opacity-70 mb-3">Q4 2025 - Implementation of fundamental cypherpunk values</p>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Decentralized architecture on Solana</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Anonymous transactions without KYC</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>100% open source code</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Matrix cyberpunk interface</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>30+ Mexican templates</span>
                          </li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-green-400/20 text-green-400 rounded-full">Privacy</span>
                          <span className="px-2 py-1 text-xs bg-blue-400/20 text-blue-400 rounded-full">Decentralization</span>
                          <span className="px-2 py-1 text-xs bg-yellow-400/20 text-yellow-400 rounded-full">Transparency</span>
                        </div>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-bold matrix-text-blue">Phase 2 - Privacy Expansion 🚧</h3>
                        </div>
                        <p className="text-sm matrix-text-white text-opacity-70 mb-3">Q1 2026 - Advanced privacy and decentralization improvements</p>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Zero-knowledge proofs for resolution</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Decentralized governance</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Private oracles</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Confidential markets</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Integration with more wallets</span>
                          </li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-green-400/20 text-green-400 rounded-full">Privacy</span>
                          <span className="px-2 py-1 text-xs bg-purple-400/20 text-purple-400 rounded-full">Innovation</span>
                          <span className="px-2 py-1 text-xs bg-red-400/20 text-red-400 rounded-full">Freedom</span>
                        </div>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <h3 className="text-lg font-bold matrix-text-purple">Phase 3 - Global Revolution 📋</h3>
                        </div>
                        <p className="text-sm matrix-text-white text-opacity-70 mb-3">Q2 2026 - Global scaling while maintaining cypherpunk values</p>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Mainnet deployment</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Public API for developers</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>SDK for integrations</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Cross-chain markets</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Complete ecosystem</span>
                          </li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-blue-400/20 text-blue-400 rounded-full">Decentralization</span>
                          <span className="px-2 py-1 text-xs bg-purple-400/20 text-purple-400 rounded-full">Innovation</span>
                          <span className="px-2 py-1 text-xs bg-cyan-400/20 text-cyan-400 rounded-full">Community</span>
                        </div>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Lightbulb className="w-5 h-5 text-orange-400" />
                          <h3 className="text-lg font-bold matrix-text-orange">Shipyard MX Vision 🔮</h3>
                        </div>
                        <p className="text-sm matrix-text-white text-opacity-70 mb-3">Long-term vision for the Shipyard MX Award project</p>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Machine Learning for predictions</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Multi-blockchain integration</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>ORACLE governance token</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Advanced privacy protocols</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Global cypherpunk ecosystem</span>
                          </li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-orange-400/20 text-orange-400 rounded-full">Shipyard MX</span>
                          <span className="px-2 py-1 text-xs bg-green-400/20 text-green-400 rounded-full">Cypherpunk</span>
                          <span className="px-2 py-1 text-xs bg-blue-400/20 text-blue-400 rounded-full">Innovation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
