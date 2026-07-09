"use client";

import { X, ChevronRight, MapPin, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategoryTree, type ApiCategoryTree } from "@/lib/api";

interface DrawerMenuItem {
  label: string;
  hasArrow: boolean;
  routePath: string;
}

const fallbackMenuItems: DrawerMenuItem[] = [
  { label: "กีฬาประเภทต่างๆ", hasArrow: true, routePath: "sports" },
  { label: "ผู้ชาย", hasArrow: true, routePath: "men" },
  { label: "ผู้หญิง", hasArrow: true, routePath: "women" },
  { label: "เด็ก", hasArrow: true, routePath: "kids" },
  { label: "อุปกรณ์เสริมอื่นๆ", hasArrow: true, routePath: "accessories" },
  { label: "สำหรับท่องเที่ยว", hasArrow: true, routePath: "travel" },
];

function treeToDrawerItems(tree: ApiCategoryTree[]): DrawerMenuItem[] {
  return tree
    .filter((n) => n.level === 0)
    .map((n) => ({
      label: n.name,
      hasArrow: n.children.length > 0,
      routePath: n.route_path,
    }));
}

const highlightItems = [
  { label: "ดีลพิเศษ", color: "text-red-500" },
  { label: "สินค้ามาใหม่", color: "text-blue-accent" },
  { label: "แบรนด์พาร์ทเนอร์", color: "text-blue-accent" },
];

const bottomItems = [
  { label: "สาขาของเรา", icon: MapPin, hasArrow: true },
  { label: "ช่วยเหลือ", icon: HelpCircle, hasArrow: true },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [mainMenuItems, setMainMenuItems] = useState<DrawerMenuItem[]>(fallbackMenuItems);

  useEffect(() => {
    getCategoryTree()
      .then((tree) => {
        if (tree.length > 0) setMainMenuItems(treeToDrawerItems(tree));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[400px] bg-white z-70 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <Link href="/" onClick={onClose}>
            <svg
              viewBox="0 0 200 30"
              className="h-6 w-auto fill-navy"
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="ปิดเมนู"
          >
            <X size={24} className="text-text-primary" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="overflow-y-auto h-[calc(100%-65px)]">
          {/* Main Menu */}
          <nav className="py-2">
            {mainMenuItems.map((item) => (
              <Link
                key={item.label}
                href={`/category/${item.routePath}`}
                onClick={onClose}
                className="flex items-center justify-between w-full px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <span className="text-xl font-bold text-navy">
                  {item.label}
                </span>
                {item.hasArrow && (
                  <ChevronRight size={22} className="text-gray-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Highlight Items */}
          <div className="px-5 py-2">
            {highlightItems.map((item) => (
              <button
                key={item.label}
                className={`block w-full text-left py-3 text-xl font-bold hover:opacity-70 transition-opacity ${item.color}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-200 my-2" />

          {/* Bottom Items */}
          <div className="py-2">
            {bottomItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent size={20} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">
                      {item.label}
                    </span>
                  </div>
                  {item.hasArrow && (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
