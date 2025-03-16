import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.profile);

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
