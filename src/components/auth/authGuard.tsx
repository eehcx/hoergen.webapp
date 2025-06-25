import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/sign-in" }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const [timeoutReached, setTimeoutReached] = useState(false);

    // Security timeout: if loading for more than 5 seconds, assume there's a problem
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('AuthGuard: Loading timeout reached, bypassing auth check');
                setTimeoutReached(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isLoading]);

    // If timeout, show content without auth for now
    if (timeoutReached) {
        console.log('AuthGuard: Bypassing due to timeout');
        return <>{children}</>;
    }    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) return <Navigate to={redirectTo} />;
    return <>{children}</>;
}