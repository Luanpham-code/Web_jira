import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;