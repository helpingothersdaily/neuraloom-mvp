import { Link } from "react-router-dom";

export default function NestNotFound() {
  return (
    <div className="nest-not-found">
      <h2>Nest Not Found</h2>
      <p>This nest no longer exists or was removed.</p>

      <Link to="/" className="back-link">
        ← Return to Seed List
      </Link>
    </div>
  );
}
