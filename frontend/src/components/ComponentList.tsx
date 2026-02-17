import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Component {
  id: string;
  title: string;
  description: string;
  branchIds: string[];
  createdAt: number;
  updatedAt: number;
}

export default function ComponentList() {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => setComponents(data.data || []));
  }, []);

  return (
    <div className="component-list">
      <h2>Components</h2>

      {components.length === 0 && <p>No components yet.</p>}

      <ul>
        {components.map((c) => (
          <li key={c.id}>
            <Link to={`/components/${c.id}`}>
              {c.title || "Untitled Component"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
