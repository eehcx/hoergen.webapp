import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
    redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = "/403" }: RoleGuardProps) {
    const { claims, isLoading } = useAuth();
    const [timeoutReached, setTimeoutReached] = useState(false);

    // Timeout de seguridad para evitar loading infinito
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('RoleGuard: Loading timeout reached, assuming listener role');
                setTimeoutReached(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isLoading]);

    // If timeout, assume 'listener' role by default
    if (timeoutReached) {
        const hasAccess = roles.includes('listener') || roles.includes('user');
        if (!hasAccess) {
            console.log('RoleGuard: Access denied after timeout, redirecting');
            return <Navigate to={redirectTo} />;
        }
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-sm text-muted-foreground">Checking permissions...</div>
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