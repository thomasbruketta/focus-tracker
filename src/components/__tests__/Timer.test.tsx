import { render, screen, fireEvent } from "@testing-library/react";
import { Timer } from "../Timer";
import { AppProvider } from "../../context/AppContext";

const TimerWithProvider = () => (
  <AppProvider>
    <Timer />
  </AppProvider>
);

describe("Timer", () => {
  it("renders timer with initial state", () => {
    render(<TimerWithProvider />);

    expect(screen.getByText("Manual Timer")).toBeInTheDocument();
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start timer/i }),
    ).toBeInTheDocument();
  });

  it("shows pause and stop buttons when timer is running", () => {
    render(<TimerWithProvider />);

    const startButton = screen.getByRole("button", { name: /start timer/i });
    fireEvent.click(startButton);

    expect(
      screen.getByRole("button", { name: /pause timer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /stop timer/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start timer/i }),
    ).not.toBeInTheDocument();
  });

  it("shows resume button when timer is paused", () => {
    render(<TimerWithProvider />);

    // Start the timer first
    const startButton = screen.getByRole("button", { name: /start timer/i });
    fireEvent.click(startButton);

    // Then pause it
    const pauseButton = screen.getByRole("button", { name: /pause timer/i });
    fireEvent.click(pauseButton);

    // Check for resume and stop buttons
    expect(
      screen.getByRole("button", { name: /resume timer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /stop timer/i }),
    ).toBeInTheDocument();
  });
});
