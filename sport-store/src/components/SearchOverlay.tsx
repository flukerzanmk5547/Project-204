"use client";

import { Search, X, LayoutGrid, Star, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  getPopularProducts,
  searchProducts,
  getCategoryTree,
  type ApiProduct,
  type ApiCategoryTree,
} from "@/lib/api";

interface SearchProduct {
  id: string;
  image: string;
  price: number;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  colors: number;
}

interface PopularCategory {
  label: string;
  routePath: string;
  subtitle?: string;
  type: "category" | "search";
}

function apiToSearchProduct(p: ApiProduct): SearchProduct {
  const rawColors = (p as unknown as Record<string, unknown>).colors;
  return {
    id: p.id,
    image: p.images?.[0] ?? "https://picsum.photos/300/300",
    price: p.price,
    name: p.name,
    brand: p.brand,
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    isNew: p.is_new ?? false,
    colors: Array.isArray(rawColors) ? (rawColors as unknown[]).length : 1,
  };
}

function flattenTree(
  tree: ApiCategoryTree[],
  maxDepth = 2,
  depth = 0
): { name: string; routePath: string; parentName?: string }[] {
  const result: { name: string; routePath: string; parentName?: string }[] = [];
  for (const node of tree) {
    if (depth > 0) {
      result.push({ name: node.name, routePath: node.route_path });
    }
    if (depth < maxDepth && node.children.length > 0) {
      for (const child of node.children) {
        result.push({
          name: child.name,
          routePath: child.route_path,
          parentName: node.name,
        });
        if (child.children.length > 0) {
          result.push(
            ...flattenTree([child], maxDepth, depth + 2).map((c) => ({
              ...c,
              parentName: `${node.name} > ${child.name}`,
            }))
          );
        }
      }
    }
  }
  return result;
}

