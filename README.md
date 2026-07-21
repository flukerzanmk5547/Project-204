# Project 204 - Sport Store

Sport Store เป็นเว็บอีคอมเมิร์ซสำหรับขายสินค้าและอุปกรณ์กีฬา พัฒนาเป็นระบบแยก frontend และ backend โดยฝั่งหน้าเว็บใช้ Next.js สำหรับแสดงสินค้า หมวดหมู่ โปรโมชัน รายละเอียดสินค้า และตะกร้าสินค้า ส่วนฝั่ง API ใช้ Fastify เชื่อมต่อ Supabase เพื่อจัดการข้อมูลสินค้า หมวดหมู่ ผู้ใช้ ตะกร้า แบนเนอร์ โปรโมชัน และข้อมูลหน้าแรก

## รายละเอียดโปรเจกต์

โปรเจกต์นี้จำลองระบบร้านค้าออนไลน์สายกีฬา มีหน้าเว็บสำหรับให้ผู้ใช้เลือกดูสินค้า ค้นหาสินค้า ดูรายละเอียดสินค้า เลือกสินค้าเข้าตะกร้า และดูหมวดหมู่สินค้าต่าง ๆ พร้อม backend API สำหรับส่งข้อมูลไปยังหน้าเว็บ ระบบถูกแบ่งออกเป็น 2 ส่วนหลัก คือ

- `sport-store` ส่วน frontend ที่พัฒนาด้วย Next.js
- `sport-store-api` ส่วน backend API ที่พัฒนาด้วย Fastify และเชื่อมต่อ Supabase

## ฟีเจอร์หลัก

> **สถานะ:** ✅ ใช้งานได้จริง (frontend ต่อ backend แล้ว) · 🟡 มีหน้าจอแต่ยังไม่ต่อ backend (hardcode / localStorage) · ❌ frontend เรียกแล้วแต่ backend ยังไม่มี API

### 1. หน้าแรก (Homepage)

| # | ฟีเจอร์ | สถานะ | อ้างอิง |
| --- | --- | --- | --- |
| 1.1 | Hero banner สไลด์ | ✅ | `GET /api/v1/banners?type=hero` |
| 1.2 | หมวดหมู่ลัด (shortcuts) | ✅ | `GET /api/v1/homepage/shortcuts` |
| 1.3 | Section สินค้า (ดีล / แนะนำ / ตามหมวด) | ✅ | `GET /api/v1/homepage/sections` |
| 1.4 | ค่าคอนฟิกหน้าเว็บ (จำนวนสินค้า ฯลฯ) | ✅ | `GET /api/v1/homepage/config/all` |
| 1.5 | แถบประกาศ (Announcement bar) | 🟡 | ข้อความคงที่ในโค้ด |

### 2. หมวดหมู่และการค้นหา

| # | ฟีเจอร์ | สถานะ | อ้างอิง |
| --- | --- | --- | --- |
| 2.1 | หมวดหมู่หลายระดับ (แม่/ลูก) | ✅ | `GET /api/v1/categories/tree` |
| 2.2 | หน้าหมวดหมู่ + breadcrumb + หมวดย่อย | ✅ | `GET /api/v1/categories/route/:path` |
| 2.3 | ตัวกรอง แบรนด์ / สี / ช่วงราคา | ✅ | คำนวณจากสินค้าที่ได้จาก API |
| 2.4 | ค้นหาสินค้า (Search overlay) | ✅ | `GET /api/v1/products?search=` |
| 2.5 | เมนูนำทาง + เมนูมือถือ | ✅ | ใช้ category tree |

### 3. รายละเอียดสินค้า

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 3.1 | แกลเลอรีรูป / เลือกไซส์ / สี / จำนวน | ✅ | ต่อ API แล้ว |
| 3.2 | สินค้าแนะนำ (Related) | ✅ | `/api/v1/recommendations` |
| 3.3 | ชุดสินค้า (Bundle) | ✅ | `/api/v1/bundles` |
| 3.4 | รีวิวสินค้า + คะแนน | 🟡 | hardcode — ตาราง `reviews` มีใน DB แต่ยังไม่มี API |

### 4. ตะกร้าสินค้า

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 4.1 | เพิ่ม / แก้ไขจำนวน / ลบสินค้า | 🟡 | `CartContext` + localStorage |
| 4.2 | แผงตะกร้าด้านข้าง (CartPanel) | 🟡 | |
| 4.3 | คำนวณยอดรวม / ส่วนลด / ค่าส่ง | 🟡 | คำนวณฝั่ง client |
| 4.4 | เชื่อมตะกร้ากับบัญชีผู้ใช้ | ✅ | ตะกร้าผูกบัญชีแล้ว (persistent cart) |

### 5. ระบบสมาชิกและบัญชีผู้ใช้

