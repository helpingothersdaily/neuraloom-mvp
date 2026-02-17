import { getBranchesBySeed, createBranch } from "../_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

export async function onRequest(context) {
  const request = context.request;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // GET /api/branches?seedId=xxx
    if (request.method === "GET") {
      const url = new URL(request.url);
      const seedId = url.searchParams.get("seedId");

      if (!seedId) {
        return jsonResponse({ success: false, error: "seedId is required" }, 400);
      }

      const branches = getBranchesBySeed(seedId);
      return jsonResponse({ success: true, data: branches });
    }

    // POST /api/branches
    if (request.method === "POST") {
      const body = await request.json();
      const { seedId, content } = body;

      if (!seedId || !content) {
        return jsonResponse({ success: false, error: "seedId and content required" }, 400);
      }

      const branch = createBranch({ seedId, content });
      return jsonResponse({ success: true, data: branch }, 201);
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
