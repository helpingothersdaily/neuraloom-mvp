
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
          title={title}
          description={content}
          setTitle={setTitle}
          setDescription={setContent}
          onSave={() => onSave(title, content)}
          onCancel={onCancel}
          placeholder="Write your branch..."
          minHeight="80px"
          id="branch-content"
          name="branchContent"
        />
  );
}
