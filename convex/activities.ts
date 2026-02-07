import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// Activity types
export type ActivityType = 
  | "message_received"
  | "message_sent"
  | "web_search"
  | "web_fetch"
  | "file_read"
  | "file_write"
  | "file_edit"
  | "shell_exec"
  | "tool_call"
  | "model_call"
  | "memory_saved"
  | "error";

// Log a new activity
export const log = mutation({
  args: {
    type: v.string(),
    description: v.string(),
    success: v.boolean(),
    tokens: v.optional(v.number()),
    model: v.optional(v.string()),
    details: v.optional(v.string()),
    metadata: v.optional(v.record(v.any())),
  },
  handler: async (ctx, args) => {
    const activity = await ctx.db.insert("activities", {
      type: args.type,
      description: args.description,
      success: args.success,
      timestamp: Date.now(),
      tokens: args.tokens,
      model: args.model,
      details: args.details,
      metadata: args.metadata || {},
    });
    return activity;
  },
});

// Get recent activities
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const activities = await ctx.db
      .query("activities")
      .order("desc")
      .take(limit);
    
    return {
      activities,
      hasMore: activities.length === limit,
    };
  },
});

// Get activity stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allActivities = await ctx.db.query("activities").collect();
    
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000).getTime();
    
    const today = allActivities.filter(a => a.timestamp >= todayStart).length;
    const thisWeek = allActivities.filter(a => a.timestamp >= weekStart).length;
    const totalCost = allActivities.reduce((sum, a) => sum + (a.tokens || 0) * 0.000002, 0);
    
    return {
      today,
      thisWeek,
      totalCost,
      total: allActivities.length,
    };
  },
});
