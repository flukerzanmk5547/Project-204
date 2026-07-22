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
import {
  getCartApi,
  addCartItemApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  type ApiCartItem,
} from "./api";

export interface CartItem {
  id: string | number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string | number, size: string) => void;
  updateQuantity: (id: string | number, size: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cart_items";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function rowKey(id: string | number, size: string): string {
  return `${String(id)}|${size ?? ""}`;
}

// แปลง cart จาก server → CartItem[] ของ frontend + เก็บ map ของ row id ไว้ใช้ update/remove
function mapServerItems(apiItems: ApiCartItem[]): {
  items: CartItem[];
  rowIds: Map<string, string>;
} {
  const rowIds = new Map<string, string>();
  const items = apiItems.map((it) => {
    const size = it.size ?? "";
    rowIds.set(rowKey(it.product_id, size), it.id);
    const price = it.product?.price ?? 0;
    const orig = it.product?.original_price ?? undefined;
    const hasDiscount = orig !== undefined && orig > price;
    return {
      id: it.product_id,
      name: it.product?.name ?? "",
      brand: it.product?.brand ?? "",
      image: it.product?.images?.[0] ?? "",
      price,
      originalPrice: hasDiscount ? orig : undefined,
      discount: hasDiscount
        ? Math.round(((orig! - price) / orig!) * 100)
        : undefined,
      size,
      quantity: it.quantity,
    } as CartItem;
  });
  return { items, rowIds };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { user, token, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  const syncedUserRef = useRef<string | null>(null);
  const serverRowIds = useRef<Map<string, string>>(new Map());

  // คิวจัดการ mutation ตะกร้าให้ทำงาน "ทีละอันตามลำดับ"
  // กัน race condition เช่น เพิ่มสินค้าแล้วรีบลบก่อนที่การเพิ่มจะ commit ที่ server
  // (ทำให้ resolveRowId หา row ไม่เจอ → ไม่ได้ยิง DELETE → สินค้าเด้งกลับมา)
  const opQueue = useRef<Promise<unknown>>(Promise.resolve());
  const enqueue = useCallback((fn: () => Promise<void>) => {
    opQueue.current = opQueue.current.then(() => fn()).catch(() => {});
  }, []);

  // โหลดจาก localStorage ครั้งแรก (สำหรับ guest)
  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  // เก็บลง localStorage เฉพาะตอนเป็น guest (และ auth โหลดเสร็จแล้ว)
  // ตะกร้าของ user ที่ login อยู่บน server ไม่ยุ่งกับ localStorage
  useEffect(() => {
    if (!loaded || authLoading) return;
    if (isLoggedIn) return;
    saveCart(items);
  }, [items, loaded, isLoggedIn, authLoading]);

  const applyServerCart = useCallback((apiItems: ApiCartItem[]) => {
    const { items: mapped, rowIds } = mapServerItems(apiItems);
    serverRowIds.current = rowIds;
    setItems(mapped);
  }, []);

  // จัดการ login / logout / สลับบัญชี
  useEffect(() => {
    if (authLoading) return;
    const currentId = user?.id ?? null;
    const prevId = prevUserIdRef.current;
    prevUserIdRef.current = currentId;

    if (currentId && token) {
      // login แล้ว — sync ตะกร้ากับ server (ทำครั้งเดียวต่อ user)
      if (syncedUserRef.current === currentId) return;
      syncedUserRef.current = currentId;

      // merge ตะกร้า guest เข้า server เฉพาะตอน "เพิ่ง login จาก guest" เท่านั้น
      // (prevId === null = เคยเห็นสถานะ guest มาก่อนใน mount นี้)
      // ถ้า refresh ทั้งๆ ที่ login อยู่แล้ว prevId จะเป็น undefined → ไม่ merge
      // ป้องกันไม่ให้สินค้าที่ลบไปแล้วถูก re-add จาก localStorage กลับเข้า server
      const shouldMergeGuest = prevId === null;

      (async () => {
        try {
          if (shouldMergeGuest) {
            const guestItems = loadCart();
            for (const gi of guestItems) {
              await addCartItemApi(token, {
                product_id: String(gi.id),
                quantity: gi.quantity,
                size: gi.size || undefined,
              }).catch(() => {});
            }
          }
          // ตะกร้าของ user อยู่บน server แล้ว — เคลียร์ localStorage ทิ้งเสมอ
          saveCart([]);
          const summary = await getCartApi(token);
          applyServerCart(summary.items);
        } catch {
          /* ignore */
        }
      })();
    } else if (!currentId) {
      syncedUserRef.current = null;
      serverRowIds.current = new Map();

      // logout จริง (เคย login มาก่อน) → ล้างตะกร้า local ทิ้ง
      // (ข้อมูลปลอดภัยอยู่ใน account บน server แล้ว)
      if (prevId !== undefined && prevId !== null && prevId !== currentId) {
        setItems([]);
        saveCart([]);
      }
    }
  }, [user, token, authLoading, applyServerCart]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      const size = item.size ?? "";

      setItems((prev) => {
        const existing = prev.find(
          (i) => String(i.id) === String(item.id) && i.size === size
        );
        if (existing) {
          return prev.map((i) =>
            String(i.id) === String(item.id) && i.size === size
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { ...item, size, quantity: qty }];
      });

      if (token) {
        enqueue(async () => {
          const server = await addCartItemApi(token, {
            product_id: String(item.id),
            quantity: qty,
            size: size || undefined,
          });
          applyServerCart(server);
        });
      }
    },
    [token, applyServerCart, enqueue]
  );

  // หา row id ของสินค้าบน server — ถ้าไม่มีใน cache ให้ดึงตะกร้าล่าสุดมาหา
  const resolveRowId = useCallback(
    async (
      authToken: string,
      id: string | number,
      size: string
    ): Promise<string | null> => {
      const cached = serverRowIds.current.get(rowKey(id, size));
      if (cached) return cached;
      try {
        const summary = await getCartApi(authToken);
        const { rowIds } = mapServerItems(summary.items);
        serverRowIds.current = rowIds;
        return rowIds.get(rowKey(id, size)) ?? null;
      } catch {
        return null;
      }
    },
    []
  );

  const removeItem = useCallback(
    (id: string | number, size: string) => {
      setItems((prev) =>
        prev.filter((i) => !(String(i.id) === String(id) && i.size === size))
      );

      if (token) {
        enqueue(async () => {
          const rowId = await resolveRowId(token, id, size);
          if (rowId) {
            const server = await removeCartItemApi(token, rowId);
            applyServerCart(server);
          } else {
            // หา row ไม่เจอ (เช่น เพิ่งลบไปแล้ว) — sync ให้ตรงกับ server
            const summary = await getCartApi(token);
            applyServerCart(summary.items);
          }
        });
      }
    },
    [token, applyServerCart, resolveRowId, enqueue]
  );

  const updateQuantity = useCallback(
    (id: string | number, size: string, qty: number) => {
      if (qty < 1) return;
      setItems((prev) =>
        prev.map((i) =>
          String(i.id) === String(id) && i.size === size
            ? { ...i, quantity: qty }
            : i
        )
      );

      if (token) {
        enqueue(async () => {
          const rowId = await resolveRowId(token, id, size);
          if (rowId) {
            const server = await updateCartItemApi(token, rowId, qty);
            applyServerCart(server);
          }
        });
      }
    },
    [token, applyServerCart, resolveRowId, enqueue]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    serverRowIds.current = new Map();
    if (token) {
      enqueue(async () => {
        await clearCartApi(token);
        applyServerCart([]);
      });
    }
  }, [token, applyServerCart, enqueue]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
