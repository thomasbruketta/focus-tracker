import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Test component to interact with theme
function ThemeTestComponent() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div>
      <div data-testid="theme-info">
        <span data-testid="current-theme">{theme}</span>
        <span data-testid="is-dark">{isDark.toString()}</span>
      </div>
      <button data-testid="light-btn" onClick={() => setTheme('light')}>
        Light
      </button>
      <button data-testid="dark-btn" onClick={() => setTheme('dark')}>
        Dark
      </button>
      <button data-testid="system-btn" onClick={() => setTheme('system')}>
        System
      </button>
    </div>
  );
}

describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove any existing dark class
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with system theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('should switch to light theme when light button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('light-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should switch to dark theme when dark button is clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('dark-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should persist theme preference in localStorage', () => {
    // Set initial theme in localStorage
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should handle invalid localStorage values gracefully', () => {
    // Set invalid theme in localStorage
    localStorage.setItem('theme', 'invalid-theme');

    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    // Should fall back to system theme
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('should apply dark class to HTML element when dark theme is active', async () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    // Initially should not have dark class
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Switch to dark theme
    fireEvent.click(screen.getByTestId('dark-btn'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Switch back to light theme
    fireEvent.click(screen.getByTestId('light-btn'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
