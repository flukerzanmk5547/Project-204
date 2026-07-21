"use client";

import { Icon } from "@iconify/react";

// ไอคอน 3D จากชุด fluent-emoji ของ Microsoft (โหลดผ่าน Iconify)
export const ICONS = {
  dashboard: "fluent-emoji:bar-chart",
  products: "fluent-emoji:package",
  promotions: "fluent-emoji:label",
  bundles: "fluent-emoji:wrapped-gift",
  attributes: "fluent-emoji:gem-stone",
  orders: "fluent-emoji:receipt",
  categories: "fluent-emoji:card-index-dividers",
  banners: "fluent-emoji:framed-picture",
  homepage: "fluent-emoji:house",
  payments: "fluent-emoji:credit-card",
  users: "fluent-emoji:busts-in-silhouette",
  brand: "fluent-emoji:trophy",
  sales: "fluent-emoji:money-bag",
  coin: "fluent-emoji:coin",
  trending: "fluent-emoji:chart-increasing",
  star: "fluent-emoji:star",
  fire: "fluent-emoji:fire",
  cart: "fluent-emoji:shopping-cart",
  crown: "fluent-emoji:crown",
  sparkles: "fluent-emoji:sparkles",
  qr: "fluent-emoji:mobile-phone",
  bank: "fluent-emoji:bank",
  chart: "fluent-emoji:bar-chart",
  ruler: "fluent-emoji:straight-ruler",
  palette: "fluent-emoji:artist-palette",
  box: "fluent-emoji:package",
  tag: "fluent-emoji:bookmark",
  analytics: "fluent-emoji:magnifying-glass-tilted-left",
  heart: "fluent-emoji:red-heart",
  eyes: "fluent-emoji:eyes",
  shopping: "fluent-emoji:shopping-bags",
} as const;

export type Icon3DName = keyof typeof ICONS;

export default function Icon3D({
  name,
  size = 24,
  className = "",
}: {
  name: Icon3DName;
  size?: number;
  className?: string;
}) {
  return (
    <Icon
      icon={ICONS[name]}
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
