"use client";

import {
  Plus,
  Percent,
  Coins,
  CalendarDays,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Panel,
  PageTitle,
  GoldButton,
  GhostButton,
  StatusBadge,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boPromotions } from "@/lib/backofficeMock";

export default function PromotionsPage() {
  return (
    <div>
      <PageTitle
        icon={<Icon3D name="promotions" size={28} />}
        title="โปรโมชันส่วนลด"
        subtitle="จัดการส่วนลดสินค้า เพื่อกระตุ้นยอดขาย"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มโปรโมชัน
          </GoldButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {boPromotions.map((promo) => (
          <Panel key={promo.id} glow className="group relative overflow-hidden p-5">
            {/* magic aura */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl transition group-hover:opacity-50"
              style={{ background: "radial-gradient(circle, #3d7bf7, transparent)" }}
            />
            <div className="relative flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#4d87f9] to-[#2d6be7] text-white shadow-lg">
                {promo.type === "percent" ? <Percent size={22} /> : <Coins size={22} />}
              </span>
              <StatusBadge status={promo.status} />
            </div>

            <h3 className="relative mt-4 font-cinzel text-lg font-bold text-[#0b1f3f]">
              {promo.name}
            </h3>

            <div className="relative mt-2 flex items-baseline gap-1">
              <span className="font-cinzel text-3xl font-extrabold bo-gold-text">
                {promo.type === "percent" ? `${promo.value}%` : `฿${promo.value}`}
              </span>
              <span className="text-sm text-[#64748b]">
                {promo.type === "percent" ? "ส่วนลด" : "ลดทันที"}
              </span>
            </div>

            <div className="relative mt-4 space-y-2 border-t border-[#eef2f7] pt-4 text-sm text-[#64748b]">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-[#94a3b8]" />
                ครอบคลุม {promo.productCount} สินค้า
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-[#94a3b8]" />
                {promo.startDate} — {promo.endDate}
              </div>
            </div>

            <div className="relative mt-4 flex gap-2">
              <GhostButton className="flex-1 justify-center">
                <Pencil size={14} /> แก้ไข
              </GhostButton>
              <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-400 hover:ring-rose-500/40">
                <Trash2 size={15} />
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
