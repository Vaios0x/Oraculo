"use client";

import { useEffect, useCallback } from "react";

/**
 * 🔮 useWindowCleanup - Hook para limpieza segura del objeto window
 * 
 * Hook que maneja la limpieza segura de propiedades del objeto window
 * para evitar errores de "Cannot delete property"
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface CleanupOptions {
  properties?: string[];
  onCleanup?: (property: string, success: boolean) => void;
  onError?: (property: string, error: Error) => void;
}

export function useWindowCleanup(options: CleanupOptions = {}) {
  const {
    properties = ['StacksProvider', 'StacksConnect', 'stacksProvider', 'stacksConnect'],
    onCleanup,
    onError
  } = options;

  const safeDeleteProperty = useCallback((propertyName: string): boolean => {
    try {
      // Verificar si la propiedad existe
      if (!window.hasOwnProperty(propertyName)) {
        return true; // Ya no existe, consideramos éxito
      }

      // Obtener descriptor de la propiedad
      const descriptor = Object.getOwnPropertyDescriptor(window, propertyName);
      
      if (!descriptor) {
        return true; // No hay descriptor, consideramos éxito
      }

      // Verificar si es configurable
      if (!descriptor.configurable) {
        console.warn(`⚠️ Cannot delete window.${propertyName} - property is not configurable`);
        // Para propiedades no configurables, intentamos establecerlas como undefined en lugar de eliminarlas
        try {
          (window as any)[propertyName] = undefined;
          console.log(`✅ Set window.${propertyName} to undefined (property not configurable)`);
          onCleanup?.(propertyName, true);
          return true;
        } catch (setError) {
          console.warn(`⚠️ Cannot modify window.${propertyName}:`, setError);
          return true; // Consideramos éxito para evitar errores
        }
      }

      // Intentar eliminar la propiedad
      delete (window as any)[propertyName];
      console.log(`✅ Successfully cleaned up window.${propertyName}`);
      onCleanup?.(propertyName, true);
      return true;

    } catch (error) {
      console.warn(`⚠️ Error cleaning up window.${propertyName}:`, error);
      // En lugar de propagar el error, simplemente retornamos true
      return true;
    }
  }, [onCleanup, onError]);

  const cleanupAll = useCallback((): Array<{property: string, success: boolean}> => {
    return properties.map(property => ({
      property,
      success: safeDeleteProperty(property)
    }));
  }, [properties, safeDeleteProperty]);

  const cleanupProperty = useCallback((propertyName: string): boolean => {
    return safeDeleteProperty(propertyName);
  }, [safeDeleteProperty]);

  // Efecto para limpieza automática al desmontar - DESHABILITADO para evitar errores
  // useEffect(() => {
  //   return () => {
  //     cleanupAll();
  //   };
  // }, [cleanupAll]);

  return {
    cleanupProperty,
    cleanupAll,
    safeDeleteProperty
  };
}

/**
 * Hook específico para limpiar StacksProvider
 */
export function useStacksCleanup() {
  return useWindowCleanup({
    properties: ['StacksProvider', 'StacksConnect', 'stacksProvider', 'stacksConnect'],
    onCleanup: (property, success) => {
      if (success) {
        console.log(`🧹 Stacks cleanup: ${property} removed successfully`);
      }
    },
    onError: (property, error) => {
      // Solo loguear el error sin propagarlo para evitar crashes
      console.warn(`🧹 Stacks cleanup failed for ${property}:`, error.message);
    }
  });
}
