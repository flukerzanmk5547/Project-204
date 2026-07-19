# Project 204 - Sport Store

Sport Store เป็นเว็บอีคอมเมิร์ซสำหรับขายสินค้าและอุปกรณ์กีฬา พัฒนาเป็นระบบแยก frontend และ backend โดยฝั่งหน้าเว็บใช้ Next.js สำหรับแสดงสินค้า หมวดหมู่ โปรโมชัน รายละเอียดสินค้า และตะกร้าสินค้า ส่วนฝั่ง API ใช้ Fastify เชื่อมต่อ Supabase เพื่อจัดการข้อมูลสินค้า หมวดหมู่ ผู้ใช้ ตะกร้า แบนเนอร์ โปรโมชัน และข้อมูลหน้าแรก

## รายละเอียดโปรเจกต์

โปรเจกต์นี้จำลองระบบร้านค้าออนไลน์สายกีฬา มีหน้าเว็บสำหรับให้ผู้ใช้เลือกดูสินค้า ค้นหาสินค้า ดูรายละเอียดสินค้า เลือกสินค้าเข้าตะกร้า และดูหมวดหมู่สินค้าต่าง ๆ พร้อม backend API สำหรับส่งข้อมูลไปยังหน้าเว็บ ระบบถูกแบ่งออกเป็น 2 ส่วนหลัก คือ

- `sport-store` ส่วน frontend ที่พัฒนาด้วย Next.js
- `sport-store-api` ส่วน backend API ที่พัฒนาด้วย Fastify และเชื่อมต่อ Supabase

## ฟีเจอร์หลัก

- หน้าแรกแสดง hero banner, หมวดหมู่สินค้า, ดีลสินค้า และสินค้าแนะนำ
- แสดงหมวดหมู่สินค้าแบบหลายระดับ
- หน้ารายละเอียดสินค้า พร้อมรูปภาพสินค้า ราคา ไซส์ สี รีวิว และสินค้าแนะนำ
- ระบบตะกร้าสินค้าแบบแผงด้านข้าง
- ระบบสมาชิก สมัครสมาชิก เข้าสู่ระบบ และจัดการเซสชันด้วย token
- หน้าบัญชีของฉัน รวมเมนูคำสั่งซื้อ สมุดที่อยู่ และสินค้าโปรด
- ประวัติคำสั่งซื้อและหน้ารายละเอียดคำสั่งซื้อ พร้อมสถานะการสั่งซื้อ
- สมุดที่อยู่จัดส่ง เพิ่ม แก้ไข ลบ พร้อมระบบกรอกที่อยู่ไทยและเติมจังหวัด/อำเภอจากรหัสไปรษณีย์อัตโนมัติ
- ระบบสินค้าโปรด บันทึกสินค้าที่ชอบไว้ดูภายหลัง
- ขั้นตอนชำระเงินแบบหลายสเต็ป เลือกที่อยู่ วิธีจัดส่ง และชำระเงินผ่าน QR พร้อมเพย์
- ส่วน feedback สำหรับผู้ใช้
- Backend API สำหรับสินค้า หมวดหมู่ ตะกร้า ผู้ใช้ แบนเนอร์ หน้าแรก โปรโมชัน recommendation และ bundle
- โครงสร้างฐานข้อมูลสำหรับสินค้า หมวดหมู่ รีวิว ตะกร้า คำสั่งซื้อ โปรโมชัน และ bundle

## 🚧 งานที่ยังไม่เสร็จ — ขอความเห็นในทีม

จากการตรวจสอบโค้ดล่าสุด (เทียบ frontend / backend / ฐานข้อมูล) ส่วนต่อไปนี้ **ออกแบบไว้ในเอกสารแล้ว แต่ยังไม่ได้เขียนโค้ด**
ฝากทีมช่วยดูว่า **มีใครทำอยู่แล้วหรือยัง** — ถ้ายังไม่มีใครรับ จะได้แบ่งงานกันต่อ

| # | งานที่เหลือ | สถานะปัจจุบัน | ผู้รับผิดชอบ |
| --- | --- | --- | --- |
| 1 | Backend module `orders` | ตาราง `orders` / `order_items` มีใน DB แล้ว แต่ยังไม่มี API — frontend `/checkout` และ `/account/orders` เรียก endpoint ที่ยังไม่มีอยู่ | |
| 2 | Backend module `addresses` | ยังไม่มีทั้ง API และตาราง — frontend `/account/addresses` เรียกอยู่ | |
| 3 | Backend module `payments` | ยังไม่มีทั้ง API และตาราง — flow ชำระเงิน PromptPay ยังทำงานจริงไม่ได้ | |
| 4 | Backend module `reviews` | ตาราง `reviews` มีใน DB แล้ว แต่ยังไม่มี API — รีวิวในหน้าสินค้ายังเป็นข้อมูล hardcode | |
| 5 | ระบบสินค้าโปรด (favorites) | ทำงานฝั่ง frontend ด้วย localStorage เท่านั้น ยังไม่ผูกกับบัญชีผู้ใช้ | |
| 6 | เพิ่ม role `super_admin` | ตอนนี้ `profiles.role` เป็น `CHECK (role IN ('customer','employee','admin'))` ต้องเพิ่ม `super_admin` ใน schema | |
| 7 | หน้า UI ฝั่ง Admin / Employee | backend มี API จัดการสินค้า หมวดหมู่ แบนเนอร์ โปรโมชันแล้ว แต่ frontend ยังไม่มีหน้าจัดการ | |
| 8 | ระบบ Feedback | เป็น UI อย่างเดียว ยังไม่ส่งข้อมูลไป backend และไม่บันทึกลงฐานข้อมูล | |

