"use client";

/**
 * 🔮 CleanProvider - Limpieza segura de propiedades globales
 * 
 * Provider que maneja la limpieza segura de propiedades del objeto window
 * para evitar errores de "Cannot delete property"
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface CleanProviderProps {
  children: React.ReactNode;
}

export function CleanProvider({ children }: CleanProviderProps) {
  // Provider completamente no invasivo - NO toca propiedades del window
  // Solo proporciona un wrapper sin funcionalidad de limpieza para evitar errores
  
  return <>{children}</>;
}

/**
 * Hook para limpieza manual de propiedades
 */
export function useCleanup() {
  const cleanupProperty = (propertyName: string) => {
    try {
      if (window.hasOwnProperty(propertyName)) {
        const descriptor = Object.getOwnPropertyDescriptor(window, propertyName);
        
        if (descriptor && descriptor.configurable) {
          delete (window as any)[propertyName];
          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn(`Error cleaning up ${propertyName}:`, error);
      return false;
    }
  };

  const cleanupMultiple = (properties: string[]) => {
    return properties.map(prop => ({
      property: prop,
      cleaned: cleanupProperty(prop)
    }));
  };

  return {
    cleanupProperty,
    cleanupMultiple
  };
}
