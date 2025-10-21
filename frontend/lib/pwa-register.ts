/**
 * 🔮 Oráculo PWA Registration
 * 
 * Script para registrar el Service Worker y configurar PWA
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

// ==================== PWA Registration ====================

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('🔮 Oráculo Service Worker: Registered successfully');

        // Manejar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                if (confirm('Nueva versión de Oráculo disponible. ¿Recargar para actualizar?')) {
                  window.location.reload();
                }
              }
            });
          }
        });

        // Manejar mensajes del service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
            console.log('🔄 Service Worker update available');
          }
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    });
  }
}

// ==================== PWA Installation ====================

export function setupPWAInstallation() {
  if (typeof window !== 'undefined') {
    let deferredPrompt: any;

    // Interceptar el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('🔮 Oráculo PWA: Install prompt triggered');
      e.preventDefault();
      deferredPrompt = e;

      // Mostrar botón de instalación personalizado
      showInstallButton();
    });

    // Detectar si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('🔮 Oráculo PWA: App installed successfully');
      hideInstallButton();
    });

    // Detectar si se ejecuta en modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('🔮 Oráculo PWA: Running in standalone mode');
    }
  }
}

// ==================== Install Button Management ====================

function showInstallButton() {
  // Crear botón de instalación si no existe
  if (!document.getElementById('pwa-install-button')) {
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.innerHTML = `
      <div class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Instalar Oráculo</span>
      </div>
    `;
    
    installButton.className = 'fixed bottom-4 right-4 z-50';
    installButton.onclick = handleInstallClick;
    
    document.body.appendChild(installButton);
  }
}

function hideInstallButton() {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.remove();
  }
}

async function handleInstallClick() {
  if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
    const deferredPrompt = (window as any).deferredPrompt;
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`🔮 Oráculo PWA: User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('🔮 Oráculo PWA: User accepted the install prompt');
    } else {
      console.log('🔮 Oráculo PWA: User dismissed the install prompt');
    }
    
    (window as any).deferredPrompt = null;
    hideInstallButton();
  }
}

// ==================== Network Status ====================

export function setupNetworkStatus() {
  if (typeof window !== 'undefined') {
    // Detectar cambios en el estado de conexión
    window.addEventListener('online', () => {
      console.log('🌐 Oráculo: Connection restored');
      showNetworkStatus('online');
    });

    window.addEventListener('offline', () => {
      console.log('❌ Oráculo: Connection lost');
      showNetworkStatus('offline');
    });

    // Estado inicial
    if (navigator.onLine) {
      showNetworkStatus('online');
    } else {
      showNetworkStatus('offline');
    }
  }
}

function showNetworkStatus(status: 'online' | 'offline') {
  const existingStatus = document.getElementById('network-status');
  if (existingStatus) {
    existingStatus.remove();
  }

  const statusElement = document.createElement('div');
  statusElement.id = 'network-status';
  statusElement.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
    status === 'online' ? 'bg-green-500' : 'bg-red-500'
  }`;
  statusElement.innerHTML = `
    <div class="flex items-center space-x-2">
      <div class="w-2 h-2 rounded-full ${status === 'online' ? 'bg-white' : 'bg-white'}"></div>
      <span class="text-sm font-medium">
        ${status === 'online' ? 'Conectado' : 'Sin conexión'}
      </span>
    </div>
  `;

  document.body.appendChild(statusElement);

  // Remover después de 3 segundos
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.remove();
    }
  }, 3000);
}

// ==================== Performance Monitoring ====================

export function setupPerformanceMonitoring() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitorear Core Web Vitals
    if ('web-vital' in window) {
      // Implementar monitoreo de Core Web Vitals
      console.log('🔮 Oráculo: Performance monitoring enabled');
    }

    // Monitorear tiempo de carga
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`🔮 Oráculo: Page load time: ${loadTime}ms`);
    });
  }
}

// ==================== Initialize PWA ====================

export function initializePWA() {
  registerServiceWorker();
  setupPWAInstallation();
  setupNetworkStatus();
  setupPerformanceMonitoring();
  
  console.log('🔮 Oráculo PWA: Initialized successfully');
}

// ==================== Export Default ====================

export default {
  registerServiceWorker,
  setupPWAInstallation,
  setupNetworkStatus,
  setupPerformanceMonitoring,
  initializePWA
};
