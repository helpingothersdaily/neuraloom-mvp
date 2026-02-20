console.log(">>> USING SEED DETAIL WITH BRANCHING");
import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Nest, nestApi } from "./api";
import { nestService } from "./services/nest.service";
import SeedDetail from "./pages/SeedDetail";
import BranchDetail from "./pages/BranchDetail";
import BranchListPage from "./pages/BranchListPage";
import NestsList from "./nests/NestsList";
import NestDetail from "./nests/NestDetail";
import "./App.css";

export default function App() {
  console.log("✓ App mounted");
  const [title, setTitle] = useState("");
  const [seeds, setSeeds] = useState<Nest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newSeedId, setNewSeedId] = useState<string | null>(null);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const seedRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch all nests on mount
  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const nests = await nestService.getAllNests();
      setSeeds(nests);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load nests";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmed = title.trim();
  if (!trimmed) return;

  try {
    setError(null);
    const newSeed = await nestService.createNest(trimmed);

    setSeeds((prev) => [newSeed, ...prev]);
    setNewSeedId(newSeed.id); // Set immediately so card starts with pulse class
    setTitle("");

    // Remove class after animation completes
    setTimeout(() => setNewSeedId(null), 300);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create nest";
    setError(message);
  }
};

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      setDeletingId(id); // start fade-out
      await nestApi.deleteNest(id);
      // allow CSS fade-out to complete before removing from DOM
      setTimeout(() => {
        setSeeds((prev) => prev.filter((seed) => seed.id !== id));
        setDeletingId(null);
      }, 300);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete nest";
      setError(message);
      setDeletingId(null); // revert if failed
    }
  };

  const openSeed = (seed: Nest) => {
    setSelectedSeedId(seed.id);
    setEditTitle(seed.title);
    setEditDescription(seed.description || "");
  };

  const closeSeed = () => {
    setSelectedSeedId(null);
  };

  const saveSeed = async (id: string) => {
    try {
      const updated = await nestApi.updateNest(id, {
        title: editTitle,
        description: editDescription,
      });

      setSeeds((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );

      closeSeed();
      setNewSeedId(id); // reuse pulse logic for settle
      setTimeout(() => setNewSeedId(null), 200);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <nav style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/">Seeds</Link>
        <Link to="/branches">Branches</Link>
        <Link to="/nests">Nest Habitat</Link>
      </nav>

      <Routes>
        <Route path="/branches" element={<BranchListPage />} />
        <Route path="/branches/:id" element={<BranchDetail />} />
        <Route path="/nests" element={<NestsList />} />
        <Route path="/nests/:id" element={<NestDetail />} />
        <Route path="/" element={
          <>
            <h1> Welcome to Neuraloom 👋</h1>
            <p>Where your thoughts keep their shape.</p>

      {error && (
        <div style={{ padding: "1rem", marginTop: "1rem", background: "#fee", border: "1px solid #f99", borderRadius: "8px", color: "#c33", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Capture a thought..."
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "text",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Adding..." : "Add Seed"}
        </button>
      </form>

      {loading && seeds.length === 0 && (
        <div style={{ marginTop: "2rem", textAlign: "center", color: "#666" }}>
          Loading seeds...
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
  <div className="seed-list">
    {seeds.length === 0 && !loading && (
      <div className="empty-state">
  No seeds yet. Create your first one!
</div>

    )}

    {seeds.map((seed) => (
      <div key={seed.id}>
        <div
          onClick={() => openSeed(seed)}
          ref={(el) => { seedRefs.current[seed.id] = el; }}
          className={`seed-card 
            ${newSeedId === seed.id ? "pulse" : "ready"} 
            ${deletingId === seed.id ? "deleting" : ""}
          `}
          style={{
            background: "#f7f7f7",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            cursor: "pointer",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: 500 }}>
              {seed.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              {new Date(seed.createdAt).toLocaleString()}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(seed.id);
            }}
            disabled={loading}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              cursor: loading ? "not-allowed" : "pointer",
              color: "#666",
              marginLeft: "1rem",
              whiteSpace: "nowrap",
            }}
          >
            Delete
          </button>
        </div>

        {selectedSeedId === seed.id && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "1rem",
              }}
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                minHeight: "80px",
                fontSize: "0.9rem",
              }}
            />

            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => saveSeed(seed.id)}
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
                onClick={closeSeed}
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

            {/* Branches Section */}
            <SeedDetail seedId={seed.id} />
          </div>
        )}
      </div>
    ))}
  </div>
</div>
          </>
        } />
      </Routes>
    </div>
  );
}
