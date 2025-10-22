'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  TrendingUp,
  X,
  ChevronRight,
  Star,
  GitBranch,
  FileText,
  MessageSquare,
  Calendar,
  Target,
  Award,
  Lightbulb
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

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
    { name: 'Documentación', id: 'documentation', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'API Reference', id: 'api', icon: <Code className="w-4 h-4" /> },
    { name: 'Comunidad', id: 'community', icon: <Users className="w-4 h-4" /> },
    { name: 'Roadmap', id: 'roadmap', icon: <TrendingUp className="w-4 h-4" /> }
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
            
            {/* Let's Fruta Build Section */}
            <div className="flex items-center space-x-2 matrix-text-white text-opacity-80">
              <span>Let&apos;s</span>
              <span className="matrix-text-green font-bold">Fruta</span>
              <span>Build</span>
              <span className="text-lg">🍒</span>
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
                  🇲🇽 Hecho en México
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
                    {activeModal === 'documentation' && 'Documentación'}
                    {activeModal === 'api' && 'API Reference'}
                    {activeModal === 'community' && 'Comunidad'}
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
                          <h3 className="text-lg font-bold matrix-text-green">Guía de Inicio</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Aprende los conceptos básicos de los mercados de predicción y cómo usar Oráculo.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Leer Guía
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Target className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Tutoriales</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Tutoriales paso a paso para crear y participar en mercados.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Ver Tutoriales
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Shield className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Seguridad</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Mejores prácticas de seguridad y protección de fondos.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Guía de Seguridad
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Award className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Estrategias</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Estrategias avanzadas para maximizar ganancias en mercados.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Ver Estrategias
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
                            <p className="text-sm matrix-text-white text-opacity-70">Obtener lista de mercados</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Probar</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div>
                            <code className="text-green-400 font-mono">POST /api/markets</code>
                            <p className="text-sm matrix-text-white text-opacity-70">Crear nuevo mercado</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Probar</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div>
                            <code className="text-green-400 font-mono">GET /api/markets/:id</code>
                            <p className="text-sm matrix-text-white text-opacity-70">Obtener mercado específico</p>
                          </div>
                          <button className="matrix-button-enhanced text-xs">Probar</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <h4 className="text-lg font-bold matrix-text-green mb-3">SDK JavaScript</h4>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          SDK oficial para integrar Oráculo en aplicaciones JavaScript/TypeScript.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Ver Documentación
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <h4 className="text-lg font-bold matrix-text-green mb-3">Webhooks</h4>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Recibe notificaciones en tiempo real de eventos importantes.
                        </p>
                        <button className="matrix-button-enhanced text-sm">
                          Configurar Webhooks
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'community' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <MessageSquare className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Discord</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Únete a nuestra comunidad Discord para soporte, discusiones y networking.
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm matrix-text-green">2,847 miembros en línea</span>
                        </div>
                        <button className="matrix-button-enhanced text-sm mt-3">
                          Unirse a Discord
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Github className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">GitHub</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Contribuye al desarrollo, reporta bugs y sugiere nuevas características.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm matrix-text-green">1,247 stars</span>
                        </div>
                        <button className="matrix-button-enhanced text-sm mt-3">
                          Ver en GitHub
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Twitter className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Twitter</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Mantente al día con las últimas noticias y actualizaciones del proyecto.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm matrix-text-green">15.2K seguidores</span>
                        </div>
                        <button className="matrix-button-enhanced text-sm mt-3">
                          Seguir en Twitter
                        </button>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <MessageCircle className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Telegram</h3>
                        </div>
                        <p className="matrix-text-white text-opacity-90 text-sm mb-3">
                          Canal de noticias oficial y grupo de discusión en español.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm matrix-text-green">3,421 miembros</span>
                        </div>
                        <button className="matrix-button-enhanced text-sm mt-3">
                          Unirse a Telegram
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'roadmap' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold matrix-text-green">Q4 2025 - Completado ✅</h3>
                        </div>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Lanzamiento de la plataforma beta</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Integración con Solana Devnet</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Creación de mercados básicos</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-bold matrix-text-blue">Q1 2026 - En Progreso 🚧</h3>
                        </div>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Integración con Solana Mainnet</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Sistema de reputación de usuarios</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>API pública para desarrolladores</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-yellow-400" />
                          <h3 className="text-lg font-bold matrix-text-yellow">Q2 2026 - Planificado 📋</h3>
                        </div>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>Mercados de predicción avanzados</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>Integración con oráculos externos</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>Mobile app nativa</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="matrix-card-enhanced neural-floating p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Lightbulb className="w-5 h-5 text-purple-400" />
                          <h3 className="text-lg font-bold matrix-text-purple">Futuro 🔮</h3>
                        </div>
                        <ul className="space-y-2 text-sm matrix-text-white text-opacity-90">
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Machine Learning para predicciones</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Integración con múltiples blockchains</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Token de gobernanza ORACLE</span>
                          </li>
                        </ul>
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