**คำถามถึงทีม**
1. มีใครทำข้อไหนอยู่แล้วบ้าง? เขียนชื่อในช่อง "ผู้รับผิดชอบ" หรือคอมเมนต์ใน Issue ได้เลย
2. ถ้ายังไม่มีใครรับ เสนอเริ่มจาก **ข้อ 1–3 (orders → addresses → payments)** ก่อน เพราะกระทบ flow ซื้อขายมากที่สุด — ตอนนี้กดสั่งซื้อจริงยังไม่ได้
3. ข้อ 6 ต้องตกลงกันก่อนว่าจะเพิ่ม `super_admin` จริงไหม เพราะต้องแก้ schema (เอกสาร/diagram เตรียมไว้แล้ว)

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
- CORS, Helmet และ Rate Limit

### Database และเครื่องมืออื่น ๆ

- Supabase PostgreSQL
- SQL schema และ seed file
- Git และ GitHub
- npm หรือ Bun สำหรับจัดการแพ็กเกจ

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

ไฟล์ต้นฉบับทั้งหมดอยู่ที่ [`docs/diagrams/`](docs/diagrams) (`.mmd` + `.png`)
Wireframe / Prototype เปิดดูได้ที่ [`docs/wireframes.html`](docs/wireframes.html) และ [`docs/prototype.html`](docs/prototype.html)

> **บทบาทผู้ใช้ในระบบ:** `customer` · `employee` · `admin` (ตาม `profiles.role` ในฐานข้อมูล) และ `super_admin` (อยู่ระหว่างเพิ่มใน schema)
> ส่วนที่กำกับว่า **planned** คือออกแบบไว้แล้วแต่ยังไม่ได้ implement ฝั่ง backend (orders / addresses / payments / reviews API)
> **สินค้าโปรด (Favorite)** ทำงานฝั่ง frontend ด้วย localStorage เท่านั้น ยังไม่มี API และตารางในฐานข้อมูล
> **แบบประเมินความพึงพอใจ (Feedback)** เป็น UI อย่างเดียว ยังไม่ส่งข้อมูลไป backend และไม่บันทึกลงฐานข้อมูล

### 1. Use Case Diagram

```mermaid
flowchart LR
    Guest(["ผู้ใช้ทั่วไป"])
    Member(["สมาชิก (Customer)"])
    Emp(["พนักงาน (Employee)"])
    Admin(["ผู้ดูแลระบบ (Admin)"])
    SAdmin(["ผู้ดูแลระบบสูงสุด (Super Admin)"])
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
        UC12["ตรวจสอบคำสั่งซื้อ"]
        UC13["อัปเดตสถานะคำสั่งซื้อ"]
        UC14["จัดการสต็อกสินค้า"]
        UC15["จัดการสินค้า / หมวดหมู่"]
        UC16["จัดการแบนเนอร์ / โปรโมชัน"]
        UC17["จัดการหน้าแรก / ชุดสินค้า"]
        UC18["ดูรายงานยอดขาย"]
        UC19["จัดการบัญชีผู้ดูแลระบบ"]
        UC20["กำหนดสิทธิ์การเข้าถึง"]
        UC21["ตั้งค่าระบบ"]
        UC22["ให้คะแนนความพึงพอใจ (Feedback)"]
    end

    Guest --- UC1
    Guest --- UC2
    Guest --- UC3
    Guest --- UC4
    Guest --- UC22
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

    Emp --- UC12
    Emp --- UC13
    Emp --- UC14
    Admin --- UC15
    Admin --- UC16
    Admin --- UC17
    Admin --- UC18
    SAdmin --- UC19
    SAdmin --- UC20
    SAdmin --- UC21

    Admin -. สืบทอดสิทธิ์ .-> Emp
    SAdmin -. สืบทอดสิทธิ์ .-> Admin
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
    class Employee {
        +viewOrders()
        +updateOrderStatus()
        +adjustStock()
    }
    class Admin {
        +manageProduct()
        +manageCategory()
        +manageBanner()
        +managePromotion()
        +manageBundle()
        +manageHomepage()
        +viewSalesReport()
    }
    class SuperAdmin {
        +manageAdminAccount()
        +assignPermission()
        +configureSystem()
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
    class Feedback {
        +int rating
        +string purpose
        +bool achieved
        +submitFeedback()
    }

    User <|-- Customer
    User <|-- Employee
    Employee <|-- Admin
    Admin <|-- SuperAdmin

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

#### 3.5 จัดการร้านค้า (Employee / Admin)

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
    subgraph SERVER["เซิร์ฟเวอร์ — Docker Compose"]
        Nginx["Nginx<br/>(Reverse Proxy / SSL)"]
        FE["Frontend Container<br/>Next.js"]
        BE["Backend Container<br/>Fastify API"]
    end
    DB[("Supabase<br/>PostgreSQL")]

    User -->|HTTPS| Nginx
    Nginx -->|route /| FE
    Nginx -->|route /api| BE
    FE -->|เรียก API| BE
    BE -->|query ข้อมูล| DB
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
