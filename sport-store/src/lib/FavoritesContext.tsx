"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface FavoriteItem {
  id: string | number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
}

interface FavoritesContextValue {
  items: FavoriteItem[];
  totalItems: number;
  isFavorite: (id: string | number) => boolean;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string | number) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "favorite_items";

function loadFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadFavorites());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveFavorites(items);
  }, [items, loaded]);

  const isFavorite = useCallback(
    (id: string | number) => items.some((i) => String(i.id) === String(id)),
    [items]
  );

  const addFavorite = useCallback((item: FavoriteItem) => {
    setItems((prev) =>
      prev.some((i) => String(i.id) === String(item.id))
        ? prev
        : [...prev, item]
    );
  }, []);

  const removeFavorite = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setItems((prev) =>
      prev.some((i) => String(i.id) === String(item.id))
        ? prev.filter((i) => String(i.id) !== String(item.id))
        : [...prev, item]
    );
  }, []);

  const clearFavorites = useCallback(() => setItems([]), []);

  const totalItems = items.length;

  return (
    <FavoritesContext.Provider
      value={{
        items,
        totalItems,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
