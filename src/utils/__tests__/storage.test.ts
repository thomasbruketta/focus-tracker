import {
  formatDuration,
  validateImportData,
  getDailyFocusMinutes,
} from "../storage";
import type { FocusSession } from "../../types";

describe("Storage Utils", () => {
  describe("formatDuration", () => {
    it("formats seconds correctly", () => {
      expect(formatDuration(30000)).toBe("0:30");
    });

    it("formats minutes correctly", () => {
      expect(formatDuration(90000)).toBe("1:30");
    });

    it("formats hours correctly", () => {
      expect(formatDuration(3661000)).toBe("1:01:01");
    });
  });

  describe("validateImportData", () => {
    it("validates correct data structure", () => {
      const validData = {
        version: "1.0.0",
        exportDate: "2023-01-01T00:00:00.000Z",
        sessions: [
          {
            id: "test-id",
            date: "2023-01-01",
            start: "2023-01-01T10:00:00.000Z",
            end: "2023-01-01T10:25:00.000Z",
            duration: 1500000,
            type: "manual",
          },
        ],
        settings: {
          focusDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          autoStartNext: false,
          sessionsUntilLongBreak: 4,
        },
      };

      expect(validateImportData(validData)).toEqual(validData);
    });

    it("rejects invalid data", () => {
      expect(validateImportData(null)).toBeNull();
      expect(validateImportData({})).toBeNull();
      expect(validateImportData({ sessions: "invalid" })).toBeNull();
    });
  });

  describe("getDailyFocusMinutes", () => {
    it("calculates daily minutes correctly", () => {
      const today = new Date().toISOString().split("T")[0];
      const sessions: FocusSession[] = [
        {
          id: "1",
          date: today,
          start: `${today}T10:00:00.000Z`,
          end: `${today}T10:25:00.000Z`,
          duration: 1500000, // 25 minutes
          type: "manual",
        },
        {
          id: "2",
          date: today,
          start: `${today}T14:00:00.000Z`,
          end: `${today}T14:30:00.000Z`,
          duration: 1800000, // 30 minutes
          type: "pomodoro",
        },
      ];

      const result = getDailyFocusMinutes(sessions, 1);
      expect(result[0].minutes).toBe(55); // 25 + 30 minutes
    });
  });
});
