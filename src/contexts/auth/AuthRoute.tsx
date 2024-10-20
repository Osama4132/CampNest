import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function AuthRoute({ Component }: {Component: React.ComponentType}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in, if user is logged in, set isAuthenticated to true, and isLoading to false
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
  }
}
