import { getNestById, updateNest, deleteNest } from "../_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PATCH,PUT,DELETE,OPTIONS",
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
  const nestId = context.params.id;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // GET /api/nests/:id
    if (request.method === "GET") {
      const nest = getNestById(nestId);

      if (!nest) {
        return jsonResponse({ success: false, error: "Nest not found" }, 404);
      }

      return jsonResponse({ success: true, data: nest });
    }

    // PATCH /api/nests/:id
    if (request.method === "PATCH" || request.method === "PUT") {
      const body = await request.json();
      const { title, description, branchIds } = body;

      const updated = updateNest(nestId, { title, description, branchIds });

      if (!updated) {
        return jsonResponse({ success: false, error: "Nest not found" }, 404);
      }

      return jsonResponse({ success: true, data: updated });
    }

    // DELETE /api/nests/:id
    if (request.method === "DELETE") {
      const success = deleteNest(nestId);

      if (!success) {
        return jsonResponse({ success: false, error: "Nest not found" }, 404);
      }

      return jsonResponse({ success: true, message: "Nest deleted" });
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
