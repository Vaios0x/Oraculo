"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'neural';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  shimmer?: boolean;
  hologram?: boolean;
  aiBrain?: boolean;
}

export function NeuralButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'neural',
  size = 'md',
  className = '',
  glow = false,
  shimmer = false,
  hologram = false,
  aiBrain = false
}: NeuralButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-neural-primary to-neural-secondary text-white',
    secondary: 'neural-glass text-neural-primary border border-neural-primary/20',
    ghost: 'text-neural-primary hover:bg-neural-primary/10',
    neural: 'neural-button text-white'
  };

  const baseClasses = `
    relative overflow-hidden rounded-lg font-medium transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${glow ? 'neural-glow' : ''}
    ${shimmer ? 'neural-shimmer' : ''}
    ${hologram ? 'neural-hologram' : ''}
    ${aiBrain ? 'neural-ai-brain' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: variant === 'neural' ? '0 4px 15px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: disabled ? 1 : 1.05,
      boxShadow: variant === 'neural' ? '0 8px 25px rgba(139, 92, 246, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: disabled ? 1 : 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {/* Shimmer Effect */}
      {shimmer && (
        <div className="absolute inset-0 neural-shimmer rounded-lg" />
      )}

      {/* Hologram Border */}
      {hologram && (
        <div className="absolute -inset-1 neural-hologram rounded-lg pointer-events-none" />
      )}

      {/* AI Brain Effect */}
      {aiBrain && (
        <div className="absolute -inset-2 neural-ai-brain rounded-lg pointer-events-none" />
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 flex items-center justify-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Neural Particles on Hover */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="neural-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Press Effect */}
      {isPressed && !disabled && (
        <div className="absolute inset-0 bg-white/10 rounded-lg" />
      )}
    </motion.button>
  );
}
