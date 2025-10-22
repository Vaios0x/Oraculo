import { useState, useEffect } from 'react'

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
    width: number
    height: number
    isLandscape: boolean
    isPortrait: boolean
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    currentBreakpoint: 'xs',
    width: 0,
    height: 0,
    isLandscape: false,
    isPortrait: false
  })

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024 && width < 1280
      const isLargeDesktop = width >= 1280
      const isLandscape = width > height
      const isPortrait = height > width
      
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
        currentBreakpoint,
        width,
        height,
        isLandscape,
        isPortrait
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

/**
 * Utilidades de grid responsive mejoradas
 */
export const getResponsiveGridClasses = (columns: {
  mobile?: number
  tablet?: number
  desktop?: number
  large?: number
}) => {
  const { mobile = 1, tablet = 2, desktop = 3, large = 4 } = columns
  
  return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} xl:grid-cols-${large} gap-4 md:gap-6 lg:gap-8`
}

/**
 * Utilidades de texto responsive
 */
export const getResponsiveTextClasses = (sizes: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'text-sm', tablet = 'text-base', desktop = 'text-lg', large = 'text-xl' } = sizes
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de padding responsive
 */
export const getResponsivePaddingClasses = (paddings: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'p-4', tablet = 'p-6', desktop = 'p-8', large = 'p-10' } = paddings
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de margin responsive
 */
export const getResponsiveMarginClasses = (margins: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'm-4', tablet = 'm-6', desktop = 'm-8', large = 'm-10' } = margins
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de spacing responsive
 */
export const getResponsiveSpacingClasses = (spacings: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'space-y-4', tablet = 'space-y-6', desktop = 'space-y-8', large = 'space-y-10' } = spacings
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de flex responsive
 */
export const getResponsiveFlexClasses = (flex: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'flex-col', tablet = 'flex-col', desktop = 'flex-row', large = 'flex-row' } = flex
  
  return `flex ${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de visibilidad responsive
 */
export const getResponsiveVisibilityClasses = (visibility: {
  mobile?: boolean
  tablet?: boolean
  desktop?: boolean
  large?: boolean
}) => {
  const { mobile = true, tablet = true, desktop = true, large = true } = visibility
  
  let classes = ''
  if (!mobile) classes += 'hidden '
  if (tablet) classes += 'md:block '
  if (desktop) classes += 'lg:block '
  if (large) classes += 'xl:block '
  
  return classes.trim()
}

/**
 * Utilidades de altura responsive
 */
export const getResponsiveHeightClasses = (heights: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'h-auto', tablet = 'h-auto', desktop = 'h-screen', large = 'h-screen' } = heights
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}

/**
 * Utilidades de ancho responsive
 */
export const getResponsiveWidthClasses = (widths: {
  mobile?: string
  tablet?: string
  desktop?: string
  large?: string
}) => {
  const { mobile = 'w-full', tablet = 'w-full', desktop = 'w-3/4', large = 'w-2/3' } = widths
  
  return `${mobile} md:${tablet} lg:${desktop} xl:${large}`
}
