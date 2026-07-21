"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const ROLE_LEVEL: Record<string, number> = {
  customer: 0,
  reseller: 1,
  manager: 2,
  superadmin: 3,
};

export default function BackofficeLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("กรุณาระบุอีเมลที่ถูกต้อง");
      return;
    }
    if (password.length < 1) {
      setError("กรุณาระบุรหัสผ่าน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);
      const level = ROLE_LEVEL[user.role] ?? 0;

      if (level < 1) {
        // บัญชีลูกค้าธรรมดา — ไม่มีสิทธิ์เข้าหลังบ้าน
        await logout();
        setError(
          "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบจัดการหลังบ้าน กรุณาใช้บัญชีพนักงาน"
        );
        return;
      }

      router.push("/backoffice");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ";
      if (msg.includes("401") || msg.includes("ไม่ถูกต้อง")) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bo-root grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="bo-panel bo-panel-glow overflow-hidden">
          {/* หัวการ์ด — แถบน้ำเงินฟ้า + โลโก้ */}
          <div className="bo-bluebar flex h-20 items-center justify-center px-6">
            <Image
              src="/sportgear-logo.png"
              alt="SportGear"
              width={1514}
              height={300}
              priority
              className="h-auto w-[70%] max-w-[220px] object-contain"
            />
          </div>

          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#16233b]">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="อีเมลพนักงาน"
                  autoFocus
                  className="w-full rounded-lg border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm text-[#16233b] outline-none transition focus:border-[#3d7bf7] focus:ring-2 focus:ring-[#3d7bf7]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#16233b]">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="w-full rounded-lg border border-[#e4e9f2] bg-white px-4 py-2.5 pr-11 text-sm text-[#16233b] outline-none transition focus:border-[#3d7bf7] focus:ring-2 focus:ring-[#3d7bf7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-600 ring-1 ring-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bo-btn-gold flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#2d6be7]"
          >
            <ArrowLeft size={16} />
            กลับหน้าร้านค้า
          </Link>
        </div>
      </div>
    </div>
  );
}
