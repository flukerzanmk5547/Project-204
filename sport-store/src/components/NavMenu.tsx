"use client";

import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  getCategoryTree,
  getBanners,
  type ApiCategoryTree,
  type ApiBanner,
} from "@/lib/api";

interface SubCategory {
  label: string;
  slug: string;
  routePath: string;
  children?: { label: string; slug: string; routePath: string }[];
}

interface MenuData {
  label: string;
  slug: string;
  routePath: string;
  hasDropdown: boolean;
  link?: string;
  subcategories?: SubCategory[];
}

interface PromoBanner {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link?: string;
}

function treeToMenu(tree: ApiCategoryTree[]): MenuData[] {
  return tree
    .filter((node) => node.level === 0)
    .map((root) => ({
      label: root.name,
      slug: root.slug,
      routePath: root.route_path,
      hasDropdown: root.children.length > 0,
      link: "ดูทั้งหมด",
      subcategories: root.children.map((sub) => ({
        label: sub.name,
        slug: sub.slug,
        routePath: sub.route_path,
        children: sub.children.map((leaf) => ({
          label: leaf.name,
          slug: leaf.slug,
          routePath: leaf.route_path,
        })),
      })),
    }));
}

function bannersToPromo(banners: ApiBanner[]): PromoBanner[] {
  return banners.map((b) => ({
    image: b.image,
    title: b.title,
    subtitle: b.subtitle ?? "",
    cta: b.cta ?? "ช้อปเลย !",
    link: b.link ?? undefined,
  }));
}

const fallbackMenuItems: MenuData[] = [
  {
    label: "กีฬาประเภทต่างๆ", slug: "sports", routePath: "sports", hasDropdown: true, link: "ดูทั้งหมด",
    subcategories: [
      { label: "กีฬากลางแจ้ง", slug: "outdoor", routePath: "sports/outdoor", children: [{ label: "แคมป์ปิ้ง", slug: "camping", routePath: "sports/outdoor/camping" }, { label: "เดินป่า", slug: "hiking", routePath: "sports/outdoor/hiking" }] },
      { label: "ฟิตเนส", slug: "fitness", routePath: "sports/fitness", children: [{ label: "เครื่องออกกำลังกาย", slug: "fitness-machines", routePath: "sports/fitness/machines" }] },
    ],
  },
  { label: "ผู้ชาย", slug: "men", routePath: "men", hasDropdown: true, link: "ดูทั้งหมด", subcategories: [] },
  { label: "ผู้หญิง", slug: "women", routePath: "women", hasDropdown: true, link: "ดูทั้งหมด", subcategories: [] },
  { label: "เด็ก", slug: "kids", routePath: "kids", hasDropdown: true, link: "ดูทั้งหมด", subcategories: [] },
  { label: "อุปกรณ์เสริมอื่นๆ", slug: "accessories", routePath: "accessories", hasDropdown: true, link: "ดูทั้งหมด", subcategories: [] },
  { label: "สำหรับท่องเที่ยว", slug: "travel", routePath: "travel", hasDropdown: true, link: "ดูทั้งหมด", subcategories: [] },
];

const fallbackPromo: PromoBanner[] = [
  { image: "https://picsum.photos/id/160/400/250", title: "CLEARANCE SALE", subtitle: "สินค้าจำนวนจำกัด\nลดสูงสุด 70%", cta: "ช้อปเลย !" },
  { image: "https://picsum.photos/id/96/400/250", title: "เล่นกีฬา\nเล่นให้คุ้ม", subtitle: "กับเหตุผลที่ทุกคนเลือก\nสปอร์ตเกียร์", cta: "ช้อปเลย !" },
];

const highlightItems = [
  { label: "ดีลพิเศษ", className: "text-blue-accent font-semibold", link: "#deals" },
  { label: "สินค้าใหม่", className: "font-semibold", link: "#new" },
  { label: "แบรนด์สปอร์ตเกียร์", className: "", link: "#brands" },
];

