"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

interface ScreenSize {
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ScreenSize {
  // Initialize state with 'undefined' for SSR compatibility.
  // We'll set the actual values only after the component mounts on the client.
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // This effect runs only on the client side.
    const mediaQueries = {
      isSm: window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`),
      isMd: window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`),
      isLg: window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`),
      isXl: window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`),
    };

    const updateScreenSize = () => {
      const currentIsSm = mediaQueries.isSm.matches;
      const currentIsMd = mediaQueries.isMd.matches;
      const currentIsLg = mediaQueries.isLg.matches;
      const currentIsXl = mediaQueries.isXl.matches;

      setScreenSize({
        isSm: currentIsSm,
        isMd: currentIsMd,
        isLg: currentIsLg,
        isXl: currentIsXl,
        isMobile: !currentIsMd, // Example: < md
        isTablet: currentIsMd && !currentIsLg, // Example: md to lg
        isDesktop: currentIsLg, // Example: >= lg
      });
    };

    // Set initial state
    updateScreenSize();

    // Add listeners for changes to each media query
    for (const key in mediaQueries) {
      if (Object.prototype.hasOwnProperty.call(mediaQueries, key)) {
        const mq = mediaQueries[key as keyof typeof mediaQueries];
        mq.addEventListener("change", updateScreenSize);
      }
    }

    // Cleanup: Remove listeners when the component unmounts
    return () => {
      for (const key in mediaQueries) {
        if (Object.prototype.hasOwnProperty.call(mediaQueries, key)) {
          const mq = mediaQueries[key as keyof typeof mediaQueries];
          mq.removeEventListener("change", updateScreenSize);
        }
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  return screenSize;
}
