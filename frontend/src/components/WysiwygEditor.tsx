
import { CSSProperties, useEffect, useRef, useState } from "react";

interface WysiwygEditorProps {
  title: string;
  description: string;
  setTitle: (next: string) => void;
  setDescription: (next: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  minHeight?: string;
  id?: string;
  name?: string;
}

const toolbarButtonStyle: CSSProperties = {
  padding: "0.35rem 0.65rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "#f5f5f5",
  cursor: "pointer",
// Removed destructuring block above function signature
  fontSize: "0.85rem",
};

  title,
  description,
  setTitle,
  setDescription,
  onSave,
  onCancel,
  placeholder = "Write here...",
  minHeight = "100px",
  id = "wysiwyg-editor",
  name = "wysiwygEditor",
}: WysiwygEditorProps) {
export default function WysiwygEditor(props: WysiwygEditorProps) {
  const {
    title,
    description,
    setTitle,
    setDescription,
    onSave,
    onCancel,
    placeholder = "Write here...",
    minHeight = "100px",
    id = "wysiwyg-editor",
    name = "wysiwygEditor",
  } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Set initial content only once on mount
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || initializedRef.current) return;
    editor.innerHTML = description || "";
    initializedRef.current = true;
    setIsEmpty(!description || description.replace(/<[^>]*>/g, "").trim().length === 0);
  }, []);

  // Sync external description changes (e.g., reset)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !initializedRef.current) return;
    if (description === "" && editor.innerHTML !== "") {
      editor.innerHTML = "";
      setIsEmpty(true);
    }
  }, [description]);

  const applyCommand = (command: string, commandValue?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, commandValue);
    setDescription(editor.innerHTML);
  };

  const insertLink = () => {
    const url = window.prompt("Enter a URL", "https://");
    if (!url) return;
    applyCommand("createLink", url);
  };

  const handleInput = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = editor.innerHTML;
    setIsEmpty(!html || html.replace(/<[^>]*>/g, "").trim().length === 0);
    setDescription(html);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    document.execCommand("insertLineBreak");
    handleInput();
  };

  return (
    <div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>Edit Seed</div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Seed title"
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "0.5rem",
        }}
      />
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => applyCommand("bold")} style={toolbarButtonStyle}>
          Bold
        </button>
        <button type="button" onClick={() => applyCommand("italic")} style={toolbarButtonStyle}>
          Italic
        </button>
        <button type="button" onClick={() => applyCommand("underline")} style={toolbarButtonStyle}>
          Underline
        </button>
        <button type="button" onClick={() => applyCommand("formatBlock", "h2")} style={toolbarButtonStyle}>
          Heading
        </button>
        <button type="button" onClick={() => applyCommand("insertUnorderedList")} style={toolbarButtonStyle}>
          List
        </button>
        <button type="button" onClick={insertLink} style={toolbarButtonStyle}>
          Link
        </button>
      </div>

      <div
        id={id}
        data-name={name}
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: "0.65rem",
          minHeight,
          fontSize: "0.9rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fff",
          color: "#222",
          boxSizing: "border-box",
          outline: "none",
          overflowY: "auto",
        }}
      />
      {isEmpty && (
        <div style={{ marginTop: "0.35rem", color: "#888", fontSize: "0.85rem" }}>
          {placeholder}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button type="button" onClick={onSave} style={{ ...toolbarButtonStyle, background: "#4a6cf7", color: "white" }}>
          Save
        </button>
        <button type="button" onClick={onCancel} style={{ ...toolbarButtonStyle, background: "#eee", color: "#333" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
