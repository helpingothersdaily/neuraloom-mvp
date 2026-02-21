
import { useState } from "react";
import WysiwygEditor from "../components/WysiwygEditor";

interface Props {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function BranchEditor({ initialTitle = "", initialContent = "", onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div
      className="branch-editor"
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        marginTop: "0.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      }}
    >
      <input
        id="branch-title"
        name="branchTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Branch title..."
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          fontSize: "1rem",
        }}
      />

      <WysiwygEditor
        value={content}
        onChange={setContent}
        id="branch-content"
        name="branchContent"
        placeholder="Write your branch..."
        minHeight="80px"
      />

      <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => onSave(title, content)}
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
            background: "#eee",
            border: "1px solid #ccc",
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
