"use client";

/**
 * 🔮 CleanProvider - Provider completamente seguro
 * 
 * Provider que NO realiza ninguna limpieza para evitar errores
 * de "Cannot delete property" en propiedades no configurables
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
 * Hook para limpieza manual de propiedades - DESHABILITADO para evitar errores
 */
export function useCleanup() {
  // Hook completamente deshabilitado para evitar errores de "Cannot delete property"
  const cleanupProperty = (propertyName: string) => {
    console.warn(`⚠️ Cleanup disabled for ${propertyName} to prevent errors`);
    return false;
  };

  const cleanupMultiple = (properties: string[]) => {
    return properties.map(prop => ({
      property: prop,
      cleaned: false
    }));
  };

  return {
    cleanupProperty,
    cleanupMultiple
  };
}
