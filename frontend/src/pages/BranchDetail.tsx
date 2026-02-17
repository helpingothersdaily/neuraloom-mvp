import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import BranchNotFound from "../components/BranchNotFound";

interface BranchData {
  id: string;
  seedId: string;
  content: string;
  title?: string;
  componentId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface ComponentData {
  id: string;
  title: string;
}

export default function BranchDetail() {
  const { id: branchId } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState<BranchData | null>(null);
  const [components, setComponents] = useState<ComponentData[]>([]);
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
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => setComponents(data.data || []));
  }, []);

  if (notFound) {
    return <BranchNotFound />;
  }

  if (!branch) {
    return <p>Loading...</p>;
  }

  const handlePromoteToComponent = async () => {
    const payload = {
      title: branch.title || "New Component",
      description: branch.content || "",
      branchIds: [branch.id],
    };

    const res = await fetch("/api/components", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    const newComponent = result.data || result;
    navigate(`/components/${newComponent.id}`);
  };

  return (
    <div className="branch-detail">
      <h2>Branch Details</h2>

      <div className="branch-content">
        <ReactMarkdown>{branch.content}</ReactMarkdown>
      </div>

      <p className="timestamp">
        Created: {new Date(branch.createdAt).toLocaleString()}
      </p>

      <div className="link-to-component" style={{ marginTop: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Link to Component:
        </label>
        <select
          value={branch.componentId || ""}
          onChange={async (e) => {
            const newComponentId = e.target.value || null;

            await fetch(`/api/branches/${branch.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ componentId: newComponentId }),
            });

            setBranch({ ...branch, componentId: newComponentId });
          }}
          style={{ padding: "0.5rem", minWidth: "200px" }}
        >
          <option value="">— No Component —</option>
          {components.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || "Untitled Component"}
            </option>
          ))}
        </select>
      </div>

      <div className="actions" style={{ marginTop: "1rem" }}>
        <button onClick={handlePromoteToComponent}>
          Promote to Component
        </button>
      </div>
    </div>
  );
}
