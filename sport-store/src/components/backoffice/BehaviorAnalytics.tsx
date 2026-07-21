"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  getAnalytics,
  type FullAnalytics,
  type AnalyticsRankItem,
} from "@/lib/api";
import Icon3D, { type Icon3DName } from "@/components/backoffice/Icon3D";
import { Loader2 } from "lucide-react";

/* ---------- horizontal bar chart ---------- */

function HBarChart({
  data,
  unit,
}: {
  data: AnalyticsRankItem[];
  unit: string;
}) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[#94a3b8]">ยังไม่มีข้อมูล</p>
    );
  }
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  return (
    <div className="bo-scroll max-h-[340px] space-y-3.5 overflow-y-auto pr-1">
      {data.map((d, i) => {
        const val = Number(d.value) || 0;
        const pct = Math.max(4, Math.round((val / max) * 100));
        return (
          <div key={d.id} className="flex items-center gap-3">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold ${
                i === 0
                  ? "bg-[#3d7bf7] text-white"
                  : i === 1
                    ? "bg-[#c0c6da] text-[#1a1a1a]"
                    : i === 2
                      ? "bg-[#cd7f32] text-white"
                      : "bg-[#eef3fb] text-[#64748b] ring-1 ring-[#e4e9f2]"
              }`}
            >
              {i + 1}
            </span>
            {d.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={d.image}
                alt=""
                className="h-9 w-9 shrink-0 rounded-lg border border-[#e4e9f2] object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-[#334155]">
                  {d.name}
                </span>
                <span className="shrink-0 text-xs font-bold text-[#2d6be7]">
                  {val.toLocaleString()}{" "}
                  <span className="font-normal text-[#94a3b8]">{unit}</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eef2f8]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2d6be7] to-[#93c5fd] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- summary chips ---------- */

function StatChip({
  icon,
  label,
  value,
}: {
  icon: Icon3DName;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[#e4e9f2] bg-[#f7f9fd] px-3 py-2">
      <Icon3D name={icon} size={22} />
      <div className="min-w-0">
        <p className="text-[11px] leading-tight text-[#94a3b8]">{label}</p>
        <p className="text-sm font-extrabold text-[#0b1f3f]">{value}</p>
      </div>
    </div>
  );
}

/* ---------- main ---------- */

export default function BehaviorAnalytics() {
  const { token } = useAuth();
  const [data, setData] = useState<FullAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"favorites" | "views" | "purchases">(
    "favorites"
  );

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAnalytics(token)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const tabs = [
    { id: "favorites" as const, label: "สินค้าโปรด", icon: "heart" as const },
    { id: "views" as const, label: "การเข้าดูสินค้า", icon: "eyes" as const },
    {
      id: "purchases" as const,
      label: "การซื้อสินค้า",
      icon: "shopping" as const,
    },
  ];

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex min-h-[280px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-accent" />
        </div>
      );
    }
    if (!data) {
      return (
        <div className="flex min-h-[280px] items-center justify-center text-sm text-[#94a3b8]">
          ไม่สามารถโหลดข้อมูลได้
        </div>
      );
    }

    const { favorites: fav, views, purchases: pur } = data;

    if (tab === "favorites") {
      return (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatChip
              icon="heart"
              label="รวมกดถูกใจ"
              value={fav.total_favorites.toLocaleString()}
            />
            <StatChip
              icon="products"
              label="สินค้าที่ถูกใจ (ไม่ซ้ำ)"
              value={fav.unique_products.toLocaleString()}
            />
            <StatChip
              icon="users"
              label="ผู้ใช้ที่กดถูกใจ"
              value={fav.unique_users.toLocaleString()}
            />
          </div>
          <p className="mb-3 text-xs font-semibold text-[#64748b]">
            สินค้ายอดนิยม (กดถูกใจมากสุด)
          </p>
          <HBarChart data={fav.top_favorited_products} unit="ครั้ง" />
        </>
      );
    }

    if (tab === "views") {
      return (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatChip
              icon="eyes"
              label="การเข้าดูทั้งหมด"
              value={views.total_views.toLocaleString()}
            />
            <StatChip
              icon="products"
              label="สินค้าที่ถูกดู (ไม่ซ้ำ)"
              value={views.unique_products_viewed.toLocaleString()}
            />
            <StatChip
              icon="trending"
              label="วันนี้"
              value={views.views_today.toLocaleString()}
            />
            <StatChip
              icon="chart"
              label="สัปดาห์นี้"
              value={views.views_this_week.toLocaleString()}
            />
          </div>
          <p className="mb-3 text-xs font-semibold text-[#64748b]">
            สินค้าที่ถูกดูมากที่สุด
          </p>
          <HBarChart data={views.top_viewed_products} unit="ครั้ง" />
        </>
      );
    }

    return (
      <>
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatChip
            icon="orders"
            label="คำสั่งซื้อทั้งหมด"
            value={pur.total_orders.toLocaleString()}
          />
          <StatChip
            icon="sales"
            label="รายได้รวม"
            value={`฿${pur.total_revenue.toLocaleString()}`}
          />
          <StatChip
            icon="cart"
            label="สินค้าขายได้"
            value={pur.total_items_sold.toLocaleString()}
          />
          <StatChip
            icon="coin"
            label="ยอดเฉลี่ย/ออเดอร์"
            value={`฿${Math.round(pur.average_order_value).toLocaleString()}`}
          />
        </div>
        <p className="mb-3 text-xs font-semibold text-[#64748b]">
          สินค้าขายดีที่สุด (จำนวน)
        </p>
        <HBarChart data={pur.top_purchased_products} unit="ชิ้น" />
      </>
    );
  };

  return (
    <div className="rounded-xl border border-[#e4e9f2] bg-white p-5 shadow-sm">
      {/* หัวการ์ด + เมนู (แท็บ) อยู่ในกราฟ */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icon3D name="analytics" size={22} />
          <h3 className="text-base font-bold text-[#0b1f3f]">
            วิเคราะห์พฤติกรรมลูกค้า
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-[#f1f5f9] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === t.id
                  ? "bg-white text-[#2d6be7] shadow-sm"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              <Icon3D name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {renderBody()}
    </div>
  );
}
