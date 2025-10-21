"use client";

import { useEffect, useState } from 'react';
import { initializePWA } from './pwa-register';

// ==================== Types ====================

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  canInstall: boolean;
}

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ==================== Hook ====================

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isStandalone: false,
    canInstall: false
  });

  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);

  // ==================== Effects ====================

  useEffect(() => {
    // Inicializar PWA
    initializePWA();

    // Detectar si está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;

    setPwaState(prev => ({
      ...prev,
      isInstalled,
      isStandalone
    }));

    // Detectar cambios en el estado de conexión
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Interceptar beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setPwaState(prev => ({ ...prev, isInstallable: true, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar instalación
    const handleAppInstalled = () => {
      setPwaState(prev => ({ ...prev, isInstalled: true, isInstallable: false, canInstall: false }));
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // ==================== Functions ====================

  const install = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setPwaState(prev => ({ ...prev, isInstalled: true, isInstallable: false, canInstall: false }));
        setInstallPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const share = async (data: ShareData): Promise<boolean> => {
    if (!navigator.share) return false;

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  };

  const getShareUrl = (): string => {
    return window.location.href;
  };

  const getShareText = (): string => {
    return '¡Mira este mercado de predicción en Oráculo!';
  };

  // ==================== Return ====================

  return {
    ...pwaState,
    install,
    share,
    getShareUrl,
    getShareText
  };
}
