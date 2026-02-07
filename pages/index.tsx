import { useState } from "react";
import dynamic from "next/dynamic";
import { Home, Calendar, Search, Activity } from "lucide-react";

// Dynamic imports with SSR disabled for Convex components
const ActivityFeed = dynamic(() => import("@/components/ActivityFeed"), { ssr: false });
const CalendarView = dynamic(() => import("@/components/CalendarView"), { ssr: false });
const GlobalSearch = dynamic(() => import("@/components/GlobalSearch"), { ssr: false });
const StatusBar = dynamic(() => import("@/components/StatusBar"), { ssr: false });

type Tab = "dashboard" | "activity" | "calendar" | "search";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🦀</span>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-sm text-gray-400">Mr. Krabs Dashboard</p>
              </div>
            </div>
            <nav className="flex space-x-1">
              <TabButton
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
                icon={<Home className="w-4 h-4" />}
                label="Overview"
              />
              <TabButton
                active={activeTab === "activity"}
                onClick={() => setActiveTab("activity")}
                icon={<Activity className="w-4 h-4" />}
                label="Activity Feed"
              />
              <TabButton
                active={activeTab === "calendar"}
                onClick={() => setActiveTab("calendar")}
                icon={<Calendar className="w-4 h-4" />}
                label="Calendar"
              />
              <TabButton
                active={activeTab === "search"}
                onClick={() => setActiveTab("search")}
                icon={<Search className="w-4 h-4" />}
                label="Search"
              />
            </nav>
          </div>
        </div>
      </header>
      <StatusBar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "activity" && <ActivityFeed />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "search" && <GlobalSearch />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Activities Today" value="—" icon="📝" color="blue" />
        <StatCard title="Tasks Due" value="—" icon="✅" color="green" />
        <StatCard title="Overdue Tasks" value="—" icon="⚠️" color="red" />
        <StatCard title="Total Tokens" value="—" icon="💰" color="purple" />
      </div>
      {/* Quick Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed limit={10} compact />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]} hover:bg-opacity-20 transition-all cursor-pointer`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-400 mt-2">{title}</p>
    </div>
  );
}
