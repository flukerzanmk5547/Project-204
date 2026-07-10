"use client";

import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import type { CartProduct } from "./CartPanel";
import { getHomepageSections, toProductCard } from "@/lib/api";

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

const fallbackProducts: Product[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/1/400/400",
    name: "เก้าอี้สนามพับได้สำหรับการตั้งแคมป์ รุ่น BASIC",
    brand: "QUECHUA",
    price: 550,
    tags: ["ซื้อชิ้นที่ 2 ลด 50%"],
    rating: 4.8,
    reviews: 14962,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/10/400/400",
    name: "กระเป๋า เป้ เดินป่า ขนาด 38 ลิตร รุ่น MH500",
    brand: "QUECHUA",
    price: 1980,
    originalPrice: 2200,
    discount: 10,
    tags: ["Sale"],
    rating: 4.8,
    reviews: 7705,
  },
  {
    id: 3,
    image: "https://picsum.photos/id/20/400/400",
    name: "ที่นอนสำหรับ 1 คนใช้ในการตั้งแคมป์ รุ่น AIR BASIC ขนาด 70 ซม.",
    brand: "QUECHUA",
    price: 399,
    originalPrice: 699,
    discount: 33,
    tags: ["Sale"],
    rating: 4.5,
    reviews: 3787,
  },
  {
    id: 4,
    image: "https://picsum.photos/id/30/400/400",
    name: "หมวกเปียก ผู้ชาย สีเขียว สำหรับเดินป่า",
    brand: "SOLOGNAC",
    price: 300,
    originalPrice: 460,
    discount: 33,
    tags: ["สินค้าใหม่"],
    rating: 4.7,
    reviews: 9926,
  },
  {
    id: 5,
    image: "https://picsum.photos/id/40/400/400",
    name: "หมวกกันน้ำสำหรับตั้งแคมป์ รุ่น TREK 900 สีกาดอลีฟ",
    brand: "FORCLAZ",
    price: 490,
    originalPrice: 550,
    discount: 11,
    tags: ["กันน้ำ"],
    rating: 4.8,
    reviews: 2976,
  },
  {
    id: 6,
    image: "https://picsum.photos/id/48/400/400",
    name: "เสื้อแจ็คเก็ต กันลม กันฝน สำหรับผู้ชาย รุ่น NH550",
    brand: "QUECHUA",
    price: 1150,
    originalPrice: 1650,
    discount: 38,
    tags: ["Sale"],
    rating: 4.9,
    reviews: 734,
  },
  {
    id: 7,
    image: "https://picsum.photos/id/50/400/400",
    name: "ชุดไม้ ชิคเทนเนส 2 ไม้ และลูกเทนนิส รุ่น PI",
    brand: "DECATHLON",
    price: 990,
    originalPrice: 2500,
    discount: 60,
    tags: ["สินค้าใหม่"],
    rating: 4.9,
    reviews: 64,
  },
  {
    id: 8,
    image: "https://picsum.photos/id/60/400/400",
    name: "ถุงนอนผ้าฝ้ายสำหรับตั้งแคมป์ อุณหภูมิ 20°C",
    brand: "QUECHUA",
    price: 450,
    originalPrice: 590,
    discount: 24,
    tags: ["Sale"],
    rating: 4.6,
    reviews: 8523,
  },
  {
    id: 9,
    image: "https://picsum.photos/id/70/400/400",
    name: "รองเท้าเดินป่ากันน้ำ สำหรับผู้ชาย รุ่น MH500",
    brand: "QUECHUA",
    price: 1690,
    originalPrice: 1990,
    discount: 15,
    tags: ["กันน้ำ", "Sale"],
    rating: 4.7,
    reviews: 12450,
  },
  {
    id: 10,
    image: "https://picsum.photos/id/80/400/400",
    name: "เสื่อโยคะขนาด 180 x 60 ซม. หนา 8 มม.",
    brand: "DOMYOS",
    price: 299,
    originalPrice: 450,
    discount: 34,
    tags: ["Sale"],
    rating: 4.5,
    reviews: 6782,
  },
  {
    id: 11,
    image: "https://picsum.photos/id/216/400/400",
    name: "กระบอกน้ำสแตนเลส เก็บอุณหภูมิ 0.7 ลิตร",
    brand: "QUECHUA",
    price: 350,
    tags: ["สินค้าใหม่"],
    rating: 4.8,
    reviews: 3240,
  },
  {
    id: 12,
    image: "https://picsum.photos/id/217/400/400",
    name: "ลูกฟุตบอลไฮบริด F500 ขนาดเบอร์ 5",
    brand: "KIPSTA",
    price: 490,
    originalPrice: 590,
    discount: 17,
    tags: [],
    rating: 4.6,
    reviews: 9871,
  },
];

interface DealsCarouselProps {
  onAddToCart?: (product: CartProduct) => void;
}

export default function DealsCarousel({ onAddToCart }: DealsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [title, setTitle] = useState("ดีลเด็ด ห้ามพลาด!");
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  useEffect(() => {
    getHomepageSections()
      .then((sections) => {
        const deals = sections.find((s) => s.slug === "hot-deals");
        if (deals && deals.products.length > 0) {
          setProducts(deals.products.map(toProductCard));
          setTitle(deals.title);
        }
      })
      .catch(() => {
        /* ใช้ fallback ถ้า API ล่ม */
      });
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = trackRef.current.offsetWidth * 0.6;
    trackRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const diff = e.clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - diff;
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
    const diff = e.touches[0].clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - diff;
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Title */}
        <h2 className="text-xl font-black text-orange mb-4">{title}</h2>

        {/* Carousel */}
        <div className="relative group">
          {/* Track */}
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
                {/* Image */}
                <Link href={`/product/${product.id}`} className="block relative bg-gray-50 rounded-lg overflow-hidden mb-2">
                  <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          tag === "Sale"
                            ? "bg-yellow-400 text-yellow-900"
                            : tag === "สินค้าใหม่"
                            ? "bg-blue-accent text-white"
                            : tag === "กันน้ำ"
                            ? "bg-cyan-500 text-white"
                            : "bg-orange text-white"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-base font-bold text-navy">
                    ฿{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xs text-text-secondary line-through">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-red-500">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Name */}
                <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-[32px]">
                  {product.name}
                </p>

                {/* Brand */}
                <p className="text-[10px] text-text-secondary uppercase mb-1.5">
                  {product.brand}
                </p>

                {/* Rating + Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-amber-400 text-amber-400"
                    />
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
                      originalPrice: product.originalPrice,
                      discount: product.discount,
                    })}
                  >
                    <ShoppingCart size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="เลื่อนซ้าย"
          >
            <ChevronLeft size={20} className="text-navy" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="เลื่อนขวา"
          >
            <ChevronRight size={20} className="text-navy" />
          </button>
        </div>
      </div>
    </section>
  );
}
