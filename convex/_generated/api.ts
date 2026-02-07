// Generated convex/api.ts - production build
export const api = {
  activities: {
    getRecent: "activities/getRecent" as const,
    getStats: "activities/getStats" as const,
  },
  tasks: {
    getAll: "tasks/getAll" as const,
    getForWeek: "tasks/getForWeek" as const,
    create: "tasks/create" as const,
  },
  memories: {
    search: "memories/search" as const,
    recent: "memories/recent" as const,
  },
  documents: {
    search: "documents/search" as const,
  },
  search: {
    global: "search/global" as const,
    suggestions: "search/suggestions" as const,
    getHistory: "search/getHistory" as const,
  },
  sync: {
    fromNotion: "sync/fromNotion" as const,
  },
};

export const internal = {};
