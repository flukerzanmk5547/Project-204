"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useAuth } from "@/lib/AuthContext";
import { getOrderDetail, type ApiOrder } from "@/lib/api";

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "รอชำระเงิน", className: "bg-amber-100 text-amber-700" },
  paid: { label: "ชำระเงินแล้ว", className: "bg-blue-100 text-blue-accent" },
  processing: {
    label: "กำลังเตรียมสินค้า",
    className: "bg-blue-100 text-blue-accent",
  },
  shipped: { label: "จัดส่งแล้ว", className: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "จัดส่งสำเร็จ", className: "bg-green-100 text-green-700" },
  completed: { label: "สำเร็จ", className: "bg-green-100 text-green-700" },
  cancelled: { label: "ยกเลิก", className: "bg-red-100 text-red-600" },
  expired: { label: "หมดอายุ", className: "bg-gray-100 text-gray-500" },
};

function statusBadge(status: string) {
  return (
    ORDER_STATUS[status] ?? {
      label: status,
      className: "bg-gray-100 text-gray-600",
    }
  );
}

function formatOrderDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYMENT_LABELS: Record<string, string> = {
  promptpay: "QR พร้อมเพย์",
  credit: "บัตรเครดิต",
  bank: "โอนเงินผ่านธนาคาร",
  gift: "บัตรของขวัญ",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(false);
    getOrderDetail(token, id)
      .then((res) => setOrder(res))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token, id]);

  const badge = order ? statusBadge(order.status) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[800px] mx-auto px-4 py-8">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          คำสั่งซื้อทั้งหมด
        </Link>

        {loading || authLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-accent" />
          </div>
        ) : error || !order ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <p className="text-text-secondary mb-4">ไม่พบคำสั่งซื้อนี้</p>
            <Link
              href="/account/orders"
              className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              กลับไปดูคำสั่งซื้อ
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-navy">
                    {order.order_number}
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    สั่งซื้อเมื่อ {formatOrderDate(order.created_at)}
                  </p>
                </div>
                {badge && (
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <h2 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                <Package size={16} />
                รายการสินค้า
              </h2>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 first:pt-0">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      {item.brand && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {item.brand}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-xs text-text-secondary">
                          ขนาด {item.size}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-navy">
                        ฿{item.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <h2 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                <MapPin size={16} />
                ที่อยู่จัดส่ง
              </h2>
              <p className="text-sm text-text-primary">{order.shipping_name}</p>
              <p className="text-sm text-text-secondary">
                {order.shipping_phone}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mt-1">
                {order.shipping_address} {order.shipping_district}{" "}
                {order.shipping_amphoe} {order.shipping_province}{" "}
                {order.shipping_postal_code}
              </p>
            </div>

            {/* Payment + Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                <CreditCard size={16} />
                การชำระเงิน
              </h2>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-text-secondary">วิธีชำระเงิน</span>
                <span className="text-text-primary">
                  {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ยอดสินค้า</span>
                  <span className="text-text-primary">
                    ฿{order.subtotal.toLocaleString()}
                  </span>
                </div>
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">ส่วนลด</span>
                    <span className="text-red-500 font-medium">
                      -฿{order.discount_total.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ค่าจัดส่ง</span>
                  <span
                    className={
                      order.shipping_cost === 0
                        ? "text-green-600"
                        : "text-text-primary"
                    }
                  >
                    {order.shipping_cost === 0
                      ? "ไม่มีค่าจัดส่ง"
                      : `฿${order.shipping_cost.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-navy">
                  ยอดชำระเงินทั้งหมด
                </span>
                <span className="text-xl font-bold text-navy">
                  ฿{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