| # | ฟีเจอร์ | สถานะ | อ้างอิง |
| --- | --- | --- | --- |
| 5.1 | สมัครสมาชิก | ✅ | `POST /api/v1/auth/register` |
| 5.2 | เข้าสู่ระบบ / ออกจากระบบ | ✅ | `/auth/login`, `/auth/logout` |
| 5.3 | ดูโปรไฟล์ + ต่ออายุ token | ✅ | `/auth/profile`, `/auth/refresh` |
| 5.4 | บทบาทผู้ใช้ (role) | ✅ | `customer` / `reseller` / `manager` / `superadmin` |
| 5.5 | role 4 ระดับ + superadmin | ✅ | `008_roles.sql` + `013_superadmin_role.sql` |
| 5.6 | หน้าบัญชีของฉัน (hub) | ✅ | `/account` |

### 6. สั่งซื้อและชำระเงิน

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 6.1 | หน้า checkout หลายขั้นตอน | 🟡 | UI ครบ (ที่อยู่ → จัดส่ง → ชำระเงิน) |
| 6.2 | สมุดที่อยู่ + เติมจังหวัด/อำเภอจากรหัสไปรษณีย์ | ✅ | `/api/v1/addresses` + ตาราง `user_addresses` |
| 6.3 | สร้างคำสั่งซื้อ | ✅ | `/api/v1/orders` |
| 6.4 | ชำระเงิน PromptPay QR + ตรวจสถานะ | ✅ | `/api/v1/payments` + ตาราง `payments`, `payment_accounts` |
| 6.5 | ประวัติคำสั่งซื้อ + รายละเอียด | ✅ | `/api/v1/orders/history` |

### 7. สินค้าโปรด (Favorites)

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 7.1 | กดหัวใจเพิ่ม/เอาออก | 🟡 | `FavoritesContext` + localStorage |
| 7.4 | Toast แจ้งเตือนตอนใส่ตะกร้า | ✅ | หน้า `/favorites` |
| 7.2 | หน้ารวมสินค้าโปรด `/favorites` | 🟡 | |
| 7.3 | ผูกสินค้าโปรดกับบัญชีผู้ใช้ | 🟡 | backend พร้อม (`/api/v1/favorites` + `user_favorites`) — frontend context ยังใช้ localStorage |

### 8. แบบประเมินความพึงพอใจ (Feedback)

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 8.1 | แผงประเมิน (คะแนน / วัตถุประสงค์) | 🟡 | UI อย่างเดียว |
| 8.2 | บันทึกผลประเมิน | ❌ | ยังไม่ส่งไป backend และไม่เก็บลง DB |

### 9. ฝั่งผู้ดูแลระบบ (Reseller / Manager / Super Admin)

| # | ฟีเจอร์ | สถานะ | หมายเหตุ |
| --- | --- | --- | --- |
| 9.1 | API จัดการสินค้า / หมวดหมู่ | ✅ | `/api/v1/products`, `/api/v1/categories` |
| 9.2 | API จัดการแบนเนอร์ / โปรโมชัน / bundle | ✅ | `/banners`, `/promotions`, `/bundles` |
| 9.3 | API จัดการหน้าแรก / attribute / variant | ✅ | `/homepage`, `/attributes` |
| 9.4 | **หน้าจอ Backoffice** | ✅ | `/backoffice` 13 หน้า (สินค้า/คำสั่งซื้อ/ผู้ใช้/แบนเนอร์/analytics ฯลฯ) |
| 9.5 | จัดการคำสั่งซื้อ / อัปเดตสถานะ | ✅ | `/api/v1/orders` (reseller ขึ้นไป) |

### 10. Backend API และฐานข้อมูล

| # | รายการ | สถานะ | รายละเอียด |
| --- | --- | --- | --- |
| 10.1 | Module ที่มีจริง (18) | ✅ | auth, product, category, cart, banner, homepage, promotion, bundle, attribute, recommendation, address, order, payment, favorite, notification, dashboard, analytics, superadmin |
| 10.2 | Health check | ✅ | `GET /api/health` ตรวจสถานะ database |
| 10.3 | ตรวจสอบสิทธิ์ด้วย Bearer Token | ✅ | ผ่าน Supabase Auth |
| 10.4 | ตรวจสอบ input | ✅ | Zod ทุก request |
| 10.5 | CORS | ✅ | `@fastify/cors` |
| 10.6 | Helmet / Rate Limit | ❌ | ติดตั้ง lib แล้วแต่ยังไม่ได้ register |
| 10.7 | ฐานข้อมูล 24 ตาราง | ✅ | `sql/001_init.sql` + `002_seed.sql` |
| 10.8 | ตาราง `user_addresses` / `payments` / `user_favorites` / `notifications` | ✅ | migration 003–013 |

## 🚧 งานที่ยังไม่เสร็จ — ขอความเห็นในทีม

