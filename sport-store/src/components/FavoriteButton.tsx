"use client";

import { Heart } from "lucide-react";
import { Icon } from "@iconify/react";
import { useFavorites, type FavoriteItem } from "@/lib/FavoritesContext";

interface FavoriteButtonProps {
  product: FavoriteItem;
  size?: number;
  className?: string;
}

export default function FavoriteButton({
  product,
  size = 16,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
      }}
      className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${className}`}
      aria-label={fav ? "เอาออกจากสินค้าโปรด" : "เพิ่มในสินค้าโปรด"}
    >
      {fav ? (
        <Icon icon="fluent-emoji:red-heart" width={size} height={size} />
      ) : (
        <Heart size={size} className="text-text-secondary" />
      )}
    </button>
  );
}
