"use client";

import React, { useEffect, useState } from 'react';

interface NeuralParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface NeuralBackgroundProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  particleCount?: number;
  className?: string;
}

export function NeuralBackground({ 
  children, 
  intensity = 'medium', 
  particleCount = 50,
  className = ''
}: NeuralBackgroundProps) {
  const [particles, setParticles] = useState<NeuralParticle[]>([]);
  const [connections, setConnections] = useState<Array<{from: number, to: number}>>([]);

  useEffect(() => {
    const particleCountMap = {
      low: 30,
      medium: 50,
      high: 80
    };

    const count = particleCountMap[intensity];
    const newParticles: NeuralParticle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        
        newX = newX > window.innerWidth ? 0 : newX < 0 ? window.innerWidth : newX;
        newY = newY > window.innerHeight ? 0 : newY < 0 ? window.innerHeight : newY;
        
        return {
          ...particle,
          x: newX,
          y: newY
        };
      }));

      // Calculate connections
      const newConnections: Array<{from: number, to: number}> = [];
      for (let i = 0; i < newParticles.length; i++) {
        for (let j = i + 1; j < newParticles.length; j++) {
          const dx = newParticles[i].x - newParticles[j].x;
          const dy = newParticles[i].y - newParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            newConnections.push({ from: i, to: j });
          }
        }
      }
      setConnections(newConnections);

      requestAnimationFrame(animate);
    };

    animate();
  }, [intensity, particleCount]);

  return (
    <div className={`relative min-h-screen neural-mesh-bg ${className}`}>
      {/* Neural Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="neural-particle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>

      {/* Neural Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => {
          const fromParticle = particles[connection.from];
          const toParticle = particles[connection.to];
          
          if (!fromParticle || !toParticle) return null;
          
          return (
            <line
              key={index}
              x1={fromParticle.x}
              y1={fromParticle.y}
              x2={toParticle.x}
              y2={toParticle.y}
              stroke="rgba(139, 92, 246, 0.2)"
              strokeWidth="1"
              className="animate-neural-shimmer"
            />
          );
        })}
      </svg>

      {/* Neural Grid Overlay */}
      <div className="absolute inset-0 neural-cyber-grid opacity-20" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
