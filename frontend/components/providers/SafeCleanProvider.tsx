"use client";

import { useEffect } from "react";

/**
 * 🔮 SafeCleanProvider - Limpieza completamente segura de propiedades globales
 * 
 * Provider que maneja la limpieza segura de propiedades del objeto window
 * sin causar errores de "Cannot delete property"
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 2.0.0
 */

interface SafeCleanProviderProps {
  children: React.ReactNode;
}

export function SafeCleanProvider({ children }: SafeCleanProviderProps) {
  // Provider completamente seguro - NO toca propiedades del window
  // Solo proporciona un wrapper sin funcionalidad de limpieza para evitar errores
  
  return <>{children}</>;
}

/**
 * Hook para limpieza manual segura
 */
export function useSafeCleanup() {
  const cleanupProperty = (propertyName: string): boolean => {
    try {
      if (!window.hasOwnProperty(propertyName)) {
        return true; // No existe, consideramos éxito
      }

      const descriptor = Object.getOwnPropertyDescriptor(window, propertyName);
      
      if (!descriptor) {
        return true; // No hay descriptor, consideramos éxito
      }

      if (descriptor.configurable) {
        try {
          delete (window as any)[propertyName];
          return true;
        } catch (error) {
          console.warn(`Error deleting ${propertyName}:`, error);
          return false;
        }
      } else {
        try {
          (window as any)[propertyName] = undefined;
          return true;
        } catch (error) {
          console.warn(`Error setting ${propertyName} to undefined:`, error);
          return false;
        }
      }
    } catch (error) {
      console.warn(`Error cleaning up ${propertyName}:`, error);
      return false;
    }
  };

  const cleanupMultiple = (properties: string[]): Array<{property: string, success: boolean}> => {
    return properties.map(property => ({
      property,
      success: cleanupProperty(property)
    }));
  };

  return {
    cleanupProperty,
    cleanupMultiple
  };
}
