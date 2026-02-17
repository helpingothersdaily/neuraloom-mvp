import { getBranch, updateBranch, deleteBranch } from "../_store.js";

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
  const branchId = context.params.id;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // GET /api/branches/:id
    if (request.method === "GET") {
      const branch = getBranch(branchId);

      if (!branch) {
        return jsonResponse({ success: false, error: "Branch not found" }, 404);
      }

      return jsonResponse({ success: true, data: branch });
    }

    // PUT /api/branches/:id
    if (request.method === "PUT") {
      const body = await request.json();
      const { content } = body;

      if (!content) {
        return jsonResponse({ success: false, error: "content required" }, 400);
      }

      const updated = updateBranch(branchId, content);

      if (!updated) {
        return jsonResponse({ success: false, error: "Branch not found" }, 404);
      }

      return jsonResponse({ success: true, data: updated });
    }

    // DELETE /api/branches/:id
    if (request.method === "DELETE") {
      const success = deleteBranch(branchId);

      if (!success) {
        return jsonResponse({ success: false, error: "Branch not found" }, 404);
      }

      return jsonResponse({ success: true, message: "Branch deleted" });
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
