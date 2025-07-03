import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks";
import { UserRole } from "@/core/types";

interface RoleGuardProps {
    children: ReactNode;
    roles: UserRole[]; // ✅ Usar tipos correctos
    redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = "/403" }: RoleGuardProps) {
    const { claims, isLoading } = useAuth();
    const [timeoutReached, setTimeoutReached] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('RoleGuard: Loading timeout reached');
                setTimeoutReached(true);
            }
        }, 8000);

        return () => clearTimeout(timer);
    }, [isLoading]);

    // ✅ SEGURO - Fallar de forma segura
    if (timeoutReached) {
        console.log('RoleGuard: Timeout reached, access denied');
        return <Navigate to={redirectTo} />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-sm text-muted-foreground">Validating access rights…</div>
            </div>
        );
    }

    const userRole = claims?.role || 'listener';
    if (!roles.includes(userRole)) {
        console.log(`RoleGuard: Access denied. User role: ${userRole}, Required: ${roles.join(', ')}`);
        return <Navigate to={redirectTo} />;
    }

    return <>{children}</>;
}
