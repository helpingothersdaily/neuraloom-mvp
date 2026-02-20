import { loadNests, saveNests } from "../_store.js";

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
  // Get ID from URL params (Cloudflare Pages provides this via context.params)
  const nestId = context.params.id;

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (request.method === "GET") {
      const nests = loadNests();
      const nest = nests.find((n) => n.id === nestId);

      if (!nest) {
        return jsonResponse(
          { success: false, error: "Nest not found" },
          404
        );
      }

      return jsonResponse({ success: true, data: nest });
    }

    if (request.method === "PUT") {
      const nests = loadNests();
      const index = nests.findIndex((n) => n.id === nestId);

      if (index === -1) {
        return jsonResponse(
          { success: false, error: "Nest not found" },
          404
        );
      }

      const body = await request.json();
      const { title, description, category } = body;
      const updated = {
        ...nests[index],
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        updatedAt: new Date().toISOString(),
      };

      nests[index] = updated;
      saveNests(nests);

      return jsonResponse({ success: true, data: updated });
    }

    if (request.method === "DELETE") {
      const nests = loadNests();
      const index = nests.findIndex((n) => n.id === nestId);

      if (index === -1) {
        return jsonResponse(
          { success: false, error: "Nest not found" },
          404
        );
      }

      const [deleted] = nests.splice(index, 1);
      saveNests(nests);

      return jsonResponse({
        success: true,
        message: "Nest deleted",
        data: deleted,
      });
    }

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
