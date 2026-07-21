"use client";

import { Plus, Link2, Pencil, Trash2 } from "lucide-react";
import {
  Panel,
  PageTitle,
  GoldButton,
  GhostButton,
  StatusBadge,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boBundles, formatBaht } from "@/lib/backofficeMock";

export default function BundlesPage() {
  return (
    <div>
      <PageTitle
        icon={<Icon3D name="bundles" size={28} />}
        title="ชุดสินค้า (Bundle)"
        subtitle="จับคู่สินค้าเป็นชุด พร้อมมอบส่วนลดพิเศษให้ลูกค้า"
        action={
          <GoldButton>
            <Plus size={16} /> สร้างชุดสินค้า
          </GoldButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {boBundles.map((bundle) => (
          <Panel key={bundle.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf1fe] ring-1 ring-[#cfe0fd]">
                  <Icon3D name="bundles" size={24} />
                </span>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#0b1f3f]">
                    {bundle.name}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {bundle.items.length} รายการในชุด
                  </p>
                </div>
              </div>
              <StatusBadge status={bundle.status} />
            </div>

            {/* item chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {bundle.items.map((it, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-[#eef3fb] px-2.5 py-1.5 text-xs text-[#334155]"
                >
                  <Link2 size={12} className="text-[#94a3b8]" />
                  {it}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-[#eef2f7] pt-4">
              <div>
                <p className="text-xs text-[#64748b]">ราคาชุด</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-2xl font-extrabold bo-gold-text">
                    {formatBaht(bundle.bundlePrice)}
                  </span>
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                    -{bundle.discount}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <GhostButton>
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
