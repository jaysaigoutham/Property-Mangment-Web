import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { routes } from "../config/routes";
import { useAuth } from "../features/auth/AuthContext";
import { sanitizeRedirectPath } from "../features/auth/redirects";
import type { UserRole } from "../types/domain";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(sanitizeRedirectPath(`${location.pathname}${location.search}`));
    return <Navigate to={`${routes.login}?redirect=${redirect}`} replace />;
  }

  if (roles?.length && (!user?.role || !roles.includes(user.role as UserRole))) {
    return <Navigate to={routes.notAuthorized} replace />;
  }

  return children;
};
