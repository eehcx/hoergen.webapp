//import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
      storage: createJSONStorage(() => {
        const w = globalThis as any
        // En Electron usamos el storage IPC; en web, localStorage
        if (w?.electronAPI?.storage) {
          return {
            getItem: async (name: string) => {
              const value = await w.electronAPI.storage.get(name)
              return value == null ? null : JSON.stringify(value)
            },
            setItem: async (name: string, value: string) => {
              await w.electronAPI.storage.set(name, JSON.parse(value))
            },
            removeItem: async (name: string) => {
              await w.electronAPI.storage.remove(name)
            },
          }
        }
        return localStorage
      }),
      partialize: (state) => ({
        claims: state.claims,
        isInitialized: state.isInitialized
      }),
    }
  )
);

