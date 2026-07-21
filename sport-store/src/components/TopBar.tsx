"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";
import { getAllConfig } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";

export default function TopBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: favCount } = useFavorites();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "ค้นหาสินค้า 7,000 รายการจาก 70 ประเภทกีฬา"
  );

  useEffect(() => {
    getAllConfig()
      .then((cfg) => {
        const total = cfg.total_products ?? "7,000";
        const types = cfg.total_sport_types ?? "70";
        setSearchPlaceholder(
          `ค้นหาสินค้า ${Number(total).toLocaleString()} รายการจาก ${types} ประเภทกีฬา`
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <div className="bg-navy text-white relative z-50">
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-[1440px] mx-auto items-center justify-between px-4 h-[60px]">
          {/* Logo + Language */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/sportgear-logo.png"
                alt="SportGear"
                width={1514}
                height={300}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button className="flex items-center gap-1 text-sm border border-white/30 rounded px-2 py-1 hover:bg-white/10 transition-colors">
              <span>TH</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Search Bar - real input that opens dropdown */}
          <div className="flex flex-1 max-w-[600px] mx-8">
            <div className="flex w-full bg-white rounded-sm overflow-hidden">
              <div className="flex items-center px-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder={searchPlaceholder}
                className="flex-1 py-2.5 pr-2 text-sm text-gray-700 outline-none placeholder-gray-400"
              />
              {searchOpen && (
                <button
                  onClick={handleSearchClose}
                  className="px-3 hover:bg-gray-100 transition-colors"
                  aria-label="ปิดค้นหา"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-orange flex items-center justify-center text-[10px] font-bold">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-[10px] mt-0.5 hidden lg:block truncate max-w-[60px]">
                    {user?.full_name?.split(" ")[0] || "บัญชี"}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white text-navy rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold truncate">
                          {user?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon icon="fluent-emoji:bust-in-silhouette" width={20} height={20} />
                        บัญชีของฉัน
                      </Link>
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon icon="fluent-emoji:gear" width={20} height={20} />
                        แก้ไขข้อมูลส่วนตัว
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon icon="fluent-emoji:shopping-cart" width={20} height={20} />
                        ตะกร้าของฉัน
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon icon="fluent-emoji:red-heart" width={20} height={20} />
                        สินค้าโปรด
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                      >
                        <LogOut size={18} />
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group"
              >
                <User size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] mt-0.5 hidden lg:block">เข้าสู่ระบบ</span>
              </Link>
            )}
            <Link href="/favorites" className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group relative">
              <Icon icon="fluent-emoji:red-heart" width={22} height={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">สินค้าโปรด</span>
              {favCount > 0 && (
                <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group relative">
              <Icon icon="fluent-emoji:shopping-cart" width={22} height={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">ตะกร้า</span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-1 bg-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <button className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group">
              <Icon icon="fluent-emoji:department-store" width={22} height={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">หาร้านค้า</span>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between px-3 h-[56px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              aria-label="เมนู"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src="/sportgear-logo.png"
                alt="SportGear"
                width={1514}
                height={300}
                priority
                className="h-6 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-0.5">
            <button className="flex items-center gap-0.5 text-sm px-2 py-1.5 hover:bg-white/10 rounded transition-colors">
              <span className="text-xs">TH</span>
              <ChevronDown size={12} />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              aria-label="ค้นหา"
            >
              <Search size={22} />
            </button>
            {isLoggedIn ? (
              <Link
                href="#"
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="บัญชี"
              >
                <div className="w-[22px] h-[22px] rounded-full bg-orange flex items-center justify-center text-[10px] font-bold">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="เข้าสู่ระบบ"
              >
                <User size={22} />
              </Link>
            )}
            <Link href="/favorites" className="p-2 hover:bg-white/10 rounded transition-colors relative" aria-label="สินค้าโปรด">
              <Icon icon="fluent-emoji:red-heart" width={22} height={22} />
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 hover:bg-white/10 rounded transition-colors relative" aria-label="ตะกร้า">
              <Icon icon="fluent-emoji:shopping-cart" width={22} height={22} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Search Dropdown (desktop) + Overlay (mobile) */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={handleSearchClose}
        placeholder={searchPlaceholder}
        externalQuery={searchQuery}
        onExternalQueryChange={setSearchQuery}
      />
    </>
  );
}
