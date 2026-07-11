"use client";

import Link from "next/link";
import { Heart, Star, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useFavorites } from "@/lib/FavoritesContext";

export default function FavoritesPage() {
  const { items, removeFavorite, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Heart size={24} className="fill-red-500 text-red-500" />
            สินค้าโปรด
            {items.length > 0 && (
              <span className="text-base font-normal text-text-secondary">
                ({items.length})
              </span>
            )}
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-1 text-sm text-text-secondary hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
              ล้างทั้งหมด
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-gray-300" />
            </div>
            <p className="text-lg text-text-secondary mb-1">
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((item) => {
              const discountPercent =
                item.originalPrice && item.originalPrice > item.price
                  ? Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100
                    )
                  : item.discount ?? null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
                >
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
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="เอาออกจากสินค้าโปรด"
                    >
                      <Heart size={18} className="fill-red-500 text-red-500" />
                    </button>
                    {discountPercent && (
                      <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500 text-white">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

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
                      <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-[32px]">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
