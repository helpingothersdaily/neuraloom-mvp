const API_BASE = "/api/branches";

export interface Branch {
  id: string;
  seedId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export async function fetchBranches(seedId: string): Promise<Branch[]> {
  const res = await fetch(`${API_BASE}?seedId=${seedId}`);
  if (!res.ok) throw new Error("Failed to load branches");
  const json = await res.json();
  return json.data || json;
}

export async function createBranch(data: { seedId: string; content: string }): Promise<Branch> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create branch");
  const json = await res.json();
  return json.data || json;
}

export async function updateBranch(id: string, content: string): Promise<Branch> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to update branch");
  const json = await res.json();
  return json.data || json;
}

export async function deleteBranch(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete branch");
}