> อัปเดตหลัง commit `d14d75d` (backoffice, roles, payment/favorites API, persistent cart)
> งานเดิมข้อ 1–4, 6, 7 **ทำเสร็จแล้ว** ขอบคุณครับ 🙏 เหลือรายการด้านล่าง

| # | งานที่เหลือ | สถานะปัจจุบัน | ผู้รับผิดชอบ |
| --- | --- | --- | --- |
| 1 | ต่อ `FavoritesContext` เข้ากับ API | backend มี `/api/v1/favorites` + ตาราง `user_favorites` แล้ว แต่ context ฝั่ง frontend ยังใช้ localStorage (มี `scripts/migrate-favorites.ts` เตรียมไว้) | |
| 2 | ระบบรีวิวสินค้า | ตาราง `reviews` มีใน DB แต่ยังไม่มี module API และหน้าสินค้ายังไม่แสดงรีวิวจริง | |
| 3 | ระบบ Feedback | เป็น UI อย่างเดียว ยังไม่ส่งข้อมูลไป backend และไม่บันทึกลง DB | |
| 4 | เปิดใช้ Helmet + Rate Limit | ติดตั้ง lib ไว้ใน `package.json` แล้ว แต่ยังไม่ได้ `register` ใน `Application.ts` | |
| 5 | Toast แจ้งเตือนหน้าอื่น | ตอนนี้ทำเฉพาะหน้า `/favorites` — หน้าสินค้า/หมวดหมู่/หน้าแรก ยังไม่มี feedback ตอนกดใส่ตะกร้า | |

**หมายเหตุการแก้ล่าสุด**
- 🐛 แก้บั๊ก: `008_roles.sql` ตั้ง `CHECK (role IN ('customer','reseller','manager'))` แต่โค้ด (`AuthPlugin`, `AuthSchema`, `seed-superadmin.ts`) ใช้ `superadmin` ด้วย → ตั้ง superadmin ไม่ได้เพราะชน constraint
  แก้แล้วใน **`sql/013_superadmin_role.sql`** — ต้องรัน migration นี้ก่อนใช้ `seed-superadmin`
- เอกสาร/diagram ทั้งหมดอัปเดตให้ตรง role ใหม่แล้ว (customer / reseller / manager / superadmin)

## เทคโนโลยีและเครื่องมือที่ใช้

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- ESLint

### Backend

- Fastify
- TypeScript
- Supabase
- Zod
- dotenv
- CORS (Helmet และ Rate Limit ติดตั้งแล้วแต่ยังไม่เปิดใช้)

### Database และเครื่องมืออื่น ๆ

- Supabase PostgreSQL
- SQL schema และ seed file
- Git และ GitHub
- npm หรือ Bun สำหรับจัดการแพ็กเกจ
- Docker + Nginx บน AWS EC2 (deployment)

## โครงสร้างโปรเจกต์

```text
Project-204/
  README.md
  sport-store/
    package.json
    src/
      app/
      components/
      lib/
  sport-store-api/
    package.json
    src/
      modules/
      plugins/
      config/
      shared/
    sql/
      001_init.sql
      002_seed.sql
```

## วิธีติดตั้งและรันโปรเจกต์

### 1. เตรียมฐานข้อมูล Supabase

สร้าง project ใน Supabase แล้วนำ SQL ในไฟล์ต่อไปนี้ไปรันใน Supabase SQL Editor ตามลำดับ

```text
sport-store-api/sql/001_init.sql
sport-store-api/sql/002_seed.sql
```

### 2. ตั้งค่า backend

เข้าไปที่โฟลเดอร์ API

```bash
cd sport-store-api
npm install
```

สร้างไฟล์ `.env` แล้วใส่ค่าตัวแปรดังนี้

```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CORS_ORIGIN=http://localhost:3000
```

รัน backend

```bash
npm run dev
```

API จะทำงานที่

```text
http://localhost:4000
```

ตรวจสอบสถานะ API ได้ที่

```text
http://localhost:4000/api/health
```

### 3. ตั้งค่า frontend

เปิด terminal อีกหน้าหนึ่ง แล้วเข้าไปที่โฟลเดอร์ frontend

```bash
cd sport-store
npm install
```

สร้างไฟล์ `.env.local` แล้วใส่ค่า API URL

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

รัน frontend

```bash
npm run dev
```

เปิดเว็บที่

```text
http://localhost:3000
```

## API หลักที่มีในระบบ

- `/api/health` ตรวจสอบสถานะ server และ database
- `/api/v1/products` จัดการและเรียกดูข้อมูลสินค้า
- `/api/v1/categories` จัดการหมวดหมู่สินค้า
- `/api/v1/cart` จัดการตะกร้าสินค้า
- `/api/v1/auth` จัดการผู้ใช้และการเข้าสู่ระบบ
- `/api/v1/banners` จัดการแบนเนอร์
- `/api/v1/homepage` จัดการข้อมูลหน้าแรก
- `/api/v1/promotions` จัดการโปรโมชัน
- `/api/v1/recommendations` แนะนำสินค้า
- `/api/v1/bundles` จัดการชุดสินค้า

