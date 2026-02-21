const API_BASE = "/api/branches";


export interface Branch {
  id: string;
  seedId: string;
  title?: string;
  content: string;
  nestId?: string | null;
  parentBranchId?: string | null;
  createdAt: number;
  updatedAt: number;
}

export async function fetchBranches(seedId: string): Promise<Branch[]> {
  const res = await fetch(`${API_BASE}?seedId=${seedId}`);
  if (!res.ok) throw new Error("Failed to load branches");
  const json = await res.json();
  return json.data || json;
}


export async function createBranch(data: { seedId: string; title?: string; content: string; parentBranchId?: string; nestId?: string }): Promise<Branch> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create branch");
  const json = await res.json();
  return json.data || json;
}


export async function updateBranch(id: string, title: string, content: string): Promise<Branch> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
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
