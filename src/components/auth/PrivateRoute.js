import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ auth }) => {
  const isLogined = localStorage.getItem("isLogined");

  if (auth) {
    console.log(auth, isLogined);
    return isLogined === null || isLogined === "false" ? (
      <Navigate to="/login" />
    ) : (
      <Outlet />
    );
  } else {
    return isLogined === null || isLogined === "false" ? (
      <Outlet />
    ) : (
      <Navigate to="/" />
    );
  }
};

export default PrivateRoute;
