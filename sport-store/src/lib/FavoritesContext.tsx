"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getFavoriteIds, toggleFavoriteApi } from "./api";

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
  favoriteIds: Set<string>;
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
  const [apiIds, setApiIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const { token, isLoggedIn } = useAuth();
  const syncedRef = useRef(false);
  const prevLoggedInRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadFavorites());
    setLoaded(true);
  }, []);

  // Sync with API when logged in
  useEffect(() => {
    if (!isLoggedIn || !token || syncedRef.current) return;
    syncedRef.current = true;

    getFavoriteIds(token)
      .then((ids) => {
        setApiIds(new Set(ids));
        setItems((prev) => {
          const localIds = prev.map((i) => String(i.id));
          const merged = new Set([...ids, ...localIds]);
          // Keep existing items, add placeholders for API-only ones
          const existingMap = new Map(prev.map((i) => [String(i.id), i]));
          const result: FavoriteItem[] = [];
          for (const id of merged) {
            if (existingMap.has(id)) {
              result.push(existingMap.get(id)!);
            }
          }
          // Sync local items that aren't on server yet
          for (const item of prev) {
            if (!ids.includes(String(item.id))) {
              toggleFavoriteApi(token, String(item.id)).catch(() => {});
            }
          }
          return result;
        });
      })
      .catch(() => {});
  }, [isLoggedIn, token]);

  // จัดการสถานะเมื่อ login/logout เปลี่ยน
  useEffect(() => {
    const wasLoggedIn = prevLoggedInRef.current;
    prevLoggedInRef.current = isLoggedIn;

    if (!isLoggedIn) {
      syncedRef.current = false;
      setApiIds(new Set());

      // ถ้าเพิ่ง logout จริงๆ (เคย login มาก่อน) → ล้าง favorites local ทิ้ง
      // ป้องกันไม่ให้ favorites ของ user คนเดิมค้างมาให้ guest เห็น
      if (wasLoggedIn) {
        setItems([]);
        saveFavorites([]);
      }
    }
  }, [isLoggedIn]);

  // Persist to localStorage
  useEffect(() => {
    if (loaded) saveFavorites(items);
  }, [items, loaded]);

  const favoriteIds = new Set([
    ...items.map((i) => String(i.id)),
    ...apiIds,
  ]);

  const isFavorite = useCallback(
    (id: string | number) => favoriteIds.has(String(id)),
    [favoriteIds]
  );

  const addFavorite = useCallback(
    (item: FavoriteItem) => {
      setItems((prev) =>
        prev.some((i) => String(i.id) === String(item.id))
          ? prev
          : [...prev, item]
      );
      setApiIds((prev) => new Set([...prev, String(item.id)]));
      if (token) {
        toggleFavoriteApi(token, String(item.id)).catch(() => {});
      }
    },
    [token]
  );

  const removeFavorite = useCallback(
    (id: string | number) => {
      setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
      setApiIds((prev) => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
      if (token) {
        toggleFavoriteApi(token, String(id)).catch(() => {});
      }
    },
    [token]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const id = String(item.id);
      const exists = items.some((i) => String(i.id) === id) || apiIds.has(id);

      if (exists) {
        setItems((prev) => prev.filter((i) => String(i.id) !== id));
        setApiIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        setItems((prev) => [...prev, item]);
        setApiIds((prev) => new Set([...prev, id]));
      }

      if (token) {
        toggleFavoriteApi(token, id).catch(() => {});
      }
    },
    [items, apiIds, token]
  );

  const clearFavorites = useCallback(() => {
    setItems([]);
    setApiIds(new Set());
  }, []);

  const totalItems = favoriteIds.size;

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
        favoriteIds,
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
