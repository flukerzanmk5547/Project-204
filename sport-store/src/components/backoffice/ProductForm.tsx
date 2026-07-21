"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Plus, X, Star, Info, Save } from "lucide-react";
import { Panel } from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import {
  boCategories,
  boAttributeGroups,
  type BoProduct,
} from "@/lib/backofficeMock";

/* ---------- form primitives ---------- */

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-[#334155]">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#94a3b8]">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#e4e9f2] bg-white px-3 py-2.5 text-sm text-[#0b1f3f] shadow-sm outline-none placeholder:text-[#94a3b8] focus:border-[#3d7bf7]/60";

function SectionCard({
  title,
  icon,
  desc,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="p-5">
      <div className="mb-4 flex items-center gap-2.5">
        {icon}
        <div>
          <h3 className="text-base font-bold text-[#0b1f3f]">{title}</h3>
          {desc && <p className="text-xs text-[#94a3b8]">{desc}</p>}
        </div>
      </div>
      {children}
    </Panel>
  );
}

/* ---------- product form (create + edit) ---------- */

export default function ProductForm({ product }: { product?: BoProduct }) {
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [price, setPrice] = useState(
    product ? String(product.discountPrice ?? product.price) : "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    product?.discountPrice ? String(product.price) : "",
  );
  const [sku, setSku] = useState(product?.sku ?? "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [category, setCategory] = useState(
    product ? (boCategories.find((c) => c.name === product.category)?.id ?? "") : "",
  );
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<string>(product?.status ?? "draft");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(
    product?.image ? [product.image] : [],
  );

  const slug = useMemo(
    () =>
      (product?.slug && !name
        ? product.slug
        : name
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")) || product?.slug || "",
    [name, product],
  );

  const discountPct = useMemo(() => {
    const p = Number(price);
    const o = Number(originalPrice);
    if (p > 0 && o > p) return Math.round(((o - p) / o) * 100);
    return 0;
  }, [price, originalPrice]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const toggleAttr = (id: string) =>
    setSelectedAttrs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const attrGroups = boAttributeGroups.filter((g) =>
    selectedAttrs.includes(g.id),
  );

  return (
    <div className="pb-10">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/backoffice/products"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4e9f2] bg-white text-[#334155] shadow-sm transition hover:text-[#2d6be7]"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf1fe] ring-1 ring-[#cfe0fd]">
            <Icon3D name="products" size={28} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1f3f]">
              {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </h1>
            <p className="mt-0.5 text-sm text-[#64748b]">
              {isEdit
                ? `กำลังแก้ไข: ${product?.name}`
                : "กรอกรายละเอียดสินค้าให้ครบถ้วนเพื่อลงขายหน้าร้าน"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/backoffice/products"
            className="rounded-lg border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] shadow-sm transition hover:text-[#2d6be7]"
          >
            ยกเลิก
          </Link>
          {!isEdit && (
            <button className="rounded-lg border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] shadow-sm">
              บันทึกฉบับร่าง
            </button>
          )}
          <button className="bo-btn-gold inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold">
            {isEdit ? <Save size={16} /> : <Plus size={16} />}
            {isEdit ? "บันทึกการแก้ไข" : "เผยแพร่สินค้า"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* main column */}
        <div className="space-y-6">
          <SectionCard
            title="ข้อมูลสินค้า"
            icon={<Icon3D name="products" size={22} />}
          >
            <div className="space-y-4">
              <Field label="ชื่อสินค้า" required>
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น รองเท้าวิ่ง Kalenji Run Support"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Slug (URL)" hint="สร้างอัตโนมัติจากชื่อสินค้า">
                  <input
                    className={`${inputCls} bg-[#f7f9fd] text-[#64748b]`}
                    value={slug}
                    readOnly
                    placeholder="auto-generated"
                  />
                </Field>
                <Field label="แบรนด์">
                  <input
                    className={inputCls}
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="เช่น Kalenji"
                  />
                </Field>
              </div>
              <Field label="คำอธิบายสินค้า">
                <textarea
                  rows={5}
                  className={`${inputCls} resize-y`}
                  placeholder="อธิบายจุดเด่น วัสดุ การใช้งาน ฯลฯ"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="รูปภาพสินค้า"
            desc="รูปแรกจะถูกใช้เป็นรูปหลัก แนะนำอัตราส่วน 1:1"
            icon={<Icon3D name="banners" size={22} />}
          >
            <div className="flex flex-wrap gap-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="group relative h-24 w-24 overflow-hidden rounded-xl ring-1 ring-[#e4e9f2]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-[#2d6be7] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      หลัก
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((_, x) => x !== i))
                    }
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setImages((prev) => [
                    ...prev,
                    `https://picsum.photos/id/${20 + prev.length + 1}/200/200`,
                  ])
                }
                className="grid h-24 w-24 place-items-center rounded-xl border-2 border-dashed border-[#cfe0fd] bg-[#f7f9fd] text-[#3d7bf7] transition hover:border-[#3d7bf7]/60"
              >
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus size={22} />
                  <span className="text-[11px] font-semibold">เพิ่มรูป</span>
                </div>
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="ราคาและสต็อก"
            icon={<Icon3D name="sales" size={22} />}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="ราคาปกติ (฿)" hint="ราคาก่อนลด (original_price)">
                <input
                  type="number"
                  className={inputCls}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0"
                />
              </Field>
              <Field
                label="ราคาขาย (฿)"
                required
                hint="ราคาที่ลูกค้าจ่ายจริง (price)"
              >
                <div className="relative">
                  <input
                    type="number"
                    className={inputCls}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                  {discountPct > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                      -{discountPct}%
                    </span>
                  )}
                </div>
              </Field>
              <Field label="SKU" required>
                <input
                  className={inputCls}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-XXX-000"
                />
              </Field>
              <Field label="จำนวนสต็อก" required>
                <input
                  type="number"
                  className={inputCls}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="ตัวเลือกสินค้า (Variants)"
            desc="เลือกกลุ่มคุณสมบัติที่ใช้กับสินค้านี้ เช่น ไซส์ / สี"
            icon={<Icon3D name="attributes" size={22} />}
          >
            <div className="flex flex-wrap gap-2">
              {boAttributeGroups.map((g) => {
                const on = selectedAttrs.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleAttr(g.id)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      on
                        ? "border-[#3d7bf7] bg-[#eaf1fe] text-[#2159c4]"
                        : "border-[#e4e9f2] bg-white text-[#64748b] hover:border-[#3d7bf7]/50"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>

            {attrGroups.length > 0 && (
              <div className="mt-4 space-y-4 border-t border-[#eef2f7] pt-4">
                {attrGroups.map((g) => (
                  <div key={g.id}>
                    <p className="mb-2 text-sm font-semibold text-[#334155]">
                      {g.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {g.options.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e4e9f2] bg-[#f7f9fd] px-3 py-1.5 text-sm text-[#334155]"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="accent-[#3d7bf7]"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* sidebar column */}
        <div className="space-y-6">
          <SectionCard
            title="สถานะการขาย"
            icon={<Icon3D name="trending" size={22} />}
          >
            <div className="space-y-4">
              <Field label="สถานะ">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputCls}
                >
                  <option value="active">กำลังขาย</option>
                  <option value="draft">ฉบับร่าง</option>
                  <option value="out">หมดสต็อก</option>
                </select>
              </Field>

              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-[#f7f9fd] px-3 py-2.5 ring-1 ring-[#eef2f7]">
                <span className="flex items-center gap-2 text-sm font-medium text-[#334155]">
                  <Star size={15} className="text-amber-400" />
                  ป้าย &quot;สินค้าใหม่&quot;
                </span>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="h-4 w-4 accent-[#3d7bf7]"
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard
            title="หมวดหมู่"
            icon={<Icon3D name="categories" size={22} />}
          >
            <Field label="หมวดหมู่สินค้า" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="">— เลือกหมวดหมู่ —</option>
                {boCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </SectionCard>

          <SectionCard
            title="ป้ายกำกับ (Tags)"
            desc="ใช้แสดงบนการ์ดสินค้า เช่น ลดราคา / ขายดี"
            icon={<Icon3D name="promotions" size={22} />}
          >
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className={inputCls}
                placeholder="พิมพ์แล้วกด Enter"
              />
              <button
                onClick={addTag}
                className="shrink-0 rounded-lg bg-[#eaf1fe] px-3 text-[#2159c4] ring-1 ring-[#cfe0fd]"
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-[#eef3fb] px-2 py-1 text-xs font-semibold text-[#2d6be7] ring-1 ring-[#dbe7fb]"
                  >
                    {t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="flex items-start gap-2 rounded-xl bg-[#eff6ff] p-4 text-xs text-[#3b5b91] ring-1 ring-[#dbe7fb]">
            <Info size={15} className="mt-0.5 shrink-0" />
            <p>
              ฟิลด์เหล่านี้อ้างอิงตามโครงสร้าง API จริง (name, slug, brand,
              price, original_price, images, tags, stock, attributes)
              พร้อมเชื่อมต่อในขั้นตอนถัดไป
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
