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
    cache: "no-store",
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
  description: string | null;
  description_full: string | null;
  price: number;
  original_price: number | null;
  brand: string;
  sku: string | null;
  category_id: string | null;
  images: string[];
  tags: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number | null;
  review_count: number;
  is_new: boolean;
  discount_label: string | null;
  benefits: { title: string; desc: string }[];
  specifications: Record<string, string>;
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

export async function getNewProducts(limit = 40): Promise<ApiProduct[]> {
  const result = await apiFetch<PaginatedData<ApiProduct>>(
    `/api/v1/products?is_new=true&limit=${limit}`
  );
  return result.data;
}

export interface ApiDeal {
  id: string;
  promotion_id: string;
  product_id: string;
  override_price: number | null;
  override_label: string | null;
  sort_order: number;
  product: ApiProduct | null;
}

export function getActiveDeals(): Promise<ApiDeal[]> {
  return apiFetch<ApiDeal[]>("/api/v1/promotions/deals");
}

export function dealToProductCard(deal: ApiDeal): ProductCard | null {
  if (!deal.product) return null;
  const p = deal.product;
  const price = deal.override_price ?? p.price;
  const original = p.original_price ?? p.price;
  const discount =
    original > price
      ? Math.round(((original - price) / original) * 100)
      : undefined;
  return {
    id: p.id,
    image: p.images?.[0] ?? "",
    name: p.name,
    brand: p.brand,
    price,
    originalPrice: original > price ? original : undefined,
    discount,
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    tags: deal.override_label ? [deal.override_label] : p.tags ?? [],
  };
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

export async function getProductById(id: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/api/v1/products/${id}`);
}

export async function getRelatedProducts(
  id: string,
  limit = 10
): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(
    `/api/v1/products/${id}/related?limit=${limit}`
  );
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
  role: string;
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

export async function authUpdateProfile(
  token: string,
  data: { full_name?: string; phone?: string; avatar_url?: string }
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/profile", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function authChangePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiFetch<void>("/api/v1/auth/profile/password", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export async function authChangeEmail(
  token: string,
  newEmail: string,
  password: string
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/profile/email", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ new_email: newEmail, password }),
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

// ============================================
// Favorites (สินค้าโปรด)
// ============================================

export interface ApiFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    original_price: number | null;
    images: string[];
    rating: number | null;
    review_count: number;
  } | null;
}

export function getFavorites(
  token: string,
  opts?: { page?: number; limit?: number }
): Promise<{ data: ApiFavorite[]; count: number }> {
  const params = new URLSearchParams();
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.limit) params.set("limit", String(opts.limit));
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ data: ApiFavorite[]; count: number }>(
    `/api/v1/favorites${q}`,
    { headers: authHeaders(token) }
  );
}

export function getFavoriteIds(token: string): Promise<string[]> {
  return apiFetch<string[]>("/api/v1/favorites/ids", {
    headers: authHeaders(token),
  });
}

export function toggleFavoriteApi(
  token: string,
  productId: string
): Promise<{ favorited: boolean }> {
  return apiFetch<{ favorited: boolean }>("/api/v1/favorites/toggle", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  });
}

export function removeFavoriteApi(
  token: string,
  productId: string
): Promise<void> {
  return apiFetch<void>(`/api/v1/favorites/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// ============================================
// Analytics (backoffice)
// ============================================

export interface AnalyticsRankItem {
  id: string;
  name: string;
  image: string | null;
  value: number;
}

export interface FavoriteAnalytics {
  total_favorites: number;
  unique_products: number;
  unique_users: number;
  top_favorited_products: AnalyticsRankItem[];
  recent_favorites: {
    user_name: string;
    product_name: string;
    product_image: string | null;
    created_at: string;
  }[];
}

export interface ViewAnalytics {
  total_views: number;
  unique_products_viewed: number;
  unique_users: number;
  top_viewed_products: AnalyticsRankItem[];
  views_today: number;
  views_this_week: number;
}

export interface PurchaseAnalytics {
  total_orders: number;
  total_revenue: number;
  total_items_sold: number;
  top_purchased_products: AnalyticsRankItem[];
  average_order_value: number;
  orders_today: number;
}

export interface FullAnalytics {
  favorites: FavoriteAnalytics;
  views: ViewAnalytics;
  purchases: PurchaseAnalytics;
}

export function getAnalytics(token: string): Promise<FullAnalytics> {
  return apiFetch<FullAnalytics>("/api/v1/analytics", {
    headers: authHeaders(token),
  });
}

// ============================================
// Dashboard (backoffice stats)
// ============================================

export interface RankItem {
  name: string;
  value: number;
}

export interface DashboardStats {
  summary: {
    sales_total: number;
    order_count: number;
    product_count: number;
    low_stock: number;
    out_of_stock: number;
    orders_today: number;
    new_customers_today: number;
  };
  category_revenue: RankItem[];
  product_revenue: RankItem[];
  top_by_sold: RankItem[];
  top_by_revenue: RankItem[];
  top_categories_by_count: RankItem[];
  top_customers: RankItem[];
  recent_orders: {
    id: string;
    code: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }[];
}

export function getDashboardStats(token: string): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/api/v1/dashboard/stats", {
    headers: authHeaders(token),
  });
}

