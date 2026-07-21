"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Trash2, ShoppingCart, Loader2, Check, X } from "lucide-react";
import { Icon } from "@iconify/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useFavorites, type FavoriteItem } from "@/lib/FavoritesContext";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { getFavorites, type ApiFavorite } from "@/lib/api";

export default function FavoritesPage() {
  const { items: localItems, removeFavorite, clearFavorites, isFavorite, toggleFavorite } = useFavorites();
  const { token, isLoggedIn } = useAuth();
  const { addItem } = useCart();

  const [apiItems, setApiItems] = useState<ApiFavorite[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ดึงจาก API เมื่อ login
  useEffect(() => {
    if (!isLoggedIn || !token) {
      setApiItems([]);
      setLoaded(true);
      return;
    }

    setLoading(true);
    getFavorites(token, { limit: 100 })
      .then((res) => {
        setApiItems(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setLoaded(true);
      });
  }, [isLoggedIn, token]);

  // รวม items — login ใช้ API, ไม่ login ใช้ localStorage
  const displayItems: FavoriteItem[] = isLoggedIn
    ? apiItems
        .filter((f) => f.product)
        .map((f) => ({
          id: f.product!.id,
          name: f.product!.name,
          brand: f.product!.brand,
          image: f.product!.images?.[0] ?? "",
          price: f.product!.price,
          originalPrice: f.product!.original_price ?? undefined,
          rating: f.product!.rating ?? undefined,
          reviews: f.product!.review_count ?? undefined,
        }))
    : localItems;

  const handleRemove = (id: string | number) => {
    removeFavorite(id);
    setApiItems((prev) => prev.filter((f) => f.product?.id !== String(id)));
  };

  const handleClearAll = () => {
    clearFavorites();
    setApiItems([]);
  };

  const handleAddToCart = (item: FavoriteItem) => {
    addItem({
      id: String(item.id),
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      size: "-",
      quantity: 1,
    });
    setToast(item.name);
  };

  // ซ่อน toast อัตโนมัติหลัง 2.5 วินาที
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* หัวข้อ */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Icon icon="fluent-emoji:red-heart" width={28} height={28} />
            สินค้าโปรด
            {displayItems.length > 0 && (
              <span className="text-base font-normal text-text-secondary">
                ({displayItems.length} รายการ)
              </span>
            )}
          </h1>
          {displayItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-sm text-text-secondary hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
              ล้างทั้งหมด
            </button>
          )}
        </div>


        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-accent" />
          </div>
        )}

        {/* Empty */}
        {!loading && loaded && displayItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4">
              <Icon icon="fluent-emoji:red-heart" width={64} height={64} className="mx-auto opacity-30" />
            </div>
            <p className="text-lg font-semibold text-text-primary mb-1">
              ยังไม่มีสินค้าโปรด
            </p>
            <p className="text-sm text-text-secondary mb-6">
              กดรูปหัวใจที่สินค้าเพื่อบันทึกไว้ดูภายหลัง
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              ช้อปปิ้งเลย
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!loading && displayItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayItems.map((item) => {
              const discountPercent =
                item.originalPrice && item.originalPrice > item.price
                  ? Math.round(
                      ((item.originalPrice - item.price) /
                        item.originalPrice) *
                        100
                    )
                  : item.discount ?? null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative">
                    <Link
                      href={`/product/${item.id}`}
                      className="block relative bg-gray-50"
                    >
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "100%" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Heart button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="เอาออกจากสินค้าโปรด"
                    >
                      <Icon icon="fluent-emoji:red-heart" width={20} height={20} />
                    </button>

                    {/* Discount badge */}
                    {discountPercent && (
                      <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500 text-white">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <Link href={`/product/${item.id}`}>
                      <p className="text-base font-bold text-navy mb-0.5">
                        ฿{item.price.toLocaleString()}
                      </p>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <p className="text-xs text-text-secondary line-through mb-0.5">
                            ฿{item.originalPrice.toLocaleString()}
                          </p>
                        )}
                      <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-8">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-text-secondary uppercase mb-1">
                        {item.brand}
                      </p>
                      {typeof item.rating === "number" && item.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-[11px] text-text-secondary">
                            {item.rating}
                            {item.reviews
                              ? ` (${item.reviews.toLocaleString()})`
                              : ""}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Add to cart */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-accent py-2 text-xs font-semibold text-white transition hover:bg-blue-hover"
                    >
                      <ShoppingCart size={14} />
                      ใส่ตะกร้า
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Toast แจ้งเตือนเมื่อเพิ่มลงตะกร้า */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[60] flex max-w-sm items-start gap-3 rounded-lg bg-navy px-4 py-3 text-white shadow-xl animate-[fadeIn_0.2s_ease-out]"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
            <Check size={13} strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">เพิ่มลงตะกร้าแล้ว</p>
            <p className="truncate text-xs text-white/70">{toast}</p>
            <Link
              href="/cart"
              className="mt-1 inline-block text-xs font-semibold text-blue-300 underline hover:text-blue-200"
            >
              ดูตะกร้า
            </Link>
          </div>
          <button
            onClick={() => setToast(null)}
            aria-label="ปิด"
            className="shrink-0 text-white/50 transition hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
