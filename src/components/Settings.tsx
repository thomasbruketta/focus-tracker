import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { exportData, validateImportData } from "../utils/storage";
import type { PomodoroSettings } from "../types";

export function Settings() {
  const { state, updatePomodoroSettings, dispatch } = useApp();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<PomodoroSettings>(
    state.pomodoroSettings,
  );
  const [importError, setImportError] = useState<string>("");

  const handleSettingsChange = (
    field: keyof PomodoroSettings,
    value: number | boolean,
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    updatePomodoroSettings(settings);
  };

  const handleExport = () => {
    const data = exportData(state);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `focus_data_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const validatedData = validateImportData(jsonData);

        if (validatedData) {
          dispatch({
            type: "IMPORT_DATA",
            data: {
              sessions: validatedData.sessions,
              settings: validatedData.settings,
            },
          });
          setImportError("");
          alert("Data imported successfully!");
        } else {
          setImportError("Invalid file format. Please check your JSON file.");
        }
      } catch {
        setImportError(
          "Failed to parse JSON file. Please check the file format.",
        );
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Theme Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: "☀️" },
                { value: "dark", label: "Dark", icon: "🌙" },
                { value: "system", label: "System", icon: "💻" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setTheme(option.value as "light" | "dark" | "system")
                  }
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === option.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <span className="text-2xl mb-2">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Pomodoro Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="focusDuration"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              id="focusDuration"
              min="1"
              max="60"
              value={settings.focusDuration}
              onChange={(e) =>
                handleSettingsChange("focusDuration", parseInt(e.target.value))
              }
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="shortBreakDuration"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              id="shortBreakDuration"
              min="1"
              max="60"
              value={settings.shortBreakDuration}
              onChange={(e) =>
                handleSettingsChange(
                  "shortBreakDuration",
                  parseInt(e.target.value),
                )
              }
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="longBreakDuration"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              id="longBreakDuration"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) =>
                handleSettingsChange(
                  "longBreakDuration",
                  parseInt(e.target.value),
                )
              }
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="sessionsUntilLongBreak"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Sessions Until Long Break
            </label>
            <input
              type="number"
              id="sessionsUntilLongBreak"
              min="2"
              max="10"
              value={settings.sessionsUntilLongBreak}
              onChange={(e) =>
                handleSettingsChange(
                  "sessionsUntilLongBreak",
                  parseInt(e.target.value),
                )
              }
              className="input-field"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoStartNext"
              checked={settings.autoStartNext}
              onChange={(e) =>
                handleSettingsChange("autoStartNext", e.target.checked)
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
            />
            <label
              htmlFor="autoStartNext"
              className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
            >
              Auto-start next phase
            </label>
          </div>

          <button onClick={handleSaveSettings} className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Data Management
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">
              Export Data
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Download your focus sessions and settings as a JSON file for
              backup or migration.
            </p>
            <button onClick={handleExport} className="btn-primary">
              Export Data
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">
              Import Data
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Upload a previously exported JSON file to restore your data. This
              will replace your current data.
            </p>
            <label htmlFor="import-file" className="sr-only">
              Choose JSON file to import
            </label>
            <input
              type="file"
              id="import-file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-neutral-500 dark:text-neutral-400 
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 
                hover:file:bg-primary-100 dark:file:bg-primary-950 dark:file:text-primary-300 
                dark:hover:file:bg-primary-900 transition-colors duration-200"
            />
            {importError && (
              <div className="status-error mt-2">{importError}</div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-bold mb-2 text-primary-900 dark:text-primary-100">
          Privacy & Data Storage
        </h3>
        <p className="text-sm text-primary-800 dark:text-primary-200">
          All your data is stored locally in your browser. No information is
          sent to external servers. Use the export feature to create backups of
          your data.
        </p>
      </div>
    </div>
  );
}
