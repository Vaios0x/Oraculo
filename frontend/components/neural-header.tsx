"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralHeaderProps {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  glow?: boolean;
  shimmer?: boolean;
  hologram?: boolean;
  aiBrain?: boolean;
  floating?: boolean;
}

export function NeuralHeader({
  title,
  subtitle,
  logo,
  actions,
  className = '',
  glow = false,
  shimmer = false,
  hologram = false,
  aiBrain = false,
  floating = false
}: NeuralHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const headerClasses = `
    neural-header
    ${glow ? 'neural-glow' : ''}
    ${shimmer ? 'neural-shimmer' : ''}
    ${hologram ? 'neural-hologram' : ''}
    ${aiBrain ? 'neural-ai-brain' : ''}
    ${floating ? 'neural-floating' : ''}
    ${className}
  `.trim();

  const headerVariants = {
    initial: { 
      y: 0,
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
    },
    hover: { 
      y: -2,
      boxShadow: '0 16px 64px rgba(139, 92, 246, 0.2)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header
      className={headerClasses}
      variants={headerVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Shimmer Effect */}
      {shimmer && (
        <div className="absolute inset-0 neural-shimmer pointer-events-none" />
      )}

      {/* Hologram Border */}
      {hologram && (
        <div className="absolute -inset-1 neural-hologram pointer-events-none" />
      )}

      {/* AI Brain Effect */}
      {aiBrain && (
        <div className="absolute -inset-2 neural-ai-brain pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            {logo && (
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {logo}
              </motion.div>
            )}
            
            <div>
              <motion.h1 
                className="text-2xl font-bold text-gray-900 neural-text-glow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {title}
              </motion.h1>
              
              {subtitle && (
                <motion.p 
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
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

      {/* Data Flow Effect */}
      {isHovered && shimmer && (
        <div className="neural-data-flow absolute inset-0 pointer-events-none" />
      )}
    </motion.header>
  );
}
