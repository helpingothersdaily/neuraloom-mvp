import React, { useState, useRef, useEffect } from "react";

interface MenuOption {
  label: string;
  onClick: () => void;
}

interface HamburgerMenuProps {
  options: MenuOption[];
  size?: number;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options, size = 22 }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
      <button
        aria-label="Open menu"
        onClick={e => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: size + 4,
            minWidth: 120,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 10,
            padding: "0.25rem 0",
          }}
        >
          {options.map((opt, i) => (
            <button
              key={opt.label}
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                opt.onClick();
              }}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "0.5rem 1rem",
                fontSize: "0.97rem",
                color: "#333",
                cursor: "pointer",
                outline: "none",
                borderBottom: i !== options.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
