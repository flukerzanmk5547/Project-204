"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useBackoffice } from "./BackofficeContext";
import { useAuth } from "@/lib/AuthContext";
import Icon3D, { type Icon3DName } from "./Icon3D";

type MinRole = "reseller" | "manager";

interface NavItem {
  href: string;
  label: string;
  icon: Icon3DName;
  minRole: MinRole;
}

const NAV: NavItem[] = [
  { href: "/backoffice", label: "แดชบอร์ด", icon: "dashboard", minRole: "reseller" },
  { href: "/backoffice/products", label: "สินค้า", icon: "products", minRole: "reseller" },
  { href: "/backoffice/promotions", label: "โปรโมชัน", icon: "promotions", minRole: "reseller" },
  { href: "/backoffice/bundles", label: "ชุดสินค้า", icon: "bundles", minRole: "reseller" },
  { href: "/backoffice/attributes", label: "คุณสมบัติสินค้า", icon: "attributes", minRole: "reseller" },
  { href: "/backoffice/orders", label: "คำสั่งซื้อ", icon: "orders", minRole: "reseller" },
  { href: "/backoffice/categories", label: "หมวดหมู่สินค้า", icon: "categories", minRole: "manager" },
  { href: "/backoffice/banners", label: "แบนเนอร์", icon: "banners", minRole: "manager" },
  { href: "/backoffice/homepage", label: "จัดการหน้าแรก", icon: "homepage", minRole: "manager" },
  { href: "/backoffice/payment-accounts", label: "บัญชีรับเงิน", icon: "payments", minRole: "manager" },
  { href: "/backoffice/users", label: "ผู้ใช้งาน", icon: "users", minRole: "manager" },
];

const LEVEL: Record<string, number> = { customer: 0, reseller: 1, manager: 2, superadmin: 3 };

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useBackoffice();
  const { role } = useAuth();
  const userLevel = LEVEL[role] ?? 0;

  const visible = NAV.filter((it) => userLevel >= LEVEL[it.minRole]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e4e9f2] bg-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* โลโก้ (แถบน้ำเงินฟ้า) */}
        <div className="bo-bluebar relative flex h-16 items-center justify-center px-5">
          <Image
            src="/sportgear-logo.png"
            alt="SportGear"
            width={1514}
            height={300}
            className="h-auto w-[86%] max-w-[225px] object-contain"
            priority
          />
          <button
            className="absolute right-4 top-4 text-white/90 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* เมนูแบบมีลำดับเลข */}
        <nav className="bo-scroll flex-1 overflow-y-auto py-2">
          {visible.map((it, i) => {
            const active =
              pathname === it.href ||
              (it.href !== "/backoffice" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 border-b border-[#f0f3f8] px-4 py-3 text-sm transition ${
                  active
                    ? "bg-[#eaf1fe] font-semibold text-[#2159c4]"
                    : "text-[#334155] hover:bg-[#f4f7fc]"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold ${
                    active
                      ? "bg-blue-accent text-white"
                      : "bg-[#eef2f7] text-[#94a3b8]"
                  }`}
                >
                  {i + 1}
                </span>
                <Icon3D name={it.icon} size={22} />
                <span className="flex-1">{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
