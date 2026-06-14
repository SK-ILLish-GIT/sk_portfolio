import { useEffect, useState } from 'react';

function detectTouch() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
}

function detectPortrait() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(orientation: portrait)').matches;
}

/** Coarse-pointer / touch device detection and portrait vs landscape orientation. */
export function useDeviceMode() {
  const [isTouch, setIsTouch] = useState(detectTouch);
  const [isPortrait, setIsPortrait] = useState(detectPortrait);

  useEffect(() => {
    const touchMq = window.matchMedia('(pointer: coarse)');
    const portraitMq = window.matchMedia('(orientation: portrait)');

    const update = () => {
      setIsTouch(touchMq.matches || 'ontouchstart' in window);
      setIsPortrait(portraitMq.matches);
    };

    touchMq.addEventListener('change', update);
    portraitMq.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    update();

    return () => {
      touchMq.removeEventListener('change', update);
      portraitMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return { isTouch, isPortrait };
}
