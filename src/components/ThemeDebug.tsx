import { useTheme } from '../context/ThemeContext';

export function ThemeDebug() {
  const { theme, isDark } = useTheme();

  const systemPreference = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  const htmlClassList = document.documentElement.classList.toString();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-xs font-mono shadow-lg z-50">
      <div className="space-y-1">
        <div>
          Theme: <span className="font-bold">{theme}</span>
        </div>
        <div>
          isDark: <span className="font-bold">{isDark.toString()}</span>
        </div>
        <div>
          System:{' '}
          <span className="font-bold">{systemPreference.toString()}</span>
        </div>
        <div>
          HTML Classes:{' '}
          <span className="font-bold">{htmlClassList || 'none'}</span>
        </div>
        <div>
          localStorage:{' '}
          <span className="font-bold">
            {localStorage.getItem('theme') || 'null'}
          </span>
        </div>
      </div>
    </div>
  );
}
