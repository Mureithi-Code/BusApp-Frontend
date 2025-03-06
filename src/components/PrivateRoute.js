import React from "react";
import { Navigate } from "react-router-dom";

// Helper function to check access
const isRoleAllowed = (allowedRoles, userRole) => {
    return allowedRoles.includes(userRole);
};

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        console.warn("🔒 No token found. Redirecting to login.");
        return <Navigate to="/" />;
    }

    if (!userRole) {
        console.warn("🔒 No user role found. Clearing session and redirecting to login.");
        localStorage.clear();
        return <Navigate to="/" />;
    }

    if (!isRoleAllowed(allowedRoles, userRole)) {
        console.warn(`🔒 Role "${userRole}" not authorized for this page. Redirecting to login.`);
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
