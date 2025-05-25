export interface FocusSession {
  id: string;
  date: string; // ISO date string
  start: string; // ISO datetime string
  end?: string; // ISO datetime string
  duration: number; // in milliseconds
  type: "manual" | "pomodoro";
  focusDuration?: number; // for pomodoro sessions
  breakDuration?: number; // for pomodoro sessions
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  autoStartNext: boolean;
  sessionsUntilLongBreak: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedTime: number;
  currentSession: Partial<FocusSession> | null;
}

export interface AppState {
  sessions: FocusSession[];
  timerState: TimerState;
  pomodoroSettings: PomodoroSettings;
  currentPomodoroPhase: "focus" | "short-break" | "long-break";
  pomodoroSessionCount: number;
}

export interface ExportData {
  version: string;
  exportDate: string;
  sessions: FocusSession[];
  settings: PomodoroSettings;
}