## หน้าหลักของ frontend

- `/` หน้าแรกของร้าน
- `/login` หน้าเข้าสู่ระบบ
- `/register` หน้าสมัครสมาชิก
- `/cart` หน้าตะกร้าสินค้า
- `/checkout` หน้าชำระเงิน เลือกที่อยู่ วิธีจัดส่ง และชำระผ่าน QR พร้อมเพย์
- `/category/[...slug]` หน้าหมวดหมู่สินค้า
- `/product/[id]` หน้ารายละเอียดสินค้า
- `/favorites` หน้าสินค้าโปรด
- `/account` หน้าบัญชีของฉัน
- `/account/orders` หน้าประวัติคำสั่งซื้อ
- `/account/orders/[id]` หน้ารายละเอียดคำสั่งซื้อ
- `/account/addresses` หน้าสมุดที่อยู่จัดส่ง

## แผนภาพระบบ (System Diagrams)

ไฟล์ต้นฉบับอยู่ที่ [`docs/diagrams/`](docs/diagrams) (`.mmd` + `.png`) · Wireframe/Prototype ที่ [`docs/wireframes.html`](docs/wireframes.html), [`docs/prototype.html`](docs/prototype.html)

> **บทบาทผู้ใช้ 4 ระดับ** (`profiles.role` — สิทธิ์แบบลำดับชั้น สูงกว่าครอบคลุมต่ำกว่า)
> `customer` (0) → `reseller` (1) → `manager` (2) → `superadmin` (3)

### 1. Use Case Diagram

```mermaid
flowchart LR
    Guest(["ผู้ใช้ทั่วไป"])
    Member(["สมาชิก (customer)"])
    Reseller(["ตัวแทนจำหน่าย (reseller)"])
    Manager(["ผู้จัดการ (manager)"])
    SAdmin(["ผู้ดูแลระบบสูงสุด (superadmin)"])
    PP(["PromptPay"])

    subgraph SYS["ระบบ Sport Store"]
        UC1["ดู / ค้นหาสินค้า"]
        UC2["ดูรายละเอียดสินค้า"]
        UC3["จัดการตะกร้า"]
        UC4["สมัครสมาชิก"]
        UC5["เข้าสู่ระบบ"]
        UC6["จัดการสินค้าโปรด"]
        UC7["จัดการที่อยู่จัดส่ง"]
        UC8["ทำรายการสั่งซื้อ (Checkout)"]
        UC9["ชำระเงิน PromptPay"]
        UC10["ดูประวัติคำสั่งซื้อ"]
        UC11["เขียนรีวิวสินค้า"]
        UC12["ให้คะแนนความพึงพอใจ"]

        UC13["จัดการสินค้า / สต็อก"]
        UC14["จัดการโปรโมชัน / ชุดสินค้า"]
        UC15["จัดการคุณลักษณะสินค้า"]
        UC16["จัดการคำสั่งซื้อ / สถานะ"]
        UC17["ตรวจสอบการชำระเงิน"]
        UC18["ดูแดชบอร์ด / วิเคราะห์ยอดขาย"]
        UC19["จัดการการแจ้งเตือน"]

        UC20["จัดการหมวดหมู่สินค้า"]
        UC21["จัดการแบนเนอร์ / หน้าแรก"]
        UC22["จัดการบัญชีผู้ใช้"]
        UC23["จัดการบัญชีรับเงิน"]

        UC24["จัดการพนักงาน (Staff)"]
        UC25["กำหนดสิทธิ์ (role)"]
        UC26["เปิด / ปิดการใช้งานบัญชี"]
        UC27["ดูสถิติระบบ"]
    end

    Guest --- UC1
    Guest --- UC2
    Guest --- UC3
    Guest --- UC4
    Guest --- UC12
    Member --- UC5
    Member --- UC6
    Member --- UC7
    Member --- UC8
    Member --- UC10
    Member --- UC11
    UC8 -. include .-> UC7
    UC8 -. include .-> UC9
    UC9 -. include .-> UC10
    UC9 --- PP

    Reseller --- UC13
    Reseller --- UC14
    Reseller --- UC15
    Reseller --- UC16
    Reseller --- UC17
    Reseller --- UC18
    Reseller --- UC19

    Manager --- UC20
    Manager --- UC21
    Manager --- UC22
    Manager --- UC23

    SAdmin --- UC24
    SAdmin --- UC25
    SAdmin --- UC26
    SAdmin --- UC27

    Manager -. สืบทอดสิทธิ์ .-> Reseller
    SAdmin -. สืบทอดสิทธิ์ .-> Manager
```

