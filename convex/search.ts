import { v } from "convex/values";
import { query } from "./_generated/server";

// Global search across memories, documents, and tasks
export const global = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    types: v.optional(v.array(v.string())), // ['memory', 'document', 'task']
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchTerm = args.query.toLowerCase();
    const results: any[] = [];

    const includeTypes = args.types || ['memory', 'document', 'task'];

    // Search memories
    if (includeTypes.includes('memory')) {
      const memories = await ctx.db.query("memories").collect();
      const matchingMemories = memories
        .filter(m => 
          m.content.toLowerCase().includes(searchTerm) ||
          m.tags.some(t => t.toLowerCase().includes(searchTerm))
        )
        .map(m => ({ ...m, resultType: 'memory' }))
        .slice(0, limit);
      results.push(...matchingMemories);
    }

    // Search documents
    if (includeTypes.includes('document')) {
      const documents = await ctx.db.query("documents").collect();
      const matchingDocs = documents
        .filter(d => 
          d.title.toLowerCase().includes(searchTerm) ||
          d.content.toLowerCase().includes(searchTerm) ||
          d.path.toLowerCase().includes(searchTerm) ||
          d.tags.some(t => t.toLowerCase().includes(searchTerm))
        )
        .map(d => ({ ...d, resultType: 'document' }))
        .slice(0, limit);
      results.push(...matchingDocs);
    }

    // Search tasks
    if (includeTypes.includes('task')) {
      const tasks = await ctx.db.query("tasks").collect();
      const matchingTasks = tasks
        .filter(t => 
          t.title.toLowerCase().includes(searchTerm) ||
          (t.description && t.description.toLowerCase().includes(searchTerm)) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
        .map(t => ({ ...t, resultType: 'task' }))
        .slice(0, limit);
      results.push(...matchingTasks);
    }

    // Sort by relevance (exact matches first, then by updated time)
    results.sort((a, b) => {
      const aScore = scoreRelevance(a, searchTerm);
      const bScore = scoreRelevance(b, searchTerm);
      if (bScore !== aScore) return bScore - aScore;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return results.slice(0, limit);
  },
});

function scoreRelevance(item: any, term: string): number {
  let score = 0;
  const content = item.content || item.title || '';
  const title = item.title || '';
  
  // Exact match in title
  if (title.toLowerCase() === term) score += 100;
  else if (title.toLowerCase().includes(term)) score += 50;
  
  // Exact match in content
  if (content.toLowerCase().includes(term)) {
    const count = (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    score += count * 10;
  }
  
  // Tags match
  if (item.tags?.some((t: string) => t.toLowerCase().includes(term))) {
    score += 30;
  }
  
  return score;
}

// Search history (recent searches)
export const getHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In a real app, we'd track search history
    // For now, return recent activities that were searches
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq("type", "search"))
      .order("desc")
      .take(args.limit || 10);

    return activities;
  },
});

// Quick search suggestions
export const suggestions = query({
  args: {
    prefix: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const prefix = args.prefix.toLowerCase();
    const limit = args.limit || 5;
    const suggestions: string[] = [];

    // Get recent tags
    const memories = await ctx.db.query("memories").take(100);
    const tasks = await ctx.db.query("tasks").take(100);
    
    const allTags = [
      ...memories.flatMap(m => m.tags),
      ...tasks.flatMap(t => t.tags),
    ];
    
    const uniqueTags = Array.from(new Set(allTags));
    const matchingTags = uniqueTags
      .filter(tag => tag.toLowerCase().startsWith(prefix))
      .slice(0, limit);
    
    return matchingTags;
  },
});
