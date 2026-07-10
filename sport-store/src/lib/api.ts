const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}


export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  brand: string;
  images: string[];
  tags: string[];
  rating: number | null;
  review_count: number;
  is_new: boolean;
  discount_label: string | null;
}

export interface ApiBanner {
  id: string;
  type: "hero" | "category" | "promo";
  title: string;
  subtitle: string | null;
  hashtag: string | null;
  cta: string | null;
  image: string;
  link: string | null;
  section_key: string | null;
  sort_order: number;
}

export interface ApiShortcut {
  id: string;
  label: string;
  image: string | null;
  text_overlay: string | null;
  link: string | null;
  sort_order: number;
}

export interface ApiSubCategory {
  id: string;
  label: string;
  image: string | null;
  icon_name: string | null;
  link: string | null;
  sort_order: number;
}

export interface ApiHomepageSection {
  id: string;
  title: string;
  slug: string;
  type: "deals" | "category" | "featured";
  category_id: string | null;
  sort_order: number;
  banners: ApiBanner[];
  sub_categories: ApiSubCategory[];
  products: ApiProduct[];
}


export function getBanners(type?: ApiBanner["type"]): Promise<ApiBanner[]> {
  const q = type ? `?type=${type}` : "";
  return apiFetch<ApiBanner[]>(`/api/v1/banners${q}`);
}

export function getShortcuts(): Promise<ApiShortcut[]> {
  return apiFetch<ApiShortcut[]>(`/api/v1/homepage/shortcuts`);
}

export function getHomepageSections(): Promise<ApiHomepageSection[]> {
  return apiFetch<ApiHomepageSection[]>(`/api/v1/homepage/sections`);
}

export function getConfig(key: string): Promise<{ key: string; value: string | null }> {
  return apiFetch<{ key: string; value: string | null }>(
    `/api/v1/homepage/config/${key}`
  );
}

export function getAllConfig(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>(`/api/v1/homepage/config/all`);
}

export interface ApiCategoryTree {
  id: string;
  name: string;
  slug: string;
  route_path: string;
  image: string | null;
  parent_id: string | null;
  level: number;
  sort_order: number;
  children: ApiCategoryTree[];
}

export function getCategoryTree(): Promise<ApiCategoryTree[]> {
  return apiFetch<ApiCategoryTree[]>(`/api/v1/categories/tree`);
}

export function getCategoryRoots(): Promise<ApiCategoryTree[]> {
  return apiFetch<ApiCategoryTree[]>(`/api/v1/categories/roots`);
}

// ============================================
// Category Full Data (by route path)
// ============================================

export interface ApiCategoryFullData {
  category: {
    id: string;
    name: string;
    slug: string;
    route_path: string;
    description: string | null;
    image: string | null;
    banner_image: string | null;
    banner_title: string | null;
    banner_subtitle: string | null;
    banner_cta: string | null;
  };
  breadcrumb: { name: string; slug: string; route_path: string }[];
  children: {
    id: string;
    name: string;
    slug: string;
    route_path: string;
    image: string | null;
    sort_order: number;
  }[];
  products: ApiProduct[];
}

export function getCategoryByRoute(routePath: string): Promise<ApiCategoryFullData> {
  return apiFetch<ApiCategoryFullData>(`/api/v1/categories/route/${routePath}`);
}

// ============================================
// Products (general)
// ============================================

interface PaginatedData<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function getPopularProducts(limit = 8): Promise<ApiProduct[]> {
  const result = await apiFetch<PaginatedData<ApiProduct>>(
    `/api/v1/products?sort=review_count&order=desc&limit=${limit}`
  );
  return result.data;
}

export async function searchProducts(
  query: string,
  opts?: { limit?: number; sort?: string; order?: string }
): Promise<{ data: ApiProduct[]; total: number }> {
  const params = new URLSearchParams({ search: query });
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.sort) params.set("sort", opts.sort);
  if (opts?.order) params.set("order", opts.order);
  const result = await apiFetch<PaginatedData<ApiProduct>>(
    `/api/v1/products?${params.toString()}`
  );
  return { data: result.data, total: result.meta.total };
}


export interface ProductCard {
  id: string;
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

export function toProductCard(p: ApiProduct): ProductCard {
  const discount =
    p.original_price && p.original_price > p.price
      ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
      : undefined;

  return {
    id: p.id,
    image: p.images?.[0] ?? "",
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    discount,
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    tags: p.tags ?? [],
  };
}