### 2. Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +uuid id
        +string email
        +string full_name
        +string phone
        +string avatar_url
        +string role
        +bool is_active
        +register()
        +login()
        +logout()
        +getProfile()
        +updateProfile()
        +requestPasswordReset()
        +refreshToken()
    }
    class Customer {
        +browseProducts()
        +manageCart()
        +manageFavorites()
        +placeOrder()
        +viewOrderHistory()
        +writeReview()
    }
    class Reseller {
        +manageProduct()
        +adjustStock()
        +managePromotion()
        +manageBundle()
        +manageAttribute()
        +manageOrder()
        +verifyPayment()
        +viewDashboard()
        +viewAnalytics()
        +manageNotification()
    }
    class Manager {
        +manageCategory()
        +manageBanner()
        +manageHomepage()
        +manageUserAccount()
        +managePaymentAccount()
    }
    class SuperAdmin {
        +createStaff()
        +assignRole()
        +setUserActive()
        +viewSystemStats()
    }

    class Category {
        +uuid id
        +string name
        +string slug
        +string route_path
        +uuid parent_id
        +int level
        +bool is_active
        +getCategoryTree()
        +getRootCategories()
        +getChildren()
        +getByRoutePath()
        +createCategory()
        +updateCategory()
        +deleteCategory()
    }
    class Product {
        +uuid id
        +string name
        +string slug
        +string sku
        +number price
        +number original_price
        +string brand
        +uuid category_id
        +json images
        +int stock
        +bool is_featured
        +getAllProducts()
        +getProductById()
        +getRelatedProducts()
        +getProductsByCategory()
        +createProduct()
        +updateProduct()
        +deleteProduct()
        +adjustStock()
    }
    class ProductVariant {
        +uuid id
        +uuid product_id
        +string sku
        +number price_override
        +int stock
        +getVariantsByProduct()
        +createVariant()
        +updateVariant()
        +deleteVariant()
    }
    class AttributeGroup {
        +uuid id
        +string name
        +getAllGroups()
        +getGroupById()
        +createGroup()
        +updateGroup()
        +deleteGroup()
        +getCategoryAttributes()
        +linkCategoryAttribute()
        +unlinkCategoryAttribute()
    }
    class AttributeOption {
        +uuid id
        +uuid group_id
        +string value
        +getOptionsByGroup()
        +createOption()
        +updateOption()
        +deleteOption()
    }

    class Cart {
        +uuid user_id
        +int totalItems
        +number totalPrice
        +getCart()
        +addItem()
        +updateItem()
        +removeItem()
        +clearCart()
        +getItemCount()
    }
    class CartItem {
        +uuid id
        +uuid product_id
        +int quantity
        +string size
        +string color
    }

    class Favorite {
        +List~FavoriteItem~ items
        +int totalItems
        +isFavorite()
        +addFavorite()
        +removeFavorite()
        +toggleFavorite()
        +clearFavorites()
    }
    class FavoriteItem {
        +uuid product_id
        +string name
        +string brand
        +string image
        +number price
    }

    class Order {
        +uuid id
        +uuid user_id
        +string status
        +number total
        +createOrder()
        +getOrderHistory()
        +getOrderDetail()
        +updateStatus()
        +calculateTotal()
    }
    class OrderItem {
        +uuid id
        +uuid order_id
        +uuid product_id
        +uuid variant_id
        +int quantity
        +number price
        +getSubtotal()
    }
    class Payment {
        +uuid id
        +uuid order_id
        +string method
        +number amount
        +number ref_amount
        +string status
        +createPayment()
        +generateQR()
        +checkStatus()
        +confirm()
    }
    class Address {
        +uuid id
        +uuid user_id
        +string province
        +string amphoe
        +string postal_code
        +bool is_default
        +getAddresses()
        +createAddress()
        +updateAddress()
        +deleteAddress()
        +setDefault()
    }
    class Review {
        +uuid id
        +uuid user_id
        +uuid product_id
        +int rating
        +string title
        +string comment
        +bool is_verified
        +getReviewsByProduct()
        +createReview()
        +updateReview()
        +deleteReview()
    }

    class Banner {
        +uuid id
        +string type
        +string title
        +string image
        +int sort_order
        +getBanners()
        +createBanner()
        +updateBanner()
        +deleteBanner()
    }
    class Promotion {
        +uuid id
        +string name
        +string type
        +number value
        +datetime start_at
        +datetime end_at
        +getAll()
        +getBySlug()
        +getActiveDeals()
        +getPromotionProducts()
        +create()
        +update()
        +delete()
        +addProduct()
        +removeProduct()
    }
    class ProductBundle {
        +uuid id
        +string name
        +number bundle_price
        +getAll()
        +getActiveBundles()
        +getBundlesForProduct()
        +create()
        +update()
        +remove()
        +addItem()
        +removeItem()
        +linkToProduct()
        +unlinkFromProduct()
    }
    class HomepageSection {
        +uuid id
        +string title
        +string type
        +uuid category_id
        +int sort_order
        +getSections()
        +getCategoryShortcuts()
        +getConfig()
        +createSection()
        +updateSection()
        +deleteSection()
        +addProductToSection()
        +removeProductFromSection()
    }
    class Recommendation {
        +trackView()
        +getRecommendations()
        +getTrending()
    }
    class ProductView {
        +uuid id
        +uuid user_id
        +uuid product_id
        +datetime viewed_at
    }
    class CategoryShortcut {
        +uuid id
        +string label
        +string image
        +string link
        +int sort_order
        +getAllShortcuts()
        +createShortcut()
        +updateShortcut()
        +deleteShortcut()
    }
    class SiteConfig {
        +string key
        +string value
        +getConfig()
        +getAllConfig()
        +updateConfig()
        +deleteConfig()
    }
    class PaymentAccount {
        +uuid id
        +string bank
        +string account_no
        +string promptpay_number
        +bool is_active
        +getAccounts()
        +createAccount()
        +updateAccount()
        +deleteAccount()
    }
    class Notification {
        +uuid id
        +uuid user_id
        +string type
        +string message
        +bool is_read
        +getNotifications()
        +createNotification()
        +markAsRead()
        +remove()
    }
    class Dashboard {
        +getSummary()
        +getSalesOverview()
        +getTopProducts()
    }
    class Analytics {
        +getFull()
        +getBehavior()
        +getSalesByPeriod()
    }
    class Feedback {
        +int rating
        +string purpose
        +bool achieved
        +submitFeedback()
    }

    User <|-- Customer
    User <|-- Reseller
    Reseller <|-- Manager
    Manager <|-- SuperAdmin

    Customer "1" --> "*" Address
    Customer "1" --> "*" Order
    Customer "1" --> "1" Cart
    Customer "1" --> "*" Review
    Customer "1" --> "1" Favorite
    Favorite "1" --> "*" FavoriteItem

    Category "1" --> "*" Category
    Category "1" --> "*" Product
    Category "*" --> "*" AttributeGroup

    Product "1" --> "*" ProductVariant
    Product "1" --> "*" CartItem
    Product "1" --> "*" OrderItem
    Product "1" --> "*" Review
    Product "1" --> "*" FavoriteItem
    Product "*" --> "*" Promotion
    Product "*" --> "*" ProductBundle

    AttributeGroup "1" --> "*" AttributeOption
    ProductVariant "1" --> "*" OrderItem

    Cart "1" --> "*" CartItem
    Order "1" --> "*" OrderItem
    Order "1" --> "1" Payment
    Payment "*" --> "1" PaymentAccount
    User "1" --> "*" Notification

    HomepageSection "1" --> "*" Product
    Recommendation ..> Product : แนะนำ
    Recommendation "1" --> "*" ProductView
    Product "1" --> "*" ProductView
    Customer ..> Feedback : ส่งแบบประเมิน
