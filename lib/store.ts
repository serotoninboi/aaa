import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Interface pour les données utilisateur
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Store pour l'état de l'utilisateur et l'authentification
interface UserState {
  user: User | null;
  token: string | null;
  credits: number | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setCredits: (credits: number | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      credits: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setCredits: (credits) => set({ credits }),
      logout: () => {
        set({ user: null, token: null, credits: null });
        // Optionnel: nettoyer d'autres stores si nécessaire
      },
    }),
    {
      name: 'pixelforge-auth-storage', // nom pour le local storage
    }
  )
);

// Store pour l'état de l'interface utilisateur (UI)
interface UIState {
  sidebarOpen: boolean;
  activeTool: string; // ex: 'image-edit', 'pose-edit'
  toggleSidebar: () => void;
  setActiveTool: (tool: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTool: 'image-edit',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
