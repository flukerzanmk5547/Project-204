// Mock data สำหรับหน้า backoffice (fantasy theme) — ยังไม่เชื่อม API

export type Rarity = "common" | "rare" | "epic" | "legendary";

// ฟิลด์อ้างอิงตาม ApiProduct ของ backend (name, slug, brand, price, original_price,
// images, tags, rating, review_count, is_new) + ฟิลด์จัดการหลังบ้าน (sku, stock, status, sold)
export interface BoProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  isNew: boolean;
  rarity: Rarity;
  status: "active" | "draft" | "out";
  image: string;
  sold: number;
}

export interface BoPromotion {
  id: string;
  name: string;
  type: "percent" | "amount";
  value: number;
  productCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "ended";
}

export interface BoBundle {
  id: string;
  name: string;
  items: string[];
  discount: number;
  bundlePrice: number;
  status: "active" | "inactive";
}

export interface BoOrder {
  id: string;
  code: string;
  customer: string;
  total: number;
  items: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  date: string;
}

export interface BoAttributeGroup {
  id: string;
  name: string;
  type: "size" | "color" | "dimension" | "custom";
  options: string[];
  categories: string[];
}

export interface BoCategory {
  id: string;
  name: string;
  slug: string;
  route: string;
  productCount: number;
  children: number;
  icon: string;
}

export interface BoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  position: number;
  active: boolean;
}

export interface BoSection {
  id: string;
  title: string;
  type: "banner-grid" | "product-carousel" | "sub-category";
  itemCount: number;
  order: number;
  active: boolean;
}

export interface BoPaymentAccount {
  id: string;
  label: string;
  bank: string;
  promptpay: string;
  lineConnected: boolean;
  active: boolean;
}

export interface BoUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "reseller" | "manager";
  orders: number;
  joined: string;
  avatar: string;
}

const IMG = (id: number) =>
  `https://picsum.photos/id/${id}/200/200`;

export const boProducts: BoProduct[] = [
  { id: "p1", name: "รองเท้าวิ่ง Kalenji Run Support", slug: "kalenji-run-support", sku: "SKU-RUN-001", brand: "Kalenji", category: "รองเท้าวิ่ง", price: 1290, discountPrice: 990, stock: 48, rating: 4.6, reviews: 214, tags: ["ลดราคา"], isNew: false, rarity: "rare", status: "active", image: IMG(21), sold: 320 },
  { id: "p2", name: "ดัมเบลปรับน้ำหนัก 20kg", slug: "adjustable-dumbbell-20kg", sku: "SKU-GYM-014", brand: "Corength", category: "ฟิตเนส", price: 2490, discountPrice: null, stock: 12, rating: 4.8, reviews: 88, tags: ["ขายดี"], isNew: false, rarity: "epic", status: "active", image: IMG(26), sold: 88 },
  { id: "p3", name: "เสื่อโยคะ Premium 8mm", slug: "yoga-mat-premium-8mm", sku: "SKU-YOG-007", brand: "Kimjaly", category: "โยคะ", price: 690, discountPrice: 490, stock: 0, rating: 4.4, reviews: 512, tags: ["ลดราคา"], isNew: false, rarity: "common", status: "out", image: IMG(28), sold: 512 },
  { id: "p4", name: "จักรยานเสือภูเขา Rockrider ST100", slug: "rockrider-st100", sku: "SKU-BIKE-002", brand: "Rockrider", category: "จักรยาน", price: 8990, discountPrice: 7990, stock: 6, rating: 4.9, reviews: 24, tags: ["ยอดนิยม", "ลดราคา"], isNew: true, rarity: "legendary", status: "active", image: IMG(30), sold: 24 },
  { id: "p5", name: "เสื้อฟุตบอล Kipsta ทีมชาติ", slug: "kipsta-national-jersey", sku: "SKU-FTB-021", brand: "Kipsta", category: "ฟุตบอล", price: 590, discountPrice: null, stock: 120, rating: 4.3, reviews: 640, tags: [], isNew: false, rarity: "common", status: "active", image: IMG(33), sold: 640 },
  { id: "p6", name: "กระเป๋าเป้เดินป่า Quechua 40L", slug: "quechua-backpack-40l", sku: "SKU-HIKE-009", brand: "Quechua", category: "เดินป่า", price: 1890, discountPrice: 1590, stock: 30, rating: 4.5, reviews: 150, tags: ["ใหม่"], isNew: true, rarity: "rare", status: "draft", image: IMG(37), sold: 150 },
];

export const boPromotions: BoPromotion[] = [
  { id: "promo1", name: "ดีลเด็ดกลางปี", type: "percent", value: 30, productCount: 24, startDate: "2026-07-01", endDate: "2026-07-31", status: "active" },
  { id: "promo2", name: "Flash Sale วันวิ่ง", type: "amount", value: 300, productCount: 8, startDate: "2026-07-20", endDate: "2026-07-21", status: "scheduled" },
  { id: "promo3", name: "ลดล้างสต็อกโยคะ", type: "percent", value: 50, productCount: 15, startDate: "2026-06-01", endDate: "2026-06-30", status: "ended" },
];

export const boBundles: BoBundle[] = [
  { id: "b1", name: "เซ็ตนักวิ่งมือใหม่", items: ["รองเท้าวิ่ง", "เสื้อวิ่ง", "ขวดน้ำ"], discount: 15, bundlePrice: 1690, status: "active" },
  { id: "b2", name: "เซ็ตโฮมยิมครบชุด", items: ["ดัมเบล", "เสื่อ", "ยางยืด"], discount: 20, bundlePrice: 3290, status: "active" },
  { id: "b3", name: "เซ็ตโยคะสายชิล", items: ["เสื่อโยคะ", "บล็อกโยคะ"], discount: 10, bundlePrice: 890, status: "inactive" },
];

