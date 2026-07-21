"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import type { ProductCard } from "@/lib/api";
import type { CartProduct } from "./CartPanel";
import FavoriteButton from "./FavoriteButton";

interface ProductGridCardProps {
  card: ProductCard;
  onAddToCart?: (product: CartProduct) => void;
}

export default function ProductGridCard({
  card,
  onAddToCart,
}: ProductGridCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.({
      id: card.id,
      image: card.image,
      name: card.name,
      brand: card.brand,
      price: card.price,
      originalPrice: card.originalPrice,
      discount: card.discount,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative">
        <Link
          href={`/product/${card.id}`}
          className="block relative bg-gray-50"
        >
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <img
              src={card.image}
              alt={card.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        {card.discount ? (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500 text-white">
            -{card.discount}%
          </span>
        ) : card.tags.length > 0 ? (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {card.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-accent text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <Link href={`/product/${card.id}`}>
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-base font-bold text-navy">
              ฿{card.price.toLocaleString()}
            </span>
            {card.originalPrice && (
              <span className="text-xs text-text-secondary line-through">
                ฿{card.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-8">
            {card.name}
          </p>
          <p className="text-[10px] text-text-secondary uppercase mb-1">
            {card.brand}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] text-text-secondary">
              {card.rating} ({card.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteButton
              product={{
                id: card.id,
                name: card.name,
                brand: card.brand,
                image: card.image,
                price: card.price,
                originalPrice: card.originalPrice,
                discount: card.discount,
                rating: card.rating,
                reviews: card.reviews,
              }}
            />
            <button
              onClick={handleAddToCart}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="ใส่ตะกร้า"
            >
              <ShoppingCart size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
