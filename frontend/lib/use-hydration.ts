/**
 * 🔮 useHydration - Hook para manejar hidratación segura
 * 
 * Hook que previene errores de hidratación al asegurar que el contenido
 * sea consistente entre servidor y cliente
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el componente está hidratado
 * @returns true si está hidratado, false si aún está en el servidor
 */
export function useHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook para renderizar contenido solo después de la hidratación
 * @param children - Contenido a renderizar
 * @param fallback - Contenido a mostrar antes de la hidratación
 * @returns Contenido renderizado de manera segura
 */
export function useHydrationSafeRender(
  children: React.ReactNode,
  fallback: React.ReactNode = null
): React.ReactNode {
  const isHydrated = useHydration();
  
  if (!isHydrated) {
    return fallback;
  }
  
  return children;
}

/**
 * Hook para valores que pueden diferir entre servidor y cliente
 * @param serverValue - Valor a usar en el servidor
 * @param clientValue - Valor a usar en el cliente
 * @returns Valor apropiado según el contexto
 */
export function useHydrationSafeValue<T>(
  serverValue: T,
  clientValue: T
): T {
  const isHydrated = useHydration();
  
  return isHydrated ? clientValue : serverValue;
}

/**
 * Hook para fechas que evita errores de hidratación
 * @param date - Fecha a formatear
 * @param options - Opciones de formateo
 * @returns Fecha formateada de manera segura
 */
export function useHydrationSafeDate(
  date: Date | number | string,
  options: {
    includeTime?: boolean;
    format?: 'date' | 'datetime' | 'relative';
  } = {}
): string {
  const isHydrated = useHydration();
  
  // En el servidor, usar un formato simple para evitar diferencias
  if (!isHydrated) {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  // En el cliente, usar el formateo completo
  const { includeTime = false, format = 'date' } = options;
  
  if (format === 'relative') {
    // Implementar formateo relativo si es necesario
    return new Date(date).toLocaleDateString();
  }
  
  if (includeTime) {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
