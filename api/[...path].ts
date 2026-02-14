import { VercelRequest, VercelResponse } from "@vercel/node";

// In-memory storage (temporary - will be replaced with database)
let components: any[] = [
  {
    id: "1",
    title: "Example Component",
    description: "This is an example",
    category: "general",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join("/") : path || "";
  const [resource, id, action] = pathStr.split("/");

  try {
    // GET /api/components
    if (req.method === "GET" && resource === "components" && !id) {
      return res.status(200).json({
        success: true,
        data: components,
      });
    }

    // GET /api/components/:id
    if (req.method === "GET" && resource === "components" && id) {
      const component = components.find((c) => c.id === id);
      if (!component) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: component,
      });
    }

    // POST /api/components
    if (req.method === "POST" && resource === "components" && !id) {
      const { title, description, category } = req.body;
      if (!title) {
        return res.status(400).json({
          success: false,
          error: "Title is required",
        });
      }

      const newComponent = {
        id: Date.now().toString(),
        title,
        description: description || "",
        category: category || "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      components.push(newComponent);
      return res.status(201).json({
        success: true,
        data: newComponent,
      });
    }

    // PUT /api/components/:id
    if (req.method === "PUT" && resource === "components" && id) {
      const index = components.findIndex((c) => c.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }

      const { title, description, category } = req.body;
      const updated = {
        ...components[index],
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        updatedAt: new Date().toISOString(),
      };

      components[index] = updated;
      return res.status(200).json({
        success: true,
        data: updated,
      });
    }

    // DELETE /api/components/:id
    if (req.method === "DELETE" && resource === "components" && id) {
      const index = components.findIndex((c) => c.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }

      const [deleted] = components.splice(index, 1);
      return res.status(200).json({
        success: true,
        message: "Component deleted",
        data: deleted,
      });
    }

    // Health check
    if (resource === "health") {
      return res.status(200).json({
        status: "ok",
        message: "Serverless API is running",
      });
    }

    res.status(404).json({
      success: false,
      error: "Not found",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
