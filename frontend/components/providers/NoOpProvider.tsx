"use client";

import React from "react";

/**
 * 🔮 NoOpProvider - Provider completamente seguro sin funcionalidad
 * 
 * Provider que NO toca ninguna propiedad del window para evitar
 * errores de "Cannot delete property" y "Cannot redefine property"
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface NoOpProviderProps {
  children: React.ReactNode;
}

export function NoOpProvider({ children }: NoOpProviderProps) {
  // Provider completamente no invasivo
  // NO toca propiedades del window en absoluto
  // Solo proporciona un wrapper sin funcionalidad
  
  return <>{children}</>;
}

/**
 * Hook para verificación segura (sin modificación)
 */
export function useSafeInspection() {
  const inspectProperty = (propertyName: string) => {
    try {
      if (window.hasOwnProperty(propertyName)) {
        const descriptor = Object.getOwnPropertyDescriptor(window, propertyName);
        return {
          exists: true,
          configurable: descriptor?.configurable ?? false,
          writable: descriptor?.writable ?? false,
          enumerable: descriptor?.enumerable ?? false
        };
      }
      return { exists: false };
    } catch (error) {
      console.warn(`Error inspecting ${propertyName}:`, error);
      return { exists: false, error: error instanceof Error ? error.message : String(error) };
    }
  };

  const inspectMultiple = (properties: string[]) => {
    return properties.map(property => ({
      property,
      info: inspectProperty(property)
    }));
  };

  return {
    inspectProperty,
    inspectMultiple
  };
}
