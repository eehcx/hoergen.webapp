import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks";

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/sign-in" }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const [timeoutReached, setTimeoutReached] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('AuthGuard: Loading timeout reached');
                setTimeoutReached(true);
            }
        }, 8000); // Más tiempo para conexiones lentas

        return () => clearTimeout(timer);
    }, [isLoading]);

    // ✅ SEGURO - Fallar de forma segura, no bypassing
    if (timeoutReached) {
        console.log('AuthGuard: Timeout reached, redirecting to sign-in');
        return <Navigate to={redirectTo} />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Signing you in…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to={redirectTo} />;
    return <>{children}</>;
}
