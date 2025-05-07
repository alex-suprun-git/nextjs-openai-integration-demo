import { useState, useEffect } from 'react';

/**
 * Custom hook to track window width for responsive components
 * @returns {number} Current window width
 */
export const useWindowWidth = (): number => {
  // Default to desktop size (992px) for server-side rendering
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 992,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Set initial width
      handleResize();
    }

    // Clean up
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return windowWidth;
};

/**
 * Helper function to calculate aspect ratio based on window width
 * @param {number} width - Current window width
 * @returns {number} Appropriate aspect ratio for charts
 */
export const getChartAspectRatio = (width: number): number => {
  // Mobile devices (smaller screens)
  if (width < 576) return 1;
  // Tablets
  if (width < 992) return 1.6;
  // Desktop
  return 2;
};
