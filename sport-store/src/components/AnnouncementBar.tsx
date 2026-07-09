"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { getConfig } from "@/lib/api";

const FALLBACK_TEXT = "ส่งฟรีทั่วไทย เมื่อสั่งซื้อสินค้า 999.-";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState(FALLBACK_TEXT);

  useEffect(() => {
    getConfig("announcement_text")
      .then((res) => {
        if (res.value) setText(res.value);
      })
      .catch(() => {
        /* ใช้ fallback ถ้า API ล่ม */
      });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-light border-b border-gray-border relative">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center py-2 px-8">
        <p className="text-sm text-text-primary">{text}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="ปิด"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
