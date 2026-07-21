"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Panel, StatCard, StatusBadge } from "@/components/backoffice/ui";
import DateRangePicker from "@/components/backoffice/DateRangePicker";
import Icon3D, { type Icon3DName } from "@/components/backoffice/Icon3D";
import BehaviorAnalytics from "@/components/backoffice/BehaviorAnalytics";
import { useAuth } from "@/lib/AuthContext";
import { getDashboardStats, type DashboardStats } from "@/lib/api";
import {
  boOrders,
  boProducts,
  boCategories,
  boUsers,
  formatBaht,
} from "@/lib/backofficeMock";

/* ---------- helpers ---------- */

const CHART_COLORS = [
  "#2d6be7",
  "#3d7bf7",
  "#6ba3f5",
  "#0ea5e9",
  "#38bdf8",
  "#818cf8",
  "#93c5fd",
];

const revenueOf = (price: number, discount: number | null, sold: number) =>
  (discount ?? price) * sold;

const compactBaht = (n: number) =>
  n >= 1000 ? "฿" + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : "฿" + n;

/* ยอดขายรายสินค้า */
const productRevenue = [...boProducts]
  .map((p) => ({
    name: p.name,
    value: revenueOf(p.price, p.discountPrice, p.sold),
  }))
  .sort((a, b) => b.value - a.value);

