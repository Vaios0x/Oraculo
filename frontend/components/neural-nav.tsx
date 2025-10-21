"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
}

interface NeuralNavProps {
  items: NeuralNavItem[];
  activeItem?: string;
  onItemClick?: (item: NeuralNavItem) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  glow?: boolean;
  shimmer?: boolean;
  hologram?: boolean;
  aiBrain?: boolean;
}

export function NeuralNav({
  items,
  activeItem,
  onItemClick,
  className = '',
  orientation = 'horizontal',
  glow = false,
  shimmer = false,
  hologram = false,
  aiBrain = false
}: NeuralNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navClasses = `
    neural-nav
    ${orientation === 'horizontal' ? 'flex space-x-1' : 'flex flex-col space-y-1'}
    ${glow ? 'neural-glow' : ''}
    ${shimmer ? 'neural-shimmer' : ''}
    ${hologram ? 'neural-hologram' : ''}
    ${aiBrain ? 'neural-ai-brain' : ''}
    ${className}
  `.trim();

  const itemVariants = {
    initial: { 
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    hover: { 
      scale: 1.05,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transition: { duration: 0.2 }
    },
    active: { 
      scale: 1.02,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
    }
  };

  return (
    <nav className={navClasses}>
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

      {items.map((item) => {
        const isActive = activeItem === item.id;
        const isHovered = hoveredItem === item.id;
        const isDisabled = item.disabled;

        return (
          <motion.div
            key={item.id}
            className="relative"
            variants={itemVariants}
            initial="initial"
            animate={isActive ? "active" : isHovered ? "hover" : "initial"}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
            onClick={() => {
              if (!isDisabled && onItemClick) {
                onItemClick(item);
              }
            }}
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
          >
            <div className={`
              neural-nav-item
              ${isActive ? 'neural-nav-item-active' : ''}
              ${isDisabled ? 'opacity-50' : ''}
              ${orientation === 'vertical' ? 'w-full' : ''}
            `}>
              {/* Icon */}
              {item.icon && (
                <div className="w-4 h-4 flex-shrink-0">
                  {item.icon}
                </div>
              )}

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span className="ml-2 px-2 py-1 text-xs bg-neural-primary/20 text-neural-primary rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Neural Particles on Hover */}
              {isHovered && !isDisabled && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="neural-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random() * 1}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neural-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </nav>
  );
}
