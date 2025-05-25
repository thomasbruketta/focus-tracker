import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Timer } from "../Timer";
import { AppProvider } from "../../context/AppContext";

const TimerWithProvider = () => (
  <AppProvider>
    <Timer />
  </AppProvider>
);

describe("Timer", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders timer with initial state", () => {
    render(<TimerWithProvider />);

    expect(screen.getByText("Manual Timer")).toBeInTheDocument();
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start timer/i }),
    ).toBeInTheDocument();
  });

  it("shows pause and stop buttons when timer is running", async () => {
    render(<TimerWithProvider />);

    const startButton = screen.getByRole("button", { name: /start timer/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /pause timer/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /stop timer/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start timer/i }),
    ).not.toBeInTheDocument();
  });

  it("shows resume button when timer is paused", async () => {
    render(<TimerWithProvider />);

    // Start the timer first
    const startButton = screen.getByRole("button", { name: /start timer/i });
    fireEvent.click(startButton);

    // Wait for the timer to be running and then pause it
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /pause timer/i }),
      ).toBeInTheDocument();
    });

    const pauseButton = screen.getByRole("button", { name: /pause timer/i });
    fireEvent.click(pauseButton);

    // Wait for the paused state and check for resume button
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /resume timer/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /stop timer/i }),
    ).toBeInTheDocument();
    // Start button should not be present when paused
    expect(
      screen.queryByRole("button", { name: /start timer/i }),
    ).not.toBeInTheDocument();
  });
});
