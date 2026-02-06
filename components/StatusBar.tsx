import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function StatusBar() {
  const activityStats = useQuery(api.activities.getStats);
  const taskStats = useQuery(api.tasks.getStats);

  return (
    <div className="bg-dark-800 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-6 text-sm">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Online</span>
          </div>

          {/* Model Status */}
          <div className="flex items-center gap-2 text-gray-400">
            <span>Model:</span>
            <span className="text-white font-medium">Kimi K2.5</span>
          </div>

          {/* Today's Activities */}
          {activityStats && (
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Today:</span>
              <span className="text-white font-medium">
                {activityStats.today} activities
              </span>
            </div>
          )}

          {/* Tasks */}
          {taskStats && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <CheckCircle className="w-4 h-4" />
                <span>Tasks:</span>
                <span className="text-green-400 font-medium">
                  {taskStats.done}
                </span>
                <span>/</span>
                <span className="text-white font-medium">
                  {taskStats.total}
                </span>
              </div>
              {taskStats.overdue > 0 && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{taskStats.overdue} overdue</span>
                </div>
              )}
            </div>
          )}

          {/* Cost */}
          {activityStats && activityStats.totalCost > 0 && (
            <div className="flex items-center gap-2 text-gray-400 ml-auto">
              <span>Est. Cost:</span>
              <span className="text-green-400 font-mono">
                ${activityStats.totalCost.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
