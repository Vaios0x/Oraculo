"use client";

import React, { useState, useEffect } from 'react';
import { useResponsive } from '../lib/responsive';

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
}

export function Layout({ children, sidebar }: LayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
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
        <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col flex-shrink-0">
          {sidebar}
        </div>
        <main className="flex-1 flex flex-col min-w-0">
          {children}
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
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out' : 'w-64 flex-shrink-0 sticky top-0 h-screen'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col
        ${!isMobile ? 'relative' : ''}
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b border-white/20">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {sidebar}
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
        
        {children}
      </main>
    </div>
  );
}

interface ContentAreaProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function ContentArea({ children, header }: ContentAreaProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  return (
    <>
      {header && (
        <div className={`
          bg-white/5 backdrop-blur-sm border-b border-white/20
          ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'}
        `}>
          {header}
        </div>
      )}
      <div className={`
        flex-1 overflow-auto
        ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'}
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
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
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
      return 'grid-cols-1 gap-4';
    } else if (isTablet) {
      return 'grid-cols-2 gap-5';
    } else if (isDesktop) {
      return 'grid-cols-3 gap-6';
    } else {
      return 'grid-cols-4 gap-6';
    }
  };

  return (
    <div className={`grid ${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}
