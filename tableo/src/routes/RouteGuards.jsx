// src/routes/RouteGuards.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Authenticated-only routes
export function ProtectedRoute() {
    const { isAuth, loading } = useAuth();

    if (loading) return null;

    return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
}

// Guest-only routes
export function GuestRoute() {
    const { isAuth, loading } = useAuth();

    if (loading) return null;

    return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
