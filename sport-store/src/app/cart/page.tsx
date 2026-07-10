"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FeedbackPanel from "@/components/FeedbackPanel";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, Check, Tag } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: number;
  image: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  size: string;
  color?: string;
  quantity: number;
  checked: boolean;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/58/300/300",
    name: "หมวกกันน้ำสำหรับเดินป่ารุ่น TREK 900 สีกาดอลีฟ",
    brand: "FORCLAZ",
    price: 490,
    originalPrice: 550,
    discount: 10,
    size: "60-62 ซม.",
    color: "เขตร้อนลมอุ่น,เขตทางตะวันตก",
    quantity: 1,
    checked: true,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/20/300/300",
    name: "ที่นอนสำหรับ 1 คนใช้ในการตั้งแคมป์รุ่น AIR BASIC ขนาด 70 ซม.",
    brand: "QUECHUA",
    price: 399,
    originalPrice: 599,
    discount: 33,
    size: "ไซส์เดียว",
    color: "กรวดสีเบจ,เบคาจูสีไม้",
    quantity: 1,
    checked: true,
  },
  {
    id: 3,
    image: "https://picsum.photos/id/30/300/300",
    name: "ที่นอนเป่าลมสำหรับ 2 คนใช้ในการตั้งแคมป์รุ่น AIR BASIC ขนาด 140 ซม.",
    brand: "QUECHUA",
    price: 800,
    originalPrice: 1100,
    discount: 27,
    size: "ไซส์เดียว",
    color: "เวิร์กกรีนลิเบจ,ผ้าน้ำหยดเล็ก",
    quantity: 1,
    checked: true,
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [allChecked, setAllChecked] = useState(true);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setItems((prev) => prev.map((item) => ({ ...item, checked: next })));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const checkedItems = items.filter((item) => item.checked);
  const subtotal = checkedItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const discountTotal = checkedItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice - item.price : 0) *
        item.quantity,
    0
  );
  const total = subtotal - discountTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 py-6">

        <h1 className="text-2xl font-bold text-navy mb-6">ตะกร้าของฉัน</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Cart Items */}
          <div className="flex-1">
            {/* Seller Header */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={toggleAll}
                className={`w-5 h-5 rounded shrink-0 flex items-center justify-center border-2 transition-colors ${
                  allChecked
                    ? "bg-blue-accent border-blue-accent"
                    : "border-gray-400"
                }`}
              >
                {allChecked && <Check size={14} className="text-white" />}
              </button>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-bold text-navy">SPORTGEAR</span>
                <span className="text-xs text-text-secondary">
                  จำหน่ายและจัดส่ง โดย SPORTGEAR
                </span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Trash2 size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-5 border-t border-gray-200"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded shrink-0 mt-1 flex items-center justify-center border-2 transition-colors ${
                      item.checked
                        ? "bg-blue-accent border-blue-accent"
                        : "border-gray-400"
                    }`}
                  >
                    {item.checked && (
                      <Check size={14} className="text-white" />
                    )}
                  </button>

                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-base font-bold text-navy">
                            ฿{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-text-secondary line-through">
                              ฿{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {item.discount && (
                            <span className="text-xs font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded">
                              -{item.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">
                          {item.brand}
                        </p>
                        <p className="text-sm text-text-primary leading-snug mt-0.5 line-clamp-2">
                          {item.name}
                        </p>
                        {item.color && (
                          <p className="text-xs text-text-secondary mt-1">
                            สี {item.color}
                          </p>
                        )}
                        <p className="text-xs text-text-secondary">
                          ขนาด: {item.size}
                        </p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4">
                        <button className="text-xs text-blue-accent hover:underline">
                          แก้ไข
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                          ลบ
                        </button>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-9 h-9 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus
                            size={14}
                            className={
                              item.quantity <= 1
                                ? "text-gray-300"
                                : "text-navy"
                            }
                          />
                        </button>
                        <div className="w-10 h-9 border-y border-gray-300 flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-9 h-9 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={14} className="text-navy" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-lg text-text-secondary mb-4">
                    ตะกร้าของคุณว่างเปล่า
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    ช้อปปิ้งเลย
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-[130px]">
              <h2 className="text-base font-bold text-navy mb-4">
                รายการสินค้าทั้งหมดในตะกร้า
              </h2>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">ยอดสินค้า</span>
                  <span className="text-text-primary">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      ส่วนลดจากราคาสินค้า
                    </span>
                    <span className="text-red-500 font-medium">
                      -฿{discountTotal.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">ค่าจัดส่ง</span>
                  <span className="text-green-600 text-xs">
                    จัดส่งถึงบ้านแบบมาตรฐานฟรี
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-navy">
                    ยอดชำระเงินทั้งหมด
                  </span>
                  <span className="text-xl font-bold text-navy">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-text-primary">
                    ท่านมีโค้ดส่วนลดหรือไม่? (ไม่ใช้กิฟต์การ์ด)
                  </span>
                  <span className="text-xs bg-orange text-white px-2 py-0.5 rounded font-semibold">
                    2 โปรโมชั่นที่ใช้ได้
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ใส่โค้ดส่วนลด"
                    className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-accent transition-colors"
                  />
                  <button className="bg-gray-200 hover:bg-gray-300 text-text-primary font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                    ใช้
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/login" className="block w-full py-3 bg-navy hover:bg-navy-dark text-white font-semibold rounded-lg text-sm transition-colors text-center">
                  เข้าสู่ระบบหรือลงทะเบียน
                </Link>
                <button className="w-full py-3 bg-blue-accent hover:bg-blue-hover text-white font-semibold rounded-lg text-sm transition-colors">
                  ดำเนินการชำระเงิน
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 border-2 border-navy text-navy font-semibold rounded-lg text-sm text-center hover:bg-gray-50 transition-colors"
                >
                  ช้อปปิ้งต่อ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
