"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database } from "lucide-react";

export default function StatusBar() {
  const [mounted, setMounted] = useState(false);
  
  // TODO: Connect to Convex when deployed
  // const stats = useQuery(api.activities.getStats);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isConnected = false; // Will be true when Convex connected

  if (!mounted) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Activity className={`w-3 h-3 ${isConnected ? "text-green-400" : "text-yellow-400"}`} />
              {isConnected ? "System Ready" : "Demo Mode"}
            </span>
            <span className="flex items-center gap-1.5">
              <Database className={`w-3 h-3 ${isConnected ? "text-blue-400" : "text-gray-500"}`} />
              Convex: {isConnected ? "Connected" : "Offline"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-purple-400" />
              Mr. Krabs Dashboard v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
