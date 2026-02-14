export default function handler(req, res) {
  // In-memory storage
  let components = [
    {
      id: "1",
      title: "Example Component",
      description: "This is an example component",
      category: "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  const componentId = Array.isArray(id) ? id[0] : id;

  try {
    if (req.method === "GET") {
      const component = components.find((c) => c.id === componentId);

      if (!component) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }

      res.status(200).json({
        success: true,
        data: component,
      });
    } else if (req.method === "PUT") {
      const index = components.findIndex((c) => c.id === componentId);

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

      res.status(200).json({
        success: true,
        data: updated,
      });
    } else if (req.method === "DELETE") {
      const index = components.findIndex((c) => c.id === componentId);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }

      const [deleted] = components.splice(index, 1);

      res.status(200).json({
        success: true,
        message: "Component deleted",
        data: deleted,
      });
    } else {
      res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
