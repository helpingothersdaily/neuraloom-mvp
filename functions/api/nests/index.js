import { getAllNests, createNest } from "../_store.js";

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
    // GET /api/nests
    if (request.method === "GET") {
      const nests = getAllNests();
      return jsonResponse({ success: true, data: nests });
    }

    // POST /api/nests
    if (request.method === "POST") {
      const body = await request.json();
      const { title, description, branchIds } = body;

      if (!title) {
        return jsonResponse({ success: false, error: "title is required" }, 400);
      }

      const nest = createNest({ title, description, branchIds });
      return jsonResponse({ success: true, data: nest }, 201);
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
