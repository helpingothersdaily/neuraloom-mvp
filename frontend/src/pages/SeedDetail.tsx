import { useEffect, useState } from "react";

import BranchList from "../components/BranchList";
import BranchEditor from "../components/BranchEditor";

import {
  Branch,
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../services/branches";

interface Props {
  seedId: string;
}

export default function SeedDetail({ seedId }: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!seedId) return;
    setLoading(true);
    fetchBranches(seedId)
      .then(setBranches)
      .finally(() => setLoading(false));
  }, [seedId]);

  async function handleCreate(content: string) {
    const newBranch = await createBranch({ seedId, content });
    setBranches((prev) => [...prev, newBranch]);
    setIsCreating(false);
  }

  async function handleUpdate(id: string, content: string) {
    const updated = await updateBranch(id, content);
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
    setEditingBranch(null);
  }

  async function handleDelete(id: string) {
    await deleteBranch(id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="seed-detail" style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0 }}>Branches</h2>
      </div>

      <button
        onClick={() => setIsCreating(true)}
        style={{
          padding: "0.5rem 1rem",
          background: "#4a6cf7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Create Branch
      </button>

      {isCreating && (
        <BranchEditor
          onSave={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {loading ? (
        <p>Loading branches...</p>
      ) : (
        <BranchList
          branches={branches}
          onEdit={setEditingBranch}
          onDelete={handleDelete}
        />
      )}

      {editingBranch && (
        <BranchEditor
          initialValue={editingBranch.content}
          onSave={(content) => handleUpdate(editingBranch.id, content)}
          onCancel={() => setEditingBranch(null)}
        />
      )}
    </div>
  );
}