export default function NavMenu() {
  const [menuItems, setMenuItems] = useState<MenuData[]>(fallbackMenuItems);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(fallbackPromo);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getCategoryTree()
      .then((tree) => {
        if (tree.length > 0) setMenuItems(treeToMenu(tree));
      })
      .catch(() => {});
    getBanners("promo")
      .then((banners) => {
        const navPromo = banners.filter((b) => b.section_key === "nav_promo");
        if (navPromo.length > 0) setPromoBanners(bannersToPromo(navPromo));
      })
      .catch(() => {});
  }, []);

  const activeMenuData = menuItems.find((m) => m.label === activeMenu);
  const activeSubData = activeMenuData?.subcategories?.find(
    (s) => s.label === activeSubMenu
  );

  useEffect(() => {
    if (activeMenuData?.subcategories?.[0] && !activeSubMenu) {
      setActiveSubMenu(activeMenuData.subcategories[0].label);
    }
  }, [activeMenu, activeMenuData, activeSubMenu]);

  const handleMenuEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
    const data = menuItems.find((m) => m.label === label);
    if (data?.subcategories?.[0]) {
      setActiveSubMenu(data.subcategories[0].label);
    } else {
      setActiveSubMenu(null);
    }
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubMenu(null);
    }, 200);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubMenu(null);
    }, 150);
  };

  const handleClose = () => {
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  return (
    <nav className="hidden md:block bg-white border-b border-gray-border relative" ref={menuRef}>
      <div className="max-w-[1440px] mx-auto flex items-center px-4">
        <ul className="flex items-center gap-0 overflow-x-auto">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={`flex items-center gap-1 px-4 py-3.5 text-sm whitespace-nowrap transition-colors relative ${
                  activeMenu === item.label
                    ? "text-blue-accent"
                    : "text-text-primary hover:text-blue-accent"
                }`}
                onMouseEnter={() => handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      activeMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-blue-accent transition-transform origin-left ${
                    activeMenu === item.label ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </li>
          ))}
          <li className="w-px h-6 bg-gray-border mx-1" />
          {highlightItems.map((item) => (
            <li key={item.label}>
              <button
                className={`px-4 py-3.5 text-sm whitespace-nowrap hover:text-blue-accent transition-colors relative group ${item.className}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu Dropdown */}
      {activeMenu && activeMenuData?.subcategories && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            style={{ top: menuRef.current?.getBoundingClientRect().bottom ?? 0 }}
            onClick={handleClose}
          />

          {/* Dropdown Panel */}
          <div
            className="absolute left-0 right-0 bg-white z-50 shadow-xl border-t-2 border-blue-accent animate-[slideDown_0.2s_ease-out]"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-[1440px] mx-auto flex">
              {/* Column 1: Subcategories */}
              <div className="w-[260px] border-r border-gray-200 py-4 shrink-0">
                <div className="flex items-center justify-between px-5 mb-2">
                  <h3 className="text-sm font-bold text-navy">
                    {activeMenuData.label}
                  </h3>
                  <Link
                    href={`/category/${activeMenuData.routePath}`}
                    onClick={handleClose}
                    className="text-xs text-blue-accent hover:underline"
                  >
                    {activeMenuData.link}
                  </Link>
                </div>
                {activeMenuData.subcategories.map((sub) => (
                  <button
                    key={sub.label}
                    className={`flex items-center justify-between w-full px-5 py-2.5 text-sm transition-colors ${
                      activeSubMenu === sub.label
                        ? "bg-gray-100 text-blue-accent font-medium"
                        : "text-text-primary hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setActiveSubMenu(sub.label)}
                  >
                    <span>{sub.label}</span>
                    {sub.children && (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Column 2: Sub-subcategories */}
              {activeSubData?.children && (
                <div className="w-[220px] border-r border-gray-200 py-4 shrink-0">
                  <div className="flex items-center justify-between px-5 mb-2">
                    <h3 className="text-sm font-bold text-navy">
                      {activeSubData.label}
                    </h3>
                    <Link
                      href={`/category/${activeSubData.routePath}`}
                      onClick={handleClose}
                      className="text-xs text-blue-accent hover:underline"
                    >
                      ดูทั้งหมด
                    </Link>
                  </div>
                  {activeSubData.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/category/${child.routePath}`}
                      onClick={handleClose}
                      className="block w-full text-left px-5 py-2.5 text-sm text-text-primary hover:bg-gray-50 hover:text-blue-accent transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Column 3: Promo Banners */}
              <div className="flex-1 p-4 flex gap-4 min-w-0">
                {promoBanners.map((banner, i) => (
                  <div
                    key={i}
                    className="flex-1 relative rounded-lg overflow-hidden group cursor-pointer min-w-0"
                  >
                    <div
                      className="w-full h-full min-h-[280px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${banner.image})` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-lg font-black text-white leading-tight whitespace-pre-line">
                          {banner.title}
                        </h4>
                        <p className="text-xs text-white/80 mt-1 whitespace-pre-line">
                          {banner.subtitle}
                        </p>
                        <button className="mt-3 bg-orange hover:bg-orange-hover text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                          {banner.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="ปิดเมนู"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
