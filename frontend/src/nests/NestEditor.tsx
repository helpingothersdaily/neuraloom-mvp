import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/nests/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const c = data.data || data;
          setTitle(c.title);
          setDescription(c.description);
        });
    }
  }, [id, isEditing]);

  const handleSave = async () => {
    const payload = { title, description };

    if (isEditing) {
      await fetch(`/api/nests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/nests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    navigate("/nests");
  };

  return (
    <div className="nest-editor">
      <h2>{isEditing ? "Edit Nest" : "New Nest"}</h2>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Description (Markdown supported)</label>
      <textarea
        rows={10}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSave}>Save</button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}
