"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { CheckCircle, AlertCircle, FileText, MessageSquare, Settings, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Activity {
  _id: string;
  type: string;
  description: string;
  success: boolean;
  timestamp: number;
  tokens?: number;
  model?: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

interface ActivityFeedProps {
  limit?: number;
  compact?: boolean;
}

export default function ActivityFeed({ limit = 50, compact = false }: ActivityFeedProps) {
  const data = useQuery(api.activities?.getRecent, { limit });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Loading state
  if (data === undefined) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center text-gray-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" />
        Loading activity feed...
      </div>
    );
  }

  // Handle case where query returns null or errors
  const activities: Activity[] = data?.activities || [];
  const stats = data?.stats || { today: 0, thisWeek: 0, totalCost: 0 };
  const hasMore = data?.hasMore || false;

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Activity Feed
          </h2>
          {!compact && (
            <p className="text-sm text-gray-500 mt-1">
              {stats.today} activities today · {stats.thisWeek} this week
            </p>
          )}
        </div>
        {!compact && stats.totalCost > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Est. Cost</p>
            <p className="font-mono text-green-400">${stats.totalCost.toFixed(4)}</p>
          </div>
        )}
      </div>
      <div className="divide-y divide-gray-800">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No activities recorded yet.
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem
              key={activity._id}
              activity={activity}
              expanded={expandedItems.has(activity._id)}
              onToggle={() => toggleExpanded(activity._id)}
              compact={compact}
            />
          ))
        )}
      </div>
      {hasMore && !compact && (
        <div className="p-4 border-t border-gray-800 text-center">
          <button className="text-blue-500 hover:text-blue-400 text-sm">
            Load more activities
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityItem({
  activity,
  expanded,
  onToggle,
  compact,
}: {
  activity: Activity;
  expanded: boolean;
  onToggle: () => void;
  compact: boolean;
}) {
  const iconConfig = getActivityIcon(activity.type);
  const hasDetails = activity.details || activity.metadata;
  const Icon = iconConfig.icon;

  return (
    <div className={clsx(
      "group hover:bg-gray-800/50 transition-colors",
      compact ? "p-3" : "p-4"
    )}>
      <div className="flex items-start gap-3">
        <div className={clsx(
          "flex-shrink-0 rounded-full p-2",
          activity.success ? "bg-green-500/10" : "bg-red-500/10"
        )}>
          <Icon className={clsx(
            "w-4 h-4",
            activity.success ? "text-green-400" : "text-red-400"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={clsx("text-white", compact ? "text-sm" : "font-medium")}>
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                  {formatActivityType(activity.type)}
                </span>
                {activity.model && (
                  <span className="text-gray-600">{activity.model}</span>
                )}
                <span>{format(activity.timestamp, "h:mm a")}</span>
                <span>{format(activity.timestamp, "MMM d, yyyy")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activity.tokens && activity.tokens > 0 && (
                <span className="text-xs text-gray-600 font-mono">
                  {activity.tokens.toLocaleString()} tokens
                </span>
              )}
              {hasDetails && !compact && (
                <button onClick={onToggle} className="p-1 hover:bg-gray-800 rounded text-gray-500">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
          {expanded && hasDetails && !compact && (
            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg text-sm">
              {activity.details && (
                <pre className="text-gray-400 font-mono text-xs overflow-x-auto">
                  {activity.details}
                </pre>
              )}
              {activity.metadata && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Metadata:</p>
                  <pre className="text-gray-400 font-mono text-xs overflow-x-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(type: string) {
  const icons: Record<string, { icon: typeof CheckCircle }> = {
    task_completed: { icon: CheckCircle },
    config_changed: { icon: Settings },
    file_created: { icon: FileText },
    message_sent: { icon: MessageSquare },
    backup_created: { icon: RefreshCw },
    default: { icon: CheckCircle },
  };
  return icons[type] || icons.default;
}

function formatActivityType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