```

### 3. Sequence Diagram

แยกตาม flow การใช้งานเพื่อให้อ่านง่าย (รวมกันครอบคลุมทั้งระบบ)

#### 3.1 เข้าชมหน้าแรกและค้นหาสินค้า

```mermaid
sequenceDiagram
    autonumber
    actor C as ลูกค้า
    participant FE as Frontend (Next.js)
    participant BE as Backend (Fastify)
    participant DB as PostgreSQL

    Note over C,DB: Flow 1 — เข้าชมหน้าแรกและค้นหาสินค้า

    C->>FE: เปิดเว็บ /
    FE->>BE: GET /api/v1/homepage/sections
    BE->>DB: query homepage_sections + products
    DB-->>BE: sections
    BE-->>FE: JSON
    FE->>BE: GET /api/v1/banners?type=hero
    BE-->>FE: banners
    FE-->>C: แสดง Hero + หมวดหมู่ + ดีลสินค้า

    C->>FE: พิมพ์คำค้นหา
    FE->>BE: GET /api/v1/products?search=...
    BE->>DB: query products
    DB-->>BE: รายการสินค้า
    BE-->>FE: ผลการค้นหา
    FE-->>C: แสดงผลการค้นหา
```

#### 3.2 ดูรายละเอียดสินค้า

```mermaid
sequenceDiagram
    autonumber
    actor C as ลูกค้า
    participant FE as Frontend (Next.js)
    participant BE as Backend (Fastify)
    participant DB as PostgreSQL

    Note over C,DB: Flow 2 — ดูรายละเอียดสินค้าและสินค้าแนะนำ

    C->>FE: คลิกสินค้า
    FE->>BE: GET /api/v1/products/:id
    BE->>DB: query product + variants
    DB-->>BE: ข้อมูลสินค้า
    BE-->>FE: รายละเอียดสินค้า
    FE->>BE: POST /api/v1/recommendations/track
    BE->>DB: insert product_views
    FE->>BE: GET /api/v1/recommendations
    BE-->>FE: สินค้าแนะนำ
    FE-->>C: แสดงหน้าสินค้า + สินค้าแนะนำ
