import { useState, useLayoutEffect } from 'react';

const getInitialViewport = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return { width: window.innerWidth, height: window.innerHeight };
};

export function useIsMobile() {
  const [viewport, setViewport] = useState(() => getInitialViewport());

  useLayoutEffect(() => {
    const updateSize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = viewport.width < 680;
  const isTablet = viewport.width >= 680 && viewport.width < 1200;
  // Unify all tablets to Galaxy Tab A9 style profile
  const device = isMobile ? 'mobile' : (isTablet ? 'tabletA9' : 'desktop');

  return { isMobile, isTablet, device, viewportWidth: viewport.width };
}
