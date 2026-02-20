import { useState } from "react";
import SimpleEditor from "../components/SimpleEditor";

interface Props {
  initialValue?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export default function BranchEditor({ initialValue = "", onSave, onCancel }: Props) {
  const [content, setContent] = useState(initialValue);

  return (
    <div className="branch-editor" style={{ marginTop: "1rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <SimpleEditor
        value={content}
        onChange={setContent}
        id="branch-content"
        name="branchContent"
        placeholder="Write your branch..."
        minHeight="100px"
      />

      <div className="actions" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => onSave(content)}
          style={{
            padding: "0.5rem 1rem",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "0.5rem 1rem",
            background: "#e0e0e0",
            color: "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
