import { Link } from "react-router-dom";

export default function ComponentNotFound() {
  return (
    <div className="component-not-found">
      <h2>Component Not Found</h2>
      <p>This component no longer exists or was removed.</p>

      <Link to="/" className="back-link">
        ← Return to Seed List
      </Link>
    </div>
  );
}
