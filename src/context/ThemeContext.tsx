import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to validate theme value
const isValidTheme = (value: string): value is Theme => {
  return ['light', 'dark', 'system'].includes(value);
};

// Helper function to get system preference
const getSystemPreference = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Helper function to determine if theme should be dark
const shouldBeDark = (theme: Theme): boolean => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return getSystemPreference();
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme with proper validation
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored && isValidTheme(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return 'system';
  });

  // Initialize isDark with the correct value based on theme
  const [isDark, setIsDark] = useState(() => shouldBeDark(theme));

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      const darkMode = shouldBeDark(theme);
      setIsDark(darkMode);

      if (darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
