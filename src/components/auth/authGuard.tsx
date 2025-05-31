import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/sign-in" }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to={redirectTo} />;
    return <>{children}</>;
}