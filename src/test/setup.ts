import "@testing-library/jest-dom";
import React from "react";

// Mock localStorage to prevent state persistence between tests
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock react-chartjs-2 to avoid Chart.js DOM issues
vi.mock("react-chartjs-2", () => ({
  Bar: vi.fn(() => {
    return React.createElement(
      "div",
      { "data-testid": "mock-chart", "data-chart-type": "bar" },
      "Mock Chart",
    );
  }),
  Line: vi.fn(() =>
    React.createElement(
      "div",
      { "data-testid": "mock-chart", "data-chart-type": "line" },
      "Mock Chart",
    ),
  ),
  Pie: vi.fn(() =>
    React.createElement(
      "div",
      { "data-testid": "mock-chart", "data-chart-type": "pie" },
      "Mock Chart",
    ),
  ),
}));

// Mock Chart.js registration
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLCanvasElement.getContext for Chart.js
const mockCanvasContext = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Array(4),
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
};

HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(mockCanvasContext);

// Mock canvas getBoundingClientRect
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 300,
  height: 150,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
});

// Mock canvas width and height properties
Object.defineProperty(HTMLCanvasElement.prototype, "width", {
  value: 300,
  writable: true,
});

Object.defineProperty(HTMLCanvasElement.prototype, "height", {
  value: 150,
  writable: true,
});

// Mock ResizeObserver
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock getComputedStyle for Chart.js
Object.defineProperty(window, "getComputedStyle", {
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(""),
    width: "300px",
    height: "150px",
  })),
});
