import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Tree, { TreeNode } from "./Tree";

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
        if (data) setNest(data.data || data);
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

  // Build tree structure
  const tree: TreeNode = {
    label: nest.title || "Nest",
    children: buildBranchTree(null),
  };

  return (
    <div className="nest-detail">
      <h2>Nest Habitat</h2>
      <h3>{nest.title || "Untitled Nest"}</h3>

      <ReactMarkdown>{nest.description}</ReactMarkdown>

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
        <Link to={`/nests/${id}/edit`}>Edit Nest</Link>
        <button onClick={handleDelete}>Delete Nest</button>
      </div>

      <Link to="/nests">← Back to Nests</Link>
    </div>
  );
}
