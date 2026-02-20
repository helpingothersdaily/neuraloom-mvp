import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface Branch {
  id: string;
  seedId: string;
  title?: string;
  content: string;
  parentBranchId: string | null;
  nestId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface Seed {
  id: string;
  title: string;
}

export default function BranchListPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch all nests (seeds) first to get their branches
    fetch("/api/nests")
      .then((res) => res.json())
      .then(async (data) => {
        const seedList = data.data || data || [];
        setSeeds(seedList);

        // Fetch branches for each seed
        const allBranches: Branch[] = [];
        for (const seed of seedList) {
          const res = await fetch(`/api/branches?seedId=${seed.id}`);
          const branchData = await res.json();
          const seedBranches = branchData.data || [];
          allBranches.push(...seedBranches);
        }
        setBranches(allBranches);
      });
  }, [location.pathname]);

  const getSeedTitle = (seedId: string) => {
    const seed = seeds.find((s) => s.id === seedId);
    return seed?.title || "Unknown Seed";
  };

  return (
    <div className="branch-list-page">
      <h2>All Branches</h2>

      {branches.length === 0 && <p>No branches yet. Create a seed and add branches.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {branches.map((b) => (
          <li
            key={b.id}
            style={{
              padding: "0.75rem",
              background: "#f7f7f7",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          >
            <Link to={`/branches/${b.id}`} style={{ fontWeight: 500 }}>
              {b.title || b.content?.slice(0, 50) || "Untitled Branch"}
            </Link>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
              Seed: {getSeedTitle(b.seedId)}
              {b.parentBranchId && " • Sub-branch"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
