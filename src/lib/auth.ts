import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, googleProvider } from "@/core/firebase";
import { useAuthStore } from "@/stores/authStore";
import { signInWithPopup } from "firebase/auth";
import { UserRole, PlanType } from "@/core/types";

export const signIn = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        
        // Verificar si el usuario tiene claims válidos (role, plan, etc.)
        // Si no tiene claims válidos, significa que no está registrado en nuestro sistema
        const tokenResult = await getIdTokenResult(result.user);
        
        if (!tokenResult.claims || !tokenResult.claims.role) {
            // Desconectar al usuario inmediatamente
            await firebaseSignOut(auth);
            throw new Error('auth/user-not-registered');
        }
        
        return result;
    } catch (error: any) {
        // Si el error es porque el usuario no está registrado, lanzar un error específico
        if (error.message === 'auth/user-not-registered') {
            const customError = new Error('This email is not registered. Please sign up first or contact an administrator.');
            customError.name = 'auth/user-not-registered';
            throw customError;
        }
        
        // Propagar otros errores de Firebase
        throw error;
    }
};

export async function signInWithGoogle() {
    try {
        // Primero verificamos si el usuario está registrado ANTES de intentar autenticar
        // Para esto necesitamos obtener el email del usuario antes de autenticar
        // Como no podemos obtener el email antes de autenticar con Google,
        // vamos a manejar esto de manera diferente
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Ahora verificamos si el usuario existe en nuestra base de datos
        // o si tiene los claims necesarios para determinar si está registrado
        const tokenResult = await getIdTokenResult(user);
        
        // Verificar si el usuario tiene claims válidos (role, plan, etc.)
        // Si no tiene claims válidos, significa que no está registrado en nuestro sistema
        if (!tokenResult.claims || !tokenResult.claims.role) {
            // Desconectar al usuario inmediatamente
            await firebaseSignOut(auth);
            throw new Error('auth/user-not-registered');
        }
        
        //console.log("Usuario autenticado:", user.displayName, user.email);
    } catch (error: any) {
        // Si el error es porque el usuario no está registrado, lanzar un error específico
        if (error.message === 'auth/user-not-registered') {
            const customError = new Error('This email is not registered. Please sign up first or contact an administrator.');
            customError.name = 'auth/user-not-registered';
            throw customError;
        }
        
        //console.error("Error logging in with Google:", error);
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
                role: ((tokenResult.claims?.role as string | undefined) || "listener") as UserRole,
                plan: ((tokenResult.claims?.plan as string | undefined) || "free") as PlanType
            });
        } else {
            setUser(null);
            setClaims(null);
        }
        setLoading(false);
    });
};