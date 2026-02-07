import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Activity tracking
  activities: defineTable({
    type: v.string(), // web_search, file_read, model_call, etc.
    description: v.string(),
    success: v.boolean(),
    timestamp: v.number(),
    tokens: v.optional(v.number()),
    model: v.optional(v.string()),
    details: v.optional(v.string()),
    metadata: v.optional(v.record(v.any())),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"]),

  // Tasks from Notion
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    notionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  // Memories
  memories: defineTable({
    content: v.string(),
    tags: v.array(v.string()),
    source: v.optional(v.string()), // e.g., "user", "agent", "notion"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_updated", ["updatedAt"])
    .index("by_tags", ["tags"]),

  // Documents
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    path: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_updated", ["updatedAt"]),

  // Scheduled events
  scheduledEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    type: v.string(), // e.g., "reminder", "meeting", "task"
    tags: v.optional(v.array(v.string())),
  })
    .index("by_start_time", ["startTime"]),
});
