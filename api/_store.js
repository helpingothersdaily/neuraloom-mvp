const fs = require("fs");
const os = require("os");
const path = require("path");

const STORE_PATH = path.join(os.tmpdir(), "neuraloom-components.json");
const DEFAULT_COMPONENTS = [
  {
    id: "1",
    title: "Example Component",
    description: "This is an example component",
    category: "general",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadComponents() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return [...DEFAULT_COMPONENTS];
    }

    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_COMPONENTS];
  } catch (error) {
    console.error("Failed to load components store:", error);
    return [...DEFAULT_COMPONENTS];
  }
}

function saveComponents(components) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(components, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save components store:", error);
  }
}

module.exports = { loadComponents, saveComponents };
