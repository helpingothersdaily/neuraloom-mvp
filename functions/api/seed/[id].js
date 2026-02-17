import { loadComponents, saveComponents } from "../_store.js";

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

export default async (request, context) => {
  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

    // Extract ID from URL path: /api/seed/:id
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const componentId = pathParts[pathParts.length - 1];

    try {
      if (request.method === "GET") {
        const components = loadComponents();
        const component = components.find((c) => c.id === componentId);

        if (!component) {
          return jsonResponse(
            { success: false, error: "Component not found" },
            404
          );
        }

        return jsonResponse({ success: true, data: component });
      }

      if (request.method === "PUT") {
        const components = loadComponents();
        const index = components.findIndex((c) => c.id === componentId);

        if (index === -1) {
          return jsonResponse(
            { success: false, error: "Component not found" },
            404
          );
        }

        const body = await request.json();
        const { title, description, category } = body;
        const updated = {
          ...components[index],
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(category !== undefined && { category }),
          updatedAt: new Date().toISOString(),
        };

        components[index] = updated;
        saveComponents(components);

        return jsonResponse({ success: true, data: updated });
      }

      if (request.method === "DELETE") {
        const components = loadComponents();
        const index = components.findIndex((c) => c.id === componentId);

        if (index === -1) {
          return jsonResponse(
            { success: false, error: "Component not found" },
            404
          );
        }

        const [deleted] = components.splice(index, 1);
        saveComponents(components);

        return jsonResponse({
          success: true,
          message: "Component deleted",
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
};
