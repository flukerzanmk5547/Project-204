"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { Panel, PageTitle, GoldButton } from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boBanners } from "@/lib/backofficeMock";

export default function BannersPage() {
  const [banners, setBanners] = useState(boBanners);

  const toggle = (id: string) =>
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );

  return (
    <div>
      <PageTitle
        icon={<Icon3D name="banners" size={28} />}
        title="แบนเนอร์"
        subtitle="จัดการแบนเนอร์หน้าแรก ลากเพื่อจัดลำดับการแสดงผล"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มแบนเนอร์
          </GoldButton>
        }
      />

      <div className="space-y-4">
        {banners
          .sort((a, b) => a.position - b.position)
          .map((banner) => (
            <Panel
              key={banner.id}
              className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
                banner.active ? "" : "opacity-60"
              }`}
            >
              <button className="hidden cursor-grab text-[#94a3b8] hover:text-[#2d6be7] sm:block">
                <GripVertical size={20} />
              </button>

              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg ring-1 ring-[#e4e9f2] sm:h-16 sm:w-32">
                <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="200px" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded bg-[#eef3fb] font-cinzel text-xs font-bold text-[#2d6be7] ring-1 ring-[#e4e9f2]">
                    {banner.position}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-[#0b1f3f]">
                    {banner.title}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-[#64748b]">{banner.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(banner.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                    banner.active
                      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
                      : "bg-slate-500/15 text-slate-300 ring-slate-500/30"
                  }`}
                >
                  {banner.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  {banner.active ? "แสดง" : "ซ่อน"}
                </button>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-[#2d6be7] hover:ring-[#3d7bf7]/40">
                  <Pencil size={15} />
                </button>
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