const fallbackPopularCategories: PopularCategory[] = [
  { label: "ฟิตเนส", routePath: "sports/fitness", type: "category" },
  { label: "วิ่ง & เดิน", routePath: "sports/running-walking", type: "category" },
  { label: "กีฬากลางแจ้ง", routePath: "sports/outdoor", type: "category" },
  { label: "จักรยาน", routePath: "sports/cycling", type: "category" },
  { label: "กีฬาทางน้ำ", routePath: "sports/water-sports", type: "category" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  externalQuery?: string;
  onExternalQueryChange?: (q: string) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  placeholder,
  externalQuery,
  onExternalQueryChange,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularProducts, setPopularProducts] = useState<SearchProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [categories, setCategories] = useState<PopularCategory[]>(
    fallbackPopularCategories
  );
  const [matchedCategories, setMatchedCategories] = useState<
    { name: string; routePath: string; parentName?: string }[]
  >([]);
  const [allFlatCategories, setAllFlatCategories] = useState<
    { name: string; routePath: string; parentName?: string }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const defaultPlaceholder =
    placeholder ?? "ค้นหาสินค้า 7,000 รายการจาก 70 ประเภทกีฬา";

  useEffect(() => {
    getPopularProducts(8)
      .then((apiProducts) => {
        if (apiProducts.length > 0)
          setPopularProducts(apiProducts.map(apiToSearchProduct));
      })
      .catch(() => {});

    getCategoryTree()
      .then((tree) => {
        if (tree.length > 0) {
          const level1 = tree
            .filter((n) => n.level === 0)
            .flatMap((root) =>
              root.children.map((child) => ({
                label: child.name,
                routePath: child.route_path,
                type: "category" as const,
              }))
            )
            .slice(0, 6);
          if (level1.length > 0) setCategories(level1);

          setAllFlatCategories(flattenTree(tree, 2));
        }
      })
      .catch(() => {});

    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (externalQuery !== undefined && externalQuery !== query) {
      setQuery(externalQuery);
      doSearch(externalQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalQuery]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const doSearch = useCallback(
    (q: string) => {
      if (q.trim().length < 2) {
        setSearchResults([]);
        setSearchTotal(0);
        setMatchedCategories([]);
        return;
      }

      setSearching(true);
      searchProducts(q, { limit: 8 })
        .then(({ data, total }) => {
          setSearchResults(data.map(apiToSearchProduct));
          setSearchTotal(total);
        })
        .catch(() => {
          setSearchResults([]);
          setSearchTotal(0);
        })
        .finally(() => setSearching(false));

      const lowerQ = q.toLowerCase();
      const matched = allFlatCategories
        .filter((c) => c.name.toLowerCase().includes(lowerQ))
        .slice(0, 5);
      setMatchedCategories(matched);
    },
    [allFlatCategories]
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onExternalQueryChange?.(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const addToRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(
      0,
      5
    );
    setRecentSearches(next);
    localStorage.setItem("recentSearches", JSON.stringify(next));
  };

  const handleCategoryClick = (cat: PopularCategory | { name: string; routePath: string }) => {
    const name = "label" in cat ? cat.label : cat.name;
    addToRecent(name);
    onClose();
  };

  const handleSearchSubmit = () => {
    if (query.trim()) addToRecent(query.trim());
  };

  const removeRecent = (item: string) => {
    const next = recentSearches.filter((s) => s !== item);
    setRecentSearches(next);
    localStorage.setItem("recentSearches", JSON.stringify(next));
  };

  const isSearching = query.trim().length >= 2;
  const displayProducts = isSearching ? searchResults : popularProducts;
  const productSectionTitle = isSearching
    ? `ผลลัพธ์ (${searchTotal} สินค้า)`
    : "สินค้ายอดนิยม";

  if (!isOpen) return null;

  const leftSidebar = (
    <>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-navy mb-3">
            การค้นหาล่าสุด
          </h3>
          {recentSearches.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between py-2"
            >
              <button
                onClick={() => handleQueryChange(item)}
                className="flex items-center gap-2.5 text-left"
              >
                <Search size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm text-text-primary">{item}</span>
              </button>
              <button
                onClick={() => removeRecent(item)}
                className="p-0.5 hover:bg-gray-100 rounded"
                aria-label="ลบ"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Matched categories (when searching) */}
      {isSearching && matchedCategories.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-navy mb-3">
            หมวดหมู่ที่เกี่ยวข้อง
          </h3>
          <div className="space-y-0.5">
            {matchedCategories.map((cat) => (
              <Link
                key={cat.routePath}
                href={`/category/${cat.routePath}`}
                onClick={() => handleCategoryClick(cat)}
                className="flex items-start gap-2.5 w-full text-left py-2 rounded hover:bg-gray-50 transition-colors"
              >
                <LayoutGrid
                  size={16}
                  className="text-navy mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm text-text-primary">{cat.name}</p>
                  {cat.parentName && (
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-tight">
                      ใน {cat.parentName}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular categories (when idle) */}
      {!isSearching && (
        <>
          <h3 className="text-xs font-bold text-navy mb-3">
            การค้นหายอดนิยม
          </h3>
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.routePath}
                href={`/category/${cat.routePath}`}
                onClick={() => handleCategoryClick(cat)}
                className="flex items-start gap-2.5 w-full text-left py-2 rounded hover:bg-gray-50 transition-colors"
              >
                <LayoutGrid
                  size={16}
                  className="text-navy mt-0.5 shrink-0"
                />
                <p className="text-sm text-text-primary">{cat.label}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );

  const productGrid = (
    <>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-bold text-navy">{productSectionTitle}</h3>
        {searching && (
          <Loader2 size={14} className="animate-spin text-blue-accent" />
        )}
      </div>
      {displayProducts.length === 0 && isSearching && !searching && (
        <p className="text-sm text-text-secondary py-8 text-center">
          ไม่พบสินค้าที่ตรงกับ &quot;{query}&quot;
        </p>
      )}
      <div className="grid grid-cols-4 gap-4">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            onClick={() => {
              if (query.trim()) addToRecent(query.trim());
              onClose();
            }}
            className="group cursor-pointer block"
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-blue-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  สินค้าใหม่
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-navy">
              ฿{product.price.toLocaleString()}
            </p>
            <p className="text-xs text-text-primary mt-0.5 line-clamp-2 leading-relaxed">
              {product.name}
            </p>
            <p className="text-[10px] text-text-secondary mt-0.5 uppercase">
              {product.brand}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-text-secondary">
                {product.rating} ({product.reviews.toLocaleString()})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: Dropdown panel below header */}
      <div className="hidden md:block">
        <div
          className="fixed left-0 right-0 bottom-0 bg-black/30 z-40"
          style={{ top: "var(--header-height, 110px)" }}
          onClick={onClose}
        />

        <div className="absolute left-0 right-0 z-50 bg-white shadow-xl animate-[slideDown_0.2s_ease-out]">
          <div
            className="max-w-[1440px] mx-auto flex"
            style={{ maxHeight: "70vh" }}
          >
            <div className="w-[260px] border-r border-gray-200 py-5 px-5 overflow-y-auto shrink-0">
              {leftSidebar}
            </div>
            <div className="flex-1 py-5 px-5 overflow-y-auto">
              {productGrid}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full screen overlay */}
      <div className="md:hidden fixed inset-0 z-100 bg-white flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex flex-1 items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-accent"
          >
            <div className="flex items-center px-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={defaultPlaceholder}
              className="flex-1 py-3 pr-2 text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </form>
          <button onClick={onClose} className="p-1 shrink-0" aria-label="ปิด">
            <X size={22} className="text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Show search results on mobile */}
          {isSearching ? (
            <>
              {matchedCategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-navy mb-3">
                    หมวดหมู่ที่เกี่ยวข้อง
                  </h3>
                  {matchedCategories.map((cat) => (
                    <Link
                      key={cat.routePath}
                      href={`/category/${cat.routePath}`}
                      onClick={() => handleCategoryClick(cat)}
                      className="flex items-start gap-3 w-full text-left py-3 border-b border-gray-100"
                    >
                      <LayoutGrid
                        size={18}
                        className="text-navy mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-text-primary">
                          {cat.name}
                        </p>
                        {cat.parentName && (
                          <p className="text-xs text-text-secondary mt-0.5 leading-tight">
                            ใน {cat.parentName}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                {productSectionTitle}
                {searching && (
                  <Loader2
                    size={14}
                    className="animate-spin text-blue-accent"
                  />
                )}
              </h3>
              {searchResults.length === 0 && !searching && (
                <p className="text-sm text-text-secondary py-4">
                  ไม่พบสินค้าที่ตรงกับ &quot;{query}&quot;
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      addToRecent(query.trim());
                      onClose();
                    }}
                    className="group block"
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-navy">
                      ฿{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-primary mt-0.5 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-text-secondary uppercase">
                      {product.brand}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-navy mb-3">
                    การค้นหาล่าสุด
                  </h3>
                  {recentSearches.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-3 border-b border-gray-100"
                    >
                      <button
                        onClick={() => handleQueryChange(item)}
                        className="flex items-center gap-3"
                      >
                        <Search
                          size={18}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="text-sm text-text-primary">
                          {item}
                        </span>
                      </button>
                      <button
                        onClick={() => removeRecent(item)}
                        className="p-1"
                        aria-label="ลบ"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-navy mb-3">
                  การค้นหายอดนิยม
                </h3>
                {categories.map((cat) => (
                  <Link
                    key={cat.routePath}
                    href={`/category/${cat.routePath}`}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex items-start gap-3 w-full text-left py-3 border-b border-gray-100"
                  >
                    <LayoutGrid
                      size={18}
                      className="text-navy mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-text-primary">{cat.label}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
