# Sport Store — Frontend

ส่วนหน้าเว็บ (frontend) ของ Project 204 - Sport Store พัฒนาด้วย Next.js (App Router) เชื่อมต่อข้อมูลผ่าน backend API (`sport-store-api`) แสดงสินค้า หมวดหมู่ โปรโมชัน รายละเอียดสินค้า ตะกร้า ระบบสมาชิก บัญชีผู้ใช้ คำสั่งซื้อ ที่อยู่จัดส่ง สินค้าโปรด และการชำระเงิน

## เทคโนโลยีที่ใช้

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Lucide React (ไอคอน)
- ESLint

## เริ่มต้นใช้งาน

ติดตั้ง dependencies

```bash
npm install
```

สร้างไฟล์ `.env.local` แล้วกำหนด URL ของ backend API

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

รัน development server

```bash
npm run dev
```

เปิดเว็บที่ [http://localhost:3000](http://localhost:3000)

> ต้องรัน `sport-store-api` ที่พอร์ต 4000 ควบคู่กันเพื่อให้ข้อมูลสินค้า/บัญชี/คำสั่งซื้อทำงานครบ ดูรายละเอียดการตั้งค่า backend ได้ที่ README หลักของโปรเจกต์

## หน้าหลัก

| Route | รายละเอียด |
| --- | --- |
| `/` | หน้าแรก hero banner หมวดหมู่ ดีล และสินค้าแนะนำ |
| `/login` | เข้าสู่ระบบ |
| `/register` | สมัครสมาชิก |
| `/cart` | ตะกร้าสินค้า |
| `/checkout` | ชำระเงิน เลือกที่อยู่ วิธีจัดส่ง และชำระผ่าน QR พร้อมเพย์ |
| `/category/[...slug]` | หมวดหมู่สินค้าแบบหลายระดับ |
| `/product/[id]` | รายละเอียดสินค้า |
| `/favorites` | สินค้าโปรด |
| `/account` | บัญชีของฉัน (รวมเมนู) |
| `/account/orders` | ประวัติคำสั่งซื้อ |
| `/account/orders/[id]` | รายละเอียดคำสั่งซื้อ |
| `/account/addresses` | สมุดที่อยู่จัดส่ง |

## โครงสร้างโค้ด

```text
src/
  app/            # หน้าเพจตาม App Router
  components/     # คอมโพเนนต์ UI (Header, Footer, Hero, การ์ดสินค้า ฯลฯ)
  lib/            # API client และ Context
    api.ts            # ตัวเรียก backend API
    AuthContext.tsx   # จัดการสถานะผู้ใช้/token
    CartContext.tsx   # จัดการตะกร้าสินค้า (localStorage)
    FavoritesContext.tsx  # จัดการสินค้าโปรด (localStorage)
    thaiPostalData.ts # ข้อมูล/ตัวช่วยที่อยู่ไทย (จังหวัด/อำเภอ/รหัสไปรษณีย์)
```

## สคริปต์

- `npm run dev` — รัน development server
- `npm run build` — build สำหรับ production
- `npm run start` — รัน production server
- `npm run lint` — ตรวจสอบโค้ดด้วย ESLint
