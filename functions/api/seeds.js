import { loadComponents, saveComponents } from "./_store.js";

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
      const components = loadComponents();
      return jsonResponse({ success: true, data: components });
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

      const components = loadComponents();
      const newComponent = {
        id: Date.now().toString(),
        title,
        description: description || "",
        category: category || "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      components.push(newComponent);
      saveComponents(components);

      return jsonResponse({ success: true, data: newComponent }, 201);
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
