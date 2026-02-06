import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    type: v.string(), // "task_completed", "message_sent", "file_created", "config_changed", "backup_created", etc.
    description: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
    timestamp: v.number(), // Unix timestamp in ms
    sessionKey: v.optional(v.string()),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
    cost: v.optional(v.number()),
    success: v.boolean(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"])
    .index("by_session", ["sessionKey"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    dueDate: v.optional(v.number()), // Unix timestamp
    scheduledFor: v.optional(v.number()), // For calendar view
    tags: v.array(v.string()),
    notionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"])
    .index("by_scheduled", ["scheduledFor"]),

  memories: defineTable({
    type: v.union(
      v.literal("fact"),
      v.literal("preference"),
      v.literal("event"),
      v.literal("document"),
      v.literal("task_summary")
    ),
    content: v.string(),
    source: v.optional(v.string()), // file path or session
    tags: v.array(v.string()),
    importance: v.number(), // 1-10
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_importance", ["importance"])
    .searchIndex("content", { searchField: "content" }),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    path: v.string(),
    type: v.union(
      v.literal("config"),
      v.literal("skill"),
      v.literal("memory"),
      v.literal("documentation"),
      v.literal("code"),
      v.literal("other")
    ),
    tags: v.array(v.string()),
    checksum: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_path", ["path"])
    .index("by_type", ["type"])
    .searchIndex("content", { searchField: "content" })
    .searchIndex("title", { searchField: "title" }),

  scheduledEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    recurring: v.optional(v.string()), // cron expression
    type: v.union(
      v.literal("cron_job"),
      v.literal("reminder"),
      v.literal("task_due"),
      v.literal("meeting"),
      v.literal("other")
    ),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed")),
    createdAt: v.number(),
  })
    .index("by_start_time", ["startTime"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  syncState: defineTable({
    lastSyncedAt: v.number(),
    gitCommit: v.string(),
    version: v.string(),
  }),
});
