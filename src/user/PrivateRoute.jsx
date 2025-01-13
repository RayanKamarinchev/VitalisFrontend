import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = ({children}) => {
  const user = useAuth();
  if (!user.token) return <Navigate to="/login" />;
  return children ? children : <Outlet />;
};

export default PrivateRoute;