import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

interface Props {
  children: React.ReactNode;
  allowed: UserRole[];
}

export default function ProtectedRoute({ children, allowed }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;

  return <>{children}</>;
}
