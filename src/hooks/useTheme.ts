import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'gocharge_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
      }
    } catch (e) {
      console.warn('Failed reading theme from storage:', e);
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
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed saving theme to storage:', e);
    }
  }, [theme, applyTheme]);

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
