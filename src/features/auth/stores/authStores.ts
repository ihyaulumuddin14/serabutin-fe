import { create } from "zustand";
import type { Role } from "../schemas/authSchemas";

type AuthState = {
  role: Role | null,
  isAuthenticated: boolean,
  isHydrated?: boolean,

  setAuth: (role: Role | null, isAuthenticated: boolean) => void,
  setIsHydrated: (isHydrated: boolean) => void,
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  role: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (role, isAuthenticated) => set({ role, isAuthenticated }),
  setIsHydrated: (isHydrated) => set({ isHydrated }),
  logout: () => set({ role: null, isAuthenticated: false })
}))