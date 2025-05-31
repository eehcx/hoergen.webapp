import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

export function useAuth() {
    const { user, claims, isLoading, setUser, setClaims, setLoading } = useAuthStore();

    useEffect(() => {
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            setUser(firebaseUser);
            const tokenResult = await firebaseUser.getIdTokenResult();
            setClaims({
                role: (tokenResult.claims.role as string | undefined) || "user",
                plan: (tokenResult.claims.plan as string | undefined) || "free"
            });
        } else {
            setUser(null);
            setClaims(null);
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setClaims, setLoading]);

    return {
        user,
        claims,
        isLoading,
        isAuthenticated: !!user,
    };
}