import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useAuthStore } from "@/stores/authStore";
import { signInWithPopup } from "firebase/auth";

export const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // El usuario está autenticado, puedes obtener la información:
        const user = result.user;
        console.log("Usuario autenticado:", user.displayName, user.email);
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
}

export const signOut = async () => {
    const { setUser, setClaims } = useAuthStore.getState();
    try {
        await firebaseSignOut(auth);
    
        console.log("Usuario desconectado exitosamente");
    } catch (error) {
        console.error("Error al desconectar al usuario:", error);
    } finally {
        setUser(null);
        setClaims(null);
    }
};

export const initAuth = () => {
    const { setUser, setClaims, setLoading } = useAuthStore.getState();

    return onAuthStateChanged(auth, async (user) => {
        setLoading(true);
        if (user) {
        setUser(user);
        const tokenResult = await getIdTokenResult(user);
        setClaims({
            role: typeof tokenResult.claims.role === "string" ? tokenResult.claims.role : "user",
            plan: typeof tokenResult.claims.plan === "string" ? tokenResult.claims.plan : "free",
        });
        /*
        setClaims({
            role: tokenResult.claims.role || "user",
            plan: tokenResult.claims.plan || "free",
        });
        */
        } else {
        setUser(null);
        setClaims(null);
        }
        setLoading(false);
    });
};