'use client';

import React, { useEffect, useRef } from 'react';

/**
 * 🎬 MatrixBackground Component - Efecto de lluvia de código estilo Matrix
 * 
 * Componente que crea el efecto visual de lluvia de código verde
 * característico de la película Matrix
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface MatrixBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  speed?: number;
}

export function MatrixBackground({ 
  className = '', 
  intensity = 'medium',
  speed = 1 
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración basada en la intensidad
    const config = {
      low: { columns: 50, fontSize: 14, speed: 0.5 },
      medium: { columns: 80, fontSize: 12, speed: 1 },
      high: { columns: 120, fontSize: 10, speed: 1.5 }
    };

    const { columns, fontSize, speed: baseSpeed } = config[intensity];
    const actualSpeed = baseSpeed * speed;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = matrixChars.split('');

    // Array de columnas
    const columnsArray: number[] = [];
    for (let i = 0; i < columns; i++) {
      columnsArray[i] = 1;
    }

    // Función de animación
    const animate = () => {
      // Fondo semi-transparente para efecto de rastro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color del texto Matrix
      ctx.fillStyle = '#00ff00';
      ctx.font = `${fontSize}px monospace`;

      // Dibujar caracteres
      for (let i = 0; i < columnsArray.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = columnsArray[i] * fontSize;

        // Efecto de brillo para el primer carácter
        if (Math.random() < 0.1) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#00ff00';
        }

        ctx.fillText(char, x, y);

        // Resetear columna cuando llega al final
        if (y > canvas.height && Math.random() > 0.975) {
          columnsArray[i] = 0;
        }

        columnsArray[i] += actualSpeed;
      }
    };

    // Iniciar animación
    const interval = setInterval(animate, 50);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'transparent',
        opacity: 0.8
      }}
    />
  );
}

/**
 * 🎬 MatrixRain Component - Efecto de lluvia Matrix simplificado
 */
export function MatrixRain({ className = '' }: { className?: string }) {
  return (
    <div className={`matrix-rain ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent"></div>
    </div>
  );
}

/**
 * 🎬 MatrixGrid Component - Grid Matrix animado
 */
export function MatrixGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`matrix-grid ${className}`}></div>
  );
}

/**
 * 🎬 MatrixScan Component - Efecto de escaneo Matrix
 */
export function MatrixScan({ className = '' }: { className?: string }) {
  return (
    <div className={`matrix-scan ${className}`}></div>
  );
}

export default MatrixBackground;
