import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
    redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = "/unauthorized" }: RoleGuardProps) {
    const { claims, isLoading } = useAuth();

    if (isLoading) return null;
    if (!roles.includes(claims?.role || "")) return <Navigate to={redirectTo} />;
    return <>{children}</>;
}