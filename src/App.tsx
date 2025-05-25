import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Timer } from './components/Timer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';

type Tab = 'timer' | 'pomodoro' | 'analytics' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');

  const tabs = [
    { id: 'timer' as const, label: 'Manual Timer', icon: '⏱️' },
    { id: 'pomodoro' as const, label: 'Pomodoro', icon: '🍅' },
    { id: 'analytics' as const, label: 'Analytics', icon: '📊' },
    { id: 'settings' as const, label: 'Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Timer />;
    }
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
          {/* Header */}
          <header className="bg-white dark:bg-neutral-900 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    FocusTracker
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    aria-label={`Switch to ${tab.label}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-fade-in">{renderContent()}</div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                <p>
                  FocusTracker - Your data stays private and local.
                  <span className="mx-2">•</span>
                  <a
                    href="https://github.com"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Source
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
