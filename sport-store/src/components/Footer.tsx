import Link from "next/link";

const footerSections = [
  {
    title: "บริการลูกค้า",
    links: [
      "ติดต่อเรา",
      "การจัดส่ง",
      "คืนสินค้า & เปลี่ยนสินค้า",
      "การเรียกคืนสินค้า",
      "การออกใบกำกับภาษี (Easy E-Receipt)",
      "บริการประกอบอุปกรณ์ที่ซื้อ",
      "ข้อกำหนดและเงื่อนไขแคมเปญการตลาด",
    ],
  },
  {
    title: "ซื้อสินค้าที่สปอร์ตเกียร์",
    links: [
      "สาขาของเรา",
      "จัดส่งแบบมาตรฐานฟรี",
      "Click & Collect รับสินค้าที่ร้าน",
      "บัตรของขวัญ",
      "จัดหาสินค้าให้องค์กร (B2B)",
    ],
  },
  {
    title: "เกี่ยวกับเรา",
    links: [
      "เกี่ยวกับเรา",
      "การพัฒนาอย่างยั่งยืน",
      "Ecodesign",
    ],
  },
  {
    title: "การบริการ",
    links: [
      "บริการของเรา",
      "สมาชิกสปอร์ตเกียร์",
      "บริการซ่อมบำรุง (ของที่ชนกลับ)",
      "Second Life",
    ],
  },
  {
    title: "ร่วมงานกับเรา",
    links: [
      "ร่วมงานกับสปอร์ตเกียร์",
    ],
  },
  {
    title: "ข้อมูลทางกฎหมาย",
    links: [
      "ข้อกำหนดและเงื่อนไข",
      "นโยบายความเป็นส่วนตัวและคุกกี้",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-navy mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button className="text-xs text-text-secondary hover:text-blue-accent transition-colors text-left leading-relaxed">
                      &gt; {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </footer>
  );
}
