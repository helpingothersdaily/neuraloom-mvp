
import { Link } from "react-router-dom";
import BranchHamburgerMenu from "./BranchHamburgerMenu";
import { Branch } from "../services/branches";

function renderBranchContent(content: string): { __html: string } {
  // Unescape HTML entities
  const doc = document.createElement("textarea");
  doc.innerHTML = content;
  const unescaped = doc.value;
  // If it looks like HTML, render as HTML; otherwise, treat as plain text
  if (/[<>]/.test(unescaped)) {
    return { __html: unescaped };
  } else {
    // Convert newlines to <br> for plain text
    return { __html: unescaped.replace(/\n/g, '<br>') };
  }
}

interface Props {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
  onView?: (branch: Branch) => void;
  renderBranchDetail?: (branch: Branch) => React.ReactNode;
}

export default function BranchList({ branches, onEdit, onDelete, onView, renderBranchDetail }: Props) {
  if (branches.length === 0) {
    return <p style={{ color: "#666", fontStyle: "italic" }}>No branches yet. Start growing your seed.</p>;
  }

  return (
    <div className="branch-list">
      {branches.filter(branch => !branch.parentBranchId).map((branch) => (
        <div
          key={branch.id}
          className="branch-item"
          style={{
            padding: "1rem",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => onView ? onView(branch) : window.location.assign(`/branches/${branch.id}`)}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              {branch.title || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Untitled Branch</span>}
            </div>
            {branch.content?.trim() && (
              <div
                style={{ fontSize: "0.97rem", color: "#444", marginBottom: "0.5rem", maxHeight: "6rem", overflowY: "auto" }}
                dangerouslySetInnerHTML={renderBranchContent(branch.content)}
              />
            )}
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              {branch.createdAt ? new Date(branch.createdAt).toLocaleString() : ''}
            </div>
            {/* Only render branch detail if not a sub-branch */}
            {renderBranchDetail && renderBranchDetail(branch)}
          </div>
          <div
            style={{ marginLeft: "0.5rem" }}
            onClick={e => e.stopPropagation()}
          >
            <BranchHamburgerMenu
              options={[
                {
                  label: "View",
                  onClick: () => onView ? onView(branch) : window.location.assign(`/branches/${branch.id}`),
                },
                {
                  label: "Edit",
                  onClick: () => onEdit(branch),
                },
                {
                  label: "Delete",
                  onClick: () => onDelete(branch.id),
                },
              ]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
