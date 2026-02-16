import { useEffect, useState } from 'react';

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isIPad(): boolean {
  return /iPad/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function isLandscape(): boolean {
  return window.innerWidth > window.innerHeight;
}

export function useDeviceOrientation() {
  const [isLandscapeMode, setIsLandscapeMode] = useState(isLandscape());
  const [isIPadDevice] = useState(isIPad());

  useEffect(() => {
    const handleResize = () => {
      setIsLandscapeMode(isLandscape());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isLandscape: isLandscapeMode, isIPad: isIPadDevice };
}

// 防止默认触摸行为
export function preventDefaultTouchBehavior() {
  if (typeof document === 'undefined') return;

  // 防止页面滚动
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';

  // 防止双击缩放
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // 防止橡皮筋效果
  document.addEventListener('touchmove', (e) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.tagName === 'CANVAS' || e.target.closest('[data-touch-control]')) {
        e.preventDefault();
      }
    }
  }, { passive: false });
}

// 恢复默认触摸行为
export function restoreDefaultTouchBehavior() {
  if (typeof document === 'undefined') return;

  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.height = '';
}
