/**
 * 🔮 Date Utils - Utilidades para formateo de fechas consistentes
 * 
 * Funciones para formatear fechas de manera consistente entre servidor y cliente
 * para evitar errores de hidratación en Next.js
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

/**
 * Formatea una fecha de manera consistente entre servidor y cliente
 * @param date - Fecha a formatear
 * @param options - Opciones de formateo
 * @returns Fecha formateada como string
 */
export function formatDate(
  date: Date | number | string,
  options: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    hour12?: boolean;
  } = {}
): string {
  const dateObj = new Date(date);
  
  const defaultOptions = {
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
    ...options
  };

  return dateObj.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Formatea una fecha con hora de manera consistente
 * @param date - Fecha a formatear
 * @param includeTime - Si incluir la hora
 * @returns Fecha y hora formateadas
 */
export function formatDateTime(
  date: Date | number | string,
  includeTime: boolean = true
): string {
  const dateObj = new Date(date);
  
  const dateStr = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  if (!includeTime) {
    return dateStr;
  }

  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return `${dateStr} ${timeStr}`;
}

/**
 * Formatea un timestamp Unix a fecha legible
 * @param timestamp - Timestamp Unix en segundos
 * @param includeTime - Si incluir la hora
 * @returns Fecha formateada
 */
export function formatUnixTimestamp(
  timestamp: number,
  includeTime: boolean = true
): string {
  return formatDateTime(timestamp * 1000, includeTime);
}

/**
 * Formatea una fecha para mostrar solo la fecha (sin hora)
 * @param date - Fecha a formatear
 * @returns Fecha formateada (MM/DD/YYYY)
 */
export function formatDateOnly(date: Date | number | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Formatea una fecha para mostrar fecha y hora
 * @param date - Fecha a formatear
 * @returns Fecha y hora formateadas (MM/DD/YYYY HH:MM)
 */
export function formatDateWithTime(date: Date | number | string): string {
  return formatDateTime(date, true);
}

/**
 * Formatea una fecha relativa (ej: "2 days ago", "in 3 hours")
 * @param date - Fecha a formatear
 * @returns Fecha relativa
 */
export function formatRelativeTime(date: Date | number | string): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 0) {
    // Fecha en el pasado
    const absDiff = Math.abs(diffInSeconds);
    const days = Math.floor(absDiff / 86400);
    const hours = Math.floor((absDiff % 86400) / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  } else {
    // Fecha en el futuro
    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Now';
  }
}