export const boOrders: BoOrder[] = [
  { id: "o1", code: "#SG-20418", customer: "สมชาย ใจดี", total: 1990, items: 2, status: "pending", date: "2026-07-16 09:12" },
  { id: "o2", code: "#SG-20417", customer: "Aomsin K.", total: 7990, items: 1, status: "paid", date: "2026-07-16 08:40" },
  { id: "o3", code: "#SG-20416", customer: "ธนวัฒน์ ศรี", total: 490, items: 1, status: "shipped", date: "2026-07-15 21:03" },
  { id: "o4", code: "#SG-20415", customer: "Jane Doe", total: 3290, items: 3, status: "completed", date: "2026-07-15 17:55" },
  { id: "o5", code: "#SG-20414", customer: "มานี มีนา", total: 590, items: 1, status: "cancelled", date: "2026-07-15 12:20" },
];

export const boAttributeGroups: BoAttributeGroup[] = [
  { id: "a1", name: "ไซส์เสื้อผ้า", type: "size", options: ["S", "M", "L", "XL", "2XL", "3XL"], categories: ["เสื้อผ้า", "ฟุตบอล"] },
  { id: "a2", name: "ไซส์รองเท้า (EU)", type: "size", options: ["38", "39", "40", "41", "42", "43", "44"], categories: ["รองเท้าวิ่ง"] },
  { id: "a3", name: "สี", type: "color", options: ["ดำ", "ขาว", "น้ำเงิน", "แดง", "เขียว"], categories: ["เสื้อผ้า", "รองเท้าวิ่ง"] },
  { id: "a4", name: "ขนาดอุปกรณ์", type: "dimension", options: ["S (20cm)", "M (30cm)", "L (40cm)"], categories: ["ฟิตเนส"] },
];

export const boCategories: BoCategory[] = [
  { id: "c1", name: "รองเท้าวิ่ง", slug: "running-shoes", route: "/category/running/shoes", productCount: 42, children: 3, icon: IMG(21) },
  { id: "c2", name: "ฟิตเนส", slug: "fitness", route: "/category/fitness", productCount: 88, children: 5, icon: IMG(26) },
  { id: "c3", name: "โยคะ & พิลาทิส", slug: "yoga-pilates", route: "/category/yoga", productCount: 30, children: 2, icon: IMG(28) },
  { id: "c4", name: "จักรยาน", slug: "cycling", route: "/category/cycling", productCount: 25, children: 4, icon: IMG(30) },
  { id: "c5", name: "ฟุตบอล", slug: "football", route: "/category/football", productCount: 64, children: 3, icon: IMG(33) },
];

export const boBanners: BoBanner[] = [
  { id: "bn1", title: "RUN YOUR WAY", subtitle: "คอลเลกชันนักวิ่งหน้าฝน", image: "https://picsum.photos/id/1011/400/200", position: 1, active: true },
  { id: "bn2", title: "HOME GYM SALE", subtitle: "อุปกรณ์ออกกำลังกายในบ้าน", image: "https://picsum.photos/id/1027/400/200", position: 2, active: true },
  { id: "bn3", title: "YOGA & CHILL", subtitle: "ผ่อนคลายทุกท่วงท่า", image: "https://picsum.photos/id/1040/400/200", position: 3, active: false },
];

export const boSections: BoSection[] = [
  { id: "s1", title: "ค้นหาสินค้าฟิตเนส", type: "banner-grid", itemCount: 4, order: 1, active: true },
  { id: "s2", title: "ดีลเด็ดประจำสัปดาห์", type: "product-carousel", itemCount: 12, order: 2, active: true },
  { id: "s3", title: "หมวดหมู่ยอดนิยม", type: "sub-category", itemCount: 8, order: 3, active: true },
  { id: "s4", title: "เรื่องการวิ่ง สุขภาพ", type: "banner-grid", itemCount: 3, order: 4, active: false },
];

export const boPaymentAccounts: BoPaymentAccount[] = [
  { id: "pa1", label: "บัญชีหลัก SCB", bank: "SCB", promptpay: "0989518191", lineConnected: true, active: true },
  { id: "pa2", label: "บัญชีสำรอง KBank", bank: "KBANK", promptpay: "0812345678", lineConnected: false, active: true },
  { id: "pa3", label: "บัญชี GSB โปรโมชัน", bank: "GSB", promptpay: "0891112222", lineConnected: true, active: false },
];

export const boUsers: BoUser[] = [
  { id: "u1", name: "โบยะ ฮารุมิจิ", email: "boya@sportgear.co", role: "manager", orders: 4, joined: "2026-01-12", avatar: IMG(64) },
  { id: "u2", name: "สมชาย ใจดี", email: "somchai@gmail.com", role: "reseller", orders: 58, joined: "2026-03-04", avatar: IMG(65) },
  { id: "u3", name: "Aomsin K.", email: "aomsin@gmail.com", role: "customer", orders: 12, joined: "2026-05-20", avatar: IMG(66) },
  { id: "u4", name: "Jane Doe", email: "jane@outlook.com", role: "customer", orders: 3, joined: "2026-06-18", avatar: IMG(68) },
  { id: "u5", name: "ธนวัฒน์ ศรี", email: "thana@gmail.com", role: "reseller", orders: 90, joined: "2026-02-27", avatar: IMG(69) },
];

export const rarityLabel: Record<Rarity, string> = {
  common: "ทั่วไป",
  rare: "แนะนำ",
  epic: "ขายดี",
  legendary: "ยอดนิยม",
};

export function formatBaht(n: number): string {
  return "฿" + n.toLocaleString("th-TH");
}
