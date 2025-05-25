import { useState } from "react";
import { useApp } from "../context/AppContext";
import { exportData, validateImportData } from "../utils/storage";
import type { PomodoroSettings } from "../types";

export function Settings() {
  const { state, updatePomodoroSettings, dispatch } = useApp();
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
      } catch (_error) {
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
      {/* Pomodoro Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Pomodoro Settings</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="focusDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="shortBreakDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="longBreakDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="sessionsUntilLongBreak"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="autoStartNext"
              className="ml-2 block text-sm text-gray-700"
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
        <h2 className="text-2xl font-bold mb-6">Data Management</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download your focus sessions and settings as a JSON file for
              backup or migration.
            </p>
            <button onClick={handleExport} className="btn-primary">
              Export Data
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a previously exported JSON file to restore your data. This
              will replace your current data.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {importError && (
              <p className="mt-2 text-sm text-red-600">{importError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-bold mb-2 text-blue-900">
          Privacy & Data Storage
        </h3>
        <p className="text-sm text-blue-800">
          All your data is stored locally in your browser. No information is
          sent to external servers. Use the export feature to create backups of
          your data.
        </p>
      </div>
    </div>
  );
}
