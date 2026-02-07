"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format, startOfWeek, endOfWeek, addDays, startOfDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  status: string;
  scheduledFor?: number;
  dueDate?: number;
}

interface CalendarEvent {
  _id: string;
  title: string;
  startTime: number;
}

export default function CalendarView() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: 0 }).getTime(),
    [currentWeek]
  );
  const weekEnd = useMemo(
    () => endOfWeek(currentWeek, { weekStartsOn: 0 }).getTime(),
    [currentWeek]
  );

  const data = useQuery(api.tasks?.getForWeek, { weekStart, weekEnd });
  const tasks: Task[] = data?.tasks || [];
  const events: CalendarEvent[] = data?.events || [];

  const weekDays = useMemo(() => {
    const days = [];
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  }, [currentWeek]);

  const goToPreviousWeek = () => setCurrentWeek((prev) => addDays(prev, -7));
  const goToNextWeek = () => setCurrentWeek((prev) => addDays(prev, 7));
  const goToToday = () => setCurrentWeek(new Date());

  if (data === undefined) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center text-gray-500">
        Loading calendar...
      </div>
    );
  }

  const dayItems = weekDays.map((day) => {
    const dayStart = startOfDay(day).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayTasks = tasks.filter((t: Task) => {
      const scheduled = t.scheduledFor || t.dueDate;
      return scheduled && scheduled >= dayStart && scheduled < dayEnd;
    });
    const dayEvents = events.filter((e: CalendarEvent) => {
      return e.startTime >= dayStart && e.startTime < dayEnd;
    });
    return { date: day, tasks: dayTasks, events: dayEvents };
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Weekly Calendar
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPreviousWeek} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToToday} className="px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-400">
              Today
            </button>
            <button onClick={goToNextWeek} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-gray-800">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-r border-gray-800 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dayItems.map((dayData, index) => (
          <CalendarDay key={index} date={dayData.date} tasks={dayData.tasks} events={dayData.events} isLastInRow={index === 6} />
        ))}
      </div>
    </div>
  );
}

function CalendarDay({ date, tasks, events, isLastInRow }: { date: Date; tasks: Task[]; events: CalendarEvent[]; isLastInRow: boolean }) {
  const isCurrentDay = isToday(date);
  const hasItems = tasks.length > 0 || events.length > 0;

  return (
    <div className={`min-h-[200px] p-2 border-r border-b border-gray-800 ${isLastInRow ? "border-r-0" : ""} hover:bg-gray-800/30 transition-colors`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isCurrentDay ? "bg-blue-500 text-white" : "text-gray-500"}`}>
          {date.getDate()}
        </span>
        {hasItems && <span className="text-xs text-gray-600">{tasks.length + events.length} items</span>}
      </div>
      <div className="space-y-1">
        {tasks.map((task) => (
          <div key={task._id} className={`p-1.5 rounded text-xs cursor-pointer truncate ${getTaskColor(task.status)} hover:opacity-80 transition-opacity`} title={task.title}>
            <div className="flex items-center gap-1">
              {task.status === "done" && <CheckCircle2 className="w-3 h-3" />}
              <span className="truncate">{task.title}</span>
            </div>
          </div>
        ))}
        {events.map((event) => (
          <div key={event._id} className="p-1.5 rounded text-xs cursor-pointer bg-purple-500/10 text-purple-400 border border-purple-500/20 truncate" title={event.title}>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="truncate">{event.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTaskColor(status: string) {
  switch (status) {
    case "done": return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "in_progress": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    case "todo": return "bg-red-500/10 text-red-400 border border-red-500/20";
    default: return "bg-gray-700 text-gray-400";
  }
}
