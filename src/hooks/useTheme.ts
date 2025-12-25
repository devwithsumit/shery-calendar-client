import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'sc_theme';

const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem(THEME_KEY) as Theme | null;
        return saved || 'system';
    });

    const applyTheme = useCallback((t: Theme) => {
        const root = document.documentElement;
        const resolved = t === 'system' ? getSystemTheme() : t;
        root.classList.toggle('dark', resolved === 'dark');
    }, []);

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        localStorage.setItem(THEME_KEY, t);
        applyTheme(t);
    }, [applyTheme]);

    useEffect(() => {
        applyTheme(theme);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => theme === 'system' && applyTheme('system');
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);

    return { theme, setTheme };
};
