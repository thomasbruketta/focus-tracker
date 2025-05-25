import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import {
  getDailyFocusMinutes,
  getConsecutiveDaysStreak,
} from "../utils/storage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function Analytics() {
  const { state } = useApp();
  const { isDark } = useTheme();
  const dailyData = getDailyFocusMinutes(state.sessions, 7);
  const streak = getConsecutiveDaysStreak(state.sessions);

  const chartData = {
    labels: dailyData.map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Focus Minutes",
        data: dailyData.map((day) => day.minutes),
        backgroundColor: isDark
          ? "rgba(56, 189, 248, 0.8)"
          : "rgba(14, 165, 233, 0.8)",
        borderColor: isDark ? "rgba(56, 189, 248, 1)" : "rgba(14, 165, 233, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#f5f5f5" : "#171717",
        },
      },
      title: {
        display: true,
        text: "Daily Focus Minutes (Last 7 Days)",
        color: isDark ? "#f5f5f5" : "#171717",
      },
      tooltip: {
        backgroundColor: isDark ? "#262626" : "#ffffff",
        titleColor: isDark ? "#f5f5f5" : "#171717",
        bodyColor: isDark ? "#f5f5f5" : "#171717",
        borderColor: isDark ? "#404040" : "#e5e5e5",
        borderWidth: 1,
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `${context.parsed.y} minutes`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#a3a3a3" : "#525252",
        },
        grid: {
          color: isDark ? "#404040" : "#e5e5e5",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutes",
          color: isDark ? "#f5f5f5" : "#171717",
        },
        ticks: {
          color: isDark ? "#a3a3a3" : "#525252",
        },
        grid: {
          color: isDark ? "#404040" : "#e5e5e5",
        },
      },
    },
  };

  const totalMinutes = dailyData.reduce((sum, day) => sum + day.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / 7);
  const totalSessions = state.sessions.length;

  return (
    <div className="space-y-6">
      <div className="card animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Analytics
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
            <h3 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
              Current Streak
            </h3>
            <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {streak} days
            </p>
          </div>

          <div className="bg-success-50 dark:bg-success-950 p-4 rounded-lg border border-success-200 dark:border-success-800">
            <h3 className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">
              Weekly Average
            </h3>
            <p className="text-2xl font-bold text-success-900 dark:text-success-100">
              {averageMinutes} min/day
            </p>
          </div>

          <div className="bg-warning-50 dark:bg-warning-950 p-4 rounded-lg border border-warning-200 dark:border-warning-800">
            <h3 className="text-sm font-medium text-warning-600 dark:text-warning-400 mb-1">
              Total Sessions
            </h3>
            <p className="text-2xl font-bold text-warning-900 dark:text-warning-100">
              {totalSessions}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card animate-slide-up">
        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Recent Sessions
        </h3>
        {state.sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">
              No sessions recorded yet. Start a timer to see your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.sessions
              .slice(-10)
              .reverse()
              .map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-200"
                >
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        session.type === "pomodoro"
                          ? "bg-error-100 dark:bg-error-950 text-error-800 dark:text-error-200 border border-error-200 dark:border-error-800"
                          : "bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800"
                      }`}
                    >
                      {session.type}
                    </span>
                    <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(session.start).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {Math.round(session.duration / (1000 * 60))} min
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(session.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
