"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Panel,
  PanelHeader,
  PageTitle,
  GoldButton,
  GhostButton,
} from "@/components/backoffice/ui";
import Icon3D, { type Icon3DName } from "@/components/backoffice/Icon3D";
import { boAttributeGroups } from "@/lib/backofficeMock";

const typeMeta: Record<string, { icon: Icon3DName; label: string }> = {
  size: { icon: "ruler", label: "ขนาด/ไซส์" },
  color: { icon: "palette", label: "สี" },
  dimension: { icon: "box", label: "มิติ" },
  custom: { icon: "tag", label: "กำหนดเอง" },
};

export default function AttributesPage() {
  return (
    <div>
      <PageTitle
        icon={<Icon3D name="attributes" size={28} />}
        title="คุณสมบัติสินค้า"
        subtitle="กำหนดคุณสมบัติของสินค้าแต่ละหมวดหมู่ เช่น ขนาด สี น้ำหนัก"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มกลุ่มคุณสมบัติ
          </GoldButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {boAttributeGroups.map((group) => {
          const meta = typeMeta[group.type] ?? typeMeta.custom;
          return (
            <Panel key={group.id}>
              <PanelHeader
                title={group.name}
                icon={<Icon3D name={meta.icon} size={20} />}
                action={
                  <div className="flex gap-1.5">
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-[#2d6be7] hover:ring-[#3d7bf7]/40">
                      <Pencil size={15} />
                    </button>
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-400 hover:ring-rose-500/40">
                      <Trash2 size={15} />
                    </button>
                  </div>
                }
              />
              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
                  ตัวเลือก ({meta.label})
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => (
                    <span
                      key={opt}
                      className="rounded-lg border border-[#e4e9f2] bg-[#eef3fb] px-3 py-1.5 text-sm font-medium text-[#0b1f3f] transition hover:border-[#3d7bf7]/40"
                    >
                      {opt}
                    </span>
                  ))}
                  <button className="grid place-items-center rounded-lg border border-dashed border-[#e4e9f2] px-3 py-1.5 text-[#94a3b8] transition hover:border-[#3d7bf7]/50 hover:text-[#2d6be7]">
                    <Plus size={16} />
                  </button>
                </div>

                <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
                  ผูกกับหมวดหมู่
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-xs font-semibold text-[#0369a1] ring-1 ring-[#bae6fd]"
                    >
                      {cat}
                    </span>
                  ))}
                  <GhostButton className="!py-1">
                    <Plus size={12} /> ผูกหมวด
                  </GhostButton>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