// ============================================
// Notifications (backoffice)
// ============================================

export interface ApiNotification {
  id: string;
  type: "order" | "payment" | "stock" | "user" | "system";
  title: string;
  detail: string | null;
  audience: "staff" | "customer";
  order_id: string | null;
  actor_name: string | null;
  amount: number | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export function getNotifications(
  token: string,
  opts?: { limit?: number; unreadOnly?: boolean }
): Promise<{ data: ApiNotification[]; unread_count: number }> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.unreadOnly) params.set("unread_only", "true");
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ data: ApiNotification[]; unread_count: number }>(
    `/api/v1/notifications${q}`,
    { headers: authHeaders(token) }
  );
}

export function getUnreadNotificationCount(
  token: string
): Promise<{ unread_count: number }> {
  return apiFetch<{ unread_count: number }>(
    "/api/v1/notifications/unread-count",
    { headers: authHeaders(token) }
  );
}

export function markNotificationRead(
  token: string,
  id: string
): Promise<ApiNotification> {
  return apiFetch<ApiNotification>(`/api/v1/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
}

export function markAllNotificationsRead(token: string): Promise<void> {
  return apiFetch<void>("/api/v1/notifications/read-all", {
    method: "POST",
    headers: authHeaders(token),
  });
}

// ============================================
// Cart (server-side, ผูกกับบัญชี)
// ============================================

export interface ApiCartItemProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images: string[];
  brand: string;
  stock: number;
}

export interface ApiCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  product: ApiCartItemProduct;
}

export interface ApiCartSummary {
  items: ApiCartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

export function getCartApi(token: string): Promise<ApiCartSummary> {
  return apiFetch<ApiCartSummary>("/api/v1/cart", {
    headers: authHeaders(token),
  });
}

export function addCartItemApi(
  token: string,
  data: { product_id: string; quantity: number; size?: string; color?: string }
): Promise<ApiCartItem[]> {
  return apiFetch<ApiCartItem[]>("/api/v1/cart/items", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function updateCartItemApi(
  token: string,
  id: string,
  quantity: number
): Promise<ApiCartItem[]> {
  return apiFetch<ApiCartItem[]>(`/api/v1/cart/items/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItemApi(
  token: string,
  id: string
): Promise<ApiCartItem[]> {
  return apiFetch<ApiCartItem[]>(`/api/v1/cart/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function clearCartApi(token: string): Promise<void> {
  return apiFetch<void>("/api/v1/cart", {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// ============================================
// Reviews (รีวิวสินค้า)
// ============================================

export interface ApiReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  author_name: string | null;
  author_country: string | null;
  is_verified: boolean;
  is_translated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  breakdown: Record<string, number>;
}

export function getProductReviews(
  productId: string,
  page = 1,
  limit = 20
): Promise<{ data: ApiReview[]; count: number; summary: ReviewSummary }> {
  return apiFetch<{ data: ApiReview[]; count: number; summary: ReviewSummary }>(
    `/api/v1/reviews/product/${productId}?page=${page}&limit=${limit}`
  );
}

export function getMyReview(
  token: string,
  productId: string
): Promise<ApiReview | null> {
  return apiFetch<ApiReview | null>(`/api/v1/reviews/me/${productId}`, {
    headers: authHeaders(token),
  });
}

export function createReview(
  token: string,
  payload: {
    product_id: string;
    rating: number;
    title?: string;
    comment?: string;
  }
): Promise<ApiReview> {
  return apiFetch<ApiReview>("/api/v1/reviews", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function deleteReview(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/reviews/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// ============================================
// Feedback (แบบประเมินความพึงพอใจ)
// ============================================

export interface ApiFeedback {
  id: string;
  user_id: string | null;
  rating: number;
  purpose: string | null;
  achieved: string | null;
  comment: string | null;
  page_url: string | null;
  created_at: string;
}

export interface FeedbackSummary {
  average: number;
  total: number;
  breakdown: Record<string, number>;
  by_purpose: Record<string, number>;
}

/** ส่งแบบประเมิน — ไม่บังคับล็อกอิน (ถ้ามี token จะผูกกับผู้ใช้ให้) */
export function submitFeedback(
  payload: {
    rating: number;
    purpose?: string;
    achieved?: string;
    comment?: string;
    page_url?: string;
  },
  token?: string | null
): Promise<ApiFeedback> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return apiFetch<ApiFeedback>("/api/v1/feedbacks", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

/** ดูผลประเมินทั้งหมด (reseller ขึ้นไป) */
export function getFeedbacks(
  token: string,
  page = 1,
  limit = 50
): Promise<{ data: ApiFeedback[]; count: number }> {
  return apiFetch<{ data: ApiFeedback[]; count: number }>(
    `/api/v1/feedbacks?page=${page}&limit=${limit}`,
    { headers: authHeaders(token) }
  );
}

export function getFeedbackSummary(token: string): Promise<FeedbackSummary> {
  return apiFetch<FeedbackSummary>("/api/v1/feedbacks/summary", {
    headers: authHeaders(token),
  });
}
