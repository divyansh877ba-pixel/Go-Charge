import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'amperway_theme';
const LEGACY_STORAGE_KEY = 'gocharge_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      }
    } catch (e) {
      console.warn('Failed reading theme from localStorage:', e);
    }
    return 'light';
  });

  const applyTheme = useCallback((targetTheme: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.style.backgroundColor = '#071715';
        body.style.color = '#E4EFEA';
      }
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.style.backgroundColor = '#F4F1E8';
        body.style.color = '#14201F';
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.setItem(LEGACY_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed storing theme to localStorage:', e);
    }
  }, [theme, applyTheme]);

  // Listen to system preference changes if user hasn't explicitly set in current session
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
