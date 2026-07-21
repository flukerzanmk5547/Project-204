"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Menu, Clock, ChevronDown, LogOut, User, Bell } from "lucide-react";
import { useBackoffice } from "./BackofficeContext";
import { useAuth } from "@/lib/AuthContext";
import Icon3D, { type Icon3DName } from "./Icon3D";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type ApiNotification,
} from "@/lib/api";

const ROLE_LABEL: Record<string, string> = {
  manager: "Manager",
  reseller: "Reseller",
  customer: "Customer",
};

const NOTIF_ICON: Record<ApiNotification["type"], Icon3DName> = {
  order: "orders",
  payment: "sales",
  stock: "box",
  user: "users",
  system: "dashboard",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "เมื่อสักครู่";
  if (min < 60) return `${min} นาทีที่แล้ว`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ชั่วโมงที่แล้ว`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "เมื่อวาน";
  if (day < 7) return `${day} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH");
}

const POLL_MS = 30000;

export default function Topbar() {
  const { setSidebarOpen } = useBackoffice();
  const { role, user, logout, token, isReseller } = useAuth();
  const router = useRouter();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!token || !isReseller) return;
    try {
      const res = await getNotifications(token, { limit: 20 });
      setNotifications(res.data);
      setUnreadCount(res.unread_count);
    } catch {
      /* เงียบไว้ ไม่รบกวนผู้ใช้ */
    }
  }, [token, isReseller]);

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, POLL_MS);
    return () => clearInterval(timer);
  }, [loadNotifications]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleReadOne = async (n: ApiNotification) => {
    if (n.is_read || !token) return;
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(token, n.id);
    } catch {
      /* ignore */
    }
  };

  const handleReadAll = async () => {
    if (!token || unreadCount === 0) return;
    setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead(token);
    } catch {
      /* ignore */
    }
  };

  const displayName =
    user?.full_name || user?.email?.split("@")[0] || "ผู้ใช้งาน";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="bo-bluebar fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:left-72">
      <button
        className="grid h-9 w-9 place-items-center rounded-lg text-white/90 hover:bg-white/15 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={18} />
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative grid h-9 w-9 place-items-center rounded-lg text-white/90 transition hover:bg-white/15"
            aria-label="การแจ้งเตือน"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-[#2f6fd6]">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[320px] overflow-hidden rounded-xl border border-[#e4e9f2] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#eef2f7] px-4 py-3">
                <h4 className="text-sm font-bold text-[#0b1f3f]">
                  การแจ้งเตือน
                </h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#eaf1fe] px-2 py-0.5 text-[11px] font-semibold text-[#2159c4]">
                    ใหม่ {unreadCount}
                  </span>
                )}
              </div>
              <div className="max-h-[360px] divide-y divide-[#f0f3f8] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-10 text-center text-xs text-[#94a3b8]">
                    ยังไม่มีการแจ้งเตือน
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleReadOne(n)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#f7f9fd] ${
                        !n.is_read ? "bg-[#f5f9ff]" : ""
                      }`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] ring-1 ring-[#e4e9f2]">
                        <Icon3D name={NOTIF_ICON[n.type] ?? "dashboard"} size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-[#0b1f3f]">
                            {n.title}
                          </span>
                          {!n.is_read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                          )}
                        </span>
                        {n.detail && (
                          <span className="block truncate text-xs text-[#64748b]">
                            {n.detail}
                          </span>
                        )}
                        <span className="mt-0.5 block text-[11px] text-[#94a3b8]">
                          {relativeTime(n.created_at)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={handleReadAll}
                disabled={unreadCount === 0}
                className="w-full border-t border-[#eef2f7] py-2.5 text-center text-xs font-semibold text-[#2d6be7] hover:bg-[#f7f9fd] disabled:cursor-default disabled:text-[#94a3b8]"
              >
                อ่านทั้งหมดแล้ว
              </button>
            </div>
          )}
        </div>

        {/* timezone */}
        <button className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/15 md:flex">
          <Clock size={14} />
          GMT+07:00
          <ChevronDown size={13} className="opacity-70" />
        </button>

        {/* language */}
        <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/15">
          <Icon
            icon="twemoji:flag-thailand"
            width={18}
            height={18}
            className="rounded-sm"
          />
          <span className="hidden sm:inline">ไทย</span>
          <ChevronDown size={13} className="opacity-70" />
        </button>

        <span className="mx-1 hidden h-6 w-px bg-white/25 sm:block" />

        {/* user */}
        <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
            <User size={16} className="text-white" />
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-white">{displayName}</p>
            <p className="text-[10px] text-white/75">
              {ROLE_LABEL[role] ?? role}
            </p>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/15"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  );
}
