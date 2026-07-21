"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import ProductGridCard from "@/components/ProductGridCard";
import CartPanel, { type CartProduct } from "@/components/CartPanel";
import { getActiveDeals, dealToProductCard, type ProductCard } from "@/lib/api";

export default function DealsPage() {
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProduct | null>(null);

  const handleAddToCart = (product: CartProduct) => {
    setCartProduct(product);
    setCartOpen(true);
  };

  useEffect(() => {
    getActiveDeals()
      .then((deals) => {
        const mapped = deals
          .map(dealToProductCard)
          .filter((c): c is ProductCard => c !== null);
        setCards(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-linear-to-r from-orange to-red-500 px-6 py-8 text-white">
          <div className="flex items-center gap-3">
            <Icon icon="fluent-emoji:fire" width={40} height={40} />
            <div>
              <h1 className="text-2xl font-black">ดีลพิเศษ</h1>
              <p className="text-sm text-white/90">
                รวมสินค้าลดราคาสุดคุ้ม ห้ามพลาด!
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-accent" />
          </div>
        ) : cards.length === 0 ? (
          <div className="py-20 text-center">
            <Icon
              icon="fluent-emoji:fire"
              width={56}
              height={56}
              className="mx-auto mb-4 opacity-40"
            />
            <p className="text-text-secondary">ยังไม่มีดีลพิเศษในขณะนี้</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-4">
              พบ {cards.length.toLocaleString()} รายการ
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cards.map((card) => (
                <ProductGridCard
                  key={card.id}
                  card={card}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        product={cartProduct}
      />
      <FeedbackPanel />
    </div>
  );
}