/* ยอดขายรายหมวดหมู่ (รวมจากสินค้า) */
const categoryRevenue = (() => {
  const map = new Map<string, number>();
  for (const p of boProducts) {
    map.set(
      p.category,
      (map.get(p.category) ?? 0) + revenueOf(p.price, p.discountPrice, p.sold),
    );
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
})();

const topBySold = [...boProducts]
  .sort((a, b) => b.sold - a.sold)
  .map((p) => ({ name: p.name, value: p.sold }));

const topByRevenue = productRevenue;

const topCategoriesByCount = [...boCategories]
  .sort((a, b) => b.productCount - a.productCount)
  .map((c) => ({ name: c.name, value: c.productCount }));

const topCustomers = [...boUsers]
  .filter((u) => u.role !== "manager")
  .sort((a, b) => b.orders - a.orders)
  .map((u) => ({ name: u.name, value: u.orders }));

/* ---------- charts (SVG, no deps) ---------- */

function EmptyChart() {
  return (
    <p className="py-10 text-center text-sm text-[#94a3b8]">ไม่มีข้อมูล</p>
  );
}

function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <EmptyChart />;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 58;
  const CX = 70;
  const CY = 70;
  const STROKE = 24;
  const circ = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative shrink-0">
        <svg width={140} height={140} viewBox="0 0 140 140">
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#eef2f8"
            strokeWidth={STROKE}
          />
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {data.map((d, i) => {
              const len = (d.value / total) * circ;
              const seg = (
                <circle
                  key={d.name}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={STROKE}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return seg;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#94a3b8]">รวม</span>
          <span className="text-sm font-extrabold text-[#0b1f3f]">
            {compactBaht(total)}
          </span>
        </div>
      </div>

      <div className="w-full flex-1 space-y-2.5">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="truncate text-[#334155]">{d.name}</span>
            </span>
            <span className="shrink-0 font-semibold text-[#2d6be7]">
              {formatBaht(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (data.length === 0) return <EmptyChart />;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-56 items-end gap-2 sm:gap-4">
      {data.map((d) => {
        const h = Math.max(6, Math.round((d.value / max) * 100));
        return (
          <div
            key={d.name}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-[10px] font-bold text-[#2d6be7]">
              {compactBaht(d.value)}
            </span>
            <div
              className="w-full max-w-[46px] rounded-t-md bg-gradient-to-t from-[#2d6be7] to-[#93c5fd] transition-all"
              style={{ height: `${h}%` }}
            />
            <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-[#64748b]">
              {d.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChartPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: Icon3DName;
  children: ReactNode;
}) {
  return (
    <Panel className="flex min-h-[320px] flex-col p-5">
      <div className="mb-5 flex items-center gap-2.5">
        <Icon3D name={icon} size={22} />
        <h3 className="text-base font-bold text-[#0b1f3f]">{title}</h3>
      </div>
      <div className="flex flex-1 items-center">
        <div className="w-full">{children}</div>
      </div>
    </Panel>
  );
}

/* ---------- ranking table ---------- */

function RankPanel({
  title,
  icon,
  columns,
  rows,
}: {
  title: string;
  icon: Icon3DName;
  columns: [string, string, string];
  rows: { name: string; value: string; badge?: ReactNode }[];
}) {
  return (
    <div className="mb-5 flex break-inside-avoid flex-col overflow-hidden rounded-xl border border-[#e4e9f2] bg-white shadow-sm">
      <div className="bo-bluebar flex items-center gap-2 px-4 py-2.5">
        <Icon3D name={icon} size={18} />
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <div className="grid grid-cols-[40px_1fr_auto] gap-2 border-b border-[#eef2f7] bg-[#f7f9fd] px-4 py-2 text-[11px] font-semibold text-[#94a3b8]">
        <span>{columns[0]}</span>
        <span>{columns[1]}</span>
        <span className="text-right">{columns[2]}</span>
      </div>
      {/* เนื้อหาเยอะ → scroll ในการ์ด (สูงคงที่ ~8 แถว) */}
      <div className="bo-scroll max-h-[352px] divide-y divide-[#f0f3f8] overflow-y-auto">
        {rows.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#94a3b8]">ไม่มีข้อมูล</p>
        ) : (
          rows.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="grid grid-cols-[40px_1fr_auto] items-center gap-2 px-4 py-2.5 transition hover:bg-[#f7f9fd]"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold ${
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
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-xs font-medium text-[#0b1f3f]">
                  {r.name}
                </span>
                {r.badge}
              </span>
              <span className="text-right text-xs font-bold text-[#334155]">
                {r.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    getDashboardStats(token)
      .then((s) => {
        if (alive) setStats(s);
      })
      .catch(() => {
        /* fallback to mock ด้านล่าง */
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  // fallback (mock) เมื่อยังโหลดไม่เสร็จ หรือ API ล้มเหลว
  const fbSalesTotal = boProducts.reduce(
    (s, p) => s + revenueOf(p.price, p.discountPrice, p.sold),
    0,
  );

  const summary = stats?.summary;
  const catRev = stats?.category_revenue ?? categoryRevenue;
  const prodRev = stats?.product_revenue ?? productRevenue;
  const bySold = stats?.top_by_sold ?? topBySold;
  const byRev = stats?.top_by_revenue ?? topByRevenue;
  const catCount = stats?.top_categories_by_count ?? topCategoriesByCount;
  const customers = stats?.top_customers ?? topCustomers;
  const recent =
    stats?.recent_orders ??
    boOrders.map((o) => ({
      code: o.code,
      customer: o.customer,
      total: o.total,
      status: o.status,
    }));

  const salesTotal = summary?.sales_total ?? fbSalesTotal;
  const orderCount = summary?.order_count ?? boOrders.length;
  const productCount = summary?.product_count ?? boProducts.length;
  const lowStock = summary?.low_stock ?? 0;
  const outOfStock = summary?.out_of_stock ?? 1;
  const ordersToday = summary?.orders_today ?? 0;
  const newCustomersToday = summary?.new_customers_today ?? 0;

  return (
    <div>
      {/* header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-extrabold text-[#0b1f3f]">แดชบอร์ด</h1>
          <div className="flex gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#e4e9f2] bg-white px-3.5 py-2 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                <Icon3D name="users" size={22} />
              </span>
              <div>
                <p className="text-[11px] text-[#94a3b8]">ลูกค้าใหม่วันนี้</p>
                <p className="text-lg font-extrabold text-[#0b1f3f]">
                  {newCustomersToday}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#e4e9f2] bg-white px-3.5 py-2 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 ring-1 ring-amber-100">
                <Icon3D name="orders" size={22} />
              </span>
              <div>
                <p className="text-[11px] text-[#94a3b8]">ออเดอร์วันนี้</p>
                <p className="text-lg font-extrabold text-[#0b1f3f]">
                  {ordersToday}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-white px-3 py-2 text-xs font-semibold text-[#334155] shadow-sm">
            THB
            <ChevronDown size={13} className="text-[#94a3b8]" />
          </button>
          <DateRangePicker />
        </div>
      </div>

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-xs text-[#94a3b8]">
          <Loader2 size={14} className="animate-spin" /> กำลังโหลดข้อมูลจากระบบ...
        </div>
      )}

      {/* stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="ยอดขายรวม"
          value={formatBaht(salesTotal)}
          sub="จากคำสั่งซื้อที่ไม่ยกเลิก"
          icon={<Icon3D name="sales" size={26} />}
          accent="gold"
        />
        <StatCard
          label="คำสั่งซื้อทั้งหมด"
          value={orderCount.toLocaleString("th-TH")}
          sub={`วันนี้ ${ordersToday} รายการ`}
          icon={<Icon3D name="orders" size={26} />}
          accent="cyan"
        />
        <StatCard
          label="สินค้าในคลัง"
          value={productCount.toLocaleString("th-TH")}
          sub={`${lowStock} รายการใกล้หมดสต็อก`}
          icon={<Icon3D name="products" size={26} />}
          accent="purple"
        />
        <StatCard
          label="สินค้าหมดสต็อก"
          value={outOfStock.toLocaleString("th-TH")}
          sub="ต้องเติมสต็อก"
          icon={<Icon3D name="box" size={26} />}
          accent="red"
        />
      </div>

      {/* charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel title="ยอดขายตามหมวดหมู่" icon="categories">
          <DonutChart data={catRev} />
        </ChartPanel>
        <ChartPanel title="ยอดขายตามสินค้า" icon="products">
          <VerticalBarChart data={prodRev.slice(0, 6)} />
        </ChartPanel>
      </div>

      {/* วิเคราะห์พฤติกรรมลูกค้า */}
      <div className="mb-8">
        <BehaviorAnalytics />
      </div>

      {/* rankings */}
      <div className="-mx-4 mb-6 border-t border-[#e4e9f2] sm:-mx-6 lg:-mx-8" />
      <div className="mb-4 flex items-center gap-2">
        <Icon3D name="trending" size={22} />
        <h2 className="text-lg font-bold text-[#0b1f3f]">
          อันดับสินค้า / ลูกค้า
        </h2>
      </div>

      <div className="columns-1 gap-5 lg:columns-3">
        <RankPanel
          title="สินค้าขายดี (จำนวนชิ้น)"
          icon="products"
          columns={["No.", "สินค้า", "ขายแล้ว"]}
          rows={bySold.map((d) => ({
            name: d.name,
            value: d.value.toLocaleString("th-TH") + " ชิ้น",
          }))}
        />
        <RankPanel
          title="สินค้าทำเงินสูงสุด"
          icon="sales"
          columns={["No.", "สินค้า", "ยอดขาย"]}
          rows={byRev.map((d) => ({
            name: d.name,
            value: formatBaht(d.value),
          }))}
        />
        <RankPanel
          title="หมวดหมู่สินค้าเยอะสุด"
          icon="categories"
          columns={["No.", "หมวดหมู่", "จำนวน"]}
          rows={catCount.map((d) => ({
            name: d.name,
            value: d.value.toLocaleString("th-TH") + " ชิ้น",
          }))}
        />
        <RankPanel
          title="ลูกค้าซื้อบ่อยสุด"
          icon="users"
          columns={["No.", "ลูกค้า", "ออเดอร์"]}
          rows={customers.map((d) => ({
            name: d.name,
            value: d.value.toLocaleString("th-TH"),
          }))}
        />
        <RankPanel
          title="คำสั่งซื้อล่าสุด"
          icon="orders"
          columns={["No.", "รหัส / ลูกค้า", "ยอดรวม"]}
          rows={recent.map((o) => ({
            name: `${o.code} · ${o.customer}`,
            value: formatBaht(o.total),
            badge: <StatusBadge status={o.status} />,
          }))}
        />
      </div>
    </div>
  );
}
