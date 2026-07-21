"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import {
  Panel,
  PageTitle,
  StatCard,
  StatusBadge,
  GhostButton,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boOrders, formatBaht } from "@/lib/backofficeMock";

const FILTERS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "pending", label: "รอชำระ" },
  { key: "paid", label: "ชำระแล้ว" },
  { key: "shipped", label: "จัดส่งแล้ว" },
  { key: "completed", label: "สำเร็จ" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = boOrders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchQuery =
      o.code.toLowerCase().includes(query.toLowerCase()) ||
      o.customer.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  const revenue = boOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <PageTitle
        icon={<Icon3D name="orders" size={28} />}
        title="คำสั่งซื้อ"
        subtitle="ติดตามและจัดการคำสั่งซื้อทั้งหมด"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="คำสั่งซื้อทั้งหมด" value={String(boOrders.length)} icon={<Icon3D name="orders" size={26} />} accent="cyan" />
        <StatCard label="รอชำระเงิน" value={String(boOrders.filter((o) => o.status === "pending").length)} icon={<Icon3D name="cart" size={26} />} accent="gold" />
        <StatCard label="สำเร็จ" value={String(boOrders.filter((o) => o.status === "completed").length)} icon={<Icon3D name="star" size={26} />} accent="green" />
        <StatCard label="รายได้รวม" value={formatBaht(revenue)} icon={<Icon3D name="sales" size={26} />} accent="purple" />
      </div>

      {/* filter tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-[#e4e9f2] bg-[#f1f5fb] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-gradient-to-r from-[#3d7bf7] to-[#2d6be7] text-[#ffffff]"
                  : "text-[#64748b] hover:text-[#0b1f3f]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[200px] flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหารหัส หรือชื่อลูกค้า..."
            className="w-full rounded-lg border border-[#e4e9f2] bg-[#f1f5fb] py-2.5 pl-9 pr-3 text-sm text-[#0b1f3f] placeholder:text-[#94a3b8] outline-none focus:border-[#3d7bf7]/50"
          />
        </div>
      </div>

      <Panel className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e4e9f2] text-left text-xs uppercase tracking-wide text-[#94a3b8]">
              <th className="px-5 py-3 font-semibold">รหัสคำสั่งซื้อ</th>
              <th className="px-4 py-3 font-semibold">ลูกค้า</th>
              <th className="px-4 py-3 font-semibold">จำนวน</th>
              <th className="px-4 py-3 font-semibold">มูลค่า</th>
              <th className="px-4 py-3 font-semibold">เวลา</th>
              <th className="px-4 py-3 font-semibold">สถานะ</th>
              <th className="px-5 py-3 text-right font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f7]">
            {filtered.map((o) => (
              <tr key={o.id} className="transition hover:bg-[#eef3fb]/50">
                <td className="px-5 py-3.5 font-cinzel font-bold text-[#2d6be7]">{o.code}</td>
                <td className="px-4 py-3.5 text-[#0b1f3f]">{o.customer}</td>
                <td className="px-4 py-3.5 text-[#64748b]">{o.items} ชิ้น</td>
                <td className="px-4 py-3.5 font-bold text-[#0b1f3f]">{formatBaht(o.total)}</td>
                <td className="px-4 py-3.5 text-xs text-[#64748b]">{o.date}</td>
                <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-[#2d6be7] hover:ring-[#3d7bf7]/40">
                      <Eye size={15} />
                    </button>
                    <GhostButton>
                      สถานะ <ChevronDown size={13} />
                    </GhostButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#64748b]">
            ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข
          </div>
        )}
      </Panel>
    </div>
  );
}
