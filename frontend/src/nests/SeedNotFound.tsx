import { Link } from "react-router-dom";

export default function SeedNotFound() {
  return (
    <div className="seed-not-found">
      <h2>Seed Not Found</h2>
      <p>This seed no longer exists or was removed.</p>

      <Link to="/" className="back-link">
        ← Return to Seed List
      </Link>
    </div>
  );
}
