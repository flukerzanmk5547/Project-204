"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ServiceBar from "@/components/ServiceBar";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import DealsCarousel from "@/components/DealsCarousel";
import FitnessCategorySection from "@/components/FitnessCategorySection";
import RunningCategorySection from "@/components/RunningCategorySection";
import CartPanel, { type CartProduct } from "@/components/CartPanel";
import FeedbackPanel from "@/components/FeedbackPanel";
import Footer from "@/components/Footer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProduct | null>(null);

  const handleAddToCart = (product: CartProduct) => {
    setCartProduct(product);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroBanner />
        <ServiceBar />
        <CategoryShortcuts />
        <DealsCarousel onAddToCart={handleAddToCart} />
        <FitnessCategorySection onAddToCart={handleAddToCart} />
        <RunningCategorySection onAddToCart={handleAddToCart} />
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
