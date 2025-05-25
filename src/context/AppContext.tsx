import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, FocusSession, PomodoroSettings } from '../types';
import {
  defaultAppState,
  saveToLocalStorage,
  loadFromLocalStorage,
  generateId,
} from '../utils/storage';

type AppAction =
  | { type: 'START_TIMER'; sessionType: 'manual' | 'pomodoro' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'UPDATE_TIMER' }
  | { type: 'COMPLETE_SESSION'; session: FocusSession }
  | { type: 'UPDATE_POMODORO_SETTINGS'; settings: PomodoroSettings }
  | {
      type: 'SET_POMODORO_PHASE';
      phase: 'focus' | 'short-break' | 'long-break';
    }
  | { type: 'INCREMENT_POMODORO_COUNT' }
  | { type: 'RESET_POMODORO_COUNT' }
  | {
      type: 'IMPORT_DATA';
      data: { sessions: FocusSession[]; settings: PomodoroSettings };
    }
  | { type: 'LOAD_STATE'; state: AppState };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  startTimer: (type: 'manual' | 'pomodoro') => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updatePomodoroSettings: (settings: PomodoroSettings) => void;
  completeSession: (session: FocusSession) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timerState: {
          isRunning: true,
          isPaused: false,
          startTime: Date.now(),
          pausedTime: 0,
          currentSession: {
            id: generateId(),
            type: action.sessionType,
            start: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
          },
        },
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          isRunning: false,
          isPaused: true,
          pausedTime: state.timerState.startTime
            ? Date.now() - state.timerState.startTime
            : state.timerState.pausedTime,
        },
      };

    case 'RESUME_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          isRunning: true,
          isPaused: false,
          startTime: Date.now() - state.timerState.pausedTime,
        },
      };

    case 'STOP_TIMER':
      return {
        ...state,
        timerState: {
          isRunning: false,
          isPaused: false,
          startTime: null,
          pausedTime: 0,
          currentSession: null,
        },
      };

    case 'UPDATE_TIMER':
      if (!state.timerState.isRunning || !state.timerState.startTime)
        return state;
      return {
        ...state,
        timerState: {
          ...state.timerState,
          pausedTime: Date.now() - state.timerState.startTime,
        },
      };

    case 'COMPLETE_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.session],
        timerState: {
          isRunning: false,
          isPaused: false,
          startTime: null,
          pausedTime: 0,
          currentSession: null,
        },
      };

    case 'UPDATE_POMODORO_SETTINGS':
      return {
        ...state,
        pomodoroSettings: action.settings,
      };

    case 'SET_POMODORO_PHASE':
      return {
        ...state,
        currentPomodoroPhase: action.phase,
      };

    case 'INCREMENT_POMODORO_COUNT':
      return {
        ...state,
        pomodoroSessionCount: state.pomodoroSessionCount + 1,
      };

    case 'RESET_POMODORO_COUNT':
      return {
        ...state,
        pomodoroSessionCount: 0,
      };

    case 'IMPORT_DATA':
      return {
        ...state,
        sessions: action.data.sessions,
        pomodoroSettings: action.data.settings,
      };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, defaultAppState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', state: savedState });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const startTimer = (type: 'manual' | 'pomodoro') => {
    dispatch({ type: 'START_TIMER', sessionType: type });
  };

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const resumeTimer = () => {
    dispatch({ type: 'RESUME_TIMER' });
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const updatePomodoroSettings = (settings: PomodoroSettings) => {
    dispatch({ type: 'UPDATE_POMODORO_SETTINGS', settings });
  };

  const completeSession = (session: FocusSession) => {
    dispatch({ type: 'COMPLETE_SESSION', session });
  };

  const value: AppContextType = {
    state,
    dispatch,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updatePomodoroSettings,
    completeSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
