import { useState } from "react";

type Seed = {
  id: string;
  text: string;
  createdAt: string;
};

export default function App() {
  console.log("APP RENDERED — CLEAN BASE");

  const [seedInput, setSeedInput] = useState("");
  const [seeds, setSeeds] = useState<Seed[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = seedInput.trim();
    if (!trimmed) return;

    const newSeed: Seed = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: new Date().toLocaleString(),
    };

    console.log("NEW SEED:", newSeed);

    // Add newest seed to the top
    setSeeds((prev) => [newSeed, ...prev]);
    setSeedInput("");
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1>Hello, Neuraloom 👋</h1>
      <p>Your mind map starts here.</p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <input
          type="text"
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          placeholder="Capture a thought..."
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Seed
        </button>
      </form>

      {/* Seed List */}
      <div style={{ marginTop: "2rem" }}>
        {seeds.map((seed) => (
          <div
            key={seed.id}
            style={{
              background: "#f7f7f7",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #e0e0e0",
            }}
          >
            <div style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              {seed.text}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#666",
