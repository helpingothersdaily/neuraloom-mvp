import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Tree, { TreeNode } from "./Tree";
import SimpleEditor from "../components/SimpleEditor";

interface NestData {
  id: string;
  title: string;
  description: string;
  branchIds: string[];
  createdAt: number;
  updatedAt: number;
}

interface BranchData {
  id: string;
  title?: string;
  content: string;
  parentBranchId?: string | null;
}

export default function NestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nest, setNest] = useState<NestData | null>(null);
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetch(`/api/nests/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const loadedNest = data.data || data;
          setNest(loadedNest);
          setEditTitle(loadedNest.title || "");
          setEditDescription(loadedNest.description || "");
        }
      });
  }, [id]);

  useEffect(() => {
    if (nest) {
      fetch(`/api/branches?nestId=${nest.id}`)
        .then((res) => res.json())
        .then((data) => setBranches(data.data || []));
    }
  }, [nest]);

  // Helper to recursively build tree nodes from branches
  const buildBranchTree = (parentId: string | null): TreeNode[] => {
    return branches
      .filter((b) => (b.parentBranchId || null) === parentId)
      .map((b) => ({
        label: b.title || "Untitled Branch",
        link: `/branches/${b.id}`,
        children: buildBranchTree(b.id),
      }));
  };

  if (notFound) {
    return (
      <div>
        <h2>Nest Not Found</h2>
        <Link to="/">← Back to Seeds</Link>
      </div>
    );
  }

  if (!nest) return <p>Loading...</p>;

  const handleDelete = async () => {
    await fetch(`/api/nests/${id}`, { method: "DELETE" });
    navigate("/nests");
  };

  const handleSave = async () => {
    const res = await fetch(`/api/nests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        branchIds: nest.branchIds || [],
      }),
    });

    const data = await res.json();
    const updatedNest = data.data || data;
    setNest(updatedNest);
    setIsEditing(false);
  };

  // Build tree structure
  const tree: TreeNode = {
    label: nest.title || "Nest",
    children: buildBranchTree(null),
  };

  return (
    <div className="nest-detail">
      <h2>Nest Habitat</h2>
      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "0.75rem", padding: "0.5rem", fontSize: "1rem" }}
          />
          <SimpleEditor
            value={editDescription}
            onChange={setEditDescription}
            placeholder="Describe this nest..."
            minHeight="140px"
          />
        </>
      ) : (
        <>
          <h3>{nest.title || "Untitled Nest"}</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>{nest.description}</div>
        </>
      )}

      <p className="timestamp">
        Created: {new Date(nest.createdAt).toLocaleString()}
      </p>

      <h3>Nest Structure</h3>
      {branches.length === 0 ? (
        <p>This nest doesn’t hold any branches yet</p>
      ) : (
        <Tree node={tree} />
      )}

      <div className="actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setEditTitle(nest.title || "");
                setEditDescription(nest.description || "");
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Nest</button>
        )}
        <button onClick={handleDelete}>Delete Nest</button>
      </div>

      <Link to="/nests">← Back to Nests</Link>
    </div>
  );
}
