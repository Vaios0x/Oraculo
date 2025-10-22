'use client';

import React from 'react';
import { useResponsive } from '../lib/responsive';

/**
 * 🔮 ResponsiveContainer Component - Contenedor responsive inteligente
 * 
 * Componente que maneja contenedores de forma completamente responsive
 * con padding, margin y sizing adaptativos
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  margin?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  maxWidth?: string;
  center?: boolean;
  fluid?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className = '',
  padding,
  margin,
  maxWidth = 'max-w-7xl',
  center = true,
  fluid = false
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getContainerClasses = () => {
    const defaultPadding = {
      mobile: 'px-3',
      tablet: 'px-4',
      desktop: 'px-6',
      large: 'px-8'
    };

    const defaultMargin = {
      mobile: 'py-4',
      tablet: 'py-6',
      desktop: 'py-8',
      large: 'py-10'
    };

    const paddings = { ...defaultPadding, ...padding };
    const margins = { ...defaultMargin, ...margin };

    let containerClasses = 'w-full ';
    
    if (!fluid) {
      containerClasses += maxWidth;
    }
    
    if (center) {
      containerClasses += ' mx-auto';
    }

    // Padding responsive
    if (isMobile) {
      containerClasses += ` ${paddings.mobile}`;
    } else if (isTablet) {
      containerClasses += ` ${paddings.mobile} md:${paddings.tablet}`;
    } else if (isDesktop) {
      containerClasses += ` ${paddings.mobile} md:${paddings.tablet} lg:${paddings.desktop}`;
    } else {
      containerClasses += ` ${paddings.mobile} md:${paddings.tablet} lg:${paddings.desktop} xl:${paddings.large}`;
    }

    // Margin responsive
    if (isMobile) {
      containerClasses += ` ${margins.mobile}`;
    } else if (isTablet) {
      containerClasses += ` ${margins.mobile} md:${margins.tablet}`;
    } else if (isDesktop) {
      containerClasses += ` ${margins.mobile} md:${margins.tablet} lg:${margins.desktop}`;
    } else {
      containerClasses += ` ${margins.mobile} md:${margins.tablet} lg:${margins.desktop} xl:${margins.large}`;
    }

    return `${containerClasses} ${className}`;
  };

  return (
    <div className={getContainerClasses()}>
      {children}
    </div>
  );
}

/**
 * 🔮 ResponsiveSection Component - Sección responsive
 */
interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  background?: string;
  rounded?: boolean;
}

export function ResponsiveSection({ 
  children, 
  className = '',
  spacing,
  background = 'bg-transparent',
  rounded = false
}: ResponsiveSectionProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getSectionClasses = () => {
    const defaultSpacing = {
      mobile: 'py-8',
      tablet: 'py-12',
      desktop: 'py-16',
      large: 'py-20'
    };

    const spacings = { ...defaultSpacing, ...spacing };

    let sectionClasses = `w-full ${background} `;
    
    if (rounded) {
      sectionClasses += ' rounded-lg';
    }

    // Spacing responsive
    if (isMobile) {
      sectionClasses += ` ${spacings.mobile}`;
    } else if (isTablet) {
      sectionClasses += ` ${spacings.mobile} md:${spacings.tablet}`;
    } else if (isDesktop) {
      sectionClasses += ` ${spacings.mobile} md:${spacings.tablet} lg:${spacings.desktop}`;
    } else {
      sectionClasses += ` ${spacings.mobile} md:${spacings.tablet} lg:${spacings.desktop} xl:${spacings.large}`;
    }

    return `${sectionClasses} ${className}`;
  };

  return (
    <section className={getSectionClasses()}>
      {children}
    </section>
  );
}

/**
 * 🔮 ResponsiveCard Component - Card responsive
 */
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function ResponsiveCard({ 
  children, 
  className = '',
  padding,
  hover = false,
  clickable = false,
  onClick
}: ResponsiveCardProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getCardClasses = () => {
    const defaultPadding = {
      mobile: 'p-4',
      tablet: 'p-6',
      desktop: 'p-8',
      large: 'p-10'
    };

    const paddings = { ...defaultPadding, ...padding };

    let cardClasses = 'matrix-card-enhanced neural-floating ';
    
    if (hover) {
      cardClasses += 'hover:scale-105 transition-transform duration-300 ';
    }
    
    if (clickable) {
      cardClasses += 'cursor-pointer ';
    }

    // Padding responsive
    if (isMobile) {
      cardClasses += paddings.mobile;
    } else if (isTablet) {
      cardClasses += `${paddings.mobile} md:${paddings.tablet}`;
    } else if (isDesktop) {
      cardClasses += `${paddings.mobile} md:${paddings.tablet} lg:${paddings.desktop}`;
    } else {
      cardClasses += `${paddings.mobile} md:${paddings.tablet} lg:${paddings.desktop} xl:${paddings.large}`;
    }

    return `${cardClasses} ${className}`;
  };

  return (
    <div 
      className={getCardClasses()}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ResponsiveContainer;
