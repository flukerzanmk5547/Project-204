"use client";

import Image from "next/image";
import { Plus, Route, Package, GitBranch, Pencil, Trash2 } from "lucide-react";
import {
  Panel,
  PageTitle,
  GoldButton,
  GhostButton,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boCategories } from "@/lib/backofficeMock";

export default function CategoriesPage() {
  return (
    <div>
      <PageTitle
        icon={<Icon3D name="categories" size={28} />}
        title="หมวดหมู่สินค้า"
        subtitle="จัดการหมวดหมู่สินค้า พร้อมเส้นทาง (route) ที่เชื่อมกับหน้าร้าน"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มหมวดหมู่
          </GoldButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {boCategories.map((cat) => (
          <Panel key={cat.id} className="group overflow-hidden">
            <div className="relative h-28 overflow-hidden">
              <Image
                src={cat.icon}
                alt={cat.name}
                fill
                className="object-cover opacity-60 transition group-hover:scale-105 group-hover:opacity-80"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/40 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 shadow-lg ring-1 ring-white/60">
                  <Icon3D name="categories" size={20} />
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white drop-shadow">
                  {cat.name}
                </h3>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                <Route size={14} />
                <code className="truncate rounded bg-[#eef2f8] px-2 py-1 text-[#0369a1]">
                  {cat.route}
                </code>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#eef3fb] p-2.5 text-center ring-1 ring-[#e4e9f2]">
                  <div className="flex items-center justify-center gap-1 text-[#2d6be7]">
                    <Package size={14} />
                    <span className="font-cinzel text-lg font-bold">{cat.productCount}</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">สินค้า</p>
                </div>
                <div className="rounded-lg bg-[#eef3fb] p-2.5 text-center ring-1 ring-[#e4e9f2]">
                  <div className="flex items-center justify-center gap-1 text-[#7c3aed]">
                    <GitBranch size={14} />
                    <span className="font-cinzel text-lg font-bold">{cat.children}</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">หมวดย่อย</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <GhostButton className="flex-1 justify-center">
                  <Pencil size={14} /> แก้ไข
                </GhostButton>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-400 hover:ring-rose-500/40">
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
