// Client-side activity logger for Mission Control

export interface ActivityPayload {
  type: string;
  description: string;
  success?: boolean;
  tokens?: number;
  model?: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

// Log activity (for now just console, later Convex)
export function logActivity(payload: ActivityPayload) {
  console.log("[Activity]", new Date().toISOString(), payload.type, payload.description);
  return true;
}

export const activityLogger = {
  webSearch: (query: string) => logActivity({ type: "web_search", description: `Searched: ${query}`, success: true }),
  webFetch: (url: string) => logActivity({ type: "web_fetch", description: `Fetched: ${url}`, success: true }),
  fileRead: (path: string) => logActivity({ type: "file_read", description: `Read: ${path}`, success: true }),
  fileWrite: (path: string) => logActivity({ type: "file_write", description: `Wrote: ${path}`, success: true }),
  fileEdit: (path: string) => logActivity({ type: "file_edit", description: `Edited: ${path}`, success: true }),
  shellExec: (cmd: string) => logActivity({ type: "shell_exec", description: `Executed: ${cmd.slice(0, 50)}`, success: true }),
  modelCall: (model: string, tokens: number, desc: string) => logActivity({ type: "model_call", description: desc, model, tokens, success: true }),
  memorySave: (key: string) => logActivity({ type: "memory_saved", description: `Saved: ${key}`, success: true }),
  messageReceived: (preview: string) => logActivity({ type: "message_received", description: `Received: ${preview.slice(0, 50)}...`, success: true }),
  messageSent: (preview: string) => logActivity({ type: "message_sent", description: `Sent: ${preview.slice(0, 50)}...`, success: true }),
  error: (err: string, ctx: string) => logActivity({ type: "error", description: `Error in ${ctx}: ${err.slice(0, 100)}`, success: false, details: err }),
};

export default activityLogger;
