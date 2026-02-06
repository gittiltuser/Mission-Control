import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get recent activities with pagination
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    let activities;
    if (args.type) {
      activities = await ctx.db
        .query("activities")
        .withIndex("by_type", (q) => q.eq("type", args.type))
        .order("desc")
        .take(limit);
    } else {
      activities = await ctx.db
        .query("activities")
        .withIndex("by_timestamp")
        .order("desc")
        .take(limit);
    }

    return {
      activities,
      hasMore: activities.length === limit,
    };
  },
});

// Log a new activity
export const log = mutation({
  args: {
    type: v.string(),
    description: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
    sessionKey: v.optional(v.string()),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
    cost: v.optional(v.number()),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

// Get activity stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", oneWeekAgo))
      .collect();

    const todayActivities = activities.filter(a => a.timestamp > oneDayAgo);
    
    const byType: Record<string, number> = {};
    for (const activity of activities) {
      byType[activity.type] = (byType[activity.type] || 0) + 1;
    }

    const totalTokens = activities.reduce((sum, a) => sum + (a.tokens || 0), 0);
    const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

    return {
      today: todayActivities.length,
      thisWeek: activities.length,
      byType,
      totalTokens,
      totalCost,
    };
  },
});
