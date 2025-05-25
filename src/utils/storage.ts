import type {
  AppState,
  ExportData,
  FocusSession,
  PomodoroSettings,
} from "../types";

const STORAGE_KEY = "focus-tracker-data";
const MAX_LOCALSTORAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Default settings
export const defaultPomodoroSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartNext: false,
  sessionsUntilLongBreak: 4,
};

export const defaultAppState: AppState = {
  sessions: [],
  timerState: {
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    currentSession: null,
  },
  pomodoroSettings: defaultPomodoroSettings,
  currentPomodoroPhase: "focus",
  pomodoroSessionCount: 0,
};

// Check if data size exceeds localStorage limit
function getDataSize(data: string): number {
  return new Blob([data]).size;
}

// localStorage operations
export function saveToLocalStorage(state: AppState): void {
  try {
    const data = JSON.stringify(state);
    if (getDataSize(data) > MAX_LOCALSTORAGE_SIZE) {
      console.warn(
        "Data size exceeds localStorage limit, consider using IndexedDB",
      );
      return;
    }
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function loadFromLocalStorage(): AppState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format duration for display
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Export data as JSON
export function exportData(state: AppState): ExportData {
  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    sessions: state.sessions,
    settings: state.pomodoroSettings,
  };
}

// Validate and import data
export function validateImportData(data: unknown): ExportData | null {
  try {
    if (!data || typeof data !== "object") return null;
    const obj = data as Record<string, unknown>;
    if (!obj.sessions || !Array.isArray(obj.sessions)) return null;
    if (!obj.settings || typeof obj.settings !== "object") return null;

    // Validate sessions structure
    for (const session of obj.sessions) {
      if (!session.id || !session.date || !session.start || !session.type) {
        return null;
      }
    }

    return data as ExportData;
  } catch (error) {
    console.error("Invalid import data:", error);
    return null;
  }
}

// Calculate daily focus minutes for analytics
export function getDailyFocusMinutes(
  sessions: FocusSession[],
  days: number = 7,
): { date: string; minutes: number }[] {
  const today = new Date();
  const result: { date: string; minutes: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayMinutes = sessions
      .filter((session) => session.date === dateStr)
      .reduce((total, session) => total + session.duration / (1000 * 60), 0);

    result.push({
      date: dateStr,
      minutes: Math.round(dayMinutes),
    });
  }

  return result;
}

// Calculate consecutive days streak
export function getConsecutiveDaysStreak(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  const currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const hasSessionOnDate = sessions.some(
      (session) => session.date === dateStr,
    );

    if (hasSessionOnDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
