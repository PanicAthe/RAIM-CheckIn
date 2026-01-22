import { useState, useLayoutEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    function updateSize() { 
      setIsMobile(window.innerWidth < 768); 
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return isMobile;
}
