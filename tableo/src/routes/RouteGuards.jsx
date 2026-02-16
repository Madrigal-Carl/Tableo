// src/routes/RouteGuards.jsx
import { Navigate, Outlet, useParams } from "react-router-dom";
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

  return !isAuth ? <Outlet /> : <Navigate to="/events" replace />;
}

// Judge route guard
export function JudgeGuard() {
  const { invitationCode } = useParams();

  // Redirect if no invitation code in URL
  if (!invitationCode) return <Navigate to="/" replace />;

  // Could also add a backend check here later
  return <Outlet />;
}
