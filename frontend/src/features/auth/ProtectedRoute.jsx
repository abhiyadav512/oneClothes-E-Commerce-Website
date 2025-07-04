import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const user = useSelector((state) => state.auth.user);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode the JWT token and check if it has expired; if expired or invalid, remove it, log the user out, and redirect to login.
        const decoded = jwtDecode(token);
        // console.log(decoded);
        const currentTime = Date.now() / 1000; // in seconds

        // console.log(currentTime);
        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            dispatch(logout()); 
            return <Navigate to="/login" replace />;
        }
    } catch (err) {
        localStorage.removeItem("token");
        dispatch(logout());
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
