'use client';

import React from 'react';
import { useResponsive } from '../lib/responsive';
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  ExternalLink,
  Heart,
  Zap,
  Shield,
  Globe,
  Code,
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react';

/**
 * 🔮 Footer Component - Footer glassmorphism para Oráculo
 * 
 * Footer moderno con diseño glassmorphism que incluye
 * enlaces, estadísticas y información del proyecto
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function Footer() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      href: 'https://github.com/oraculo-solana',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      href: 'https://twitter.com/oraculo_solana',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Discord',
      icon: <MessageCircle className="w-5 h-5" />,
      href: 'https://discord.gg/oraculo',
      color: 'hover:text-purple-400'
    }
  ];

  const quickLinks = [
    { name: 'Documentación', href: '#', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'API Reference', href: '#', icon: <Code className="w-4 h-4" /> },
    { name: 'Comunidad', href: '#', icon: <Users className="w-4 h-4" /> },
    { name: 'Roadmap', href: '#', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const features = [
    { name: 'Descentralizado', icon: <Shield className="w-4 h-4" /> },
    { name: 'Rápido', icon: <Zap className="w-4 h-4" /> },
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
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center matrix-glow">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold matrix-text-green neural-text-glow">
                    ORÁCULO
                  </h3>
                  <p className="text-sm matrix-text-white text-opacity-80">
                    Mercados de Predicción Descentralizados
                  </p>
                </div>
              </div>
              
              <p className="matrix-text-white text-opacity-90 max-w-md">
                La plataforma más avanzada para crear, participar y resolver mercados de predicción 
                en Solana. Predice el futuro, gana recompensas, construye el mañana.
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
              <h4 className="text-lg font-bold matrix-text-green">Enlaces Rápidos</h4>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-2 matrix-text-white text-opacity-80 hover:text-green-400 hover:text-opacity-100 transition-colors group"
                  >
                    {link.icon}
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold matrix-text-green">Conecta</h4>
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
            <div className="text-xs matrix-text-white text-opacity-70">Volume Total</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">1,247</div>
            <div className="text-xs matrix-text-white text-opacity-70">Mercados</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">52K+</div>
            <div className="text-xs matrix-text-white text-opacity-70">Usuarios</div>
          </div>
          <div className="matrix-card-enhanced neural-floating p-4 text-center">
            <div className="text-2xl font-bold matrix-text-green mb-1">94.2%</div>
            <div className="text-xs matrix-text-white text-opacity-70">Precisión</div>
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
              <span>© {currentYear} Oráculo. Hecho por</span>
              <span className="matrix-text-green font-bold">Vaiosx</span>
              <span>y</span>
              <span className="matrix-text-green font-bold">M0nsxx</span>
              <span>con</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>en Solana</span>
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
                  🇲🇽 Hecho en México
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
