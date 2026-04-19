import React from "react";
import { Navigate } from "react-router-dom";
import { hasAuthSession } from "../../utils/getUserFromStorage";

const AuthRoute = ({ children }) => {
  if (hasAuthSession()) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthRoute;
