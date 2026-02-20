import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Nest {
  id: string;
  title: string;
  description: string;
  branchIds: string[];
  createdAt: number;
  updatedAt: number;
}

export default function NestsList() {
  const [nests, setNests] = useState<Nest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/nests")
      .then((res) => res.json())
      .then((data) => setNests(data.data || []));
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/nests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Nest", description: "" }),
    });
    const result = await res.json();
    const newNest = result.data || result;
    navigate(`/nests/${newNest.id}`);
  };

  return (
    <div className="nest-list">
      <h2>Nest Habitat</h2>

      <button
        onClick={handleCreate}
        style={{
          padding: "0.5rem 1rem",
          background: "#4a6cf7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Build a Nest
      </button>

      {nests.length === 0 && <p>No nests yet</p>}

      <ul>
        {nests.map((c) => (
          <li key={c.id}>
            <Link to={`/nests/${c.id}`}>
              {c.title || "Untitled Nest"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