```

#### 3.3 สมัครสมาชิก / เข้าสู่ระบบ

```mermaid
sequenceDiagram
    autonumber
    actor C as ลูกค้า
    participant FE as Frontend (Next.js)
    participant BE as Backend (Fastify)
    participant SB as Supabase Auth
    participant DB as PostgreSQL

    Note over C,DB: Flow 3 — สมัครสมาชิก / เข้าสู่ระบบ

    C->>FE: กรอกอีเมล + รหัสผ่าน
    FE->>BE: POST /api/v1/auth/register หรือ /login
    BE->>SB: สร้าง / ตรวจสอบบัญชี
    SB-->>BE: access_token + refresh_token
    BE->>DB: อ่าน profiles (role)
    DB-->>BE: profile (customer/employee/admin)
    BE-->>FE: token + user
    FE->>FE: เก็บ token ใน AuthContext
    FE-->>C: เข้าสู่ระบบสำเร็จ
```

#### 3.4 สั่งซื้อและชำระเงิน

```mermaid
sequenceDiagram
    autonumber
    actor C as ลูกค้า
    participant FE as Frontend (Next.js)
    participant BE as Backend (Fastify)
    participant DB as PostgreSQL
    participant PP as PromptPay

    Note over C,PP: Flow 4 — สั่งซื้อและชำระเงิน (planned: ยังไม่ implement ฝั่ง backend)

    C->>FE: เพิ่มสินค้าลงตะกร้า
    FE->>BE: POST /api/v1/cart (Bearer token)
    BE->>DB: insert cart_items
    DB-->>BE: ok
    C->>FE: เข้า /checkout เลือกที่อยู่ + วิธีจัดส่ง
    FE->>BE: POST /api/v1/orders
    BE->>DB: insert orders + order_items
    DB-->>BE: order_number
    BE-->>FE: order
    FE->>BE: POST /api/v1/payments
    BE->>PP: ขอสร้าง QR PromptPay
    PP-->>BE: qr_image + payment_id
    BE-->>FE: qr_image
    C->>PP: สแกน QR แล้วโอนเงิน
    loop ทุก 3 วินาที
        FE->>BE: GET /api/v1/payments/:id/status
        BE-->>FE: status
    end
    FE-->>C: แสดงหน้า "สั่งซื้อสำเร็จ" + ล้างตะกร้า
```

#### 3.5 จัดการร้านค้า (Reseller / Manager)

```mermaid
sequenceDiagram
    autonumber
    actor A as พนักงาน / ผู้ดูแลระบบ
    participant FE as Frontend (Next.js)
    participant BE as Backend (Fastify)
    participant SB as Supabase Auth
    participant DB as PostgreSQL

    Note over A,DB: Flow 5 — จัดการร้านค้า (Employee / Admin)

    A->>FE: เข้าหน้าจัดการ
    FE->>BE: GET /api/v1/orders (แนบ token)
    BE->>SB: ตรวจ token + role
    SB-->>BE: role = employee / admin
    BE->>DB: query orders
    DB-->>BE: รายการคำสั่งซื้อ
    BE-->>FE: orders
    A->>FE: อัปเดตสถานะคำสั่งซื้อ
    FE->>BE: PUT /api/v1/orders/:id
    BE->>DB: update orders.status
    A->>FE: เพิ่ม / แก้ไขสินค้า
    FE->>BE: POST หรือ PUT /api/v1/products
    BE->>DB: insert / update products
    DB-->>BE: ok
    BE-->>FE: สำเร็จ
    FE-->>A: แสดงผลการบันทึก
```

#### 3.6 จัดการสินค้าโปรด

```mermaid
sequenceDiagram
    autonumber
    actor C as ลูกค้า
    participant FE as Frontend (Next.js)
    participant CTX as FavoritesContext
    participant BE as Backend (Fastify)
    participant SB as Supabase Auth
    participant DB as PostgreSQL

    Note over C,DB: Flow 6 — จัดการสินค้าโปรด (Favorites)

    C->>FE: กดรูปหัวใจที่สินค้า
    FE->>CTX: toggleFavorite()
    CTX->>CTX: บันทึกลง localStorage (กรณียังไม่ล็อกอิน)

    alt ล็อกอินแล้ว
        FE->>BE: POST /api/v1/favorites (Bearer token)
        BE->>SB: ตรวจสอบ token
        SB-->>BE: user
        BE->>DB: insert user_favorites
        DB-->>BE: ok
        BE-->>FE: สำเร็จ
    end

    C->>FE: เข้าหน้า /favorites
    FE->>BE: GET /api/v1/favorites
    BE->>DB: query user_favorites + products
    DB-->>BE: รายการสินค้าโปรด
    BE-->>FE: favorites
    FE-->>C: แสดงรายการสินค้าโปรด

    C->>FE: กด "ใส่ตะกร้า"
    FE->>BE: POST /api/v1/cart
    BE->>DB: insert cart_items
    DB-->>BE: ok
    FE-->>C: แสดง toast "เพิ่มลงตะกร้าแล้ว"
