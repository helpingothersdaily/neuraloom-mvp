import { getComponent, updateComponent, deleteComponent } from "../_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
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
  const componentId = context.params.id;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // GET /api/components/:id
    if (request.method === "GET") {
      const component = getComponent(componentId);

      if (!component) {
        return jsonResponse({ success: false, error: "Component not found" }, 404);
      }

      return jsonResponse({ success: true, data: component });
    }

    // PUT /api/components/:id
    if (request.method === "PUT") {
      const body = await request.json();
      const { title, description, branchIds } = body;

      const updated = updateComponent(componentId, { title, description, branchIds });

      if (!updated) {
        return jsonResponse({ success: false, error: "Component not found" }, 404);
      }

      return jsonResponse({ success: true, data: updated });
    }

    // DELETE /api/components/:id
    if (request.method === "DELETE") {
      const success = deleteComponent(componentId);

      if (!success) {
        return jsonResponse({ success: false, error: "Component not found" }, 404);
      }

      return jsonResponse({ success: true, message: "Component deleted" });
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
