"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database } from "lucide-react";

export default function StatusBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-green-400" />
              System Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-blue-400" />
              Convex: Connecting...
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              Mr. Krabs Dashboard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
