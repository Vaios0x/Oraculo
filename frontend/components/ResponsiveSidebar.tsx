'use client';

import React, { useState, useEffect } from 'react';
import { useResponsive } from '../lib/responsive';
import { X, Menu } from 'lucide-react';

/**
 * 🔮 ResponsiveSidebar Component - Sidebar responsive mejorado
 * 
 * Componente que maneja el sidebar de forma completamente responsive
 * con animaciones suaves y mejor UX en todos los dispositivos
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ResponsiveSidebar({ children, isOpen, onClose, className = '' }: ResponsiveSidebarProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  if (!isClient) {
    return (
      <div className={`bg-black border-r border-green-400/30 flex flex-col min-h-screen ${
        isMobile ? 'w-64' : isTablet ? 'w-64' : isDesktop ? 'w-72' : 'w-80'
      } ${className}`}>
        {children}
      </div>
    );
  }

  const getSidebarClasses = () => {
    if (isMobile) {
      return `
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `;
    } else if (isTablet) {
      return `
        w-64 flex-shrink-0 relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `;
    } else if (isDesktop) {
      return `
        w-72 flex-shrink-0 relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `;
    } else {
      return `
        w-80 flex-shrink-0 relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`${getSidebarClasses()} bg-black border-r border-green-400/30 flex flex-col min-h-screen ${className}`}>
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b border-white/20">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {children}
      </div>
    </>
  );
}

/**
 * 🔮 ResponsiveSidebarToggle Component - Botón para toggle del sidebar
 */
interface ResponsiveSidebarToggleProps {
  onClick: () => void;
  className?: string;
}

export function ResponsiveSidebarToggle({ onClick, className = '' }: ResponsiveSidebarToggleProps) {
  const { isMobile } = useResponsive();

  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${className}`}
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

export default ResponsiveSidebar;
