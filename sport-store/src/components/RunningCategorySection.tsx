"use client";

import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import type { CartProduct } from "./CartPanel";
import { getHomepageSections, toProductCard } from "@/lib/api";

interface Banner {
  tag: string;
  title: string;
  image: string;
  cta: string;
  link?: string;
}

interface SubCat {
  label: string;
  image: string;
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

const fallbackBanners: Banner[] = [
  {
    tag: "วิ่ง",
    title: "ก้าวข้าม\nทุกขีดจำกัด",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/running-walking/running",
  },
  {
    tag: "วิ่งเทรล",
    title: "พร้อมลุย\nทุกเส้นทาง",
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/running-walking/trail-running",
  },
  {
    tag: "ส่องไอเทมสุขภาพและโภชนาการ",
    title: "ฟื้นฟูร่างกาย\nให้พร้อมลุย",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/running-walking/health-nutrition",
  },
];

const fallbackSubCategories: SubCat[] = [
  { label: "เสื้อวิ่ง", image: "https://picsum.photos/id/64/200/200" },
  { label: "กางเกงวิ่ง", image: "https://picsum.photos/id/91/200/200" },
  { label: "เสื้อเทคนิค", image: "https://picsum.photos/id/160/200/200" },
  { label: "รองเท้าวิ่ง", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { label: "เป้น้ำวิ่งเทรล", image: "https://picsum.photos/id/111/200/200" },
  { label: "อุปกรณ์เสริม\nสำหรับวิ่ง", image: "https://picsum.photos/id/57/200/200" },
  { label: "ถุงเท้า", image: "https://picsum.photos/id/103/200/200" },
  { label: "แว่นตาวิ่ง", image: "https://picsum.photos/id/3/200/200" },
  { label: "หมวก", image: "https://picsum.photos/id/58/200/200" },
  { label: "นาฬิกา", image: "https://picsum.photos/id/175/200/200" },
  { label: "ชุดวิ่ง", image: "https://picsum.photos/id/177/200/200" },
  { label: "โลชั่นอาร์นิก้า &\nแฟชั่นแอ่นเมือ", image: "https://picsum.photos/id/63/200/200" },
  { label: "ผลิตภัณฑ์กีฬา", image: "https://picsum.photos/id/26/200/200" },
];

const fallbackProducts: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
    name: "รองเท้าวิ่งเสริมแผ่นคาร์บอนสำหรับผู้ชายรุ่น Kipstorm Elite (สีขาว...)",
    brand: "KIPRUN",
    price: 5200,
    rating: 4.8,
    reviews: 48,
    tags: [],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
    name: "รองเท้าวิ่งเทรล สำหรับผู้ชาย Kipsummit Max (สีเหลือง)",
    brand: "KIPRUN",
    price: 3600,
    rating: 4.3,
    reviews: 241,
    tags: [],
  },
  {
    id: 3,
    image: "https://picsum.photos/id/91/600/600",
    name: "กางเกงรัดรูป/วิ่งเทรลอาชีพน้ำหนักเบา สำหรับผู้หญิงรุ่น Run 900 Light ...",
    brand: "KIPRUN",
    price: 650,
    rating: 4.8,
    reviews: 502,
    tags: [],
  },
  {
    id: 4,
    image: "https://picsum.photos/id/64/600/600",
    name: "เสื้อ แขนสั้น กันลม กันแดด สำหรับผู้ชาย รุ่น WIND 100 (สีน้ำเงิน...)",
    brand: "KIPRUN",
    price: 450,
    rating: 4.9,
    reviews: 108,
    tags: [],
  },
  {
    id: 5,
    image: "https://picsum.photos/id/58/600/600",
    name: "หมวกแก็ปไวเซอร์ Unisex เวอร์ชั่น 2 (สีดำ)",
    brand: "KIPRUN",
    price: 250,
    rating: 4.8,
    reviews: 2364,
    tags: ["สินค้าใหม่"],
  },
  {
    id: 6,
    image: "https://picsum.photos/id/175/600/600",
    name: "สมาร์ทวอทช์สำหรับนักกีฬาพร้อม GPS รุ่น Fit 100 S",
    brand: "DECATHLON",
    price: 1600,
    rating: 4.3,
    reviews: 389,
    tags: ["สินค้าใหม่"],
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    name: "กระเป๋า เป้ วิ่งเทรล สะพายหลัง ขนาด 10 ลิตร",
    brand: "KIPRUN",
    price: 1100,
    rating: 4.9,
    reviews: 117,
    tags: ["สินค้าใหม่"],
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1515775538093-d2d95c71bd48?w=600&h=600&fit=crop",
    name: "กางเกงวิ่งขาสั้น Breathable สำหรับผู้ชาย Run Dry+",
    brand: "KALENJI",
    price: 390,
    rating: 4.7,
    reviews: 8450,
    tags: [],
  },
];

interface RunningCategorySectionProps {
  onAddToCart?: (product: CartProduct) => void;
}

export default function RunningCategorySection({ onAddToCart }: RunningCategorySectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const [title, setTitle] = useState("ค้นพบเรื่องการวิ่ง สุขภาพ และโภชนาการ");
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [subCategories, setSubCategories] = useState<SubCat[]>(
    fallbackSubCategories
  );
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    getHomepageSections()
      .then((sections) => {
        const section = sections.find((s) => s.slug === "running-health");
        if (!section) return;
        setTitle(section.title);
        if (section.banners.length > 0) {
          setBanners(
            section.banners.map((b) => ({
              tag: b.subtitle ?? "",
              title: b.title,
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
              image: s.image ?? "",
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
  const [bannerDragOffset, setBannerDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const bannerDragStartX = useRef(0);

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
    <section className="py-8 bg-white border-t border-gray-border">
      <div className="max-w-[1440px] mx-auto px-4">
        <h2 className="text-lg font-bold text-navy mb-4">{title}</h2>

        {/* Mobile: Banner Carousel */}
        <div className="md:hidden mb-6">
          <div
            className="relative overflow-hidden rounded-xl"
            onTouchStart={onBannerTouchStart}
            onTouchMove={onBannerTouchMove}
            onTouchEnd={onBannerTouchEnd}
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
                    {banner.tag && (
                      <p className="text-[10px] text-white/70 mb-0.5">{banner.tag}</p>
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

        {/* Desktop: Banner Grid - 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
          {banners.map((banner) => (
            <div
              key={banner.title}
              className="relative rounded-xl overflow-hidden group cursor-pointer"
              style={{ paddingBottom: "65%" }}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 font-[family-name:var(--font-noto-thai)]">
                {banner.tag && (
                  <p className="text-[10px] text-white/70 mb-0.5">{banner.tag}</p>
                )}
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight whitespace-pre-line">
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

        {/* Sub-category Icons with images */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide mb-4">
          {subCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.link ?? "#"}
              className="flex flex-col items-center gap-1.5 min-w-[65px] group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-blue-accent overflow-hidden group-hover:scale-110 group-hover:border-orange transition-all">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-text-primary text-center leading-tight whitespace-pre-line group-hover:text-blue-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
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
