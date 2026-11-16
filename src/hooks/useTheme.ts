import { useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const applyTheme = useCallback(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    if (body) {
      body.classList.remove('dark');
      body.style.backgroundColor = '#F4F1E8';
      body.style.color = '#14201F';
    }
  }, []);

  useEffect(() => {
    applyTheme();
    try {
      localStorage.removeItem('amperway_theme');
      localStorage.removeItem('gocharge_theme');
    } catch (e) {
      console.warn('Failed clearing theme in localStorage:', e);
    }
  }, [applyTheme]);

  return {
    theme: 'light' as ThemeMode,
    isDark: false,
    toggleTheme: () => {},
    setTheme: (_newTheme?: ThemeMode) => {
      applyTheme();
    },
  };
}
