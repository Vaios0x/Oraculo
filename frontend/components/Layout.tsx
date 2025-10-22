"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useResponsive } from '../lib/responsive';
import { Footer } from './Footer';
import { TrendingUp } from 'lucide-react';
import { WalletButton } from './WalletButton';

/**
 * 🔮 Layout Component - Componente de layout principal responsive
 * 
 * Componente que asegura la distribución correcta del espacio
 * con sidebar responsive y contenido principal flexible
 * siguiendo las mejores prácticas de Next.js 15 (2025)
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 2.0.0
 */

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  navItems?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export function Layout({ children, sidebar, activeTab = '', setActiveTab = () => {}, navItems = [] }: LayoutProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  if (!isClient) {
    return (
      <div className="min-h-screen neural-mesh-bg flex">
        <div className="w-64 bg-black border-r border-green-400/30 flex flex-col flex-shrink-0 min-h-screen">
          {sidebar}
        </div>
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen neural-mesh-bg flex">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'mobile-sidebar' : 
           isTablet ? 'w-64 flex-shrink-0 relative' : 
           isDesktop ? 'w-72 flex-shrink-0 relative' : 
           'w-80 flex-shrink-0 relative'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!isMobile ? 'bg-black border-r border-green-400/30 flex flex-col min-h-screen relative' : ''}
      `}>
        {isMobile ? (
          <div className="mobile-sidebar-content">
            {/* Mobile Header */}
            <div className="mobile-sidebar-header">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 matrix-glow flex items-center justify-center"
                style={{
                  filter: 'drop-shadow(0 0 6px #00ff00) drop-shadow(0 0 12px #00ff00)',
                  borderRadius: '8px',
                  backgroundColor: '#000000',
                  border: '1px solid rgba(0, 255, 0, 0.3)'
                }}>
                  <img 
                    src="/images/6bfaee8f-15e1-4a4f-94ca-375350592475.png" 
                    alt="Oráculo Logo" 
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      console.log('Error loading mobile logo:', e);
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-sm">🔮</span>';
                      }
                    }}
                    onLoad={() => console.log('Mobile logo loaded successfully')}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-400">Oráculo</h1>
                  <p className="text-sm text-green-300/80">Prediction Markets</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="mobile-close-btn"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wallet Section - Hidden on Mobile */}
            {!isMobile && (
              <div className="p-4 border-b border-green-400/30">
                <WalletButton />
              </div>
            )}

            {/* Navigation */}
            <div className="mobile-sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          sidebar
        )}
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/20 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Oráculo</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

interface ContentAreaProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function ContentArea({ children, header }: ContentAreaProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  return (
    <>
      {header && (
        <div className={`
          bg-white/5 backdrop-blur-sm border-b border-white/20
          ${isMobile ? 'p-3' : isTablet ? 'p-4' : isDesktop ? 'p-5' : 'p-6'}
        `}>
          {header}
        </div>
      )}
      <div className={`
        flex-1 overflow-auto
        ${isMobile ? 'p-3' : isTablet ? 'p-4' : isDesktop ? 'p-5' : 'p-6'}
      `}>
        {children}
      </div>
    </>
  );
}

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export function GridContainer({ children, className = "", responsive = true }: GridContainerProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  if (!responsive) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}>
        {children}
      </div>
    );
  }

  // Grid responsive inteligente basado en el tamaño de pantalla
  const getGridClasses = () => {
    if (isMobile) {
      return 'grid-cols-1 gap-3';
    } else if (isTablet) {
      return 'grid-cols-2 gap-4';
    } else if (isDesktop) {
      return 'grid-cols-3 gap-5';
    } else if (isLargeDesktop) {
      return 'grid-cols-4 gap-6';
    } else {
      return 'grid-cols-5 gap-6';
    }
  };

  return (
    <div className={`grid ${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}
