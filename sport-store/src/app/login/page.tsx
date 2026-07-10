"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, CheckCircle2, ChevronDown } from "lucide-react";

type LoginTab = "email" | "phone";

export default function LoginPage() {
  const [tab, setTab] = useState<LoginTab>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center relative">
          <Link
            href="/"
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
          <h1 className="text-2xl font-bold text-navy mb-6">
            เข้าสู่ระบบ
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setTab("email")}
              className={`px-6 pb-3 text-sm font-medium text-center transition-colors ${
                tab === "email"
                  ? "text-navy border-b-2 border-navy"
                  : "text-text-secondary hover:text-navy"
              }`}
            >
              อีเมล
            </button>
            <button
              onClick={() => setTab("phone")}
              className={`px-6 pb-3 text-sm font-medium text-center transition-colors ${
                tab === "phone"
                  ? "text-navy border-b-2 border-navy"
                  : "text-text-secondary hover:text-navy"
              }`}
            >
              เบอร์โทรศัพท์
            </button>
          </div>

          {/* Form */}
          {tab === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  ใส่อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="อีเมล"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
                />
              </div>
              <button className="w-full bg-navy hover:bg-navy-dark text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                ถัดไป
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  ใส่เบอร์โทรศัพท์
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 shrink-0">
                    <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 900 600">
                      <rect width="900" height="600" fill="#A51931" />
                      <rect y="100" width="900" height="400" fill="#F4F5F8" />
                      <rect y="200" width="900" height="200" fill="#2D2A4A" />
                    </svg>
                    <span className="text-text-secondary">+66</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เบอร์โทรศัพท์"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent"
                  />
                </div>
              </div>
              <button className="w-full bg-navy hover:bg-navy-dark text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                ถัดไป
              </button>
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mt-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              <span className="text-text-primary font-medium">ดำเนินการต่อด้วย Facebook</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#06C755"
                  d="M12 2C6.48 2 2 5.82 2 10.5c0 3.57 2.84 6.65 6.96 7.73-.1.87-.55 3.26-.58 3.44 0 0-.01.1.05.14.06.04.13.02.13.02.18-.03 2.1-1.39 3.05-2.04.77.11 1.57.17 2.39.17 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"
                />
              </svg>
              <span className="text-text-primary font-medium">ดำเนินการต่อด้วย Line</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-text-primary font-medium">ดำเนินการต่อด้วย Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.65-2.2.46-3.06-.4C3.79 16.17 4.36 9.03 8.93 8.78c1.28.07 2.17.74 2.92.78 1.11-.22 2.17-.87 3.36-.79 1.43.12 2.5.66 3.22 1.67-2.96 1.77-2.26 5.65.48 6.73-.57 1.49-1.31 2.96-2.86 4.11zM12.03 8.7c-.15-2.34 1.79-4.3 3.97-4.5.29 2.72-2.46 4.74-3.97 4.5z"
                />
              </svg>
              <span className="text-text-primary font-medium">ดำเนินการต่อด้วย Apple</span>
            </button>
          </div>

          {/* Register Section */}
          <div className="mt-8">
            <h2 className="text-sm font-bold text-navy mb-1">สมัครสมาชิกกับเรา</h2>
            <Link
              href="/register"
              className="text-sm text-blue-accent hover:underline font-medium"
            >
              สร้างบัญชี
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-8">
            <p className="text-sm font-bold text-navy mb-3">
              ใช้งานได้ง่ายขึ้นเมื่อคุณเข้าสู่ระบบ
            </p>
            <div className="space-y-2">
              {[
                "สมัครสมาชิกฟรี",
                "ข้อเสนอและคูปองสุดพิเศษเฉพาะสมาชิก",
                "คืนสินค้าได้ฟรี ภายใน 2 ปีนับตั้งแต่วันที่ซื้อสินค้า",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-text-secondary">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <button className="hover:text-navy transition-colors font-medium">ความช่วยเหลือ</button>
              <button className="hover:text-navy transition-colors font-medium">นโยบายความเป็นส่วนตัว</button>
            </div>

            <div className="flex items-center gap-1.5 mt-4">
              <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 900 600">
                <rect width="900" height="600" fill="#A51931" />
                <rect y="100" width="900" height="400" fill="#F4F5F8" />
                <rect y="200" width="900" height="200" fill="#2D2A4A" />
              </svg>
              <span className="text-sm text-text-secondary">ไทย (ไทย)</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </div>

            <p className="text-[10px] text-text-secondary mt-4 leading-relaxed">
              ไซต์นี้ได้รับการคุ้มครองโดย reCaptcha{" "}
              <button className="underline">นโยบายความเป็นส่วนตัวของ Google</button>{" "}
              ได้ดำเนินการ กับ{" "}
              <button className="underline">ข้อตกลงในการใช้บริการของเราแล้ว</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
