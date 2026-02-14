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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      res.status(200).json({
        success: true,
        data: components,
      });
    } else if (req.method === "POST") {
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
      res.status(201).json({
        success: true,
        data: newComponent,
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
