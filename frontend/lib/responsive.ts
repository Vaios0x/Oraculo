/**
 * 🔮 Responsive Utilities - Utilidades para diseño responsive
 * 
 * Sistema de breakpoints y utilidades para diseño responsive
 * siguiendo las mejores prácticas de Next.js 15 (2025)
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Hook para detectar el tamaño de pantalla actual
 */
export function useResponsive() {
  const [screenSize, setScreenSize] = useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isLargeDesktop: boolean
    currentBreakpoint: Breakpoint
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    currentBreakpoint: 'xs'
  })

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024 && width < 1280
      const isLargeDesktop = width >= 1280
      
      let currentBreakpoint: Breakpoint = 'xs'
      if (width >= 1536) currentBreakpoint = '2xl'
      else if (width >= 1280) currentBreakpoint = 'xl'
      else if (width >= 1024) currentBreakpoint = 'lg'
      else if (width >= 768) currentBreakpoint = 'md'
      else if (width >= 640) currentBreakpoint = 'sm'
      
      setScreenSize({
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        currentBreakpoint
      })
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

/**
 * Utilidades de clases responsive
 */
export const responsiveClasses = {
  container: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8',
  text: 'text-sm sm:text-base lg:text-lg',
  heading: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl',
  padding: 'p-4 sm:p-6 lg:p-8',
  margin: 'm-4 sm:m-6 lg:m-8',
  safeArea: 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right'
} as const

/**
 * Utilidades para componentes responsive
 */
export const getResponsiveClasses = (baseClasses: string, responsiveClasses: Record<string, string>) => {
  return Object.entries(responsiveClasses).reduce((acc, [breakpoint, classes]) => {
    return `${acc} ${breakpoint}:${classes}`
  }, baseClasses)
}

import { useState, useEffect } from 'react'
