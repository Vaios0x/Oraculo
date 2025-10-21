"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  floating?: boolean;
  shimmer?: boolean;
  hologram?: boolean;
  aiBrain?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function NeuralCard({
  children,
  className = '',
  hover = true,
  glow = false,
  floating = false,
  shimmer = false,
  hologram = false,
  aiBrain = false,
  onClick,
  style
}: NeuralCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    neural-card
    ${hover ? 'neural-card-hover' : ''}
    ${glow ? 'neural-glow' : ''}
    ${floating ? 'neural-floating' : ''}
    ${shimmer ? 'neural-shimmer' : ''}
    ${hologram ? 'neural-hologram' : ''}
    ${aiBrain ? 'neural-ai-brain' : ''}
    ${className}
  `.trim();

  const cardVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
    },
    hover: { 
      scale: 1.02,
      boxShadow: '0 16px 64px rgba(139, 92, 246, 0.2)',
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className={baseClasses}
      variants={cardVariants}
      initial="initial"
      whileHover={hover ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {/* Neural Data Flow Effect */}
      {shimmer && (
        <div className="neural-data-flow absolute inset-0 rounded-xl pointer-events-none" />
      )}

      {/* AI Brain Effect */}
      {aiBrain && (
        <div className="absolute -inset-2 rounded-xl pointer-events-none">
          <div className="neural-ai-brain w-full h-full rounded-xl" />
        </div>
      )}

      {/* Hologram Border Effect */}
      {hologram && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none">
          <div className="neural-hologram w-full h-full rounded-xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Neural Particles on Hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="neural-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
