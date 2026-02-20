import { loadNests, saveNests } from "./_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
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
    // GET /api/seeds
    if (request.method === "GET") {
      const nests = loadNests();
      return jsonResponse({ success: true, data: nests });
    }

    // POST /api/seeds
    if (request.method === "POST") {
      const body = await request.json();
      const { title, description, category } = body;

      if (!title) {
        return jsonResponse(
          { success: false, error: "Title is required" },
          400
        );
      }

      const nests = loadNests();
      const newNest = {
        id: Date.now().toString(),
        title,
        description: description || "",
        category: category || "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      nests.push(newNest);
      saveNests(nests);

      return jsonResponse({ success: true, data: newNest }, 201);
    }

    // Unsupported method
    return jsonResponse(
      { success: false, error: "Method not allowed" },
      405
    );
  } catch (error) {
    return jsonResponse(
      { success: false, error: error.message || "Internal server error" },
      500
    );
  }
}
