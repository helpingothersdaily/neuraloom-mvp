import { CSSProperties, useRef } from "react";

interface SimpleEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  minHeight?: string;
  id?: string;
  name?: string;
}

export default function SimpleEditor({
  value,
  onChange,
  placeholder = "Write here...",
  minHeight = "100px",
  id = "simple-editor",
  name = "simpleEditor",
}: SimpleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateValue = (nextValue: string, selectionStart?: number, selectionEnd?: number) => {
    onChange(nextValue);

    if (selectionStart === undefined || selectionEnd === undefined) return;

    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const withSelection = (transform: (selectedText: string, start: number, end: number, fullText: string) => {
    nextValue: string;
    nextStart: number;
    nextEnd: number;
  }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);

    const result = transform(selectedText, start, end, value);
    updateValue(result.nextValue, result.nextStart, result.nextEnd);
  };

  const wrapSelection = (prefix: string, suffix = prefix, fallback = "text") => {
    withSelection((selectedText, start, end, fullText) => {
      const target = selectedText || fallback;
      const replacement = `${prefix}${target}${suffix}`;
      const nextValue = `${fullText.slice(0, start)}${replacement}${fullText.slice(end)}`;
      const nextStart = start + prefix.length;
      const nextEnd = nextStart + target.length;

      return { nextValue, nextStart, nextEnd };
    });
  };

  const prefixLines = (prefix: string) => {
    withSelection((_selectedText, start, end, fullText) => {
      const blockStart = fullText.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const blockEndCandidate = fullText.indexOf("\n", end);
      const blockEnd = blockEndCandidate === -1 ? fullText.length : blockEndCandidate;

      const block = fullText.slice(blockStart, blockEnd);
      const prefixed = block
        .split("\n")
        .map((line) => (line.trim() ? `${prefix}${line}` : line))
        .join("\n");

      const nextValue = `${fullText.slice(0, blockStart)}${prefixed}${fullText.slice(blockEnd)}`;
      return {
        nextValue,
        nextStart: blockStart,
        nextEnd: blockStart + prefixed.length,
      };
    });
  };

  const insertLink = () => {
    withSelection((selectedText, start, end, fullText) => {
      const target = selectedText || "link text";
      const replacement = `[${target}](https://example.com)`;
      const nextValue = `${fullText.slice(0, start)}${replacement}${fullText.slice(end)}`;
      const nextStart = start + 1;
      const nextEnd = nextStart + target.length;

      return { nextValue, nextStart, nextEnd };
    });
  };

  return (
    <div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>Editor</div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => wrapSelection("**")} style={toolbarButtonStyle}>
          Bold
        </button>
        <button type="button" onClick={() => wrapSelection("*")} style={toolbarButtonStyle}>
          Italic
        </button>
        <button type="button" onClick={() => prefixLines("## ")} style={toolbarButtonStyle}>
          Heading
        </button>
        <button type="button" onClick={() => prefixLines("- ")} style={toolbarButtonStyle}>
          List
        </button>
        <button type="button" onClick={insertLink} style={toolbarButtonStyle}>
          Link
        </button>
      </div>
      <textarea
        id={id}
        name={name}
        ref={textareaRef}
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
    </div>
  );
}

const toolbarButtonStyle: CSSProperties = {
  padding: "0.35rem 0.65rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "#f5f5f5",
  cursor: "pointer",
  fontSize: "0.85rem",
};
