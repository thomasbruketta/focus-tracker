import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { Timer } from "./components/Timer";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";

type Tab = "timer" | "pomodoro" | "analytics" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  const tabs = [
    { id: "timer" as const, label: "Manual Timer", icon: "⏱️" },
    { id: "pomodoro" as const, label: "Pomodoro", icon: "🍅" },
    { id: "analytics" as const, label: "Analytics", icon: "📊" },
    { id: "settings" as const, label: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "timer":
        return <Timer />;
      case "pomodoro":
        return <PomodoroTimer />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Timer />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  FocusTracker
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
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
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>
                FocusTracker - Your data stays private and local.
                <span className="mx-2">•</span>
                <a
                  href="https://github.com"
                  className="text-blue-600 hover:text-blue-800"
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
  );
}

export default App;
