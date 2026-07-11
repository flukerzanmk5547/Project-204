"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useAuth } from "@/lib/AuthContext";
import { getOrderHistory, type ApiOrder } from "@/lib/api";

const ORDER_STATUS: Record<
  string,
  { label: string; className: string }
> = {
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

export default function OrdersPage() {
  const { token, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
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
    getOrderHistory(token)
      .then((res) => setOrders(res.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[900px] mx-auto px-4 py-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          บัญชีของฉัน
        </Link>

        <h1 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
          <Package size={24} />
          คำสั่งซื้อของฉัน
        </h1>

        {loading || authLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-accent" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <p className="text-text-secondary mb-1">
              ไม่สามารถโหลดคำสั่งซื้อได้
            </p>
            <p className="text-sm text-text-secondary">
              กรุณาลองใหม่อีกครั้งในภายหลัง
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-300" />
            </div>
            <p className="text-lg text-text-secondary mb-1">
              ยังไม่มีคำสั่งซื้อ
            </p>
            <p className="text-sm text-text-secondary mb-6">
              เมื่อคุณสั่งซื้อสินค้า รายการจะปรากฏที่นี่
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              เริ่มช้อปปิ้ง
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = statusBadge(order.status);
              const totalQty =
                order.items?.reduce((s, i) => s + i.quantity, 0) ?? null;

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-accent hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-navy">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatOrderDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-text-secondary">
                          +{order.items.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-text-secondary">
                      {totalQty !== null ? `${totalQty} ชิ้น · ` : ""}
                      ยอดรวม
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-navy">
                        ฿{order.total.toLocaleString()}
                      </span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
