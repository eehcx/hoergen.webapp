//import Cookies from 'js-cookie'
import { create } from 'zustand'
import { User } from 'firebase/auth'

//const ACCESS_TOKEN = 'thisisjustarandomstring'

//interface AuthUser {
//  accountNo: string
//  email: string
//  role: string[]
//  exp: number
//}

interface AuthState {
  user: User | null;
  claims: { plan?: string; role?: string } | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setClaims: (claims: { plan?: string; role?: string } | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  claims: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setClaims: (claims) => set({ claims }),
  setLoading: (isLoading) => set({ isLoading }),
}));

/*

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
*/

// export const useAuth = () => useAuthStore((state) => state.auth)
