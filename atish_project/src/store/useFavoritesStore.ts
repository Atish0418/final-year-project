import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoriteItem = {
  id: string;
  type: "stream" | "department";
  name: string;
  description?: string;
  streamId?: string;
  slug?: string;
};

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  isSaved: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      isSaved: (id) => Boolean(get().items.find((i) => i.id === id)),
    }),
    { name: "futurepath-favorites" },
  ),
);
