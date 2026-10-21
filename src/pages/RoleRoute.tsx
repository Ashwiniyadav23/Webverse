import { Navigate, Outlet } from "react-router-dom";
import { getAuth, type UserRole } from "../utils/auth";

interface RoleRouteProps {
  allowedRole?: UserRole | UserRole[];
}

export default function RoleRoute({ allowedRole }: RoleRouteProps) {
  const auth = getAuth();

  if (!auth?.token || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = allowedRole
    ? Array.isArray(allowedRole)
      ? allowedRole
      : [allowedRole]
    : [];

  if (allowedRoles.length && !allowedRoles.includes(auth.user.role)) {
    return (
      <Navigate
        to={
          auth.user.role === "student"
            ? "/dashboard"
            : auth.user.role === "teacher"
              ? "/teacher"
              : "/admin"
        }
        replace
      />
    );
  }

  return <Outlet />;
}