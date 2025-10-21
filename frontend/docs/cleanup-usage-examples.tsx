/**
 * 🔮 Ejemplos de Uso - Cleanup Providers
 * 
 * Ejemplos de cómo usar los diferentes providers de limpieza
 * para evitar el error "Cannot delete property 'StacksProvider'"
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

import React from 'react';
import { CleanProvider } from '../components/providers/CleanProvider';
import { SafeCleanProvider } from '../components/providers/SafeCleanProvider';

// ========================================
// EJEMPLO 1: Uso Básico con CleanProvider
// ========================================
export function BasicUsageExample() {
  return (
    <CleanProvider>
      <div>
        <h1>Mi Aplicación</h1>
        <p>Esta aplicación usa CleanProvider para limpieza segura</p>
      </div>
    </CleanProvider>
  );
}

// ========================================
// EJEMPLO 2: Uso con SafeCleanProvider (Recomendado)
// ========================================
export function SafeUsageExample() {
  return (
    <SafeCleanProvider>
      <div>
        <h1>Mi Aplicación Segura</h1>
        <p>Esta aplicación usa SafeCleanProvider para máxima seguridad</p>
      </div>
    </SafeCleanProvider>
  );
}

// ========================================
// EJEMPLO 3: Uso en App Principal
// ========================================
export function AppWithCleanup() {
  return (
    <SafeCleanProvider>
      <div className="app">
        <header>
          <h1>Oraculo - Blockchain Oracle</h1>
        </header>
        <main>
          {/* Tu contenido de la aplicación aquí */}
        </main>
        <footer>
          <p>Powered by Blockchain Technology</p>
        </footer>
      </div>
    </SafeCleanProvider>
  );
}

// ========================================
// EJEMPLO 4: Uso Condicional
// ========================================
export function ConditionalCleanupExample({ enableCleanup = true }: { enableCleanup?: boolean }) {
  const content = (
    <div>
      <h1>Mi Aplicación</h1>
      <p>Contenido de la aplicación</p>
    </div>
  );

  if (enableCleanup) {
    return <SafeCleanProvider>{content}</SafeCleanProvider>;
  }

  return content;
}

// ========================================
// EJEMPLO 5: Uso con Múltiples Providers
// ========================================
export function MultipleProvidersExample() {
  return (
    <SafeCleanProvider>
      {/* Otros providers aquí */}
      <div>
        <h1>Aplicación con Múltiples Providers</h1>
        <p>SafeCleanProvider maneja la limpieza de propiedades globales</p>
      </div>
    </SafeCleanProvider>
  );
}

// ========================================
// EJEMPLO 6: Uso en Next.js App Router
// ========================================
export function NextJSAppRouterExample() {
  return (
    <html>
      <body>
        <SafeCleanProvider>
          <div id="root">
            {/* Tu aplicación Next.js aquí */}
          </div>
        </SafeCleanProvider>
      </body>
    </html>
  );
}

// ========================================
// EJEMPLO 7: Uso en Layout Component
// ========================================
export function LayoutWithCleanup({ children }: { children: React.ReactNode }) {
  return (
    <SafeCleanProvider>
      <div className="layout">
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </div>
    </SafeCleanProvider>
  );
}

// ========================================
// EJEMPLO 8: Uso con Error Boundaries
// ========================================
export function ErrorBoundaryExample() {
  return (
    <SafeCleanProvider>
      <div>
        <h1>Aplicación con Error Boundary</h1>
        <p>SafeCleanProvider previene errores de limpieza</p>
      </div>
    </SafeCleanProvider>
  );
}

// ========================================
// EJEMPLO 9: Uso en Desarrollo vs Producción
// ========================================
export function EnvironmentBasedExample() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const content = (
    <div>
      <h1>Mi Aplicación</h1>
      <p>Contenido de la aplicación</p>
    </div>
  );

  // En desarrollo, usar SafeCleanProvider para debugging
  if (isDevelopment) {
    return <SafeCleanProvider>{content}</SafeCleanProvider>;
  }

  // En producción, usar CleanProvider para mejor rendimiento
  return <CleanProvider>{content}</CleanProvider>;
}

// ========================================
// EJEMPLO 10: Uso con TypeScript Strict
// ========================================
interface AppProps {
  children: React.ReactNode;
  enableCleanup?: boolean;
}

export function TypeScriptStrictExample({ children, enableCleanup = true }: AppProps) {
  if (!enableCleanup) {
    return <>{children}</>;
  }

  return <SafeCleanProvider>{children}</SafeCleanProvider>;
}
