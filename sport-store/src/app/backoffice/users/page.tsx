"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Crown,
  Sword,
  User as UserIcon,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { Panel, PageTitle, StatCard } from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boUsers } from "@/lib/backofficeMock";

const roleMeta: Record<
  string,
  { icon: React.ReactNode; label: string; badge: string }
> = {
  manager: {
    icon: <Crown size={14} />,
    label: "Manager",
    badge: "bg-gradient-to-r from-[#3d7bf7] to-[#2d6be7] text-[#ffffff]",
  },
  reseller: {
    icon: <Sword size={14} />,
    label: "Reseller",
    badge: "bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white",
  },
  customer: {
    icon: <UserIcon size={14} />,
    label: "Customer",
    badge: "bg-[#eef3fb] text-[#64748b] ring-1 ring-[#e4e9f2]",
  },
};

export default function UsersPage() {
  const [query, setQuery] = useState("");

  const filtered = boUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageTitle
        icon={<Icon3D name="users" size={28} />}
        title="ผู้ใช้งาน"
        subtitle="จัดการผู้ใช้งานและกำหนดสิทธิ์ (role) ของแต่ละคน"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="ผู้ใช้ทั้งหมด" value={String(boUsers.length)} icon={<Icon3D name="users" size={26} />} accent="cyan" />
        <StatCard label="Reseller" value={String(boUsers.filter((u) => u.role === "reseller").length)} icon={<Icon3D name="products" size={26} />} accent="purple" />
        <StatCard label="Manager" value={String(boUsers.filter((u) => u.role === "manager").length)} icon={<Icon3D name="crown" size={26} />} accent="gold" />
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อ หรืออีเมล..."
          className="w-full rounded-lg border border-[#e4e9f2] bg-[#f1f5fb] py-2.5 pl-9 pr-3 text-sm text-[#0b1f3f] placeholder:text-[#94a3b8] outline-none focus:border-[#3d7bf7]/50"
        />
      </div>

      <Panel className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e4e9f2] text-left text-xs uppercase tracking-wide text-[#94a3b8]">
              <th className="px-5 py-3 font-semibold">ผู้ใช้งาน</th>
              <th className="px-4 py-3 font-semibold">สิทธิ์ปัจจุบัน</th>
              <th className="px-4 py-3 font-semibold">คำสั่งซื้อ</th>
              <th className="px-4 py-3 font-semibold">วันที่สมัคร</th>
              <th className="px-5 py-3 text-right font-semibold">จัดการสิทธิ์</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f7]">
            {filtered.map((u) => {
              const meta = roleMeta[u.role];
              return (
                <tr key={u.id} className="transition hover:bg-[#eef3fb]/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-[#e4e9f2]">
                        <Image src={u.avatar} alt={u.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#0b1f3f]">{u.name}</p>
                        <p className="truncate text-xs text-[#94a3b8]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${meta.badge}`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[#334155]">
                      <ShoppingBag size={14} className="text-[#94a3b8]" />
                      {u.orders}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748b]">{u.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-[#eef3fb]/60 px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:border-[#3d7bf7]/50 hover:text-[#2d6be7]">
                        เปลี่ยนสิทธิ์ <ChevronDown size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
