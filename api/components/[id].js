const { loadComponents, saveComponents } = require("../_store");

module.exports = (req, res) => {
  const components = loadComponents();

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
      saveComponents(components);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } else if (req.method === "DELETE") {
      // Check for authorization token
      const secretToken = process.env.DELETE_SECRET_TOKEN;
      const authHeader = req.headers.authorization || "";
      const providedToken = authHeader.replace("Bearer ", "");

      if (!secretToken || providedToken !== secretToken) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Invalid or missing delete token",
        });
      }

      const index = components.findIndex((c) => c.id === componentId);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Component not found",
        });
      }

      const [deleted] = components.splice(index, 1);
      saveComponents(components);

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
};

