"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/backoffice/ProductForm";
import { boProducts } from "@/lib/backofficeMock";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = boProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div>
          <p className="text-lg font-bold text-[#0b1f3f]">ไม่พบสินค้า</p>
          <p className="mt-1 text-sm text-[#64748b]">
            สินค้าที่คุณต้องการแก้ไขอาจถูกลบไปแล้ว
          </p>
          <Link
            href="/backoffice/products"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] shadow-sm"
          >
            <ArrowLeft size={16} /> กลับไปหน้าสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return <ProductForm product={product} />;
}
