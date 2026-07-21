"use client";

import { ChevronLeft, ChevronRight, Star, ShoppingCart, Dumbbell, Shirt, HeartPulse, Trophy, Apple, Footprints, Waves, Bike } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import type { CartProduct } from "./CartPanel";
import { getHomepageSections, toProductCard } from "@/lib/api";
import FavoriteButton from "./FavoriteButton";

interface Banner {
  title: string;
  subtitle?: string;
  image: string;
  cta: string;
  link?: string;
}

interface SubCat {
  label: string;
  icon?: LucideIcon;
  image?: string;
  link?: string;
}

interface Product {
  id: number | string;
  image: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  tags: string[];
}

// map icon_name (string จาก API) → Lucide component
const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  Dumbbell,
  Trophy,
  HeartPulse,
  Apple,
  Footprints,
  Waves,
  Bike,
};

const fallbackBanners: Banner[] = [
  {
    title: "เพาะกาย",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/fitness/bodybuilding",
  },
  {
    title: "คาร์ดิโอ",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/fitness/cardio",
  },
  {
    title: "โฟลว์ไปกับ\nทุกท่วงท่า",
    subtitle: "เมื่อโลกไม่หยุด",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/fitness/yoga",
  },
  {
    title: "เสริมความแข็งแรง\nจากข้างใน",
    subtitle: "พิลาทิสและซอฟต์เทรนนิ่ง",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/fitness/pilates",
  },
];

const fallbackSubCategories: SubCat[] = [
  { label: "เสื้อผ้าฟิตเนส\nผู้ชาย", icon: Shirt },
  { label: "เสื้อผ้าฟิตเนส\nผู้หญิง", icon: Shirt },
  { label: "เปรียบเทียบ", icon: Dumbbell },
  { label: "สูตร", icon: Trophy },
  { label: "เคลื่อนไหว", icon: HeartPulse },
  { label: "ยางยืด", icon: Waves },
  { label: "ดัมเบล", icon: Dumbbell },
  { label: "แทรมโพลีน", icon: Footprints },
  { label: "เชือกกระโดด", icon: Bike },
  { label: "อาหารเสริมและ\nการฟื้นฟู", icon: Apple },
];

const fallbackProducts: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop",
    name: "แถบยางยืดออกกำลังกายเซต 3 ชิ้น แรงต้าน 10, 20 และ 30 กิโลกรัม",
    brand: "DOMYOS",
    price: 700,
    rating: 4.8,
    reviews: 154,
    tags: ["สินค้าใหม่"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&h=600&fit=crop",
    name: "ตุ้มน้ำหนักปรับได้สำหรับการออกแรง นั่งและยกครอสเทรนนิ่ง 12-24 กิโลกรัม",
    brand: "DOMYOS",
    price: 2550,
    rating: 4.7,
    reviews: 124,
    tags: ["สินค้าใหม่"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=600&fit=crop",
    name: "ลู่วิ่งไฟฟ้า 220 โวลต์รุ่น Run 700",
    brand: "DOMYOS",
    price: 29000,
    rating: 4.7,
    reviews: 24,
    tags: [],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    name: "กระเป๋าอุปกรณ์เทรนนิ่งขนาดใหญ่ เทรนนิ่งขนาด 30 ลิตร (สีดำ)",
    brand: "DOMYOS",
    price: 1950,
    rating: 4.9,
    reviews: 106,
    tags: [],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=600&fit=crop",
    name: "เสื้อกล้าม แขนสั้น เว้าหลัง สำหรับผู้หญิง (สีน้ำเงินอ่อน)",
    brand: "DOMYOS",
    price: 320,
    rating: 4.8,
    reviews: 76,
    tags: [],
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1515775538093-d2d95c71bd48?w=600&h=600&fit=crop",
    name: "กางเกงออกกำลังกายขายาวอากาศ ใส่สบาย สำหรับผู้ชาย (สีดำ)",
    brand: "DOMYOS",
    price: 159,
    rating: 4.8,
    reviews: 17470,
    tags: [],
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=600&fit=crop",
    name: "เครื่องออกกำลังกาย 3-in-1 มัลติฟังก์ชั่น สำหรับผู้ชาย (สีดำ)",
    brand: "DOMYOS",
    price: 30000,
    rating: 4.7,
    reviews: 473,
    tags: [],
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
    name: "เสื่อโยคะ Comfort ขนาด 173 x 61 ซม. หนา 8 มม. สีม่วง",
    brand: "KIMJALY",
    price: 399,
    rating: 4.6,
    reviews: 8920,
    tags: [],
  },
];

interface FitnessCategorySectionProps {
  onAddToCart?: (product: CartProduct) => void;
}

