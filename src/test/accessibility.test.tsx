import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { AppProvider } from "../context/AppContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Timer } from "../components/Timer";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { Analytics } from "../components/Analytics";
import { Settings } from "../components/Settings";

expect.extend(toHaveNoViolations);

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <AppProvider>{children}</AppProvider>
  </ThemeProvider>
);

describe("Accessibility Tests", () => {
  it("Timer component should not have accessibility violations", async () => {
    const { container } = render(
      <TestWrapper>
        <Timer />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("PomodoroTimer component should not have accessibility violations", async () => {
    const { container } = render(
      <TestWrapper>
        <PomodoroTimer />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Analytics component should not have accessibility violations", async () => {
    const { container } = render(
      <TestWrapper>
        <Analytics />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Settings component should not have accessibility violations", async () => {
    const { container } = render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Timer component in dark mode should not have accessibility violations", async () => {
    // Set dark mode
    document.documentElement.classList.add("dark");

    const { container } = render(
      <TestWrapper>
        <Timer />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Clean up
    document.documentElement.classList.remove("dark");
  });

  it("Settings component in dark mode should not have accessibility violations", async () => {
    // Set dark mode
    document.documentElement.classList.add("dark");

    const { container } = render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Clean up
    document.documentElement.classList.remove("dark");
  });
});
