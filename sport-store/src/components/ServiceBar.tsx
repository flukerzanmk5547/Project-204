"use client";

import {
  Truck,
  BadgePercent,
  RotateCcw,
  Shield,
  Wrench,
  PackageCheck,
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "ส่งฟรีเมื่อสั่ง 999 บาทขึ้นไป",
    subtitle: "สั่งซื้อออนไลน์",
    color: "text-blue-accent",
  },
  {
    icon: BadgePercent,
    title: "ราคาเบาๆ",
    subtitle: "สินค้าคุณภาพ ราคาดี",
    color: "text-orange",
  },
  {
    icon: RotateCcw,
    title: "สิทธิ์คืนสินค้า",
    subtitle: "คืนได้ง่ายๆ",
    color: "text-blue-accent",
  },
  {
    icon: Shield,
    title: "คืนสินค้าภายใน 2 ปี",
    subtitle: "พร้อมรับประกันสินค้า",
    color: "text-orange",
  },
  {
    icon: Wrench,
    title: "บริการรับซ่อม",
    subtitle: "แนะนำโดยผู้เชี่ยวชาญ",
    color: "text-blue-accent",
  },
  {
    icon: PackageCheck,
    title: "การส่งสินค้ารวดเร็ว",
    subtitle: "จัดส่งทั่วประเทศ",
    color: "text-orange",
  },
];

export default function ServiceBar() {
  return (
    <div className="bg-navy text-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.title}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors group"
              >
                <IconComponent
                  size={22}
                  className={`${service.color} shrink-0 group-hover:scale-110 transition-transform`}
                />
                <div className="text-left min-w-0">
                  <p className="text-xs font-medium leading-tight truncate">
                    {service.title}
                  </p>
                  <p className="text-[10px] text-white/60 leading-tight truncate mt-0.5">
                    {service.subtitle} &gt;
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
