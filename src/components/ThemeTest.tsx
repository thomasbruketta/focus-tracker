import { useTheme } from '../context/ThemeContext';

export function ThemeTest() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Theme Test Component</h2>

      <div className="space-y-2">
        <p>Current theme: {theme}</p>
        <p>Is dark: {isDark.toString()}</p>
        <p>
          HTML has dark class:{' '}
          {document.documentElement.classList.contains('dark').toString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          System
        </button>
      </div>

      <div className="p-4 border rounded">
        <p className="text-neutral-900 dark:text-neutral-100">
          This text should be dark in light mode and light in dark mode
        </p>
        <div className="mt-2 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
          This div should have a white background in light mode and dark
          background in dark mode
        </div>
      </div>

      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded">
        Red background test - should be light red in light mode, dark red in
        dark mode
      </div>
    </div>
  );
}
