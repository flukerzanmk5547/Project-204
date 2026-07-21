"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import FeedbackPanel from "@/components/FeedbackPanel";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavorites } from "@/lib/FavoritesContext";
import { useAuth } from "@/lib/AuthContext";
import {
  getProductReviews,
  createReview,
  deleteReview,
  type ApiReview,
  type ReviewSummary,
} from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import {
  getProductById,
  getRelatedProducts,
  ApiProduct,
  toProductCard,
  apiFetch,
} from "@/lib/api";
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
  Loader2,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  const { token, isLoggedIn, user } = useAuth();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const productInfoRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(110);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getProductById(id).catch(() => null),
      getRelatedProducts(id).catch(() => []),
    ]).then(([prod, rel]) => {
      if (!prod) {
        setError("ไม่พบสินค้า");
      } else {
        setProduct(prod);
        setRelated(rel);
      }
      setLoading(false);
    });

    // Track product view
    apiFetch("/api/v1/recommendations/view", {
      method: "POST",
      body: JSON.stringify({ product_id: id }),
    }).catch(() => {});
  }, [id]);

  // โหลดรีวิวของสินค้านี้
  useEffect(() => {
    getProductReviews(id)
      .then((res) => {
        setReviews(res.data);
        setReviewSummary(res.summary);
      })
      .catch(() => {
        setReviews([]);
        setReviewSummary(null);
      });
  }, [id]);

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

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.images?.[0] ?? "",
      price: product.price,
      size: selectedSize || "-",
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const scrollRelated = (dir: "left" | "right") => {
    if (!relatedRef.current) return;
    relatedRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-accent" />
          <span className="ml-3 text-text-secondary">กำลังโหลดข้อมูลสินค้า...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-xl font-bold text-navy mb-2">ไม่พบสินค้า</p>
          <p className="text-text-secondary mb-4">สินค้านี้อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
          <Link href="/" className="text-blue-accent hover:underline">กลับหน้าหลัก</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["https://picsum.photos/400/400?grayscale"];
  const sizes: { label: string; available: boolean }[] = (product.sizes ?? []).map((s: string) => ({
    label: s,
    available: true,
  }));
  const colors = product.colors ?? [];
  const benefits = product.benefits ?? [];
  const loadReviews = async (pid: string) => {
    try {
      const res = await getProductReviews(pid);
      setReviews(res.data);
      setReviewSummary(res.summary);
    } catch {
      /* ไม่มีรีวิวหรือโหลดไม่ได้ — ใช้ค่าสรุปจาก product แทน */
    }
  };

  const handleSubmitReview = async () => {
    if (!token || !product) return;
    setReviewSaving(true);
    setReviewError(null);
    try {
      await createReview(token, {
        product_id: String(product.id),
        rating: reviewRating,
        title: reviewTitle || undefined,
        comment: reviewComment || undefined,
      });
      setReviewFormOpen(false);
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      await loadReviews(String(product.id));
    } catch (e) {
      setReviewError(e instanceof Error ? e.message : "บันทึกรีวิวไม่สำเร็จ");
    } finally {
      setReviewSaving(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!token || !product) return;
    try {
      await deleteReview(token, id);
      await loadReviews(String(product.id));
    } catch {
      /* ignore */
    }
  };

  const reviewCount = reviewSummary?.total ?? product.review_count ?? 0;
  const rating = reviewSummary?.average ?? product.rating ?? 0;
  const fav = isFavorite(product.id as unknown as number);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Sticky Product Bar */}
      <div
        className={`sticky z-45 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${
          showStickyBar ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: `${headerHeight}px` }}
      >
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3 min-w-0">
            <img src={images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy truncate">{product.name}</p>
              <p className="text-sm font-bold text-navy">฿{product.price.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shrink-0 ml-4"
          >
            {addedToCart ? "✓ เพิ่มแล้ว" : "เพิ่มในตะกร้า"}
          </button>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-3 text-xs text-text-secondary overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-accent">หน้าหลัก</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 pb-10" ref={productInfoRef}>
          {/* Left: Image Gallery */}
          <div className="flex-1">
            <div className="flex flex-col-reverse lg:flex-row gap-3">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide">
                {images.map((img, i) => (
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
              <div className="flex-1 relative">
                <div className="relative w-full rounded-lg overflow-hidden bg-gray-50" style={{ paddingBottom: "100%" }}>
                  <img src={images[selectedImage]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() =>
                      toggleFavorite({
                        id: product.id as unknown as number,
                        name: product.name,
                        brand: product.brand,
                        image: images[0],
                        price: product.price,
                        rating,
                        reviews: reviewCount,
                      })
                    }
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                  >
                    <Heart size={20} className={fav ? "fill-red-500 text-red-500" : "text-text-secondary"} />
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
            {product.tags?.length > 0 && (
              <div className="flex gap-2 mb-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-accent text-white">{tag}</span>
                ))}
              </div>
            )}

            <p className="text-xs text-text-secondary uppercase mb-1">
              {product.brand} | อ้างอิง: {product.sku ?? "-"}
            </p>
            <h1 className="text-xl font-bold text-navy mb-2 leading-snug">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-navy">{rating}</span>
              <span className="text-sm text-text-secondary">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-navy">฿{product.price.toLocaleString()}</p>
              {product.original_price && product.original_price > product.price && (
                <p className="text-sm text-text-secondary line-through">฿{product.original_price.toLocaleString()}</p>
              )}
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-bold text-text-primary mb-2">ตัวเลือกอื่นๆ:</p>
                <div className="flex gap-2">
                  {colors.map((color: { name: string; hex: string }, i: number) => (
                    <button
                      key={i}
                      className="w-10 h-10 rounded-lg border-2 border-blue-accent"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-text-primary">ขนาด:</p>
                  <button className="text-sm text-blue-accent hover:underline">ค้นหาไซส์ของคุณ</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`py-2.5 text-sm rounded-lg border-2 transition-all ${
                        selectedSize === size.label
                          ? "border-blue-accent bg-blue-50 text-blue-accent font-semibold"
                          : "border-gray-300 text-text-primary hover:border-gray-400"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5">
              <p className="text-sm font-bold text-text-primary mb-2">จำนวน:</p>
              <div className="flex items-center gap-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 border-2 border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50">
                  <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-navy"} />
                </button>
                <div className="w-14 h-11 border-y-2 border-gray-300 flex items-center justify-center">
                  <span className="text-sm font-semibold">{quantity}</span>
                </div>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 border-2 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50">
                  <Plus size={16} className="text-navy" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-blue-accent hover:bg-blue-hover text-white font-bold rounded-lg transition-colors text-base"
              >
                {addedToCart ? "✓ เพิ่มในตะกร้าแล้ว" : "เพิ่มในตะกร้า"}
              </button>
              <FavoriteButton
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  image: images[0],
                  price: product.price,
                  originalPrice: product.original_price ?? undefined,
                  rating,
                  reviews: reviewCount,
                }}
                size={24}
                className="w-12 h-12 shrink-0 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 !p-0"
              />
            </div>

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
        {related.length > 0 && (
          <section className="py-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-navy mb-4">ท่านอาจจะชอบสิ่งนี้</h2>
            <div className="relative group">
              <div ref={relatedRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
                {related.map((rp) => {
                  const card = toProductCard(rp);
                  return (
                    <Link key={rp.id} href={`/product/${rp.id}`} className="min-w-[200px] max-w-[200px] shrink-0">
                      <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-2">
                        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                          <img src={card.image} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        {card.tags.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {card.tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-accent text-white">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-base font-bold text-navy mb-0.5">฿{card.price.toLocaleString()}</p>
                      <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-1 min-h-[32px]">{card.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase mb-1">{card.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-[11px] text-text-secondary">{card.rating} ({card.reviews.toLocaleString()})</span>
                        </div>
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
                      </div>
                    </Link>
                  );
                })}
              </div>
              <button onClick={() => scrollRelated("left")} className="absolute left-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft size={20} className="text-navy" />
              </button>
              <button onClick={() => scrollRelated("right")} className="absolute right-0 top-[100px] -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={20} className="text-navy" />
              </button>
            </div>
          </section>
        )}

        {/* Description */}
        {(product.description || product.description_full) && (
          <section className="py-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-navy mb-4">คำอธิบาย</h2>
            {product.description && <p className="text-sm text-text-primary leading-relaxed mb-3">{product.description}</p>}
            {product.description_full && <p className="text-sm text-text-secondary leading-relaxed mb-2">{product.description_full}</p>}
            <p className="text-xs text-text-secondary">• อ้างอิง {product.sku ?? "-"}</p>
          </section>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <section className="py-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-navy mb-6">ประโยชน์ของสินค้า</h2>
            <div className="space-y-6">
              {benefits.map((benefit: { title: string; desc: string }, i: number) => (
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
        )}

        {/* Technical Accordion */}
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
            {/* สรุปคะแนน */}
            <div className="md:w-[240px] shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <Star size={24} className="fill-amber-400 text-amber-400" />
                  <span className="text-4xl font-bold text-navy">{rating}</span>
                </div>
                {isLoggedIn ? (
                  <button
                    onClick={() => setReviewFormOpen((v) => !v)}
                    className="text-xs border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50"
                  >
                    {reviewFormOpen ? "ยกเลิก" : "เขียนรีวิว"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50"
                  >
                    เข้าสู่ระบบเพื่อรีวิว
                  </Link>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-3">({reviewCount} รีวิว)</p>

              {reviewSummary && reviewSummary.total > 0 && (
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const c = reviewSummary.breakdown[String(star)] ?? 0;
                    const pct = reviewSummary.total
                      ? (c / reviewSummary.total) * 100
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-3 text-[11px] text-text-secondary">
                          {star}
                        </span>
                        <Star
                          size={10}
                          className="fill-amber-400 text-amber-400 shrink-0"
                        />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: pct + "%" }}
                          />
                        </div>
                        <span className="w-5 text-right text-[11px] text-text-secondary">
                          {c}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ฟอร์มเขียนรีวิว + รายการรีวิว */}
            <div className="flex-1">
              {reviewFormOpen && (
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <p className="mb-2 text-sm font-semibold text-navy">
                    ให้คะแนนสินค้านี้
                  </p>
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        aria-label={"ให้ " + star + " ดาว"}
                      >
                        <Star
                          size={26}
                          className={
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="หัวข้อรีวิว (ไม่บังคับ)"
                    className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-accent"
                  />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="เล่าประสบการณ์การใช้งานสินค้านี้"
                    rows={3}
                    className="mb-2 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-accent"
                  />
                  {reviewError && (
                    <p className="mb-2 text-xs text-red-500">{reviewError}</p>
                  )}
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewSaving}
                    className="rounded-md bg-blue-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-hover disabled:bg-gray-300"
                  >
                    {reviewSaving ? "กำลังบันทึก..." : "ส่งรีวิว"}
                  </button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-secondary">
                  ยังไม่มีรีวิวสำหรับสินค้านี้ — เป็นคนแรกที่รีวิวได้เลย
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {reviews.map((rv) => (
                    <div key={rv.id} className="py-4">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= rv.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-navy">
                          {rv.author_name || "ผู้ใช้"}
                        </span>
                        {rv.is_verified && (
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700">
                            ซื้อจริง
                          </span>
                        )}
                        <span className="text-xs text-text-secondary">
                          {new Date(rv.created_at).toLocaleDateString("th-TH")}
                        </span>
                        {user?.id === rv.user_id && (
                          <button
                            onClick={() => handleDeleteReview(rv.id)}
                            className="ml-auto text-xs text-red-500 hover:underline"
                          >
                            ลบ
                          </button>
                        )}
                      </div>
                      {rv.title && (
                        <p className="text-sm font-semibold text-text-primary">
                          {rv.title}
                        </p>
                      )}
                      {rv.comment && (
                        <p className="text-sm leading-relaxed text-text-secondary">
                          {rv.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
