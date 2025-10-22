"use client";

import React from 'react';
import { useHydration } from '../lib/use-hydration';

/**
 * 🔮 HydrationBoundary - Componente para manejar hidratación segura
 * 
 * Componente que previene errores de hidratación al renderizar contenido
 * de manera consistente entre servidor y cliente
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function HydrationBoundary({ 
  children, 
  fallback = null, 
  className 
}: HydrationBoundaryProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <div className={className}>{children}</div>;
}

/**
 * Componente específico para fechas que evita errores de hidratación
 */
interface SafeDateProps {
  date: Date | number | string;
  format?: 'date' | 'datetime' | 'relative';
  className?: string;
  fallback?: string;
}

export function SafeDate({ 
  date, 
  format = 'date', 
  className,
  fallback = 'Loading...'
}: SafeDateProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <span className={className}>{fallback}</span>;
  }

  const formatDate = (date: Date | number | string) => {
    let dateObj: Date;
    
    // Si es un número, verificar si es timestamp en segundos o milisegundos
    if (typeof date === 'number') {
      // Si el número es menor que 1e12, es probablemente un timestamp en segundos
      if (date < 1e12) {
        dateObj = new Date(date * 1000); // Convertir de segundos a milisegundos
      } else {
        dateObj = new Date(date); // Ya está en milisegundos
      }
    } else {
      dateObj = new Date(date);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    switch (format) {
      case 'datetime':
        return dateObj.toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      case 'relative':
        // Implementar lógica de fecha relativa si es necesario
        return dateObj.toLocaleDateString('es-MX');
      case 'date':
      default:
        return dateObj.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
    }
  };

  return <span className={className}>{formatDate(date)}</span>;
}

/**
 * Componente para contenido que puede diferir entre servidor y cliente
 */
interface SafeContentProps {
  serverContent: React.ReactNode;
  clientContent: React.ReactNode;
  className?: string;
}

export function SafeContent({ 
  serverContent, 
  clientContent, 
  className 
}: SafeContentProps) {
  const isHydrated = useHydration();

  return (
    <div className={className}>
      {isHydrated ? clientContent : serverContent}
    </div>
  );
}
