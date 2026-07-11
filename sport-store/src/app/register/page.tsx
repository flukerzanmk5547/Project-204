"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      setError("กรุณาระบุชื่อ-นามสกุล");
      return;
    }
    if (!email.includes("@")) {
      setError("กรุณาระบุอีเมลที่ถูกต้อง");
      return;
    }
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (!agreed) {
      setError("กรุณายอมรับข้อกำหนดและเงื่อนไข");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        email,
        password,
        full_name: fullName,
        phone: phone || undefined,
      });
      router.push("/");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ";
      if (msg.includes("409") || msg.includes("already")) {
        setError("อีเมลนี้ถูกลงทะเบียนแล้ว");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center relative">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-navy transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>กลับ</span>
          </Link>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <svg
              viewBox="0 0 200 30"
              className="h-6 w-auto fill-navy"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="50%"
                y="24"
                fontFamily="Arial Black, sans-serif"
                fontSize="22"
                fontWeight="900"
                letterSpacing="2"
                textAnchor="middle"
              >
                SPORTGEAR
              </text>
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          <h1 className="text-2xl font-bold text-navy mb-2">สร้างบัญชี</h1>
          <p className="text-sm text-text-secondary mb-6">
            กรอกข้อมูลด้านล่างเพื่อสมัครสมาชิก
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ชื่อ-นามสกุล"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                เบอร์โทรศัพท์
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 shrink-0">
                  <svg
                    className="w-5 h-3.5 shrink-0"
                    viewBox="0 0 900 600"
                  >
                    <rect width="900" height="600" fill="#A51931" />
                    <rect
                      y="100"
                      width="900"
                      height="400"
                      fill="#F4F5F8"
                    />
                    <rect
                      y="200"
                      width="900"
                      height="200"
                      fill="#2D2A4A"
                    />
                  </svg>
                  <span className="text-text-secondary">+66</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เบอร์โทรศัพท์ (ไม่บังคับ)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {password.length > 0 && password.length < 8 && (
                <p className="text-xs text-orange mt-1">
                  ต้องมีอย่างน้อย 8 ตัวอักษร
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ใส่รหัสผ่านอีกครั้ง"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
              />
              {confirmPassword.length > 0 &&
                password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    รหัสผ่านไม่ตรงกัน
                  </p>
                )}
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-navy focus:ring-blue-accent"
              />
              <span className="text-xs text-text-secondary leading-relaxed">
                ข้าพเจ้ายอมรับ{" "}
                <button
                  type="button"
                  className="text-blue-accent underline"
                >
                  ข้อกำหนดและเงื่อนไข
                </button>{" "}
                และ{" "}
                <button
                  type="button"
                  className="text-blue-accent underline"
                >
                  นโยบายความเป็นส่วนตัว
                </button>{" "}
                ของ SportGear
              </span>
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-navy-dark disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <span className="text-sm text-text-secondary">
              มีบัญชีอยู่แล้ว?{" "}
            </span>
            <Link
              href="/login"
              className="text-sm text-blue-accent hover:underline font-medium"
            >
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-8">
            <p className="text-sm font-bold text-navy mb-3">
              สิทธิประโยชน์สำหรับสมาชิก
            </p>
            <div className="space-y-2">
              {[
                "สมัครสมาชิกฟรี ไม่มีค่าใช้จ่าย",
                "ข้อเสนอและคูปองสุดพิเศษเฉพาะสมาชิก",
                "คืนสินค้าได้ฟรี ภายใน 2 ปีนับตั้งแต่วันที่ซื้อสินค้า",
                "ติดตามคำสั่งซื้อและประวัติการซื้อได้ง่าย",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-text-secondary">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 900 600">
                <rect width="900" height="600" fill="#A51931" />
                <rect y="100" width="900" height="400" fill="#F4F5F8" />
                <rect y="200" width="900" height="200" fill="#2D2A4A" />
              </svg>
              <span className="text-sm text-text-secondary">ไทย (ไทย)</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
