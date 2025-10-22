import { useResponsive } from './responsive';

/**
 * 🔮 useResponsiveClasses Hook - Hook para clases responsive
 * 
 * Hook que proporciona utilidades para generar clases responsive
 * de forma dinámica basada en el tamaño de pantalla
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function useResponsiveClasses() {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getResponsiveClasses = (classes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    let responsiveClasses = '';

    if (isMobile && classes.mobile) {
      responsiveClasses += classes.mobile;
    } else if (isTablet && classes.tablet) {
      responsiveClasses += classes.tablet;
    } else if (isDesktop && classes.desktop) {
      responsiveClasses += classes.desktop;
    } else if (isLargeDesktop && classes.large) {
      responsiveClasses += classes.large;
    }

    return responsiveClasses;
  };

  const getGridClasses = (columns: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  }) => {
    const { mobile = 1, tablet = 2, desktop = 3, large = 4 } = columns;
    
    if (isMobile) {
      return `grid-cols-${mobile}`;
    } else if (isTablet) {
      return `grid-cols-${mobile} md:grid-cols-${tablet}`;
    } else if (isDesktop) {
      return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
    } else {
      return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} xl:grid-cols-${large}`;
    }
  };

  const getFlexClasses = (direction: {
    mobile?: 'row' | 'col';
    tablet?: 'row' | 'col';
    desktop?: 'row' | 'col';
    large?: 'row' | 'col';
  }) => {
    const { mobile = 'col', tablet = 'col', desktop = 'row', large = 'row' } = direction;
    
    if (isMobile) {
      return `flex-${mobile}`;
    } else if (isTablet) {
      return `flex-${mobile} md:flex-${tablet}`;
    } else if (isDesktop) {
      return `flex-${mobile} md:flex-${tablet} lg:flex-${desktop}`;
    } else {
      return `flex-${mobile} md:flex-${tablet} lg:flex-${desktop} xl:flex-${large}`;
    }
  };

  const getTextClasses = (sizes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    const { mobile = 'text-sm', tablet = 'text-base', desktop = 'text-lg', large = 'text-xl' } = sizes;
    
    if (isMobile) {
      return mobile;
    } else if (isTablet) {
      return `${mobile} md:${tablet}`;
    } else if (isDesktop) {
      return `${mobile} md:${tablet} lg:${desktop}`;
    } else {
      return `${mobile} md:${tablet} lg:${desktop} xl:${large}`;
    }
  };

  const getSpacingClasses = (spacing: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    const { mobile = 'p-4', tablet = 'p-6', desktop = 'p-8', large = 'p-10' } = spacing;
    
    if (isMobile) {
      return mobile;
    } else if (isTablet) {
      return `${mobile} md:${tablet}`;
    } else if (isDesktop) {
      return `${mobile} md:${tablet} lg:${desktop}`;
    } else {
      return `${mobile} md:${tablet} lg:${desktop} xl:${large}`;
    }
  };

  const getGapClasses = (gaps: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    const { mobile = 'gap-4', tablet = 'gap-5', desktop = 'gap-6', large = 'gap-8' } = gaps;
    
    if (isMobile) {
      return mobile;
    } else if (isTablet) {
      return `${mobile} md:${tablet}`;
    } else if (isDesktop) {
      return `${mobile} md:${tablet} lg:${desktop}`;
    } else {
      return `${mobile} md:${tablet} lg:${desktop} xl:${large}`;
    }
  };

  const getVisibilityClasses = (visibility: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
    large?: boolean;
  }) => {
    const { mobile = true, tablet = true, desktop = true, large = true } = visibility;
    
    let classes = '';
    
    if (!mobile) classes += 'hidden ';
    if (tablet) classes += 'md:block ';
    if (desktop) classes += 'lg:block ';
    if (large) classes += 'xl:block ';
    
    return classes.trim();
  };

  const getWidthClasses = (widths: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    const { mobile = 'w-full', tablet = 'w-full', desktop = 'w-3/4', large = 'w-2/3' } = widths;
    
    if (isMobile) {
      return mobile;
    } else if (isTablet) {
      return `${mobile} md:${tablet}`;
    } else if (isDesktop) {
      return `${mobile} md:${tablet} lg:${desktop}`;
    } else {
      return `${mobile} md:${tablet} lg:${desktop} xl:${large}`;
    }
  };

  const getHeightClasses = (heights: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  }) => {
    const { mobile = 'h-auto', tablet = 'h-auto', desktop = 'h-screen', large = 'h-screen' } = heights;
    
    if (isMobile) {
      return mobile;
    } else if (isTablet) {
      return `${mobile} md:${tablet}`;
    } else if (isDesktop) {
      return `${mobile} md:${tablet} lg:${desktop}`;
    } else {
      return `${mobile} md:${tablet} lg:${desktop} xl:${large}`;
    }
  };

  return {
    getResponsiveClasses,
    getGridClasses,
    getFlexClasses,
    getTextClasses,
    getSpacingClasses,
    getGapClasses,
    getVisibilityClasses,
    getWidthClasses,
    getHeightClasses,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  };
}

export default useResponsiveClasses;
