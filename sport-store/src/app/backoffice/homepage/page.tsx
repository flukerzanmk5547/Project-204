"use client";

import { useState } from "react";
import {
  Plus,
  GripVertical,
  LayoutGrid,
  GalleryHorizontal,
  Rows3,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Panel,
  PageTitle,
  GoldButton,
  GhostButton,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boSections } from "@/lib/backofficeMock";

const typeMeta: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  "banner-grid": { icon: <LayoutGrid size={18} />, label: "กริดแบนเนอร์", color: "from-[#3d7bf7]/25 text-[#2d6be7]" },
  "product-carousel": { icon: <GalleryHorizontal size={18} />, label: "คารูเซลสินค้า", color: "from-[#0ea5e9]/25 text-[#0369a1]" },
  "sub-category": { icon: <Rows3 size={18} />, label: "หมวดหมู่ย่อย", color: "from-[#8b5cf6]/25 text-[#7c3aed]" },
};

export default function HomepagePage() {
  const [sections, setSections] = useState(boSections);

  const toggle = (id: string) =>
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );

  return (
    <div>
      <PageTitle
        icon={<Icon3D name="homepage" size={28} />}
        title="จัดการหน้าแรก"
        subtitle="จัดวางเลย์เอาต์หน้าแรก และจัดเรียงส่วนแสดงผลต่างๆ"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มส่วนแสดงผล
          </GoldButton>
        }
      />

      <div className="space-y-3">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            const meta = typeMeta[section.type] ?? typeMeta["banner-grid"];
            return (
              <Panel
                key={section.id}
                className={`flex items-center gap-4 p-4 ${section.active ? "" : "opacity-60"}`}
              >
                <button className="hidden cursor-grab text-[#94a3b8] hover:text-[#2d6be7] sm:block">
                  <GripVertical size={20} />
                </button>

                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.color} to-transparent ring-1 ring-[#e4e9f2]`}
                >
                  {meta.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-cinzel text-base font-bold text-[#0b1f3f]">
                    {section.title}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {meta.label} · {section.itemCount} รายการ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(section.id)}
                    className={`grid h-8 w-8 place-items-center rounded-lg ring-1 transition ${
                      section.active
                        ? "text-emerald-300 ring-emerald-500/30 hover:bg-emerald-500/10"
                        : "text-slate-400 ring-slate-500/30 hover:bg-slate-500/10"
                    }`}
                  >
                    {section.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <GhostButton className="hidden sm:inline-flex">
                    <Pencil size={14} /> แก้ไข
                  </GhostButton>
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-[#2d6be7] hover:ring-[#3d7bf7]/40 sm:hidden">
                    <Pencil size={15} />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-400 hover:ring-rose-500/40">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Panel>
            );
          })}
      </div>
    </div>
  );
}
