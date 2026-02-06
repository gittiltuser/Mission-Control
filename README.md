# 🦀 Mission Control Dashboard

Mr. Krabs' personal dashboard for tracking AI activities, tasks, and memories.

## Features

### 1. Activity Feed
- Real-time logging of every action Mr. Krabs performs
- Token usage and cost tracking
- Expandable details with metadata
- Filter by activity type

### 2. Calendar View
- Weekly view of scheduled tasks
- Drag-and-drop task management
- Color-coded by status (To Do, In Progress, Done)
- Integration with Notion tasks

### 3. Global Search
- Search across all memories, documents, and tasks
- Filter by type
- Relevance-based sorting
- Instant results

## Tech Stack

- **Framework:** Next.js 14
- **Database:** Convex
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date:** date-fns

## Setup

### 1. Install Convex
```bash
npx convex dev
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy Convex
```bash
npx convex deploy
```

### Deploy to Vercel
```bash
vercel --prod
```

## Integration with Mr. Krabs

The dashboard syncs automatically with:
- OpenClaw activity logs
- Notion task database
- Workspace memory files
- Git commits

### Sync API

To sync activities from OpenClaw:
```typescript
import { api } from "@/convex/_generated/api";

// Log activity
await ctx.runMutation(api.activities.log, {
  type: "task_completed",
  description: "Created Notion database",
  success: true,
  metadata: { databaseId: "..." },
});
```

## Dashboard Sections

### Overview
Quick stats and recent activities at a glance.

### Activity Feed
Complete history of every interaction with timestamps.

### Calendar
Weekly view with tasks scheduled from Notion.

### Search
Global search across:
- Memories (facts, preferences, events)
- Documents (config files, skills, code)
- Tasks (Notion todos, scheduled work)

## Database Schema

See `convex/schema.ts` for complete schema definition.

Key tables:
- `activities` - Activity log
- `tasks` - Task management
- `memories` - Long-term memory
- `documents` - Files and configs
- `scheduledEvents` - Calendar events

## Customization

Edit `tailwind.config.js` to customize the color scheme.

## Monitoring

The dashboard automatically tracks:
- Token usage per interaction
- Model costs
- Success/failure rates
- Time spent on tasks

## Backup

All data is backed up to Convex's managed storage.
