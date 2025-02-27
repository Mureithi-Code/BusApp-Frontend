import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) return <Navigate to="/" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;
    return children;
};

export default PrivateRoute;
