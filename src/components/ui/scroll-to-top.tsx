'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const initialized = useRef(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      // Check initial scroll position on mount (e.g. if page is restored from bfcache)
      initialized.current = true;
      requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300);
      });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="بازگشت به بالا"
      className={`
        fixed bottom-6 left-6 z-50
        flex h-12 w-12 items-center justify-center rounded-full
        bg-gradient-to-br from-violet-500 to-purple-700
        text-white shadow-lg shadow-purple-500/25
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1
        dark:from-violet-600 dark:to-purple-800 dark:shadow-purple-700/30
        dark:hover:shadow-purple-700/50
        ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
