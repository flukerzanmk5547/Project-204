"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getShortcuts } from "@/lib/api";

interface Category {
  label: string;
  image: string;
  textOverlay?: string;
  link?: string;
}

const fallbackCategories: Category[] = [
  {
    label: "ผู้ชาย",
    image: "https://picsum.photos/id/91/200/200",
  },
  {
    label: "ผู้หญิง",
    image: "https://picsum.photos/id/64/200/200",
  },
  {
    label: "เด็ก",
    image: "https://picsum.photos/id/177/200/200",
  },
  {
    label: "อุปกรณ์เสริม\nอื่นๆ",
    image: "https://picsum.photos/id/111/200/200",
  },
  {
    label: "ประเภทกีฬา",
    image: "https://picsum.photos/id/116/200/200",
  },
  {
    label: "สินค้าสำหรับ\nหน้าฝน",
    image: "https://picsum.photos/id/119/200/200",
  },
  {
    label: "ดีลสุดพิเศษ",
    image: "",
    textOverlay: "%",
  },
  {
    label: "สินค้ามาใหม่",
    image: "",
    textOverlay: "NEW",
  },
  {
    label: "แบรนด์สปอร์ต\nเกียร์",
    image: "",
    textOverlay: "SG",
  },
  {
    label: "สำหรับการท่อง\nเที่ยว",
    image: "https://picsum.photos/id/15/200/200",
  },
  {
    label: "เสื้อผ้าฝึกและ\nไลฟ์สไตล์",
    image: "https://picsum.photos/id/325/200/200",
  },
];

export default function CategoryShortcuts() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    getShortcuts()
      .then((items) => {
        if (items.length > 0) {
          setCategories(
            items.map((s) => ({
              label: s.label,
              image: s.image ?? "",
              textOverlay: s.text_overlay ?? undefined,
              link: s.link ?? undefined,
            }))
          );
        }
      })
      .catch(() => {
        /* ใช้ fallback ถ้า API ล่ม */
      });
  }, []);

  return (
    <div className="bg-white py-5 border-b border-gray-border">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-between gap-2 overflow-x-auto pt-1 pb-3 px-1 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.link || "#"}
              className="flex flex-col items-center gap-2 min-w-[75px] group"
            >
              <div className="w-[72px] h-[72px] rounded-full border-[3px] border-blue-accent overflow-hidden group-hover:scale-110 group-hover:border-orange transition-all duration-200">
                {cat.image ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-accent flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {cat.textOverlay}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-text-primary text-center leading-tight whitespace-pre-line group-hover:text-blue-accent transition-colors font-medium">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