export default function FitnessCategorySection({ onAddToCart }: FitnessCategorySectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const [title, setTitle] = useState("ค้นหาสินค้าฟิตเนส");
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [subCategories, setSubCategories] = useState<SubCat[]>(
    fallbackSubCategories
  );
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    getHomepageSections()
      .then((sections) => {
        const section = sections.find((s) => s.slug === "fitness-products");
        if (!section) return;
        setTitle(section.title);
        if (section.banners.length > 0) {
          setBanners(
            section.banners.map((b) => ({
              title: b.title,
              subtitle: b.subtitle ?? undefined,
              image: b.image,
              cta: b.cta ?? "ค้นหาเพิ่มเติม",
              link: b.link ?? undefined,
            }))
          );
        }
        if (section.sub_categories.length > 0) {
          setSubCategories(
            section.sub_categories.map((s) => ({
              label: s.label,
              icon: s.icon_name ? ICON_MAP[s.icon_name] : undefined,
              image: s.image ?? undefined,
              link: s.link ?? undefined,
            }))
          );
        }
        if (section.products.length > 0) {
          setProducts(section.products.map(toProductCard));
        }
      })
      .catch(() => {
        /* ใช้ fallback ถ้า API ล่ม */
      });
  }, []);

  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerTrackRef = useRef<HTMLDivElement>(null);
  const bannerDragStartX = useRef(0);
  const [bannerDragOffset, setBannerDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);

  const goToBanner = useCallback(
    (idx: number) => {
      let target = idx;
      if (target < 0) target = banners.length - 1;
      if (target >= banners.length) target = 0;
      setBannerIndex(target);
    },
    [banners.length]
  );

  const onBannerTouchStart = (e: React.TouchEvent) => {
    setIsBannerDragging(true);
    bannerDragStartX.current = e.touches[0].clientX;
  };
  const onBannerTouchMove = (e: React.TouchEvent) => {
    if (!isBannerDragging) return;
    setBannerDragOffset(e.touches[0].clientX - bannerDragStartX.current);
  };
  const onBannerTouchEnd = () => {
    if (!isBannerDragging) return;
    setIsBannerDragging(false);
    const threshold = 50;
    if (bannerDragOffset < -threshold) goToBanner(bannerIndex + 1);
    else if (bannerDragOffset > threshold) goToBanner(bannerIndex - 1);
    setBannerDragOffset(0);
  };

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = trackRef.current.offsetWidth * 0.6;
    trackRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.scrollBehavior = "smooth";
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    dragStartX.current = e.touches[0].clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = "auto";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    trackRef.current.scrollLeft = scrollStartX.current - (e.touches[0].clientX - dragStartX.current);
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-navy mb-4">{title}</h2>

        {/* Mobile: Banner Carousel */}
        <div className="md:hidden mb-6">
          <div
            className="relative overflow-hidden rounded-xl"
            onTouchStart={onBannerTouchStart}
            onTouchMove={onBannerTouchMove}
            onTouchEnd={onBannerTouchEnd}
            ref={bannerTrackRef}
          >
            <div
              className={`flex ${isBannerDragging ? "" : "transition-transform duration-400 ease-out"}`}
              style={{
                width: `${banners.length * 100}%`,
                transform: `translateX(calc(-${bannerIndex * (100 / banners.length)}% + ${isBannerDragging ? bannerDragOffset : 0}px))`,
              }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.title}
                  className="relative shrink-0 rounded-xl overflow-hidden"
                  style={{ width: `${100 / banners.length}%`, paddingBottom: `${55 / banners.length}%` }}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 font-[family-name:var(--font-noto-thai)]">
                    {banner.subtitle && (
                      <p className="text-[10px] text-white/70 mb-0.5">{banner.subtitle}</p>
                    )}
                    <h3 className="text-xl font-black text-white leading-tight whitespace-pre-line">
                      {banner.title}
                    </h3>
                    <Link
                      href={banner.link ?? "#"}
                      className="inline-block mt-2 bg-white text-navy text-xs font-semibold px-4 py-1.5 rounded-full"
                    >
                      {banner.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dots + Arrows */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <button onClick={() => goToBanner(bannerIndex - 1)} className="p-1">
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goToBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === bannerIndex ? "bg-navy scale-125" : "bg-gray-300"
                }`}
              />
            ))}
            <button onClick={() => goToBanner(bannerIndex + 1)} className="p-1">
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Desktop: Banner Grid */}
        <div className="hidden md:grid grid-cols-4 gap-3 mb-6">
          {banners.map((banner) => (
            <div
              key={banner.title}
              className="relative rounded-xl overflow-hidden group cursor-pointer"
              style={{ paddingBottom: "75%" }}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 font-[family-name:var(--font-noto-thai)]">
                {banner.subtitle && (
                  <p className="text-[10px] text-white/70 mb-0.5">{banner.subtitle}</p>
                )}
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight whitespace-pre-line">
                  {banner.title}
                </h3>
                <Link
                  href={banner.link ?? "#"}
                  className="inline-block mt-2 bg-white text-navy text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {banner.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-category Icons */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide mb-4">
          {subCategories.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={`${cat.label}-${i}`}
                href={cat.link ?? "#"}
                className="flex flex-col items-center gap-1.5 min-w-[65px] group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-blue-accent bg-white flex items-center justify-center overflow-hidden group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover"
                    />
                  ) : IconComponent ? (
                    <IconComponent size={22} className="text-blue-accent" />
                  ) : null}
                </div>
                <span className="text-[10px] text-text-primary text-center leading-tight whitespace-pre-line group-hover:text-blue-accent transition-colors">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Product Carousel */}
        <div className="relative group">
          <div
            ref={trackRef}
            className={`flex gap-4 overflow-x-auto scrollbar-hide select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[200px] max-w-[200px] shrink-0"
              >
                <Link href={`/product/${product.id}`} className="block relative bg-gray-50 rounded-lg overflow-hidden mb-2">
                  <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.tags.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-accent text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                <p className="text-base font-bold text-navy mb-0.5">
                  ฿{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-[32px]">
                  {product.name}
                </p>
                <p className="text-[10px] text-text-secondary uppercase mb-1.5">
                  {product.brand}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] text-text-secondary">
                      {product.rating} ({product.reviews.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FavoriteButton
                      product={{
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        image: product.image,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        discount: product.discount,
                        rating: product.rating,
                        reviews: product.reviews,
                      }}
                    />
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => onAddToCart?.({
                        id: product.id,
                        image: product.image,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                      })}
                    >
                      <ShoppingCart size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft size={20} className="text-navy" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRight size={20} className="text-navy" />
          </button>
        </div>
      </div>
    </section>
  );
}
