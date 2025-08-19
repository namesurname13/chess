import { create } from "zustand";

interface AppState {
  currentPage: string;
  isLoading: boolean;
  user: {
    name: string;
    rating: number;
  } | null;

  // Actions
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: { name: string; rating: number } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: "home",
  isLoading: false,
  user: null,

  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
}));
