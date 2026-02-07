"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Activity, Cpu, Database } from "lucide-react";

export default function StatusBar() {
  let stats: any = undefined;
  try {
    // @ts-ignore - API might not exist yet
    stats = useQuery(api.activities.getStats);
  } catch (e) {
    // API not ready
  }
  
  const isConnected = stats !== undefined;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Activity className={`w-3 h-3 ${isConnected ? "text-green-400" : "text-yellow-400"}`} />
              {isConnected ? "System Ready" : "Connecting..."}
            </span>
            <span className="flex items-center gap-1.5">
              <Database className={`w-3 h-3 ${isConnected ? "text-blue-400" : "text-gray-500"}`} />
              Convex: {isConnected ? "Connected" : "Offline"}
            </span>
            {stats && stats.today > 0 && (
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-purple-400" />
                {stats.today} activities today
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Mr. Krabs Dashboard v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
