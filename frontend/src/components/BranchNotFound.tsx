import { Link } from "react-router-dom";

export default function BranchNotFound() {
  return (
    <div className="branch-not-found">
      <h2>Branch Not Found</h2>
      <p>This branch no longer exists or was removed.</p>

      <Link to="/" className="back-link">
        ← Return to Seed List
      </Link>
    </div>
  );
}
