"use client";

import type { ReactNode } from "react";

/* ============================================
   Backoffice UI Kit (navy / blue / white)
   ============================================ */

export function Panel({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`bo-panel ${glow ? "bo-panel-glow" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  icon,
  action,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#e4e9f2] px-5 py-4">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef3fb] text-[#3d7bf7] ring-1 ring-[#e4e9f2]">
            {icon}
          </span>
        )}
        <h3 className="font-cinzel text-lg font-bold text-[#0b1f3f]">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "gold",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accent?: "gold" | "purple" | "cyan" | "green" | "red";
}) {
  const ring: Record<string, string> = {
    gold: "from-[#3d7bf7]/15 text-[#2d6be7]",
    purple: "from-[#8b5cf6]/15 text-[#7c3aed]",
    cyan: "from-[#0ea5e9]/15 text-[#0369a1]",
    green: "from-emerald-400/15 text-emerald-600",
    red: "from-rose-400/15 text-rose-600",
  };
  return (
    <Panel className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
            {label}
          </p>
          <p className="mt-1.5 font-cinzel text-2xl font-extrabold text-[#0b1f3f]">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-[#64748b]">{sub}</p>}
        </div>
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${ring[accent]} to-transparent ring-1 ring-[#e4e9f2]`}
        >
          {icon}
        </span>
      </div>
    </Panel>
  );
}

const rarityStyles: Record<string, string> = {
  common: "bg-slate-100 text-slate-600 ring-slate-200",
  rare: "bg-sky-50 text-sky-700 ring-sky-200",
  epic: "bg-violet-50 text-violet-700 ring-violet-200",
  legendary: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function RarityBadge({ rarity }: { rarity: string }) {
  const labels: Record<string, string> = {
    common: "ทั่วไป",
    rare: "แนะนำ",
    epic: "ขายดี",
    legendary: "ยอดนิยม",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ring-1 ${rarityStyles[rarity] ?? rarityStyles.common}`}
    >
      {labels[rarity] ?? rarity}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
  shipped: "bg-sky-50 text-sky-700 ring-sky-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  ended: "bg-slate-100 text-slate-600 ring-slate-200",
  out: "bg-rose-50 text-rose-700 ring-rose-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    active: "ใช้งาน",
    inactive: "ปิด",
    draft: "ฉบับร่าง",
    out: "หมดสต็อก",
    pending: "รอชำระ",
    paid: "ชำระแล้ว",
    shipped: "จัดส่งแล้ว",
    completed: "สำเร็จ",
    cancelled: "ยกเลิก",
    scheduled: "ตั้งเวลา",
    ended: "สิ้นสุด",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${statusStyles[status] ?? statusStyles.inactive}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] ?? status}
    </span>
  );
}

export function GoldButton({
  children,
  onClick,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      className={`bo-btn-gold inline-flex items-center gap-1.5 rounded-lg font-bold ${pad} ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-[#eef3fb]/60 px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:border-[#3d7bf7]/50 hover:text-[#2d6be7] ${className}`}
    >
      {children}
    </button>
  );
}

export function PageTitle({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf1fe] ring-1 ring-[#cfe0fd]">
            {icon}
          </span>
        )}
        <div>
          <h1 className="font-cinzel text-2xl font-extrabold bo-gold-text sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-[#64748b]">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function XpBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef2f8] ring-1 ring-[#e4e9f2]">
      <div className="bo-xpbar-fill h-full rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}
