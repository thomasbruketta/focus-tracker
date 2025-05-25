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
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Focus Minutes (Last 7 Days)",
      },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `${context.parsed.y} minutes`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutes",
        },
      },
    },
  };

  const totalMinutes = dailyData.reduce((sum, day) => sum + day.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / 7);
  const totalSessions = state.sessions.length;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Analytics</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 mb-1">
              Current Streak
            </h3>
            <p className="text-2xl font-bold text-blue-900">{streak} days</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 mb-1">
              Weekly Average
            </h3>
            <p className="text-2xl font-bold text-green-900">
              {averageMinutes} min/day
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600 mb-1">
              Total Sessions
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              {totalSessions}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
        {state.sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No sessions recorded yet. Start a timer to see your progress!
          </p>
        ) : (
          <div className="space-y-2">
            {state.sessions
              .slice(-10)
              .reverse()
              .map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        session.type === "pomodoro"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {session.type}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(session.start).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {Math.round(session.duration / (1000 * 60))} min
                    </div>
                    <div className="text-xs text-gray-500">
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
