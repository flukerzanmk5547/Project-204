"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  X,
  Pencil,
  Trash2,
  MapPin,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useAuth } from "@/lib/AuthContext";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress as apiDeleteAddress,
  type ApiAddress,
} from "@/lib/api";
import {
  loadThaiAddressData,
  getAllProvinces,
  getAmphoes,
  getPostalCode,
  lookupByPostalCode,
  type Province,
} from "@/lib/thaiPostalData";

interface AddressForm {
  label: string;
  fullName: string;
  phone: string;
  postalCode: string;
  province: string;
  amphoe: string;
  district: string;
  address: string;
  note: string;
  isDefault: boolean;
}

const emptyAddressForm: AddressForm = {
  label: "",
  fullName: "",
  phone: "",
  postalCode: "",
  province: "",
  amphoe: "",
  district: "",
  address: "",
  note: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { token, user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyAddressForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AddressForm, string>>
  >({});
  const [saving, setSaving] = useState(false);

  const [addressData, setAddressData] = useState<Province[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    loadThaiAddressData().then((data) => {
      setAddressData(data);
      setAddressLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAddresses(token)
      .then((data) => setAddresses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const provinceList = useMemo(
    () => getAllProvinces(addressData),
    [addressData]
  );
  const amphoeList = useMemo(
    () => (form.province ? getAmphoes(addressData, form.province) : []),
    [addressData, form.province]
  );

  const handlePostalCodeChange = (value: string) => {
    const code = value.replace(/\D/g, "").slice(0, 5);
    if (code.length === 5 && addressData.length > 0) {
      const matches = lookupByPostalCode(addressData, code);
      if (matches.length >= 1) {
        const firstProv = matches[0].province;
        const firstAmphoe = matches[0].amphoe;
        const sameProv = matches.every((m) => m.province === firstProv);
        const sameAmphoe =
          sameProv && matches.every((m) => m.amphoe === firstAmphoe);
        setForm((f) => ({
          ...f,
          postalCode: code,
          province: sameProv ? firstProv : "",
          amphoe: sameAmphoe ? firstAmphoe : "",
          district: matches.length === 1 ? matches[0].district : "",
        }));
        return;
      }
    }
    setForm((f) => ({
      ...f,
      postalCode: code,
      ...(code.length < 5
        ? { province: "", amphoe: "", district: "" }
        : {}),
    }));
  };

  const handleProvinceChange = (province: string) => {
    setForm((f) => ({ ...f, province, amphoe: "", district: "" }));
  };

  const handleAmphoeChange = (amphoe: string) => {
    setForm((f) => {
      const next = { ...f, amphoe, district: "" };
      if (!f.postalCode || f.postalCode.length < 5) {
        const postal = getPostalCode(addressData, f.province, amphoe, "");
        if (postal) next.postalCode = postal;
      }
      return next;
    });
  };

  const openAddPanel = () => {
    setEditingId(null);
    setForm({
      ...emptyAddressForm,
      fullName: user?.full_name || "",
      phone: user?.phone || "",
    });
    setFormErrors({});
    setPanelOpen(true);
  };

  const openEditPanel = (addr: ApiAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label || "",
      fullName: addr.full_name,
      phone: addr.phone,
      postalCode: addr.postal_code,
      province: addr.province,
      amphoe: addr.amphoe,
      district: addr.district || "",
      address: addr.address,
      note: addr.note || "",
      isDefault: addr.is_default,
    });
    setFormErrors({});
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await apiDeleteAddress(token, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      /* ignore */
    }
  };

  const validateForm = (): boolean => {
    const e: Partial<Record<keyof AddressForm, string>> = {};
    if (!form.fullName.trim()) e.fullName = "ต้องระบุชื่อ";
    if (!form.phone.trim() || form.phone.length < 9)
      e.phone = "ต้องระบุเบอร์โทรศัพท์";
    if (form.postalCode.length !== 5) e.postalCode = "ต้องระบุรหัสไปรษณีย์";
    if (!form.province) e.province = "จำเป็นต้องระบุจังหวัด";
    if (!form.amphoe) e.amphoe = "จำเป็นต้องระบุเขต/อำเภอ";
    if (!form.address.trim()) e.address = "จำเป็นต้องระบุที่อยู่";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validateForm() || !token) return;
    setSaving(true);

    const payload = {
      label: form.label || null,
      full_name: form.fullName,
      phone: form.phone,
      postal_code: form.postalCode,
      province: form.province,
      amphoe: form.amphoe,
      district: form.district || null,
      address: form.address,
      note: form.note || null,
      is_default: form.isDefault,
    };

    try {
      if (editingId) {
        const updated = await updateAddress(token, editingId, payload);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? updated : a))
        );
      } else {
        const created = await createAddress(token, payload as ApiAddress);
        setAddresses((prev) => [...prev, created]);
      }
      setPanelOpen(false);
    } catch {
      alert("ไม่สามารถบันทึกที่อยู่ได้ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[800px] mx-auto px-4 py-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          บัญชีของฉัน
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <MapPin size={24} />
            สมุดที่อยู่
          </h1>
          <button
            onClick={openAddPanel}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-accent hover:bg-blue-hover px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            เพิ่มที่อยู่
          </button>
        </div>

        {loading || authLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-accent" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-gray-300" />
            </div>
            <p className="text-text-secondary mb-4">ยังไม่มีที่อยู่บันทึกไว้</p>
            <button
              onClick={openAddPanel}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-accent hover:underline"
            >
              <Plus size={16} />
              เพิ่มที่อยู่แรกของคุณ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-navy">
                        {addr.full_name}
                      </span>
                      {addr.label && (
                        <span className="text-[10px] bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full">
                          {addr.label}
                        </span>
                      )}
                      {addr.is_default && (
                        <span className="text-[10px] bg-blue-100 text-blue-accent px-2 py-0.5 rounded-full font-medium">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{addr.phone}</p>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {addr.address} {addr.district} {addr.amphoe}{" "}
                      {addr.province} {addr.postal_code}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditPanel(addr)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label="แก้ไข"
                    >
                      <Pencil size={15} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label="ลบ"
                    >
                      <Trash2 size={15} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <FeedbackPanel />

      {/* Address Panel (slide from right) */}
      <div
        className={`fixed inset-0 bg-black/40 z-60 transition-opacity duration-300 ${
          panelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setPanelOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-70 transform transition-transform duration-300 ease-out shadow-2xl ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-navy">
            {editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
          </h2>
          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="ปิด"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  ประเภทที่อยู่
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="เช่น บ้าน, ที่ทำงาน"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *ชื่อ
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="ชื่อ-นามสกุล"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent ${
                    formErrors.fullName ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *เบอร์โทรศัพท์มือถือ
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08x-xxx-xxxx"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent ${
                    formErrors.phone ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={form.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  disabled={addressLoading}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent disabled:bg-gray-100 ${
                    formErrors.postalCode
                      ? "border-red-400"
                      : form.postalCode.length === 5
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.postalCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *จังหวัด
                </label>
                <div className="relative">
                  <select
                    value={form.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent appearance-none cursor-pointer ${
                      formErrors.province
                        ? "border-red-400"
                        : form.province
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">กรุณาเลือก</option>
                    {provinceList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {formErrors.province && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.province}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *เขต/อำเภอ
                </label>
                <div className="relative">
                  <select
                    value={form.amphoe}
                    onChange={(e) => handleAmphoeChange(e.target.value)}
                    disabled={!form.province}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      formErrors.amphoe
                        ? "border-red-400"
                        : form.amphoe
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">กรุณาเลือก</option>
                    {amphoeList.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {formErrors.amphoe && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.amphoe}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *ที่อยู่ (บ้านเลขที่ ตึก หมู่บ้าน ซอย ถนน แขวง/ตำบล)
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="บ้านเลขที่ ตึก หมู่บ้าน ซอย ถนน แขวง/ตำบล"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-accent ${
                    formErrors.address ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {formErrors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  ข้อมูลเพิ่มเติม/จุดสังเกต
                </label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="ข้อมูลเพิ่มเติม/จุดสังเกต"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-accent focus:ring-blue-accent"
                />
                <span className="text-sm text-text-primary">
                  ตั้งเป็นที่อยู่เริ่มต้น
                </span>
              </label>
            </div>
          </div>

          <div className="px-5 pb-5 pt-3 border-t border-gray-100">
            <button
              onClick={save}
              disabled={saving}
              className="w-full py-3.5 bg-[#3643BA] hover:bg-[#2a35a0] disabled:bg-gray-300 text-white font-semibold rounded-full transition-colors text-sm flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                "บันทึกที่อยู่"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
