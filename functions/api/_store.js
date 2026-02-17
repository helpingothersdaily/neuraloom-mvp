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
let componentStore = [];

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

export function createBranch({ seedId, content, parentBranchId = null }) {
  const branch = {
    id: Date.now().toString(),
    seedId,
    content,
    componentId: null,
    parentBranchId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  branchStore.push(branch);
  return branch;
}

export function getBranchesByComponent(componentId) {
  return branchStore.filter((b) => b.componentId === componentId);
}

export function getSubBranches(parentBranchId) {
  return branchStore.filter((b) => b.parentBranchId === parentBranchId);
}

export function updateBranch(id, data) {
  const branch = branchStore.find((b) => b.id === id);
  if (!branch) return null;

  if (typeof data === "string") {
    // Backward compatibility: if data is a string, treat it as content
    branch.content = data;
  } else {
    branch.content = data.content ?? branch.content;
    branch.componentId = data.componentId ?? branch.componentId;
    branch.parentBranchId = data.parentBranchId ?? branch.parentBranchId;
  }
  branch.updatedAt = Date.now();
  return branch;
}

export function deleteBranch(id) {
  const index = branchStore.findIndex((b) => b.id === id);
  if (index === -1) return false;

  branchStore.splice(index, 1);
  return true;
}

// --- COMPONENTS (branch compositions) ---

export function getComponents() {
  return componentStore;
}

export function getComponent(id) {
  return componentStore.find((c) => c.id === id);
}

export function createComponent(data) {
  const component = {
    id: Date.now().toString(),
    title: data.title || "",
    description: data.description || "",
    branchIds: data.branchIds || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  componentStore.push(component);
  return component;
}

export function updateComponent(id, data) {
  const component = getComponent(id);
  if (!component) return null;

  component.title = data.title ?? component.title;
  component.description = data.description ?? component.description;
  component.branchIds = data.branchIds ?? component.branchIds;
  component.updatedAt = Date.now();

  return component;
}

export function deleteComponent(id) {
  const index = componentStore.findIndex((c) => c.id === id);
  if (index === -1) return false;
  componentStore.splice(index, 1);
  return true;
}
