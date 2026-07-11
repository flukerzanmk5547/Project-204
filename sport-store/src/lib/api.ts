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
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let msg = `API error ${res.status}: ${path}`;
    try {
      const errJson = (await res.json()) as { message?: string; error?: string };
      if (errJson.message) msg = errJson.message;
      else if (errJson.error) msg = errJson.error;
    } catch { /* ไม่สามารถ parse error body */ }
    throw new Error(msg);
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

// ============================================
// Auth
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

export async function authLogin(
  email: string,
  password: string
): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function authRegister(data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function authGetProfile(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function authLogout(token: string): Promise<void> {
  await apiFetch<void>("/api/v1/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function authRefreshToken(
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string }> {
  return apiFetch<{ access_token: string; refresh_token: string }>(
    "/api/v1/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  );
}

// ============================================
// Addresses
// ============================================

export interface ApiAddress {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  postal_code: string;
  province: string;
  amphoe: string;
  district: string | null;
  address: string;
  note: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function getAddresses(token: string): Promise<ApiAddress[]> {
  return apiFetch<ApiAddress[]>("/api/v1/addresses", {
    headers: authHeaders(token),
  });
}

export function createAddress(
  token: string,
  data: Omit<ApiAddress, "id" | "user_id" | "created_at" | "updated_at">
): Promise<ApiAddress> {
  return apiFetch<ApiAddress>("/api/v1/addresses", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function updateAddress(
  token: string,
  id: string,
  data: Partial<ApiAddress>
): Promise<ApiAddress> {
  return apiFetch<ApiAddress>(`/api/v1/addresses/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteAddress(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/addresses/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// ============================================
// Orders
// ============================================

export interface ApiOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  image: string | null;
  brand: string | null;
  size: string | null;
  price: number;
  original_price: number | null;
  quantity: number;
}

export interface ApiOrder {
  id: string;
  order_number: string;
  status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_province: string;
  shipping_amphoe: string;
  shipping_district: string | null;
  shipping_postal_code: string;
  payment_method: string;
  subtotal: number;
  discount_total: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  items?: ApiOrderItem[];
}

export interface CreateOrderPayload {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_province: string;
  shipping_amphoe: string;
  shipping_district?: string;
  shipping_postal_code: string;
  shipping_note?: string;
  payment_method: "promptpay" | "credit" | "bank" | "gift";
  items: {
    product_id: string;
    name: string;
    image?: string;
    brand?: string;
    size?: string;
    price: number;
    original_price?: number;
    quantity: number;
  }[];
}

export function createOrder(
  payload: CreateOrderPayload,
  token?: string
): Promise<ApiOrder> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return apiFetch<ApiOrder>("/api/v1/orders", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

export function getOrderHistory(
  token: string,
  page = 1,
  limit = 20
): Promise<{ data: ApiOrder[]; count: number }> {
  return apiFetch<{ data: ApiOrder[]; count: number }>(
    `/api/v1/orders/history?page=${page}&limit=${limit}`,
    { headers: authHeaders(token) }
  );
}

export function getOrderDetail(
  token: string,
  id: string
): Promise<ApiOrder> {
  return apiFetch<ApiOrder>(`/api/v1/orders/${id}`, {
    headers: authHeaders(token),
  });
}

// ============================================
// Payments (PromptPay)
// ============================================

export interface ApiPayment {
  id: string;
  order_id: string;
  method: string;
  amount: number;
  ref_amount: number;
  status: "pending" | "confirmed" | "expired" | "failed";
  promptpay_number: string | null;
  expires_at: string;
  confirmed_at: string | null;
}

export function createPayment(
  orderId: string,
  amount: number
): Promise<{ payment: ApiPayment; qr_image: string }> {
  return apiFetch<{ payment: ApiPayment; qr_image: string }>(
    "/api/v1/payments",
    {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, amount }),
    }
  );
}

export function checkPaymentStatus(
  paymentId: string
): Promise<ApiPayment> {
  return apiFetch<ApiPayment>(`/api/v1/payments/${paymentId}/status`);
}