```

### 4. System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["ผู้ใช้งาน (Client)"]
        BR["Browser / Mobile<br/>Customer · Employee · Admin · Super Admin"]
    end

    subgraph FE["Frontend — Next.js (App Router) + TypeScript"]
        PAGES["Pages<br/>/ · /product · /category · /cart<br/>/checkout · /account · /favorites"]
        COMP["Components<br/>Header · NavMenu · SearchOverlay · CartPanel"]
        CTX["State (Context + localStorage)<br/>AuthContext · CartContext · FavoritesContext"]
        APICLI["API Client<br/>lib/api.ts"]
    end

    subgraph BE["Backend — Fastify + TypeScript"]
        PLUG["Plugins<br/>CorsPlugin · AuthPlugin · ErrorHandler"]
        ROUTE["Routes<br/>/api/v1/*"]
        CTRL["Controller<br/>รับ request + validate ด้วย Zod"]
        SVC["Service<br/>business logic"]
        REPO["Repository<br/>query ข้อมูล"]
    end

    subgraph DATA["Supabase (BaaS)"]
        AUTH["Supabase Auth<br/>ออก/ตรวจสอบ Bearer Token"]
        PG[("PostgreSQL<br/>profiles · products · categories<br/>orders · order_items · reviews")]
    end

    EXT["PromptPay<br/>สร้าง QR / ยืนยันการชำระเงิน<br/>(planned)"]

    BR -->|HTTPS| PAGES
    PAGES --- COMP
    PAGES --- CTX
    PAGES --> APICLI
    APICLI -->|REST JSON<br/>NEXT_PUBLIC_API_URL| PLUG
    PLUG --> ROUTE
    ROUTE --> CTRL
    CTRL --> SVC
    SVC --> REPO
    REPO -->|supabase-js| PG
    PLUG -.ตรวจ Token.-> AUTH
    AUTH --- PG
    SVC -.เรียกชำระเงิน.-> EXT
```

### 5. Deployment Diagram

```mermaid
flowchart TB
    User(["ผู้ใช้ (Browser)"])

    subgraph AWS["AWS Cloud"]
        subgraph EC2["Amazon EC2 Instance"]
            Nginx["Nginx<br/>(Reverse Proxy / SSL)"]
            subgraph DOCKER["Docker"]
                FE["Frontend Container<br/>Next.js : 3000"]
                BE["Backend Container<br/>Fastify API : 4000"]
            end
        end
    end

    SB[("Supabase<br/>PostgreSQL + Auth")]
    PP["PromptPay<br/>(ระบบชำระเงิน)"]
    LINE["LINE Messaging API<br/>(แจ้งเตือน / อ่านสลิป)"]

    User -->|HTTPS| Nginx
    Nginx -->|route /| FE
    Nginx -->|route /api| BE
    FE -->|เรียก API| BE
    BE -->|supabase-js| SB
    BE -.ชำระเงิน.-> PP
    BE -.แจ้งเตือน.-> LINE
```

## หมายเหตุการพัฒนา

ระบบนี้ออกแบบเป็น full-stack web application โดย frontend เรียกข้อมูลผ่าน backend API และ backend เชื่อมต่อฐานข้อมูล Supabase หากต้องการนำไปใช้งานจริงควรตั้งค่า environment variables ให้ครบ ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล และทดสอบ API ก่อน deploy

## รายชื่อผู้จัดทำ

| รหัสนักศึกษา | ชื่อ-นามสกุล | กลุ่ม/ห้องปฏิบัติการ | ตำแหน่ง |
| --- | --- | --- | --- |
| 66083478 | ณัฐมน สุโพธิ์ | T002/L002 | นักพัฒนาส่วนหน้าและผู้ทดสอบคุณภาพระบบ (Frontend Developer & QA) |
| 67159957 | พลช ชูตระกูลวงศ์ | T003/L005 | นักพัฒนา Full-stack นักวิเคราะห์ระบบ และผู้ทดสอบคุณภาพระบบ (Full-stack Developer, System Analyst & QA) |
| 67130409 | เลปกร ศรีสมุทร | T003/L004 | นักพัฒนา Full-stack (Full-stack Developer) |
| 67126710 | ชิษณุพงศ์ สาตร์แก้ว | T003/L005 | ผู้จัดการโครงการ (Project Manager - PM) |


## Url
- https://demo-spu.neoragnaworld.com/
