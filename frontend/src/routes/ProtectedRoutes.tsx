import React, { type JSX } from "react";
import { useAuth } from "../context/AuthProvide";
import { Navigate } from "react-router-dom";

const ProtectedRoutes: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { authenticated, loading } = useAuth();
  console.log(authenticated);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!authenticated) return <Navigate to={"/login"} replace />;

  return children;
};

export default ProtectedRoutes;
