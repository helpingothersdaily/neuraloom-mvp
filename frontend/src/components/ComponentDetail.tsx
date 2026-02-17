import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ComponentNotFound from "./ComponentNotFound";

export default function ComponentDetail() {
  const { id: componentId } = useParams();

  const [component, setComponent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/components/${componentId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setComponent(data);
      });
  }, [componentId]);

  if (notFound) {
    return <ComponentNotFound />;
  }

  if (!component) {
    return <p>Loading...</p>;
  }

  return (
    <div className="component-detail">
      {/* your upcoming component detail UI */}
    </div>
  );
}
