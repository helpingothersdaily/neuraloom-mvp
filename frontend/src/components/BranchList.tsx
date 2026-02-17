import { Branch } from "../services/branches";

interface Props {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

export default function BranchList({ branches, onEdit, onDelete }: Props) {
  if (branches.length === 0) {
    return <p style={{ color: "#666", fontStyle: "italic" }}>No branches yet. Start growing your seed.</p>;
  }

  return (
    <div className="branch-list">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="branch-item"
          style={{
            padding: "1rem",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            marginBottom: "0.75rem",
          }}
        >
          <p style={{ margin: 0, marginBottom: "0.5rem" }}>{branch.content}</p>

          <div className="actions" style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => onEdit(branch)}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.85rem",
                background: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(branch.id)}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.85rem",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#c33",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
