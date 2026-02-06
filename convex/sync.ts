import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Sync data from filesystem into Convex
export const importFromWorkspace = mutation({
  args: {
    documents: v.array(v.object({
      path: v.string(),
      title: v.string(),
      content: v.string(),
      type: v.string(),
      tags: v.array(v.string()),
    })),
    commit: v.string(),
    version: v.string(),
  },
  handler: async (ctx, args) => {
    // Upsert documents
    for (const doc of args.documents) {
      // Check if document exists
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_path", (q) => q.eq("path", doc.path))
        .first();

      const now = Date.now();
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          ...doc,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("documents", {
          ...doc,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // Update sync state
    await ctx.db.insert("syncState", {
      lastSyncedAt: Date.now(),
      gitCommit: args.commit,
      version: args.version,
    });

    return { success: true, imported: args.documents.length };
  },
});

// Import activities from OpenClaw logs
export const importActivities = mutation({
  args: {
    activities: v.array(v.object({
      type: v.string(),
      description: v.string(),
      details: v.optional(v.string()),
      metadata: v.optional(v.record(v.string(), v.any())),
      timestamp: v.number(),
      sessionKey: v.optional(v.string()),
      model: v.optional(v.string()),
      tokens: v.optional(v.number()),
      cost: v.optional(v.number()),
      success: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    for (const activity of args.activities) {
      // Check if activity already exists by unique fields
      const existing = await ctx.db
        .query("activities")
        .filter((q) =>
          q.and(
            q.eq("timestamp", activity.timestamp),
            q.eq("type", activity.type)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("activities", activity);
      }
    }

    return { success: true, imported: args.activities.length };
  },
});

// Create a task from Notion
export const importNotionTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.optional(v.number()),
    notionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if task exists
    const existing = args.notionId
      ? await ctx.db
          .query("tasks")
          .filter((q) => q.eq("notionId", args.notionId))
          .first()
      : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return { updated: true, id: existing._id };
    } else {
      const id = await ctx.db.insert("tasks", {
        ...args,
        status: args.status as any,
        priority: args.priority as any,
        scheduledFor: undefined,
        tags: [],
        createdAt: now,
        updatedAt: now,
      });
      return { created: true, id };
    }
  },
});
