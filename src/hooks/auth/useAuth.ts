import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/core/firebase";
//import { useQuery } from '@tanstack/react-query';
//import { UserService } from '@/core/services/users/user.service';
// Types
import { UserRole, PlanType } from "@/core/types";

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

  // Función para refrescar claims después de una actualización
  const refreshClaims = useCallback(async () => {
    if (auth.currentUser) {
      try {
        // Forzar refresh del token para obtener nuevos claims
        await auth.currentUser.getIdToken(true);
        const tokenResult = await auth.currentUser.getIdTokenResult();

        const newClaims = {
          role: ((tokenResult.claims?.role as string | undefined) || "listener") as UserRole,
          plan: ((tokenResult.claims?.plan as string | undefined) || "free") as PlanType
        };

        setClaims(newClaims);
        console.log('Claims refreshed:', newClaims);
      } catch (error) {
        console.error('Error refreshing claims:', error);
      }
    }
  }, [setClaims]);

  useEffect(() => {
    // Si ya tenemos claims persistidos y Firebase tiene usuario, cargar inmediatamente
    if (isInitialized && claims && auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Usar onIdTokenChanged para capturar cambios en el token (incluyendo refreshes)
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // Si ya tenemos claims persistidos y es el mismo usuario, usarlos inmediatamente
          if (claims && isInitialized && user?.uid === firebaseUser.uid) {
            setLoading(false);
            // Pero aún así refrescar claims en background
            setTimeout(() => refreshClaims(), 100);
            return;
          }

          // Obtener claims del token (primera vez o cambio de usuario)
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 2000)
          );

          try {
            const tokenResult = await Promise.race([
              firebaseUser.getIdTokenResult(),
              timeoutPromise
            ]) as any;

            const newClaims = {
              role: ((tokenResult.claims?.role as string | undefined) || "listener") as UserRole,
              plan: ((tokenResult.claims?.plan as string | undefined) || "free") as PlanType
            };

            setClaims(newClaims);
          } catch (tokenError) {
            console.warn('Token claims timeout, using defaults:', tokenError);
            setClaims({
              role: "listener" as UserRole,
              plan: "free" as PlanType
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
  }, [setUser, setClaims, setLoading, setInitialized, claims, isInitialized, user?.uid, refreshClaims]);

  return {
    user,
    claims,
    isLoading,
    isAuthenticated: !!user,
    refreshClaims, // Exponemos la función para uso externo
  };
}

/*

export function useGlobalUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRole', user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error('User is not authenticated');
      }

      const userService = UserService.getInstance();
      const userData = await userService.getUserById(user.uid);

      return {
        role: userData.claims?.role || 'listener',
        plan: userData.claims?.plan || 'free',
      };
    },
  });
}

*/
