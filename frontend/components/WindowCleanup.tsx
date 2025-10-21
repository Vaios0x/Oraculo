"use client";

import { useEffect, useState } from "react";
import { useWindowCleanup } from "../lib/use-window-cleanup";

/**
 * 🔮 WindowCleanup - Componente para limpieza manual del objeto window
 * 
 * Componente que permite limpiar propiedades específicas del objeto window
 * de forma manual y segura
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface WindowCleanupProps {
  properties?: string[];
  autoCleanup?: boolean;
  onCleanupComplete?: (results: Array<{property: string, success: boolean}>) => void;
}

export function WindowCleanup({ 
  properties = ['StacksProvider', 'StacksConnect'],
  autoCleanup = true,
  onCleanupComplete 
}: WindowCleanupProps) {
  const [cleanupResults, setCleanupResults] = useState<Array<{property: string, success: boolean}>>([]);
  const { cleanupAll, cleanupProperty } = useWindowCleanup({
    properties,
    onCleanup: (property, success) => {
      setCleanupResults(prev => [...prev, { property, success }]);
    }
  });

  useEffect(() => {
    if (autoCleanup) {
      const results = cleanupAll();
      setCleanupResults(results);
      onCleanupComplete?.(results);
    }
  }, [autoCleanup, cleanupAll, onCleanupComplete]);

  const handleManualCleanup = () => {
    const results = cleanupAll();
    setCleanupResults(results);
    onCleanupComplete?.(results);
  };

  const handleCleanupProperty = (property: string) => {
    const success = cleanupProperty(property);
    setCleanupResults(prev => [...prev, { property, success }]);
  };

  // No renderizar nada, solo manejar la limpieza
  return null;
}

/**
 * Hook para limpieza manual desde otros componentes
 */
export function useManualCleanup() {
  const { cleanupAll, cleanupProperty } = useWindowCleanup();

  const cleanupStacks = () => {
    const stacksProperties = ['StacksProvider', 'StacksConnect', 'stacksProvider', 'stacksConnect'];
    return cleanupAll();
  };

  const cleanupCustom = (properties: string[]) => {
    return properties.map(prop => ({
      property: prop,
      success: cleanupProperty(prop)
    }));
  };

  return {
    cleanupStacks,
    cleanupCustom,
    cleanupProperty
  };
}
