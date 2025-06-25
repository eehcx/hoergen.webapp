import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/core/firebase";

export function useAuth() {
    const { 
        user, 
        claims, 
        isLoading, 
        isInitialized,
        setUser, 
        setClaims, 
        setLoading,
        setInitialized 
    } = useAuthStore();

    useEffect(() => {
        // Si ya tenemos claims persistidos y Firebase tiene usuario, cargar inmediatamente
        if (isInitialized && claims && auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setUser(firebaseUser);
                    
                    // Si ya tenemos claims persistidos, usarlos inmediatamente
                    if (claims && isInitialized) {
                        setLoading(false);
                        return;
                    }
                    
                    // Solo obtener claims si no los tenemos (primera vez o cambio de usuario)
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 2000)
                    );
                    
                    try {
                        const tokenResult = await Promise.race([
                            firebaseUser.getIdTokenResult(),
                            timeoutPromise
                        ]) as any;
                        
                        const newClaims = {
                            role: (tokenResult.claims?.role as string | undefined) || "listener",
                            plan: (tokenResult.claims?.plan as string | undefined) || "free"
                        };
                        
                        setClaims(newClaims);
                    } catch (tokenError) {
                        console.warn('Token claims timeout, using defaults:', tokenError);
                        setClaims({
                            role: "listener",
                            plan: "free"
                        });
                    }
                } else {
                    setUser(null);
                    setClaims(null);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
                setClaims(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        });

        return () => unsubscribe();
    }, [setUser, setClaims, setLoading, setInitialized, claims, isInitialized]);

    return {
        user,
        claims,
        isLoading,
        isAuthenticated: !!user,
    };
}