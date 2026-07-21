"use client";

import { useState, useRef, useEffect, use, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import CartPanel, { type CartProduct } from "@/components/CartPanel";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Grid3X3,
  List,
  Plus,
  Minus,
  X,
  ChevronDown,
} from "lucide-react";
import {
  getCategoryByRoute,
  type ApiCategoryFullData,
  type ApiProduct,
} from "@/lib/api";

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

function extractBrands(products: ApiProduct[]) {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function extractColors(products: ApiProduct[]) {
  const map = new Map<string, { count: number; hex: string }>();
  for (const p of products) {
    const raw = (p as unknown as Record<string, unknown>).colors;
    if (!Array.isArray(raw)) continue;
    for (const c of raw as { name: string; hex?: string }[]) {
      const existing = map.get(c.name);
      map.set(c.name, {
        count: (existing?.count ?? 0) + 1,
        hex: c.hex ?? existing?.hex ?? "#ccc",
      });
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, v]) => ({ name, count: v.count, hex: v.hex }));
}

function priceRange(products: ApiProduct[]) {
  if (products.length === 0) return { min: 0, max: 10000 };
  let min = Infinity,
    max = -Infinity;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min, max };
}

// ---------------------------------------------------------------------------
// Collapsible filter section
// ---------------------------------------------------------------------------

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-bold text-sm text-text-primary">{title}</span>
        {open ? (
          <Minus className="w-4 h-4 text-text-secondary" />
        ) : (
          <Plus className="w-4 h-4 text-text-secondary" />
        )}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "relevance", label: "เกี่ยวข้อง" },
  { value: "price_asc", label: "ราคาต่ำ - สูง" },
  { value: "price_desc", label: "ราคาสูง - ต่ำ" },
  { value: "rating", label: "คะแนนสูงสุด" },
  { value: "newest", label: "สินค้าใหม่" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function sortProducts(products: ApiProduct[], sort: SortValue) {
  const copy = [...products];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "newest":
      return copy.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    default:
      return copy;
  }
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const routePath = slug.join("/");

  const [data, setData] = useState<ApiCategoryFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProduct | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setData(null);
    setSelectedBrands(new Set());
    setSelectedColors(new Set());
    setPriceMin(null);
    setPriceMax(null);
    setSortBy("relevance");

    getCategoryByRoute(routePath)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routePath]);

  const brands = useMemo(() => (data ? extractBrands(data.products) : []), [data]);
  const colors = useMemo(() => (data ? extractColors(data.products) : []), [data]);
  const range = useMemo(() => (data ? priceRange(data.products) : { min: 0, max: 10000 }), [data]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    let list = data.products;

    if (selectedBrands.size > 0) {
      list = list.filter((p) => selectedBrands.has(p.brand));
    }
    if (selectedColors.size > 0) {
      list = list.filter((p) => {
        const raw = (p as unknown as Record<string, unknown>).colors;
        if (!Array.isArray(raw)) return false;
        return (raw as { name: string }[]).some((c) => selectedColors.has(c.name));
      });
    }
    if (priceMin !== null) list = list.filter((p) => p.price >= priceMin);
    if (priceMax !== null) list = list.filter((p) => p.price <= priceMax);

    return sortProducts(list, sortBy);
  }, [data, selectedBrands, selectedColors, priceMin, priceMax, sortBy]);

  const handleAddToCart = (product: CartProduct) => {
    setCartProduct(product);
    setCartOpen(true);
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });
  };

  const toggleColor = (c: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };

  const activeFilterCount =
    selectedBrands.size +
    selectedColors.size +
    (priceMin !== null ? 1 : 0) +
    (priceMax !== null ? 1 : 0);

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[120px]">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error / not-found state
  // -----------------------------------------------------------------------
  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-[1440px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">ไม่พบหมวดหมู่</h1>
          <p className="text-text-secondary mb-8">
            หมวดหมู่ที่คุณค้นหาไม่พบในระบบ
          </p>
          <Link
            href="/"
            className="text-blue-accent hover:underline"
          >
            กลับหน้าหลัก
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { category, breadcrumb, children, products } = data;
  const hasProducts = products.length > 0;
  const hasChildren = children.length > 0;

  const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);
  const hiddenBrandCount = brands.length - 5;

  // -----------------------------------------------------------------------
  // Filter sidebar content (shared desktop / mobile)
  // -----------------------------------------------------------------------
  const filterContent = (
    <>
      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="ยี่ห้อ" defaultOpen>
          <div className="space-y-2">
            {visibleBrands.map((b) => (
              <label
                key={b.name}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.has(b.name)}
                  onChange={() => toggleBrand(b.name)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-accent focus:ring-blue-accent"
                />
                <span className="text-sm text-text-primary group-hover:text-blue-accent transition-colors flex-1">
                  {b.name}
                </span>
                <span className="text-xs text-text-secondary">{b.count}</span>
              </label>
            ))}
          </div>
          {hiddenBrandCount > 0 && !showAllBrands && (
            <button
              onClick={() => setShowAllBrands(true)}
              className="text-sm text-blue-accent hover:underline mt-2"
            >
              ดูเพิ่มเติม ({hiddenBrandCount})
            </button>
          )}
        </FilterSection>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <FilterSection title="สี">
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleColor(c.name)}
                className="flex flex-col items-center gap-1 group"
                title={c.name}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColors.has(c.name)
                      ? "border-blue-accent scale-110"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] text-text-secondary">
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Gender (static, placeholder) */}
      <FilterSection title="เพศ">
        <div className="space-y-2">
          {["ชาย", "หญิง", "เด็ก", "ยูนิเซ็กส์"].map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-accent focus:ring-blue-accent"
              />
              <span className="text-sm text-text-primary">{g}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="ราคา">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`${range.min}`}
            value={priceMin ?? ""}
            onChange={(e) =>
              setPriceMin(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
          />
          <span className="text-text-secondary text-sm">-</span>
          <input
            type="number"
            placeholder={`${range.max}`}
            value={priceMax ?? ""}
            onChange={(e) =>
              setPriceMax(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
          />
        </div>
      </FilterSection>

      {/* Static filter sections */}
      <FilterSection title="ลักษณะสินค้า">
        <p className="text-xs text-text-secondary">ไม่มีตัวเลือก</p>
      </FilterSection>
      <FilterSection title="ขนาด">
        <p className="text-xs text-text-secondary">ไม่มีตัวเลือก</p>
      </FilterSection>
    </>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 py-4 text-sm overflow-x-auto scrollbar-hide">
          <Link
            href="/"
            className="text-text-secondary hover:text-navy transition-colors shrink-0"
          >
            หน้าหลัก
          </Link>
          {breadcrumb.map((crumb) => (
            <span
              key={crumb.route_path}
              className="flex items-center gap-1 shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              {crumb.route_path === routePath ? (
                <span className="text-navy font-medium">{crumb.name}</span>
              ) : (
                <Link
                  href={`/category/${crumb.route_path}`}
                  className="text-text-secondary hover:text-navy transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Category title + description */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy font-(family-name:--font-noto-thai)">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-text-secondary text-sm mt-2 leading-relaxed max-w-4xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Sub-categories (horizontal scroll) */}
        {hasChildren && (
          <div className="mb-8">
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
              >
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.route_path}`}
                    className="shrink-0 group"
                  >
                    <div className="w-[100px] md:w-[120px]">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {child.image ? (
                          <img
                            src={child.image}
                            alt={child.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-light">
                            <span className="text-2xl text-text-secondary">
                              {child.name[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center text-text-primary font-medium group-hover:text-blue-accent transition-colors leading-tight">
                        {child.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Divider before product area */}
        {hasProducts && <hr className="border-gray-200 mb-4" />}

        {/* Products layout: sidebar + grid */}
        {hasProducts && (
          <div className="flex gap-6 mb-12">
            {/* ---- Desktop filter sidebar ---- */}
            <aside className="hidden lg:block w-[240px] shrink-0">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-200">
                <SlidersHorizontal className="w-5 h-5 text-text-primary" />
                <span className="text-lg font-bold text-text-primary font-(family-name:--font-noto-thai)">
                  ตัวกรอง
                </span>
              </div>
              {filterContent}
            </aside>

            {/* ---- Product grid area ---- */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-text-primary hover:border-navy transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>ตัวกรอง</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="hidden lg:block" />

                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-sm text-text-secondary">
                    {filteredProducts.length} สินค้า
                  </span>

                  {/* Sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-text-primary hover:border-navy transition-colors"
                    >
                      <span>เรียงลำดับ</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {sortOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setSortOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-44">
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSortBy(opt.value);
                                setSortOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                sortBy === opt.value
                                  ? "text-blue-accent font-semibold"
                                  : "text-text-primary"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* View toggle */}
                  <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-navy text-white"
                          : "text-text-secondary hover:bg-gray-50"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-navy text-white"
                          : "text-text-secondary hover:bg-gray-50"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active filters pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from(selectedBrands).map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 bg-gray-100 text-sm text-text-primary px-3 py-1 rounded-full"
                    >
                      {b}
                      <button onClick={() => toggleBrand(b)}>
                        <X className="w-3 h-3 text-text-secondary hover:text-navy" />
                      </button>
                    </span>
                  ))}
                  {Array.from(selectedColors).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 bg-gray-100 text-sm text-text-primary px-3 py-1 rounded-full"
                    >
                      {c}
                      <button onClick={() => toggleColor(c)}>
                        <X className="w-3 h-3 text-text-secondary hover:text-navy" />
                      </button>
                    </span>
                  ))}
                  {(priceMin !== null || priceMax !== null) && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-sm text-text-primary px-3 py-1 rounded-full">
                      ฿{priceMin ?? range.min} - ฿{priceMax ?? range.max}
                      <button
                        onClick={() => {
                          setPriceMin(null);
                          setPriceMax(null);
                        }}
                      >
                        <X className="w-3 h-3 text-text-secondary hover:text-navy" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBrands(new Set());
                      setSelectedColors(new Set());
                      setPriceMin(null);
                      setPriceMax(null);
                    }}
                    className="text-sm text-blue-accent hover:underline"
                  >
                    ล้างทั้งหมด
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-text-secondary">
                    ไม่พบสินค้าที่ตรงกับตัวกรอง
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBrands(new Set());
                      setSelectedColors(new Set());
                      setPriceMin(null);
                      setPriceMax(null);
                    }}
                    className="text-blue-accent hover:underline mt-2 text-sm"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {filteredProducts.map((product) => {
                    const image = product.images?.[0] ?? "";
                    const productColors = (
                      (product as unknown as Record<string, unknown>).colors as
                        | { name: string; hex?: string }[]
                        | undefined
                    ) ?? [];
                    const discount =
                      product.original_price && product.original_price > product.price
                        ? Math.round(
                            ((product.original_price - product.price) /
                              product.original_price) *
                              100
                          )
                        : null;

                    const tags: string[] = [...(product.tags ?? [])];
                    if (product.is_new && !tags.includes("สินค้าใหม่"))
                      tags.unshift("สินค้าใหม่");
                    if (
                      product.discount_label &&
                      !tags.includes(product.discount_label)
                    )
                      tags.push(product.discount_label);

                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <Link
                          href={`/product/${product.id}`}
                          className={
                            viewMode === "list" ? "shrink-0 w-[160px]" : "block"
                          }
                        >
                          <div
                            className="relative bg-gray-50"
                            style={{
                              paddingBottom:
                                viewMode === "list" ? "0" : "100%",
                            }}
                          >
                            <img
                              src={image}
                              alt={product.name}
                              className={
                                viewMode === "list"
                                  ? "w-[160px] h-[160px] object-cover"
                                  : "absolute inset-0 w-full h-full object-cover"
                              }
                            />
                            {tags.length > 0 && (
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${
                                      tag === "สินค้าใหม่"
                                        ? "bg-blue-accent"
                                        : tag === "ขายดี"
                                        ? "bg-orange"
                                        : "bg-orange"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-3 flex-1 flex flex-col">
                          {/* Color dots */}
                          {productColors.length > 0 && (
                            <div className="flex gap-1.5 mb-2">
                              {productColors.slice(0, 5).map((c, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: c.hex ?? "#ccc",
                                  }}
                                  title={c.name}
                                />
                              ))}
                              {productColors.length > 5 && (
                                <span className="text-[10px] text-text-secondary self-center">
                                  +{productColors.length - 5}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-base font-bold text-navy">
                              ฿{product.price.toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-xs text-text-secondary line-through">
                                ฿{product.original_price.toLocaleString()}
                              </span>
                            )}
                            {discount && (
                              <span className="text-[10px] font-bold text-red-600">
                                -{discount}%
                              </span>
                            )}
                          </div>

                          {/* Product name */}
                          <Link href={`/product/${product.id}`}>
                            <h3 className="text-sm text-text-primary leading-snug line-clamp-2 hover:text-blue-accent transition-colors mb-1.5">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Brand */}
                          <p className="text-[11px] text-text-secondary mb-2">
                            {product.brand}
                          </p>

                          {/* Rating + Cart */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              {product.rating != null && product.rating > 0 && (
                                <>
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-text-secondary">
                                    {product.rating}
                                  </span>
                                  {product.review_count > 0 && (
                                    <span className="text-xs text-text-secondary">
                                      ({product.review_count.toLocaleString()})
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleAddToCart({
                                  id: product.id,
                                  name: product.name,
                                  brand: product.brand,
                                  price: product.price,
                                  image,
                                  originalPrice:
                                    product.original_price ?? undefined,
                                  discount: discount ?? undefined,
                                })
                              }
                              className="p-2 text-text-secondary hover:text-blue-accent transition-colors"
                              title="เพิ่มในตะกร้า"
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasProducts && !hasChildren && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">
              ยังไม่มีสินค้าในหมวดหมู่นี้
            </p>
            <Link
              href="/"
              className="text-blue-accent hover:underline mt-4 inline-block"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        )}

        {/* Only children, no products */}
        {!hasProducts && hasChildren && (
          <div className="text-center py-16 pb-16">
            <p className="text-text-secondary">
              เลือกหมวดหมู่ย่อยด้านบนเพื่อดูสินค้า
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* ---- Mobile filter drawer ---- */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 lg:hidden ${
          mobileFilterOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileFilterOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl lg:hidden ${
          mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-text-primary" />
            <span className="text-lg font-bold text-text-primary font-(family-name:--font-noto-thai)">
              ตัวกรอง
            </span>
          </div>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-65px)] px-4">
          {filterContent}
        </div>
      </div>

      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        product={cartProduct}
      />
      <FeedbackPanel />
    </div>
  );
}
