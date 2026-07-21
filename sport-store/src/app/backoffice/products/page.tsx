"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ChevronDown,
} from "lucide-react";
import { Panel, StatCard, StatusBadge } from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boProducts, formatBaht } from "@/lib/backofficeMock";

const CATEGORIES = ["ทั้งหมด", ...new Set(boProducts.map((p) => p.category))];
const STATUSES = [
  { value: "all", label: "ทุกสถานะ" },
  { value: "active", label: "กำลังขาย" },
  { value: "draft", label: "ฉบับร่าง" },
  { value: "out", label: "หมดสต็อก" },
];

function Tags({ tags, isNew }: { tags: string[]; isNew: boolean }) {
  const all = isNew && !tags.includes("ใหม่") ? ["ใหม่", ...tags] : tags;
  if (all.length === 0)
    return <span className="text-xs text-[#cbd5e1]">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {all.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-md bg-[#eef3fb] px-1.5 py-0.5 text-[10px] font-semibold text-[#2d6be7] ring-1 ring-[#dbe7fb]"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      boProducts.filter((p) => {
        const q = query.toLowerCase();
        const matchQ =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q);
        const matchCat = category === "ทั้งหมด" || p.category === category;
        const matchStatus = status === "all" || p.status === status;
        return matchQ && matchCat && matchStatus;
      }),
    [query, category, status],
  );

  const total = boProducts.length;
  const active = boProducts.filter((p) => p.status === "active").length;
  const low = boProducts.filter((p) => p.stock > 0 && p.stock < 15).length;
  const out = boProducts.filter((p) => p.stock === 0).length;

  return (
    <div>
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf1fe] ring-1 ring-[#cfe0fd]">
            <Icon3D name="products" size={28} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1f3f]">สินค้า</h1>
            <p className="mt-0.5 text-sm text-[#64748b]">
              จัดการสินค้าทั้งหมดในระบบ
            </p>
          </div>
        </div>
        <Link
          href="/backoffice/products/new"
          className="bo-btn-gold inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold"
        >
          <Plus size={16} /> เพิ่มสินค้า
        </Link>
      </div>

      {/* summary stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="สินค้าทั้งหมด"
          value={total.toString()}
          icon={<Icon3D name="products" size={26} />}
          accent="gold"
        />
        <StatCard
          label="กำลังขาย"
          value={active.toString()}
          icon={<Icon3D name="sales" size={26} />}
          accent="green"
        />
        <StatCard
          label="สต็อกต่ำ"
          value={low.toString()}
          sub="ต่ำกว่า 15 ชิ้น"
          icon={<Icon3D name="trending" size={26} />}
          accent="cyan"
        />
        <StatCard
          label="หมดสต็อก"
          value={out.toString()}
          icon={<Icon3D name="box" size={26} />}
          accent="red"
        />
      </div>

      {/* toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า / SKU / แบรนด์..."
            className="w-full rounded-lg border border-[#e4e9f2] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0b1f3f] shadow-sm outline-none placeholder:text-[#94a3b8] focus:border-[#3d7bf7]/60"
          />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none rounded-lg border border-[#e4e9f2] bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#334155] shadow-sm outline-none focus:border-[#3d7bf7]/60"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none rounded-lg border border-[#e4e9f2] bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#334155] shadow-sm outline-none focus:border-[#3d7bf7]/60"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
        </div>
      </div>

      {/* desktop table */}
      <Panel className="hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e4e9f2] bg-[#f7f9fd] text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              <th className="px-5 py-3">สินค้า</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">ป้ายกำกับ</th>
              <th className="px-4 py-3">ราคา</th>
              <th className="px-4 py-3">เรตติ้ง</th>
              <th className="px-4 py-3">สต็อก</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-5 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f7]">
            {filtered.map((p) => (
              <tr key={p.id} className="transition hover:bg-[#f7f9fd]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#e4e9f2]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#0b1f3f]">
                        {p.name}
                      </p>
                      <p className="text-xs text-[#94a3b8]">
                        {p.brand} · {p.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#64748b]">{p.category}</td>
                <td className="px-4 py-3">
                  <Tags tags={p.tags} isNew={p.isNew} />
                </td>
                <td className="px-4 py-3">
                  {p.discountPrice ? (
                    <div>
                      <span className="font-bold text-[#2d6be7]">
                        {formatBaht(p.discountPrice)}
                      </span>
                      <span className="ml-1.5 text-xs text-[#94a3b8] line-through">
                        {formatBaht(p.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-[#0b1f3f]">
                      {formatBaht(p.price)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-[#334155]">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-semibold">{p.rating.toFixed(1)}</span>
                    <span className="text-xs text-[#94a3b8]">
                      ({p.reviews})
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stock === 0
                        ? "font-bold text-rose-500"
                        : p.stock < 15
                          ? "font-bold text-amber-500"
                          : "text-[#0b1f3f]"
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/backoffice/products/${p.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-[#2d6be7] hover:ring-[#3d7bf7]/40"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-500 hover:ring-rose-400/50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-sm text-[#94a3b8]"
                >
                  ไม่พบสินค้าที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((p) => (
          <Panel key={p.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#e4e9f2]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#0b1f3f]">
                  {p.name}
                </p>
                <p className="text-xs text-[#94a3b8]">
                  {p.brand} · {p.sku}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Tags tags={p.tags} isNew={p.isNew} />
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#eef2f7] pt-3">
              <div className="text-sm">
                <span className="font-bold text-[#2d6be7]">
                  {formatBaht(p.discountPrice ?? p.price)}
                </span>
                <span className="ml-2 text-xs text-[#64748b]">
                  สต็อก {p.stock}
                </span>
              </div>
              <div className="flex gap-1.5">
                <Link
                  href={`/backoffice/products/${p.id}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2]"
                >
                  <Pencil size={15} />
                </Link>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2]">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
