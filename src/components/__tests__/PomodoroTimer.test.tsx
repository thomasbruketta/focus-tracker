import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { vi } from 'vitest';
import { PomodoroTimer } from '../PomodoroTimer';
import { AppProvider } from '../../context/AppContext';

const PomodoroTimerWithProvider = () => (
  <AppProvider>
    <PomodoroTimer />
  </AppProvider>
);

// Mock Date.now to control time in tests
const mockDateNow = vi.fn();
Date.now = mockDateNow;

describe('PomodoroTimer', () => {
  beforeEach(() => {
    mockDateNow.mockReturnValue(1000000); // Start at a fixed time
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders pomodoro timer with initial state', () => {
    render(<PomodoroTimerWithProvider />);

    expect(screen.getByText('Pomodoro Timer')).toBeInTheDocument();
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument(); // Default 25 minutes
    expect(
      screen.getByRole('button', { name: /start pomodoro timer/i })
    ).toBeInTheDocument();
  });

  it('shows pause and stop buttons when timer is running', async () => {
    render(<PomodoroTimerWithProvider />);

    const startButton = screen.getByRole('button', {
      name: /start pomodoro timer/i,
    });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /pause pomodoro timer/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /stop pomodoro timer/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /start pomodoro timer/i })
    ).not.toBeInTheDocument();
  });

  it('shows resume button when timer is paused', async () => {
    render(<PomodoroTimerWithProvider />);

    // Start the timer first
    const startButton = screen.getByRole('button', {
      name: /start pomodoro timer/i,
    });
    fireEvent.click(startButton);

    // Wait for the timer to be running and then pause it
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /pause pomodoro timer/i })
      ).toBeInTheDocument();
    });

    const pauseButton = screen.getByRole('button', {
      name: /pause pomodoro timer/i,
    });
    fireEvent.click(pauseButton);

    // Wait for the paused state and check for resume button
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /resume pomodoro timer/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /stop pomodoro timer/i })
    ).toBeInTheDocument();
    // Start button should not be present when paused
    expect(
      screen.queryByRole('button', { name: /start pomodoro timer/i })
    ).not.toBeInTheDocument();
  });

  it('maintains paused state correctly', async () => {
    render(<PomodoroTimerWithProvider />);

    // Start the timer
    const startButton = screen.getByRole('button', {
      name: /start pomodoro timer/i,
    });
    fireEvent.click(startButton);

    // Wait for timer to be running
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /pause pomodoro timer/i })
      ).toBeInTheDocument();
    });

    // Pause the timer
    const pauseButton = screen.getByRole('button', {
      name: /pause pomodoro timer/i,
    });
    fireEvent.click(pauseButton);

    // Wait for paused state
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /resume pomodoro timer/i })
      ).toBeInTheDocument();
    });

    // Resume the timer
    const resumeButton = screen.getByRole('button', {
      name: /resume pomodoro timer/i,
    });
    fireEvent.click(resumeButton);

    // Wait for running state again
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /pause pomodoro timer/i })
      ).toBeInTheDocument();
    });

    // Verify we can pause again
    const pauseButton2 = screen.getByRole('button', {
      name: /pause pomodoro timer/i,
    });
    fireEvent.click(pauseButton2);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /resume pomodoro timer/i })
      ).toBeInTheDocument();
    });
  });
});
