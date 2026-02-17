import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Tree, { TreeNode } from "./Tree";

interface ComponentData {
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

export default function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [component, setComponent] = useState<ComponentData | null>(null);
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/components/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setComponent(data.data || data);
      });
  }, [id]);

  useEffect(() => {
    if (component) {
      fetch(`/api/branches?componentId=${component.id}`)
        .then((res) => res.json())
        .then((data) => setBranches(data.data || []));
    }
  }, [component]);

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
        <h2>Component Not Found</h2>
        <Link to="/">← Back to Seeds</Link>
      </div>
    );
  }

  if (!component) return <p>Loading...</p>;

  const handleDelete = async () => {
    await fetch(`/api/components/${id}`, { method: "DELETE" });
    navigate("/components");
  };

  // Build tree structure
  const tree: TreeNode = {
    label: component.title || "Component",
    children: buildBranchTree(null),
  };

  return (
    <div className="component-detail">
      <h2>{component.title || "Untitled Component"}</h2>

      <ReactMarkdown>{component.description}</ReactMarkdown>

      <p className="timestamp">
        Created: {new Date(component.createdAt).toLocaleString()}
      </p>

      <h3>Structure</h3>
      <Tree node={tree} />

      <div className="actions">
        <Link to={`/components/${id}/edit`}>Edit</Link>
        <button onClick={handleDelete}>Delete</button>
      </div>

      <Link to="/components">← Back to Components</Link>
    </div>
  );
}
