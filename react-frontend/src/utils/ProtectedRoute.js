import React from 'react'
import { Navigate } from "react-router-dom";
import cookie from "react-cookies";

export const ProtectedRoute = ({ children }) => {
  const session = cookie.load("auth-session");
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  return children;
};
