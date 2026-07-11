"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";

export default function AccountPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const { totalItems: favCount } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-[900px] mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-blue-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  const menu = [
    {
      href: "/account/orders",
      icon: Package,
      title: "คำสั่งซื้อของฉัน",
      desc: "ดูประวัติและติดตามสถานะคำสั่งซื้อ",
      badge: null as string | null,
    },
    {
      href: "/account/addresses",
      icon: MapPin,
      title: "สมุดที่อยู่",
      desc: "จัดการที่อยู่จัดส่งของคุณ",
      badge: null,
    },
    {
      href: "/favorites",
      icon: Heart,
      title: "สินค้าโปรด",
      desc: "สินค้าที่คุณบันทึกไว้",
      badge: favCount > 0 ? String(favCount) : null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[900px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-navy mb-6">บัญชีของฉัน</h1>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.full_name?.charAt(0)?.toUpperCase() || (
                <User size={28} />
              )
            )}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-navy truncate">
              {user?.full_name || "ผู้ใช้"}
            </p>
            <p className="text-sm text-text-secondary truncate">
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-sm text-text-secondary">{user.phone}</p>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {menu.map(({ href, icon: Icon, title, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-accent flex items-center justify-center">
                  <Icon size={22} />
                </div>
                {badge ? (
                  <span className="text-xs font-bold text-white bg-orange rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                    {badge}
                  </span>
                ) : (
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-blue-accent transition-colors"
                  />
                )}
              </div>
              <p className="text-sm font-bold text-navy mb-0.5">{title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-1"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </main>

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
