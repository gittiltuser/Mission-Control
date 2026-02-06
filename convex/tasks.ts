import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get tasks for calendar view (weekly)
export const getForWeek = query({
  args: {
    weekStart: v.number(), // Unix timestamp for start of week
    weekEnd: v.number(),   // Unix timestamp for end of week
  },
  handler: async (ctx, { weekStart, weekEnd }) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.or(
          q.and(
            q.gte("scheduledFor", weekStart),
            q.lte("scheduledFor", weekEnd)
          ),
          q.and(
            q.gte("dueDate", weekStart),
            q.lte("dueDate", weekEnd)
          )
        )
      )
      .collect();

    const events = await ctx.db
      .query("scheduledEvents")
      .withIndex("by_start_time", (q) =>
        q.gte("startTime", weekStart).lte("startTime", weekEnd)
      )
      .collect();

    return { tasks, events };
  },
});

// Get all tasks with filters
export const list = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").collect();

    if (args.status) {
      tasks = tasks.filter((t) => t.status === args.status);
    }
    if (args.priority) {
      tasks = tasks.filter((t) => t.priority === args.priority);
    }

    // Sort by due date
    tasks.sort((a, b) => {
      const aTime = a.dueDate || a.createdAt;
      const bTime = b.dueDate || b.createdAt;
      return aTime - bTime;
    });

    const limit = args.limit ?? 50;
    return tasks.slice(0, limit);
  },
});

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: (args.status as any) || "todo",
      priority: (args.priority as any) || "medium",
      dueDate: args.dueDate,
      scheduledFor: args.scheduledFor,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.string(),
  },
  handler: async (ctx, { taskId, status }) => {
    const update: any = {
      status,
      updatedAt: Date.now(),
    };
    if (status === "done") {
      update.completedAt = Date.now();
    }
    await ctx.db.patch(taskId, update);
  },
});

// Get task stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter((t) => 
        t.status !== "done" && t.dueDate && t.dueDate < Date.now()
      ).length,
    };
  },
});
