import { Outlet, Navigate, useLocation } from "react-router-dom"
import { Roles, type Role } from "../types/user"
import useAuthStore from "../store/authStore"

interface RequireAuthProps {
    allowedRoles?: Role[]
}

export default function RequireAuth({
    allowedRoles = Object.values(Roles),
}: RequireAuthProps) {
    const location = useLocation()
    const { user, isAuthenticated } = useAuthStore()

    return allowedRoles?.find(
        (allowedRole: Role) => allowedRole === user?.role
    ) ? (
        <Outlet />
    ) : isAuthenticated ? (
        <Navigate to="/unauthorized" replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}
