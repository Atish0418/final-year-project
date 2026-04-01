import { create } from "zustand";

type Accent = "aqua" | "violet";

type ThemeState = {
  accent: Accent;
  toggleAccent: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  accent: "aqua",
  toggleAccent: () =>
    set((state) => ({
      accent: state.accent === "aqua" ? "violet" : "aqua",
    })),
}));
