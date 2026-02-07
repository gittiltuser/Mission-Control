import { httpRouter } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
const http = httpRouter();

// Endpoint for logging activities from external sources
http.route({
  path: "/log-activity",
  method: "POST",
  handler: async (ctx, request) => {
    const body = await request.json();
    
    await ctx.runMutation(internal.activities.log, {
      type: body.type || "unknown",
      description: body.description || "",
      success: body.success ?? true,
      tokens: body.tokens,
      model: body.model,
      details: body.details,
      metadata: body.metadata || {},
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});

// Health check
http.route({
  path: "/health",
  method: "GET",
  handler: async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});

export default http;
