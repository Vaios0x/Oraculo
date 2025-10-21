"use client";

import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface NeuralInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  glow?: boolean;
  shimmer?: boolean;
  hologram?: boolean;
  aiBrain?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NeuralInput = forwardRef<HTMLInputElement, NeuralInputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  label,
  error,
  glow = false,
  shimmer = false,
  hologram = false,
  aiBrain = false,
  size = 'md'
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const baseClasses = `
    neural-input w-full transition-all duration-300
    ${sizeClasses[size]}
    ${glow ? 'neural-glow' : ''}
    ${shimmer ? 'neural-shimmer' : ''}
    ${hologram ? 'neural-hologram' : ''}
    ${aiBrain ? 'neural-ai-brain' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim();

  const inputVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0 0 0px rgba(139, 92, 246, 0)'
    },
    focused: { 
      scale: 1.02,
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.01,
      boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 neural-text-glow">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <motion.div
        className="relative"
        variants={inputVariants}
        initial="initial"
        animate={isFocused ? "focused" : isHovered ? "hover" : "initial"}
      >
        {/* Shimmer Effect */}
        {shimmer && (
          <div className="absolute inset-0 neural-shimmer rounded-lg pointer-events-none" />
        )}

        {/* Hologram Border */}
        {hologram && (
          <div className="absolute -inset-1 neural-hologram rounded-lg pointer-events-none" />
        )}

        {/* AI Brain Effect */}
        {aiBrain && (
          <div className="absolute -inset-2 neural-ai-brain rounded-lg pointer-events-none" />
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          required={required}
          className={baseClasses}
        />

        {/* Neural Particles on Focus */}
        {isFocused && (
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

        {/* Data Flow Effect */}
        {isFocused && shimmer && (
          <div className="neural-data-flow absolute inset-0 rounded-lg pointer-events-none" />
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 flex items-center space-x-1"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
});

NeuralInput.displayName = 'NeuralInput';
