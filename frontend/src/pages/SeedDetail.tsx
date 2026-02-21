import { useEffect, useState } from "react";

import BranchList from "../nests/BranchList";
import BranchEditor from "../nests/BranchEditor";

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
  const [openBranchId, setOpenBranchId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!seedId) return;
    setLoading(true);
    fetchBranches(seedId)
      .then(setBranches)
      .finally(() => setLoading(false));
  }, [seedId]);


  async function handleCreate(title: string, content: string) {
    const newBranch = await createBranch({ seedId, title: title || "", content });
    setBranches((prev) => [...prev, newBranch]);
    // Only close seed editor if not creating a sub-branch
    if (isCreating) setIsCreating(false);
  }

  async function handleUpdate(id: string, title: string, content: string) {
    const updated = await updateBranch(id, title, content);
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
    setEditingBranchId(null);
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
          onEdit={(branch) => {
            setEditingBranchId(branch.id);
            setOpenBranchId(branch.id);
          }}
          onDelete={handleDelete}
          onView={(branch) => {
            if (openBranchId === branch.id && editingBranchId == null) {
              setOpenBranchId(null);
            } else {
              setOpenBranchId(branch.id);
              setEditingBranchId(null);
            }
          }}
          renderBranchDetail={(branch) => (
            openBranchId === branch.id ? (
              editingBranchId === branch.id ? (
                <BranchEditor
                  initialTitle={branch.title || ""}
                  initialContent={branch.content}
                  onSave={(title, content) => handleUpdate(branch.id, title, content)}
                  onCancel={() => setEditingBranchId(null)}
                />
              ) : (
                <>
                  {/* Sub-branches heading and Add Sub-branch button only for saved branches */}
                  {branch.id && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0", color: "#333" }}>
                          Sub-branches
                        </h3>
                        <button
                          style={{
                            marginLeft: "auto",
                            padding: "0.5rem 1rem",
                            background: "#4a6cf7",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditingBranchId("new-sub-branch-" + branch.id);
                          }}
                        >
                          Add Sub-branch
                        </button>
                      </div>
                      {/* Render only sub-branch cards for this branch */}
                      <div style={{ marginTop: "1rem" }}>
                        {/* New Sub-branch editor */}
                        {editingBranchId === "new-sub-branch-" + branch.id && (
                          <BranchEditor
                            initialTitle=""
                            initialContent=""
                            onSave={async (title, content) => {
                              // Create sub-branch with parentBranchId
                              const newSubBranch = await createBranch({ seedId, title, content, parentBranchId: branch.id });
                              setBranches((prev) => [...prev, newSubBranch]);
                              setEditingBranchId(null);
                            }}
                            onCancel={() => setEditingBranchId(null)}
                          />
                        )}
                        {branches.filter(sb => sb.parentBranchId === branch.id).map(sb => (
                          editingBranchId === sb.id ? (
                            <BranchEditor
                              initialTitle={sb.title || ""}
                              initialContent={sb.content}
                              onSave={(title, content) => handleUpdate(sb.id, title, content)}
                              onCancel={() => setEditingBranchId(null)}
                            />
                          ) : (
                            <div
                              key={sb.id}
                              className="sub-branch-card"
                              style={{
                                background: "#f7f7f7",
                                padding: "1rem",
                                borderRadius: "8px",
                                marginBottom: "1rem",
                                border: "1px solid #e0e0e0",
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              <div style={{ fontSize: "1.1rem", fontWeight: 500, marginBottom: "0.5rem" }}>{sb.title || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Untitled Sub-branch</span>}</div>
                              {sb.content?.trim() && (
                                <div
                                  style={{ fontSize: "0.97rem", color: "#444", marginBottom: "0.5rem", maxHeight: "6rem", overflowY: "auto" }}
                                  dangerouslySetInnerHTML={{ __html: sb.content }}
                                />
                              )}
                              <div style={{ fontSize: "0.8rem", color: "#999" }}>
                                {sb.createdAt ? new Date(sb.createdAt).toLocaleString() : ''}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            ) : null
          )}
        />
      )}
      {!loading && branches.length > 0 && !branches.some((b) => b.nestId) && (
        <p style={{ color: "#666", fontStyle: "italic", marginTop: "0.75rem" }}>
          This seed has no nests connected yet
        </p>
      )}
    </div>
  );
}
