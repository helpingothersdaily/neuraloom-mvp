interface SimpleEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function SimpleEditor({
  value,
  onChange,
  placeholder = "Write here...",
  minHeight = "100px",
}: SimpleEditorProps) {
  return (
    <div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>Editor</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.65rem",
          minHeight,
          fontSize: "0.9rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fff",
          color: "#222",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <div style={{ marginTop: "0.75rem" }}>
        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>Preview</div>
        <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "0.75rem", background: "#fff" }}>
          {value.trim() ? (
            <div style={{ margin: 0, whiteSpace: "pre-wrap" }}>{value}</div>
          ) : (
            <span style={{ color: "#888" }}>Nothing to preview yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
