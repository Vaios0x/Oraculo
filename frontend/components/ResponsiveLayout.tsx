'use client'

import React, { useState, useEffect } from 'react'
import { useResponsive } from '../lib/responsive'

/**
 * 🔮 ResponsiveLayout - Layout responsive principal
 * 
 * Componente que maneja el layout responsive siguiendo
 * las mejores prácticas de Next.js 15 (2025)
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveLayout({ children, className = "" }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen neural-mesh-bg">
        <div className="container-responsive">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`
      min-h-screen neural-mesh-bg
      ${isMobile ? 'px-4 py-2' : ''}
      ${isTablet ? 'px-6 py-4' : ''}
      ${isDesktop ? 'px-8 py-6' : ''}
      ${className}
    `}>
      <div className="container-responsive">
        {children}
      </div>
    </div>
  )
}

/**
 * 🔮 ResponsiveContainer - Contenedor responsive
 */
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function ResponsiveContainer({ 
  children, 
  className = "", 
  maxWidth = 'full' 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={`
      w-full mx-auto
      ${maxWidthClasses[maxWidth]}
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * 🔮 ResponsiveGrid - Grid responsive inteligente
 */
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveGrid({ 
  children, 
  className = "",
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10'
  }

  const gridClasses = Object.entries(cols)
    .map(([breakpoint, colCount]) => {
      if (breakpoint === 'xs') return `grid-cols-${colCount}`
      return `${breakpoint}:grid-cols-${colCount}`
    })
    .join(' ')

  return (
    <div className={`
      grid ${gridClasses} ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * 🔮 ResponsiveText - Texto responsive
 */
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
}

export function ResponsiveText({ 
  children, 
  className = "",
  size = 'base',
  weight = 'normal'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-sm sm:text-base lg:text-lg',
    lg: 'text-base sm:text-lg lg:text-xl',
    xl: 'text-lg sm:text-xl lg:text-2xl',
    '2xl': 'text-xl sm:text-2xl lg:text-3xl',
    '3xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '4xl': 'text-3xl sm:text-4xl lg:text-5xl'
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <span className={`
      ${sizeClasses[size]}
      ${weightClasses[weight]}
      ${className}
    `}>
      {children}
    </span>
  )
}

/**
 * 🔮 ResponsiveSpacing - Espaciado responsive
 */
interface ResponsiveSpacingProps {
  children: React.ReactNode
  className?: string
  padding?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  margin?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
}

export function ResponsiveSpacing({ 
  children, 
  className = "",
  padding,
  margin
}: ResponsiveSpacingProps) {
  const paddingClasses = padding ? Object.entries(padding)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs') return `p-${value}`
      return `${breakpoint}:p-${value}`
    })
    .join(' ') : ''

  const marginClasses = margin ? Object.entries(margin)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs') return `m-${value}`
      return `${breakpoint}:m-${value}`
    })
    .join(' ') : ''

  return (
    <div className={`
      ${paddingClasses}
      ${marginClasses}
      ${className}
    `}>
      {children}
    </div>
  )
}
