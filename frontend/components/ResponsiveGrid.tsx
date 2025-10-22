'use client';

import React from 'react';
import { useResponsive } from '../lib/responsive';

/**
 * 🔮 ResponsiveGrid Component - Grid responsive inteligente
 * 
 * Componente que crea grids responsive de forma inteligente
 * basado en el contenido y el tamaño de pantalla
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  autoFit?: boolean;
  minWidth?: string;
}

export function ResponsiveGrid({ 
  children, 
  className = '', 
  columns,
  gap,
  autoFit = false,
  minWidth = '300px'
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getGridClasses = () => {
    if (autoFit) {
      return `grid gap-4 ${className}`;
    }

    const defaultColumns = {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      large: 4
    };

    const defaultGap = {
      mobile: 'gap-3',
      tablet: 'gap-4',
      desktop: 'gap-5',
      large: 'gap-6'
    };

    const cols = { ...defaultColumns, ...columns };
    const gaps = { ...defaultGap, ...gap };

    let gridClasses = 'grid ';
    
    if (isMobile) {
      gridClasses += `grid-cols-${cols.mobile} ${gaps.mobile}`;
    } else if (isTablet) {
      gridClasses += `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} ${gaps.mobile} md:${gaps.tablet}`;
    } else if (isDesktop) {
      gridClasses += `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop} ${gaps.mobile} md:${gaps.tablet} lg:${gaps.desktop}`;
    } else {
      gridClasses += `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop} xl:grid-cols-${cols.large} ${gaps.mobile} md:${gaps.tablet} lg:${gaps.desktop} xl:${gaps.large}`;
    }

    return `${gridClasses} ${className}`;
  };

  if (autoFit) {
    return (
      <div 
        className={getGridClasses()}
        style={{ 
          gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` 
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
}

/**
 * 🔮 ResponsiveFlex Component - Flex responsive inteligente
 */
interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'col';
    tablet?: 'row' | 'col';
    desktop?: 'row' | 'col';
    large?: 'row' | 'col';
  };
  justify?: string;
  align?: string;
  wrap?: boolean;
  gap?: string;
}

export function ResponsiveFlex({ 
  children, 
  className = '',
  direction,
  justify = 'justify-start',
  align = 'items-start',
  wrap = false,
  gap = 'gap-4'
}: ResponsiveFlexProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getFlexClasses = () => {
    const defaultDirection = {
      mobile: 'col' as const,
      tablet: 'col' as const,
      desktop: 'row' as const,
      large: 'row' as const
    };

    const dirs = { ...defaultDirection, ...direction };

    let flexClasses = 'flex ';
    
    if (isMobile) {
      flexClasses += `flex-${dirs.mobile}`;
    } else if (isTablet) {
      flexClasses += `flex-${dirs.mobile} md:flex-${dirs.tablet}`;
    } else if (isDesktop) {
      flexClasses += `flex-${dirs.mobile} md:flex-${dirs.tablet} lg:flex-${dirs.desktop}`;
    } else {
      flexClasses += `flex-${dirs.mobile} md:flex-${dirs.tablet} lg:flex-${dirs.desktop} xl:flex-${dirs.large}`;
    }

    flexClasses += ` ${justify} ${align}`;
    
    if (wrap) {
      flexClasses += ' flex-wrap';
    }
    
    flexClasses += ` ${gap}`;

    return `${flexClasses} ${className}`;
  };

  return (
    <div className={getFlexClasses()}>
      {children}
    </div>
  );
}

/**
 * 🔮 ResponsiveText Component - Texto responsive
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  weight?: string;
  color?: string;
}

export function ResponsiveText({ 
  children, 
  className = '',
  size,
  weight = 'font-normal',
  color = 'text-white'
}: ResponsiveTextProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getTextClasses = () => {
    const defaultSize = {
      mobile: 'text-sm',
      tablet: 'text-base',
      desktop: 'text-lg',
      large: 'text-xl'
    };

    const sizes = { ...defaultSize, ...size };

    let textClasses = '';
    
    if (isMobile) {
      textClasses += sizes.mobile;
    } else if (isTablet) {
      textClasses += `${sizes.mobile} md:${sizes.tablet}`;
    } else if (isDesktop) {
      textClasses += `${sizes.mobile} md:${sizes.tablet} lg:${sizes.desktop}`;
    } else {
      textClasses += `${sizes.mobile} md:${sizes.tablet} lg:${sizes.desktop} xl:${sizes.large}`;
    }

    textClasses += ` ${weight} ${color}`;

    return `${textClasses} ${className}`;
  };

  return (
    <span className={getTextClasses()}>
      {children}
    </span>
  );
}

export default ResponsiveGrid;
