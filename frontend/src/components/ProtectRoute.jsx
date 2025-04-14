import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={"/auth"} />;
};

export default ProtectRoute;
