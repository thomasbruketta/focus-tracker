import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { formatDuration, generateId } from "../utils/storage";
import type { FocusSession } from "../types";

export function Timer() {
  const {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    completeSession,
  } = useApp();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (state.timerState.isRunning && state.timerState.startTime) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - state.timerState.startTime!);
      }, 1000);
    } else if (state.timerState.isPaused) {
      setCurrentTime(state.timerState.pausedTime);
    } else {
      setCurrentTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    state.timerState.isRunning,
    state.timerState.startTime,
    state.timerState.isPaused,
    state.timerState.pausedTime,
  ]);

  const handleStart = () => {
    startTimer("manual");
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStop = () => {
    if (state.timerState.currentSession && currentTime > 0) {
      const session: FocusSession = {
        id: state.timerState.currentSession.id || generateId(),
        date:
          state.timerState.currentSession.date ||
          new Date().toISOString().split("T")[0],
        start:
          state.timerState.currentSession.start || new Date().toISOString(),
        end: new Date().toISOString(),
        duration: currentTime,
        type: "manual",
      };
      completeSession(session);
    } else {
      stopTimer();
    }
  };

  const isRunning = state.timerState.isRunning;
  const isPaused = state.timerState.isPaused;

  return (
    <div className="card max-w-md mx-auto animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Manual Timer
        </h2>

        <div className="timer-display mb-8">{formatDuration(currentTime)}</div>

        <div className="flex gap-3 justify-center">
          {!isRunning && !isPaused && (
            <button
              onClick={handleStart}
              className="btn-primary"
              aria-label="Start timer"
            >
              Start
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="btn-secondary"
              aria-label="Pause timer"
            >
              Pause
            </button>
          )}

          {isPaused && (
            <button
              onClick={handleResume}
              className="btn-primary"
              aria-label="Resume timer"
            >
              Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={handleStop}
              className="btn-danger"
              aria-label="Stop timer"
            >
              Stop
            </button>
          )}
        </div>

        {(isRunning || isPaused) && (
          <div className="mt-6 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Session started at{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(
                  state.timerState.currentSession?.start || "",
                ).toLocaleTimeString()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
