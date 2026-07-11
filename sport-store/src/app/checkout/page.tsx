"use client";

import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import {
  loadThaiAddressData,
  getAllProvinces,
  getAmphoes,
  getSubDistricts,
  getPostalCode,
  lookupByPostalCode,
  type Province,
  type PostalLookupResult,
} from "@/lib/thaiPostalData";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress as apiDeleteAddress,
  createOrder,
  createPayment,
  checkPaymentStatus,
  type ApiAddress,
  type CreateOrderPayload,
  type ApiPayment,
} from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  CreditCard,
  QrCode,
  Gift,
  ChevronLeft,
} from "lucide-react";

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

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isLoggedIn, user, token } = useAuth();

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyAddressForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AddressForm, string>>
  >({});
  const [savingAddress, setSavingAddress] = useState(false);

  const [addressData, setAddressData] = useState<Province[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [postalMatches, setPostalMatches] = useState<PostalLookupResult[]>([]);

  const [orderExpanded, setOrderExpanded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<
    "address" | "shipping" | "payment" | "promptpay" | "success"
  >("address");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [needFullTaxInvoice, setNeedFullTaxInvoice] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("delivery");
  const [paymentData, setPaymentData] = useState<{
    payment: ApiPayment;
    qr_image: string;
  } | null>(null);
  const [paymentPolling, setPaymentPolling] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadThaiAddressData().then((data) => {
      setAddressData(data);
      setAddressLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      getAddresses(token)
        .then((data) => {
          setAddresses(data);
          const def = data.find((a) => a.is_default);
          if (def) setSelectedAddressId(def.id);
        })
        .catch(() => {});
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (panelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
  const subDistrictList = useMemo(
    () =>
      form.province && form.amphoe
        ? getSubDistricts(addressData, form.province, form.amphoe)
        : [],
    [addressData, form.province, form.amphoe]
  );

  const handlePostalCodeChange = (value: string) => {
    const code = value.replace(/\D/g, "").slice(0, 5);
    setForm((f) => ({ ...f, postalCode: code }));

    if (code.length === 5 && addressData.length > 0) {
      const matches = lookupByPostalCode(addressData, code);
      setPostalMatches(matches);
      if (matches.length === 1) {
        setForm((f) => ({
          ...f,
          postalCode: code,
          province: matches[0].province,
          amphoe: matches[0].amphoe,
          district: matches[0].district,
        }));
      } else if (matches.length > 1) {
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
          district: "",
        }));
      }
    } else {
      setPostalMatches([]);
      if (code.length < 5) {
        setForm((f) => ({
          ...f,
          postalCode: code,
          province: "",
          amphoe: "",
          district: "",
        }));
      }
    }
  };

  const handleProvinceChange = (province: string) => {
    setForm((f) => ({ ...f, province, amphoe: "", district: "" }));
  };

  const handleAmphoeChange = (amphoe: string) => {
    setForm((f) => ({ ...f, amphoe, district: "" }));
  };

  const handleDistrictChange = (district: string) => {
    if (!form.postalCode || form.postalCode.length < 5) {
      const postal = getPostalCode(
        addressData,
        form.province,
        form.amphoe,
        district
      );
      setForm((f) => ({ ...f, district, postalCode: postal }));
    } else {
      setForm((f) => ({ ...f, district }));
    }
  };

  const openAddPanel = () => {
    setEditingId(null);
    setForm({
      ...emptyAddressForm,
      fullName: user?.full_name || "",
      phone: user?.phone || "",
    });
    setFormErrors({});
    setPostalMatches([]);
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
    if (addr.postal_code.length === 5 && addressData.length > 0) {
      setPostalMatches(lookupByPostalCode(addressData, addr.postal_code));
    }
    setPanelOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (isLoggedIn && token) {
      try {
        await apiDeleteAddress(token, id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } catch {
        /* ignore */
      }
    } else {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
    if (selectedAddressId === id) setSelectedAddressId(null);
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

  const saveAddress = async () => {
    if (!validateForm()) return;
    setSavingAddress(true);

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
      if (isLoggedIn && token) {
        if (editingId) {
          const updated = await updateAddress(token, editingId, payload);
          setAddresses((prev) =>
            prev.map((a) => (a.id === editingId ? updated : a))
          );
          setSelectedAddressId(editingId);
        } else {
          const created = await createAddress(token, payload as ApiAddress);
          setAddresses((prev) => [...prev, created]);
          setSelectedAddressId(created.id);
        }
      } else {
        const localAddr: ApiAddress = {
          id: editingId || `local_${Date.now()}`,
          user_id: "",
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (editingId) {
          setAddresses((prev) =>
            prev.map((a) => (a.id === editingId ? localAddr : a))
          );
        } else {
          setAddresses((prev) => [...prev, localAddr]);
        }
        setSelectedAddressId(localAddr.id);
      }
      setPanelOpen(false);
    } catch {
      /* ignore */
    } finally {
      setSavingAddress(false);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const discountTotal = items.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice - item.price : 0) *
        item.quantity,
    0
  );

  const handleGoToShipping = () => {
    if (!selectedAddress) return;
    setStep("shipping");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToPayment = () => {
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shippingCost =
    shippingMethod === "pickup" ? 0 : totalPrice >= 1500 ? 0 : 80;

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPaymentPolling(false);
  }, []);

  const startPolling = useCallback(
    (paymentId: string) => {
      stopPolling();
      setPaymentPolling(true);

      pollingRef.current = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(paymentId);
          if (status.status === "confirmed") {
            stopPolling();
            setOrderNumber(
              paymentData?.payment.order_id
                ? `SPG-${paymentData.payment.order_id.substring(0, 8).toUpperCase()}`
                : ""
            );
            setStep("success");
            clearCart();
          } else if (
            status.status === "expired" ||
            status.status === "failed"
          ) {
            stopPolling();
            setPaymentData(null);
            alert("การชำระเงินหมดอายุ กรุณาลองใหม่อีกครั้ง");
          }
        } catch {
          // ignore polling errors
        }
      }, 3000);
    },
    [stopPolling, clearCart, paymentData]
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handlePay = async () => {
    if (!selectedPayment || !selectedAddress) return;
    setSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        shipping_name: selectedAddress.full_name,
        shipping_phone: selectedAddress.phone,
        shipping_address: selectedAddress.address,
        shipping_province: selectedAddress.province,
        shipping_amphoe: selectedAddress.amphoe,
        shipping_district: selectedAddress.district || undefined,
        shipping_postal_code: selectedAddress.postal_code,
        shipping_note: selectedAddress.note || undefined,
        payment_method: selectedPayment as CreateOrderPayload["payment_method"],
        items: items.map((item) => ({
          product_id: String(item.id),
          name: item.name,
          image: item.image,
          brand: item.brand || undefined,
          size: item.size || undefined,
          price: item.price,
          original_price: item.originalPrice,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(payload, token || undefined);

      if (selectedPayment === "promptpay") {
        const payResult = await createPayment(
          order.id,
          totalPrice + shippingCost
        );
        setPaymentData(payResult);
        setOrderNumber(order.order_number);
        setStep("promptpay");
        startPolling(payResult.payment.id);
      } else {
        setOrderNumber(order.order_number);
        setStep("success");
        clearCart();
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-[800px] mx-auto px-4 py-16 text-center">
          <p className="text-lg text-text-secondary mb-4">
            ไม่มีสินค้าในตะกร้า
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            กลับไปช้อปปิ้ง
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "promptpay" && paymentData) {
    const expiresAt = new Date(paymentData.payment.expires_at);
    const remainMs = Math.max(0, expiresAt.getTime() - Date.now());
    const remainMin = Math.floor(remainMs / 60000);
    const remainSec = Math.floor((remainMs % 60000) / 1000);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-[520px] mx-auto px-4 py-8">
          <button
            onClick={() => {
              stopPolling();
              setStep("payment");
              setPaymentData(null);
            }}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            เปลี่ยนวิธีชำระเงิน
          </button>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#1A3365] text-white text-center py-4">
              <p className="text-xs opacity-80 mb-1">ชำระเงินผ่าน</p>
              <h2 className="text-lg font-bold">QR พร้อมเพย์ PromptPay</h2>
            </div>

            {/* QR Code */}
            <div className="p-6 text-center">
              <div className="inline-block bg-white p-3 rounded-lg border border-gray-100 shadow-sm mb-4">
                <img
                  src={paymentData.qr_image}
                  alt="PromptPay QR Code"
                  className="w-[280px] h-[280px]"
                />
              </div>

              <p className="text-sm text-text-secondary mb-1">
                สแกน QR Code เพื่อชำระเงิน
              </p>

              <p className="text-2xl font-bold text-navy mb-4">
                ฿
                {paymentData.payment.ref_amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
                <p className="text-xs text-amber-700">
                  กรุณาโอนเงินจำนวน{" "}
                  <span className="font-bold">
                    ฿
                    {paymentData.payment.ref_amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>{" "}
                  เท่านั้น (รวมสตางค์) เพื่อให้ระบบตรวจสอบอัตโนมัติ
                </p>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                <Loader2
                  size={14}
                  className={paymentPolling ? "animate-spin text-blue-accent" : "text-gray-300"}
                />
                <span>
                  {paymentPolling
                    ? `รอการชำระเงิน... (${remainMin}:${remainSec
                        .toString()
                        .padStart(2, "0")})`
                    : "ตรวจสอบสถานะ..."}
                </span>
              </div>

              <p className="text-xs text-text-secondary mt-2">
                หมายเลขคำสั่งซื้อ:{" "}
                <span className="font-medium text-navy">{orderNumber}</span>
              </p>
            </div>

            {/* Steps */}
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-xs font-bold text-navy mb-3">ขั้นตอน:</p>
              <ol className="space-y-2 text-xs text-text-secondary">
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-accent text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    1
                  </span>
                  เปิดแอปธนาคารบนมือถือ
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-accent text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    2
                  </span>
                  เลือก &quot;สแกนจ่าย&quot; แล้วสแกน QR Code ด้านบน
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-accent text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    3
                  </span>
                  ยืนยันยอดเงินและโอน — ระบบจะตรวจสอบอัตโนมัติ
                </li>
              </ol>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-[600px] mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">
            สั่งซื้อสำเร็จแล้ว!
          </h1>
          <p className="text-text-secondary mb-2">
            หมายเลขคำสั่งซื้อ:{" "}
            <span className="font-semibold text-navy">
              {orderNumber || "N/A"}
            </span>
          </p>
          {selectedAddress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 text-left mt-6">
              <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                <MapPin size={16} />
                ที่อยู่จัดส่ง
              </h3>
              <p className="text-sm text-text-primary">
                {selectedAddress.full_name}
              </p>
              <p className="text-sm text-text-secondary">
                {selectedAddress.address} {selectedAddress.district}{" "}
                {selectedAddress.amphoe} {selectedAddress.province}{" "}
                {selectedAddress.postal_code}
              </p>
              <p className="text-sm text-text-secondary">
                {selectedAddress.phone}
              </p>
            </div>
          )}
          <Link
            href="/"
            className="inline-block bg-blue-accent hover:bg-blue-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "shipping") {
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-navy mb-2">ชำระเงิน</h1>

          <div className="mb-6">
            <h2 className="text-base font-bold text-navy mb-1">
              ตัวเลือกการจัดส่ง
            </h2>
            <p className="text-xs text-text-secondary">
              เพื่อให้แน่ใจว่าสินค้าของท่านพร้อมจัดส่ง
              คำสั่งซื้อของท่านอาจถูกแยกให้สาขาต่างๆเพื่อจัดส่งต่อไป
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left — Product List + Shipping Options */}
            <div className="flex-1">
              {/* Package header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
                <span className="text-sm font-semibold text-navy">
                  พัสดุ 1/1
                </span>
                <span className="text-xs text-text-secondary">
                  จำหน่ายและจัดส่ง โดย :{" "}
                  <span className="font-bold text-navy">SPORTGEAR</span>
                </span>
              </div>

              {/* Product items */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const hasDiscount =
                    item.originalPrice && item.originalPrice > item.price;
                  const discountPct = hasDiscount
                    ? Math.round(
                        ((item.originalPrice! - item.price) /
                          item.originalPrice!) *
                          100
                      )
                    : 0;

                  return (
                    <div
                      key={`${item.id}__${item.size}`}
                      className="flex items-start gap-4 py-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        {item.brand && (
                          <p className="text-xs text-text-secondary mt-0.5">
                            {item.brand}
                          </p>
                        )}
                        {item.size && (
                          <p className="text-xs text-text-secondary">
                            ขนาด {item.size}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm text-text-secondary mr-4">
                          {item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-navy">
                          ฿{item.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <div className="flex items-center justify-end gap-2 mt-0.5">
                            <span className="text-xs text-text-secondary line-through">
                              ฿{item.originalPrice!.toLocaleString()}
                            </span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                              -{discountPct}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping method selection */}
              <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="text-sm font-bold text-navy mb-4">
                  เลือกการจัดส่งของท่าน:
                </h3>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      shippingMethod === "pickup"
                        ? "border-navy bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                      className="mt-0.5 w-4 h-4 text-navy focus:ring-navy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">
                        คลิกแอนด์คอลเลคท์ รับสินค้าที่ร้าน SportGear
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        รับสินค้าวันนี้ ตั้งแต่เวลา 13:18 เป็นต้นไป
                      </p>
                    </div>
                    <span className="text-sm font-medium text-navy shrink-0">
                      ค่าส่ง ฿0
                    </span>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      shippingMethod === "delivery"
                        ? "border-navy bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="delivery"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                      className="mt-0.5 w-4 h-4 text-navy focus:ring-navy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">
                        จัดส่งถึงบ้าน
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        จัดส่งประมาณ วันอาทิตย์ที่{" "}
                        {new Date(
                          Date.now() + 2 * 86400000
                        ).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-navy shrink-0">
                      ค่าส่ง ฿{shippingCost}
                    </span>
                  </label>
                </div>
              </div>

              {/* Proceed button (mobile) */}
              <div className="mt-8 lg:hidden">
                <button
                  onClick={handleGoToPayment}
                  className="w-full py-4 bg-[#F56B00] hover:bg-[#e06200] text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:w-[380px] shrink-0">
              <div className="border border-gray-200 rounded-lg sticky top-[130px]">
                <h2 className="text-base font-bold text-navy px-5 pt-5 pb-4">
                  สรุปค่าสั่งซื้อ
                </h2>

                <div className="border-t border-gray-200">
                  <button
                    onClick={() => setOrderExpanded(!orderExpanded)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-navy">
                      จำหน่ายและจัดส่งโดย SPORTGEAR
                    </span>
                    {orderExpanded ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="px-5 py-4 space-y-2.5 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">จำนวนพัสดุ</span>
                    <span className="text-text-primary">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">จำนวนสินค้า</span>
                    <span className="text-text-primary">{totalQty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">ยอดสินค้า</span>
                    <span className="text-text-primary">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        ส่วนลดจากราคาสินค้า
                      </span>
                      <span className="text-red-500 font-medium">
                        -฿{discountTotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">ค่าจัดส่ง</span>
                    <span
                      className={
                        shippingCost === 0
                          ? "text-green-600"
                          : "text-text-primary"
                      }
                    >
                      {shippingCost === 0
                        ? "ไม่มีค่าจัดส่ง"
                        : `฿${shippingCost}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-5 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-navy">
                      ยอดชำระเงินทั้งหมด
                    </span>
                    <span className="text-xl font-bold text-navy">
                      ฿{(totalPrice + shippingCost).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Proceed button (desktop) */}
                <div className="px-5 pb-5 hidden lg:block">
                  <button
                    onClick={handleGoToPayment}
                    className="w-full py-4 bg-[#F56B00] hover:bg-[#e06200] text-white font-semibold rounded-lg text-sm transition-colors"
                  >
                    ดำเนินการชำระเงิน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <FeedbackPanel />
      </div>
    );
  }

  if (step === "payment") {
    const paymentMethods: {
      id: string;
      label: string;
      badge: string | null;
      badgeColor: string;
      desc: string;
      icon?: ReactNode;
    }[] = [
      {
        id: "promptpay",
        label: "QR พร้อมเพย์",
        badge: null,
        badgeColor: "",
        desc: "จ่ายผ่านพร้อมเพย์ QR โค้ด ไม่มีค่าธรรมเนียม",
        icon: (
          <img
            src="/prompt-pay-logo.png"
            alt="PromptPay"
            className="h-7 w-auto object-contain"
          />
        ),
      },
      {
        id: "credit",
        label: "บัตรเครดิต Stripe",
        badge: null,
        badgeColor: "",
        desc: "Visa, Mastercard, JCB — ชำระผ่าน Stripe อย่างปลอดภัย",
        icon: <CreditCard size={20} className="text-gray-500" />,
      },
      {
        id: "bank",
        label: "โอนเงินผ่านธนาคาร",
        badge: null,
        badgeColor: "",
        desc: "โอนเงินภายใน 24 ชม. เพื่อยืนยันคำสั่งซื้อ",
      },
      {
        id: "gift",
        label: "บัตรของขวัญ",
        badge: "SPORTGEAR",
        badgeColor: "bg-navy text-white",
        desc: "ใช้บัตรของขวัญ SPORTGEAR ชำระเงิน",
        icon: <Gift size={20} className="text-gray-500" />,
      },
    ];

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-[720px] mx-auto px-4 py-8">
          <button
            onClick={() => setStep("shipping")}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            กลับ
          </button>

          {/* Payment Summary */}
          <h2 className="text-xl font-bold text-navy mb-5">สรุปการชำระเงิน</h2>

          <div className="border border-gray-200 rounded-lg p-5 mb-8">
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">จำนวนพัสดุ</span>
                <span className="text-text-primary">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">จำนวนสินค้า</span>
                <span className="text-text-primary">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">ยอดสินค้า</span>
                <span className="text-text-primary">
                  ฿{subtotal.toLocaleString()}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    ส่วนลดจากราคาสินค้า
                  </span>
                  <span className="text-red-500 font-medium">
                    -฿{discountTotal.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">ค่าจัดส่ง</span>
                <span className="text-green-600 text-sm">ไม่มีค่าจัดส่ง</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-navy">
                  ยอดชำระเงินทั้งหมด
                </span>
                <span className="text-2xl font-bold text-navy">
                  ฿{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <h2 className="text-xl font-bold text-navy mb-5">
            โปรดเลือกวิธีการชำระเงินของคุณ
          </h2>

          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <div
                  key={method.id}
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "border-navy"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() =>
                      setSelectedPayment(isSelected ? null : method.id)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-navy">
                      {method.label}
                    </span>
                    <div className="flex items-center gap-3">
                      {isSelected && (
                        <span className="text-xs text-text-secondary">
                          จ่าย ฿{totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {method.icon && method.icon}
                      {method.badge && !method.icon && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${method.badgeColor}`}
                        >
                          {method.badge}
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${
                          isSelected ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSelected ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm text-text-secondary pl-2 border-l-2 border-gray-200">
                        {method.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terms */}
          <div className="mb-6">
            <p className="text-xs text-text-secondary leading-relaxed">
              การกดชำระเงินหมายความว่าฉันได้อ่านและเห็นด้วยกับ{" "}
              <button className="underline font-medium text-navy">
                นโยบายความเป็นส่วนตัว
              </button>{" "}
              และ{" "}
              <button className="underline font-medium text-navy">
                ข้อกำหนดและเงื่อนไข
              </button>{" "}
              ของ SportGear ประเทศไทย
            </p>
          </div>

          {/* Full tax invoice */}
          <label className="flex items-start gap-3 mb-8 cursor-pointer border border-gray-200 rounded-lg p-4">
            <input
              type="checkbox"
              checked={needFullTaxInvoice}
              onChange={(e) => setNeedFullTaxInvoice(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-navy focus:ring-blue-accent"
            />
            <span className="text-xs text-text-secondary leading-relaxed">
              ฉันต้องการใบกำกับภาษีเต็มรูป (เฉพาะสินค้าที่ขายและจัดส่ง
              โดย SportGear เท่านั้น สำหรับสินค้าแบรนด์พาร์ทเนอร์
              กรุณาติดต่อ contactus@sportgear.th)
            </span>
          </label>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={!selectedPayment || submitting}
            className="w-full py-4 bg-[#3643BA] hover:bg-[#2a35a0] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังดำเนินการ...
              </>
            ) : (
              "ชำระเงิน"
            )}
          </button>
        </main>
        <Footer />
        <FeedbackPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-navy mb-8">ชำระเงิน</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            {/* Shipping Info */}
            <div className="border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">
                  {isLoggedIn ? "เข้าสู่ระบบแล้ว" : "เข้าสู่ระบบภายใต้ชื่อ"}
                </p>
              </div>
              <p className="text-sm font-semibold text-navy">
                {isLoggedIn
                  ? user?.full_name || user?.email
                  : "บุคคลทั่วไป"}
              </p>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-navy mb-3">
                  เลือกที่อยู่จัดส่ง
                </h2>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-blue-accent bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                              selectedAddressId === addr.id
                                ? "border-blue-accent"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-2.5 h-2.5 bg-blue-accent rounded-full" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-navy">
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
                            <p className="text-xs text-text-secondary">
                              {addr.phone}
                            </p>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                              {addr.address} {addr.district} {addr.amphoe}{" "}
                              {addr.province} {addr.postal_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPanel(addr);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Pencil size={14} className="text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 size={14} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Address / Add Address */}
            {addresses.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
                <p className="text-sm text-text-secondary mb-3">
                  ไม่มีที่อยู่บันทึกไว้
                </p>
                <button
                  onClick={openAddPanel}
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-accent hover:underline"
                >
                  <Plus size={16} />
                  เพิ่มที่อยู่
                </button>
              </div>
            )}

            {addresses.length > 0 && (
              <button
                onClick={openAddPanel}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-accent hover:underline mb-6"
              >
                <Plus size={16} />
                เพิ่มที่อยู่ใหม่
              </button>
            )}

            {/* Next Step Button */}
            <button
              onClick={handleGoToShipping}
              disabled={!selectedAddress}
              className="w-full py-4 bg-[#3643BA] hover:bg-[#2a35a0] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors"
            >
              ขั้นตอนต่อไป
            </button>
          </div>

          {/* Right Column — Order Summary */}
          <div className="lg:w-[420px] shrink-0">
            <div className="border border-gray-200 rounded-lg sticky top-[130px]">
              <h2 className="text-lg font-bold text-navy px-5 pt-5 pb-4">
                สรุปคำสั่งซื้อ
              </h2>

              {/* Seller section with expand/collapse */}
              <div className="border-t border-gray-200">
                <button
                  onClick={() => setOrderExpanded(!orderExpanded)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-navy">
                    จำหน่ายและจัดส่งโดย SPORTGEAR
                  </span>
                  {orderExpanded ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>

                {orderExpanded && (
                  <div className="px-5 pb-4 space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.id}__${item.size}`}
                        className="flex gap-3"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary line-clamp-2 leading-snug">
                            {item.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            ขนาด: {item.size}
                          </p>
                          <p className="text-sm font-semibold text-navy mt-0.5">
                            ฿{item.price.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs text-text-secondary shrink-0 mt-1">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">จำนวนพัสดุ</span>
                  <span className="text-text-secondary">
                    จะอัปเดตในภายหลัง
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">จำนวนสินค้า</span>
                  <span className="text-text-primary">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ยอดสินค้า</span>
                  <span className="text-text-primary">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      ส่วนลดจากราคาสินค้า
                    </span>
                    <span className="text-red-500 font-medium">
                      -฿{discountTotal.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ค่าจัดส่ง</span>
                  <span className="text-text-secondary">
                    จะคำนวณในภายหลัง
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-gray-200 px-5 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">
                    ยอดชำระเงินทั้งหมด
                  </span>
                  <span className="text-xl font-bold text-navy">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FeedbackPanel />

      {/* ========== Address Panel (slide from right) ========== */}
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
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-navy">
            {editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
          </h2>
          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-4">
              {/* Label + Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    ประเภทที่อยู่ (ไม่ใช้ที่อยู่)
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    placeholder="เช่น บ้าน, ที่ทำงาน"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    *ประเทศ
                  </label>
                  <div className="relative">
                    <select
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 appearance-none"
                    >
                      <option>ไทย</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Full Name */}
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
                  placeholder="ชื่อ"
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

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *เบอร์โทรศัพท์มือถือ
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="+66"
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

              {/* Province */}
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

              {/* Postal Code */}
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
                  placeholder=""
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

              {/* Amphoe */}
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
                    <option value=""></option>
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

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  *ที่อยู่ (บ้านเลขที่ ตึก หมู่บ้าน หมู่ ซอย ถนน แขวง/ตำบล)
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="บ้านเลขที่ ตึก หมู่บ้าน หมู่ ซอย ถนน แขวง/ตำบล"
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

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  ข้อมูลที่อยู่เพิ่มเติม/จุดสังเกต
                </label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                  placeholder="ข้อมูลที่อยู่เพิ่มเติม/จุดสังเกต"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent"
                />
              </div>

              {/* Default checkbox */}
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

          {/* Save Button */}
          <div className="px-5 pb-5 pt-3 border-t border-gray-100">
            <button
              onClick={saveAddress}
              disabled={savingAddress}
              className="w-full py-3.5 bg-[#3643BA] hover:bg-[#2a35a0] disabled:bg-gray-300 text-white font-semibold rounded-full transition-colors text-sm flex items-center justify-center gap-2"
            >
              {savingAddress ? (
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
