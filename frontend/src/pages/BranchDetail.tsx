import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BranchNotFound from "../components/BranchNotFound";

export default function BranchDetail() {
  const { id: branchId } = useParams();

  const [branch, setBranch] = useState(null);
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
        if (data) setBranch(data);
      });
  }, [branchId]);

  if (notFound) {
    return <BranchNotFound />;
  }

  if (!branch) {
    return <p>Loading...</p>;
  }

  return (
    <div className="branch-detail">
      {/* your existing branch detail UI */}
    </div>
  );
}
