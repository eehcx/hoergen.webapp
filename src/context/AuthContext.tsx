import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, User, getIdTokenResult } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { db } from '@/core/firebase';

interface AuthUser extends User {
  role?: string;
  plan?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Al login o cambio de user, obtenemos claims frescos
      const tokenResult = await getIdTokenResult(fbUser, /* forceRefresh */ true);
      const { role, plan } = tokenResult.claims;
      setUser({ ...fbUser, role: role as string, plan: plan as string });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user?.uid) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUser((prevUser) => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              role: userData.role as string,
              plan: userData.plan as string,
            };
          });
        }
      });

      return () => unsubscribe();
    }
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
