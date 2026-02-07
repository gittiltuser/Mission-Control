// Convex activities API - backend functions
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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
      stats: { today: 0, thisWeek: 0, totalCost: 0 },
    };
  },
});

// Get activity stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    return {
      today: 0,
      thisWeek: 0,
      totalCost: 0,
    };
  },
});

// Log new activity
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
