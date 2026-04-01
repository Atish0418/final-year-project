import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "ta";

type LanguageState = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === "en" ? "ta" : "en" }),
    }),
    { name: "futurepath-lang" },
  ),
);
