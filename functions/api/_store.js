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
let branchStore = [];

export function loadComponents() {
  return store;
}

export function saveComponents(components) {
  store = components;
}

// --- BRANCHES ---

export function getBranchesBySeed(seedId) {
  return branchStore.filter((b) => b.seedId === seedId);
}

export function getBranch(id) {
  return branchStore.find((b) => b.id === id);
}

export function createBranch({ seedId, content }) {
  const branch = {
    id: Date.now().toString(),
    seedId,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  branchStore.push(branch);
  return branch;
}

export function updateBranch(id, content) {
  const branch = branchStore.find((b) => b.id === id);
  if (!branch) return null;

  branch.content = content;
  branch.updatedAt = Date.now();
  return branch;
}

export function deleteBranch(id) {
  const index = branchStore.findIndex((b) => b.id === id);
  if (index === -1) return false;

  branchStore.splice(index, 1);
  return true;
}
