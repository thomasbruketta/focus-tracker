import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDuration, generateId } from '../utils/storage';
import type { FocusSession } from '../types';

export function PomodoroTimer() {
  const {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    completeSession,
    dispatch,
  } = useApp();
  const [currentTime, setCurrentTime] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);

  const { pomodoroSettings, currentPomodoroPhase, pomodoroSessionCount } =
    state;

  // Calculate phase duration in milliseconds
  const getPhaseDuration = () => {
    switch (currentPomodoroPhase) {
      case 'focus':
        return pomodoroSettings.focusDuration * 60 * 1000;
      case 'short-break':
        return pomodoroSettings.shortBreakDuration * 60 * 1000;
      case 'long-break':
        return pomodoroSettings.longBreakDuration * 60 * 1000;
      default:
        return pomodoroSettings.focusDuration * 60 * 1000;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.timerState.isRunning && state.timerState.startTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - state.timerState.startTime!;
        setCurrentTime(elapsed);

        const phaseDuration = getPhaseDuration();
        const remaining = Math.max(0, phaseDuration - elapsed);
        setPhaseTimeRemaining(remaining);

        // Check if phase is complete
        if (remaining === 0) {
          handlePhaseComplete();
        }
      }, 1000);
    } else if (state.timerState.isPaused) {
      setCurrentTime(state.timerState.pausedTime);
      const phaseDuration = getPhaseDuration();
      setPhaseTimeRemaining(
        Math.max(0, phaseDuration - state.timerState.pausedTime)
      );
    } else {
      setCurrentTime(0);
      setPhaseTimeRemaining(getPhaseDuration());
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    state.timerState.isRunning,
    state.timerState.startTime,
    state.timerState.isPaused,
    state.timerState.pausedTime,
    currentPomodoroPhase,
    pomodoroSettings,
  ]);

  const handlePhaseComplete = () => {
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const message =
        currentPomodoroPhase === 'focus'
          ? 'Focus session complete! Time for a break.'
          : 'Break time over! Ready to focus?';
      new Notification('FocusTracker', { body: message });
    }

    // Save session if it was a focus phase
    if (currentPomodoroPhase === 'focus' && state.timerState.currentSession) {
      const shouldTakeLongBreak =
        (pomodoroSessionCount + 1) % pomodoroSettings.sessionsUntilLongBreak ===
        0;
      const session: FocusSession = {
        id: state.timerState.currentSession.id || generateId(),
        date:
          state.timerState.currentSession.date ||
          new Date().toISOString().split('T')[0],
        start:
          state.timerState.currentSession.start || new Date().toISOString(),
        end: new Date().toISOString(),
        duration: currentTime,
        type: 'pomodoro',
        focusDuration: pomodoroSettings.focusDuration,
        breakDuration: shouldTakeLongBreak
          ? pomodoroSettings.longBreakDuration
          : pomodoroSettings.shortBreakDuration,
      };
      completeSession(session);
      dispatch({ type: 'INCREMENT_POMODORO_COUNT' });
    }

    // Determine next phase
    let nextPhase: 'focus' | 'short-break' | 'long-break';
    if (currentPomodoroPhase === 'focus') {
      const shouldTakeLongBreak =
        (pomodoroSessionCount + 1) % pomodoroSettings.sessionsUntilLongBreak ===
        0;
      nextPhase = shouldTakeLongBreak ? 'long-break' : 'short-break';
    } else {
      nextPhase = 'focus';
    }

    dispatch({ type: 'SET_POMODORO_PHASE', phase: nextPhase });

    // Auto-start next phase if enabled
    if (pomodoroSettings.autoStartNext) {
      setTimeout(() => {
        startTimer('pomodoro');
      }, 1000);
    } else {
      stopTimer();
    }
  };

  const handleStart = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    startTimer('pomodoro');
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStop = () => {
    stopTimer();
  };

  const isRunning = state.timerState.isRunning;
  const isPaused = state.timerState.isPaused;

  const getPhaseLabel = () => {
    switch (currentPomodoroPhase) {
      case 'focus':
        return 'Focus Time';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getPhaseColor = () => {
    switch (currentPomodoroPhase) {
      case 'focus':
        return 'text-error-600 dark:text-error-400';
      case 'short-break':
        return 'text-success-600 dark:text-success-400';
      case 'long-break':
        return 'text-primary-600 dark:text-primary-400';
      default:
        return 'text-error-600 dark:text-error-400';
    }
  };

  return (
    <div className="card max-w-md mx-auto animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-50">
          Pomodoro Timer
        </h2>
        <p className={`text-lg font-medium mb-6 ${getPhaseColor()}`}>
          {getPhaseLabel()}
        </p>

        <div className={`timer-display mb-8 ${getPhaseColor()}`}>
          {formatDuration(phaseTimeRemaining)}
        </div>

        <div className="flex gap-3 justify-center">
          {!isRunning && !isPaused && (
            <button
              onClick={handleStart}
              className="btn-primary"
              aria-label="Start pomodoro timer"
            >
              Start
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="btn-secondary"
              aria-label="Pause pomodoro timer"
            >
              Pause
            </button>
          )}

          {isPaused && (
            <button
              onClick={handleResume}
              className="btn-primary"
              aria-label="Resume pomodoro timer"
            >
              Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={handleStop}
              className="btn-danger"
              aria-label="Stop pomodoro timer"
            >
              Stop
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
            <p>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Session:
              </span>{' '}
              {pomodoroSessionCount + 1}
            </p>
            <p>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Next:
              </span>{' '}
              {pomodoroSessionCount %
                pomodoroSettings.sessionsUntilLongBreak ===
              pomodoroSettings.sessionsUntilLongBreak - 1
                ? 'Long Break'
                : currentPomodoroPhase === 'focus'
                  ? 'Short Break'
                  : 'Focus'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
