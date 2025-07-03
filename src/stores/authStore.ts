//import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserRole, PlanType } from '@/core/types'

interface AuthState {
  user: User | null;
  claims: {
    plan?: PlanType;
    role?: UserRole
  } | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setClaims: (
    claims: {
      plan?: PlanType;
      role?: UserRole
    } | null
  ) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      claims: null,
      isLoading: true,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setClaims: (claims) => set({ claims }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        claims: state.claims,
        isInitialized: state.isInitialized
      }),
    }
  )
);
