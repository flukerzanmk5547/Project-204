"use client";

import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";
import { getAllConfig } from "@/lib/api";

export default function TopBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
              <svg
                viewBox="0 0 200 30"
                className="h-6 w-auto fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="24"
                  fontFamily="Arial Black, sans-serif"
                  fontSize="22"
                  fontWeight="900"
                  letterSpacing="2"
                >
                  SPORTGEAR
                </text>
              </svg>
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
            <Link href="/login" className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group">
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">เข้าสู่ระบบ</span>
            </Link>
            <button className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group">
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">สินค้าโปรด</span>
            </button>
            <Link href="/cart" className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group relative">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 hidden lg:block">ตะกร้า</span>
              <span className="absolute top-0 right-1 bg-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
            <button className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group">
              <MapPin size={20} className="group-hover:scale-110 transition-transform" />
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
              <svg
                viewBox="0 0 200 30"
                className="h-5 w-auto fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="24"
                  fontFamily="Arial Black, sans-serif"
                  fontSize="22"
                  fontWeight="900"
                  letterSpacing="2"
                >
                  SPORTGEAR
                </text>
              </svg>
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
            <button className="p-2 hover:bg-white/10 rounded transition-colors" aria-label="บัญชี">
              <User size={22} />
            </button>
            <Link href="/cart" className="p-2 hover:bg-white/10 rounded transition-colors relative" aria-label="ตะกร้า">
              <ShoppingCart size={22} />
              <span className="absolute top-0.5 right-0.5 bg-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
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
