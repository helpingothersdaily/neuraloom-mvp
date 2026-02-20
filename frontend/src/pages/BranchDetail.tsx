import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BranchNotFound from "../nests/BranchNotFound";
import Tree, { TreeNode } from "../nests/Tree";

interface BranchData {
  id: string;
  seedId: string;
  content: string;
  title?: string;
  nestId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface NestData {
  id: string;
  title: string;
}

export default function BranchDetail() {
  const { id: branchId } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState<BranchData | null>(null);
  const [nests, setNests] = useState<NestData[]>([]);
  const [subBranches, setSubBranches] = useState<BranchData[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/branches/${branchId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setBranch(data.data || data);
      });
  }, [branchId]);

  useEffect(() => {
    fetch("/api/nests")
      .then((res) => res.json())
      .then((data) => setNests(data.data || []));
  }, []);

  useEffect(() => {
    if (branch) {
      fetch(`/api/branches?parentBranchId=${branch.id}`)
        .then((res) => res.json())
        .then((data) => setSubBranches(data.data || []));
    }
  }, [branch]);

  if (notFound) {
    return <BranchNotFound />;
  }

  if (!branch) {
    return <p>Loading...</p>;
  }

  const handlePromoteToNest = async () => {
    const payload = {
      title: branch.title || "New Nest",
      description: branch.content || "",
      branchIds: [branch.id],
    };

    const res = await fetch("/api/nests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    const newNest = result.data || result;
    navigate(`/nests/${newNest.id}`);
  };

  return (
    <div className="branch-detail">
      <h2>Branch Details</h2>

      <div className="branch-content" style={{ whiteSpace: "pre-wrap" }}>
        {branch.content}
      </div>

      <p className="timestamp">
        Created: {new Date(branch.createdAt).toLocaleString()}
      </p>

      <div className="link-to-nest" style={{ marginTop: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Nest Connections
        </label>
        <select
          value={branch.nestId || ""}
          onChange={async (e) => {
            const newNestId = e.target.value || null;

            await fetch(`/api/branches/${branch.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nestId: newNestId }),
            });

            setBranch({ ...branch, nestId: newNestId });
          }}
          style={{ padding: "0.5rem", minWidth: "200px" }}
        >
          <option value="">— No Nest —</option>
          {nests.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || "Untitled Nest"}
            </option>
          ))}
        </select>
        {!branch.nestId && (
          <p style={{ marginTop: "0.5rem", color: "#666" }}>
            This branch isn’t part of any nests yet
          </p>
        )}
      </div>

      <div className="actions" style={{ marginTop: "1rem" }}>
        <button onClick={handlePromoteToNest}>
          Let this Branch form a Nest
        </button>
      </div>

      <h3>Sub-branches</h3>
      <Tree
        node={{
          label: branch.title || "Branch",
          link: `/branches/${branch.id}`,
          children: subBranches.map((sb) => ({
            label: sb.title || "Untitled Branch",
            link: `/branches/${sb.id}`,
            children: [], // Phase 2: deeper recursion
          })),
        }}
      />

      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#4a6cf7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={async () => {
          const payload = {
            title: "New Sub-branch",
            content: "",
            parentBranchId: branch.id,
            nestId: branch.nestId || null,
          };

          const res = await fetch("/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await res.json();
          const newBranch = result.data || result;
          navigate(`/branches/${newBranch.id}`);
        }}
      >
        Add Sub-branch
      </button>
    </div>
  );
}
