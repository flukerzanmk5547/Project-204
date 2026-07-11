"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import FeedbackPanel from "@/components/FeedbackPanel";
import Footer from "@/components/Footer";
import { useFavorites } from "@/lib/FavoritesContext";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Truck,
  Store,
  Minus,
  Plus,
  ChevronDown,
  Heart,
  Share2,
  ShoppingCart,
  Check,
} from "lucide-react";

const allProducts: Record<string, ProductData> = {
  "1": {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop",
    ],
    name: "รองเท้าวิ่งเสริมแผ่นคาร์บอนสำหรับผู้ชายรุ่น Kipstorm Elite (สีขาว/ชมพู)",
    brand: "KIPRUN",
    sku: "8961380",
    price: 5200,
    rating: 4.8,
    reviews: 48,
    tags: ["สินค้าใหม่"],
    colors: [
      { name: "ขาว/ชมพู", hex: "#f5f0f0" },
    ],
    sizes: [
      { label: "39", available: true },
      { label: "40", available: true },
      { label: "41", available: true },
      { label: "42", available: true },
      { label: "43", available: true },
      { label: "44", available: false },
      { label: "45", available: true },
    ],
    description: "รองเท้ารุ่น Kipstorm คือคำตอบเพื่อการแข่งขัน มาพร้อมโฟม Fastech+ เพื่อให้แรงส่งและความสบายเต็มเปี่ยมสำหรับทุกการแข่งขัน ไม่ว่าจะเป็นฮาล์ฟมาราธอนหรือมาราธอน",
    descriptionFull: "ออกแบบมาเพื่อตอบสนองจินตนาการของคุณ โดยเฉพาะ Méline Rollin และ Jimmy Gressier ด้วยแผ่นคาร์บอน น้ำหนักเบา และดูดซับแรงกระแทกจากทุกประเภทและสนามไส่",
    benefits: [
      { title: "แรงสะท้อนกลับ", desc: "โฟม Fastech+: ให้แรงส่งและการส่งคืนพลังงานเต็มเปี่ยมชนะแข่งขัน" },
      { title: "น้ำหนักเบา", desc: "น้ำหนักเบามากเพียง 215 กรัม (ขนาด 42) ช่วยลดความเหนื่อยล้าและเสริมประสิทธิภาพ" },
      { title: "รองรับแรงกระแทก", desc: "โฟม Fastech+ ให้การปกป้องยาวนาน แม้ในระยะทางไกลระดับมาราธอน" },
      { title: "ความสะดวกสบายในการสวมใส่", desc: "ส่วนบนรองเท้าถักและพื้นรองเท้าแบบมินิมอล ให้สัมผัสสบายไม่เกิดการเสียดสี" },
    ],
    relatedProducts: [
      { id: 101, image: "https://picsum.photos/id/21/400/400", name: "รองเท้าวิ่งสำหรับผู้ชายรุ่น RUN 100 (สีเทา)", brand: "DECATHLON", price: 399, rating: 4.5, reviews: 1250, tags: ["สินค้าใหม่"] },
      { id: 102, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop", name: "รองเท้าวิ่งเทรลสำหรับผู้ชายรุ่น PS 990 Dynamic (สีน้ำเงิน/ส้ม)", brand: "KUIKMA", price: 2500, rating: 4.3, reviews: 241, tags: [] },
      { id: 103, image: "https://picsum.photos/id/96/400/400", name: "รองเท้าวิ่งสำหรับผู้ชายรุ่น JOGFLOW 100.1 (สีดำ/เทา)", brand: "KALENJI", price: 599, rating: 4.8, reviews: 502, tags: ["กันน้ำ"] },
      { id: 104, image: "https://picsum.photos/id/160/400/400", name: "รองเท้าบูทเดินป่าเทรคกิ้งหนักบึกบึน สำหรับผู้ชายรุ่น MT500", brand: "SIMOND", price: 4800, rating: 4.9, reviews: 108, tags: [] },
      { id: 105, image: "https://picsum.photos/id/119/400/400", name: "รองเท้า เดินป่า ข้อต่ำ กันน้ำ สำหรับผู้ชาย รุ่น MH900 (สีดำ)", brand: "QUECHUA", price: 3200, rating: 4.7, reviews: 2364, tags: [] },
      { id: 106, image: "https://picsum.photos/id/103/400/400", name: "รองเท้าเดินป่าเทรคกิ้งหนักบึกบึน สำหรับผู้ชายรุ่น MT100 (สีดำ)", brand: "QUECHUA", price: 3200, rating: 4.6, reviews: 389, tags: ["สินค้าใหม่"] },
    ],
    bundleItems: [
      { id: 201, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop", name: "รองเท้าวิ่งเสริมแผ่นคาร์บอนสำหรับผู้ชายรุ่น Kipstorm Elite (สีขาว/ชมพู)", price: 5200, checked: true },
      { id: 202, image: "https://picsum.photos/id/103/200/200", name: "ถุงเท้าไวเซอร์รุ่น Run 100 แพ็ค 3 คู่ (สีดำ)", price: 79, checked: true },
    ],
    reviewDetails: [
      { name: "Krzysztof", country: "Poland", date: "09/07/2026", rating: 5, title: "Buty", comment: "Dobrze się biega", translated: true },
      { name: "THIERRY", country: "Hong Kong SAR China", date: "07/07/2026", rating: 1, title: "Triggering Sesamoiditis !!!", comment: "The explosive foam delivers high energy return, but seems it lacks the shock absorbing platform needed to \"offload\" the forefoot - as a result I got Sesamoiditis injury after a few runs !!! Never happened before and i've been running about 3,000km with carbo...", translated: true },
      { name: "คุณเอ็ม", country: "Thailand", date: "01/07/2026", rating: 5, title: "รองเท้ามีแรงดังส่งดี น้ำหนักเบา...", comment: "รองเท้ามีแรงดังส่งดี น้ำหนักเบา วิ่งสนุกสนานวิ่งเก่งแข่งขันถูกใจ 170 ขึ้นไปฟรี", translated: false },
    ],
    ratingBreakdown: { 5: 43, 4: 2, 3: 1, 2: 1, 1: 1 },
  },
};

interface ProductData {
  id: number;
  images: string[];
  name: string;
  brand: string;
  sku: string;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  colors: { name: string; hex: string }[];
  sizes: { label: string; available: boolean }[];
  description: string;
  descriptionFull: string;
  benefits: { title: string; desc: string }[];
  relatedProducts: { id: number; image: string; name: string; brand: string; price: number; rating: number; reviews: number; tags: string[] }[];
  bundleItems: { id: number; image: string; name: string; price: number; checked: boolean }[];
  reviewDetails: { name: string; country: string; date: string; rating: number; title: string; comment: string; translated: boolean }[];
  ratingBreakdown: Record<number, number>;
}

function getProduct(id: string): ProductData {
  return allProducts[id] || allProducts["1"];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProduct(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [bundleChecked, setBundleChecked] = useState<Record<number, boolean>>(
    Object.fromEntries(product.bundleItems.map((item) => [item.id, item.checked]))
  );
  const productInfoRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const [headerHeight, setHeaderHeight] = useState(110);

  useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    measureHeader();

    const handleScroll = () => {
      measureHeader();
      if (productInfoRef.current) {
        const rect = productInfoRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < headerHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", measureHeader);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measureHeader);
    };
  }, [headerHeight]);

  const scrollRelated = (dir: "left" | "right") => {
    if (!relatedRef.current) return;
    relatedRef.current.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  const totalReviews = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0);
  const bundleTotal = product.bundleItems
    .filter((item) => bundleChecked[item.id])
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Sticky Product Bar - ติดใต้ Header */}
      <div
        className={`sticky z-45 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${
          showStickyBar ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: `${headerHeight}px` }}
      >
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy truncate">{product.name}</p>
              <p className="text-sm font-bold text-navy">฿{product.price.toLocaleString()}</p>
            </div>
          </div>
          <button className="bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shrink-0 ml-4">
            เพิ่มในตะกร้า
          </button>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-3 text-xs text-text-secondary overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-accent">หน้าหลัก</Link>
          <ChevronRight size={12} />
          <span className="hover:text-blue-accent cursor-pointer">กีฬาประเภทต่างๆ</span>
          <ChevronRight size={12} />
          <span className="hover:text-blue-accent cursor-pointer">วิ่ง & เดิน</span>
          <ChevronRight size={12} />
          <span className="hover:text-blue-accent cursor-pointer">วิ่ง</span>
          <ChevronRight size={12} />
          <span className="hover:text-blue-accent cursor-pointer">รองเท้าวิ่ง</span>
          <ChevronRight size={12} />
          <span className="text-text-primary">รองเท้าวิ่งเสริมแผ่นคาร์บอน</span>
        </nav>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 pb-10" ref={productInfoRef}>
          {/* Left: Image Gallery */}
          <div className="flex-1">
            <div className="flex flex-col-reverse lg:flex-row gap-3">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-blue-accent" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="relative w-full rounded-lg overflow-hidden bg-gray-50" style={{ paddingBottom: "100%" }}>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() =>
                      toggleFavorite({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        image: product.images[0],
                        price: product.price,
                        rating: product.rating,
                        reviews: product.reviews,
                      })
                    }
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                    aria-label="เพิ่มในสินค้าโปรด"
                  >
                    <Heart
                      size={20}
                      className={
                        fav ? "fill-red-500 text-red-500" : "text-text-secondary"
                      }
                    />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50">
                    <Share2 size={20} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-[400px] shrink-0">
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex gap-2 mb-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-accent text-white">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-text-secondary uppercase mb-1">
              {product.brand} | อ้างอิง: {product.sku}
            </p>
            <h1 className="text-xl font-bold text-navy mb-2 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-navy">{product.rating}</span>
              <span className="text-sm text-text-secondary">({product.reviews})</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-navy mb-4">
              ฿{product.price.toLocaleString()}
            </p>

            {/* Color Selector */}
            <div className="mb-5">
              <p className="text-sm font-bold text-text-primary mb-2">ตัวเลือกอื่นๆ:</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className="w-12 h-12 rounded-lg border-2 border-blue-accent overflow-hidden"
                    title={color.name}
                  >
                    <img src={product.images[0]} alt={color.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-text-primary">ขนาด:</p>
                <button className="text-sm text-blue-accent hover:underline">ค้นหาไซส์ของคุณ</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    disabled={!size.available}
                    onClick={() => setSelectedSize(size.label)}
                    className={`py-2.5 text-sm rounded-lg border-2 transition-all ${
                      selectedSize === size.label
                        ? "border-blue-accent bg-blue-50 text-blue-accent font-semibold"
                        : size.available
                        ? "border-gray-300 text-text-primary hover:border-gray-400"
                        : "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <p className="text-sm font-bold text-text-primary mb-2">จำนวน:</p>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border-2 border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-navy"} />
                </button>
                <div className="w-14 h-11 border-y-2 border-gray-300 flex items-center justify-center">
                  <span className="text-sm font-semibold">{quantity}</span>
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border-2 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={16} className="text-navy" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full py-3.5 bg-blue-accent hover:bg-blue-hover text-white font-bold rounded-lg transition-colors text-base mb-5">
              เพิ่มในตะกร้า
            </button>

            {/* Shipping Info */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-bold text-text-primary mb-3">ข้อมูลการจัดส่งและการเข้ารับสินค้าด้วยตนเอง</p>
              <p className="text-xs text-text-secondary mb-3">กรุณาเลือกขนาดเพื่อดูตัวเลือกการจัดส่ง</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <Truck size={20} className="text-navy shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">จัดส่งถึงบ้านแบบมาตรฐาน</p>
                    <p className="text-xs text-text-secondary">สั่งครบ 499 บาท จัดส่งฟรีทั่วประเทศไทย</p>
                  </div>
                  <button className="text-xs text-blue-accent hover:underline shrink-0">เลือกไซส์</button>
                </div>
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <Store size={20} className="text-navy shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">รับสินค้าที่ร้านค้า</p>
                    <p className="text-xs text-text-secondary">ฟรี</p>
                  </div>
                  <button className="text-xs text-blue-accent hover:underline shrink-0">เลือกไซส์</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-navy mb-4">ท่านอาจจะชอบสิ่งนี้</h2>
          <div className="relative group">
            <div
              ref={relatedRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide"
            >
              {product.relatedProducts.map((rp) => (
                <div key={rp.id} className="min-w-[200px] max-w-[200px] shrink-0">
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-2">
                    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                      <img src={rp.image} alt={rp.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    {rp.tags.length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {rp.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-accent text-white">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-base font-bold text-navy mb-0.5">฿{rp.price.toLocaleString()}</p>
                  <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-[32px]">{rp.name}</p>
                  <p className="text-[10px] text-text-secondary uppercase mb-1">{rp.brand}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px] text-text-secondary">{rp.rating} ({rp.reviews.toLocaleString()})</span>
                    </div>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full">
                      <ShoppingCart size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollRelated("left")} className="absolute left-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all">
              <ChevronLeft size={20} className="text-navy" />
            </button>
            <button onClick={() => scrollRelated("right")} className="absolute right-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={20} className="text-navy" />
            </button>
          </div>
        </section>

        {/* Bundle Section */}
        <section className="py-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-navy mb-4">ซื้อเป็นเซ็ต</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3">
              {product.bundleItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setBundleChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                    }}
                    className={`w-5 h-5 rounded shrink-0 flex items-center justify-center border-2 transition-colors ${
                      bundleChecked[item.id] ? "bg-blue-accent border-blue-accent" : "border-gray-400"
                    }`}
                  >
                    {bundleChecked[item.id] && <Check size={14} className="text-white" />}
                  </div>
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy">฿{item.price.toLocaleString()}</p>
                    <p className="text-xs text-text-primary truncate">{item.name}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="lg:w-[280px] shrink-0">
              <div className="bg-gray-50 rounded-lg p-5 sticky top-[180px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-text-primary">ยอดชำระเงิน<br />ทั้งหมด:</span>
                  <span className="text-2xl font-bold text-navy">฿{bundleTotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-3 bg-blue-accent hover:bg-blue-hover text-white font-semibold rounded-lg text-sm transition-colors">
                  เพิ่มสินค้า ลงในตะกร้า
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-navy mb-4">คำอธิบาย</h2>
          <p className="text-sm text-text-primary leading-relaxed mb-3">{product.description}</p>
          <p className="text-sm text-text-secondary leading-relaxed mb-2">{product.descriptionFull}</p>
          <p className="text-xs text-text-secondary">• อ้างอิง {product.sku}</p>
        </section>

        {/* Benefits */}
        <section className="py-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-navy mb-6">ประโยชน์ของสินค้า</h2>
          <div className="space-y-6">
            {product.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-navy">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical & Composition (Accordion style) */}
        <section className="py-4 border-t border-gray-200">
          <button className="flex items-center justify-between w-full py-4 text-left">
            <h2 className="text-base font-bold text-navy">ข้อมูลทางเทคนิค</h2>
            <ChevronDown size={20} className="text-gray-400" />
          </button>
        </section>
        <section className="py-4 border-t border-gray-200">
          <button className="flex items-center justify-between w-full py-4 text-left">
            <h2 className="text-base font-bold text-navy">องค์ประกอบ / คำแนะนำ</h2>
            <ChevronDown size={20} className="text-gray-400" />
          </button>
        </section>

        {/* Reviews */}
        <section className="py-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-navy mb-6">รีวิว</h2>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Rating Summary */}
            <div className="md:w-[220px] shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <Star size={24} className="fill-amber-400 text-amber-400" />
                  <span className="text-4xl font-bold text-navy">{product.rating}</span>
                </div>
                <button className="text-xs border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50">
                  เขียนรีวิว
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-1">({totalReviews} รีวิว)</p>
              <p className="text-xs text-text-secondary">73% ของลูกค้าแนะนำสินค้านี้</p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product.ratingBreakdown[star] || 0;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary w-4 text-right">{star}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-accent rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-text-secondary w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-0">
            {product.reviewDetails.map((review, i) => (
              <div key={i} className="py-5 border-t border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-[180px] shrink-0">
                    <p className="text-sm font-bold text-text-primary">{review.name}</p>
                    <div className="flex gap-0.5 my-1">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary">{review.country} | {review.date}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-primary mb-1">{review.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                    {review.translated && (
                      <p className="text-xs text-text-secondary mt-1 italic">แปลที่นี้ (โดย Google)</p>
                    )}
                    <button className="text-xs text-orange hover:underline mt-2">รายงานการล่วงละเมิด</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
