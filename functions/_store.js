// In-memory data store for Cloudflare Workers
// For production, upgrade to Cloudflare KV (https://developers.cloudflare.com/kv/)

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

let store = [...DEFAULT_COMPONENTS];

export function loadComponents() {
  return store;
}

export function saveComponents(components) {
  store = components;
}
