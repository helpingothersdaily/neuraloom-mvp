// In-memory data store for Cloudflare Workers
// For production, upgrade to Cloudflare KV (https://developers.cloudflare.com/kv/)

const DEFAULT_NESTS = [
  {
    id: "1",
    title: "Example Nest",
    description: "This is an example nest",
    category: "general",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let store = [...DEFAULT_NESTS];
let branchStore = [];
let nestStore = [];

export function loadNests() {
  return store;
}

export function saveNests(nests) {
  store = nests;
}

// --- BRANCHES ---

export function getBranchesBySeed(seedId) {
  return branchStore.filter((b) => b.seedId === seedId);
}

export function getBranch(id) {
  return branchStore.find((b) => b.id === id);
}

export function createBranch({ seedId, content, parentBranchId = null, title = null, nestId = null }) {
  const branch = {
    id: Date.now().toString(),
    seedId,
    title: title || null,
    content: content || "",
    nestId,
    parentBranchId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  branchStore.push(branch);
  return branch;
}

export function getBranchesByNest(nestId) {
  return branchStore.filter((b) => b.nestId === nestId);
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
    branch.nestId = data.nestId ?? branch.nestId;
    branch.parentBranchId = data.parentBranchId ?? branch.parentBranchId;
  }
  branch.updatedAt = Date.now();
  return branch;
}

export function connectBranchToNest(branchId, nestId) {
  const branch = getBranch(branchId);
  if (!branch) return null;
  branch.nestId = nestId;
  branch.updatedAt = Date.now();
  return branch;
}

export function deleteBranch(id) {
  const index = branchStore.findIndex((b) => b.id === id);
  if (index === -1) return false;

  branchStore.splice(index, 1);
  return true;
}

// --- NESTS (branch compositions) ---

export function getAllNests() {
  return nestStore;
}

export function getNestById(id) {
  return nestStore.find((n) => n.id === id);
}

export function createNest(data) {
  const nest = {
    id: Date.now().toString(),
    title: data.title || "",
    description: data.description || "",
    branchIds: data.branchIds || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  nestStore.push(nest);
  return nest;
}

export function updateNest(id, data) {
  const nest = getNestById(id);
  if (!nest) return null;

  nest.title = data.title ?? nest.title;
  nest.description = data.description ?? nest.description;
  nest.branchIds = data.branchIds ?? nest.branchIds;
  nest.updatedAt = Date.now();

  return nest;
}

export function deleteNest(id) {
  const index = nestStore.findIndex((n) => n.id === id);
  if (index === -1) return false;
  nestStore.splice(index, 1);
  return true;
}

