"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useAuth } from "@/lib/AuthContext";
import {
  authUpdateProfile,
  authChangeEmail,
  authChangePassword,
} from "@/lib/api";

type Toast = { type: "success" | "error"; message: string } | null;

export default function ProfileEditPage() {
  const { user, token, isLoggedIn, loading, updateUser } = useAuth();
  const router = useRouter();

  const [toast, setToast] = useState<Toast>(null);

  // Profile form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-blue-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!token) return;
    if (!fullName.trim()) {
      setToast({ type: "error", message: "กรุณาระบุชื่อ-นามสกุล" });
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await authUpdateProfile(token, {
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      updateUser(updated);
      setToast({ type: "success", message: "บันทึกข้อมูลส่วนตัวสำเร็จ" });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!token) return;
    if (!newEmail.trim() || !emailPassword) {
      setToast({ type: "error", message: "กรุณากรอกอีเมลใหม่และรหัสผ่าน" });
      return;
    }
    setSavingEmail(true);
    try {
      const updated = await authChangeEmail(token, newEmail.trim(), emailPassword);
      updateUser(updated);
      setNewEmail("");
      setEmailPassword("");
      setToast({ type: "success", message: "เปลี่ยนอีเมลสำเร็จ" });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
      });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    if (!currentPassword || !newPassword) {
      setToast({ type: "error", message: "กรุณากรอกรหัสผ่านให้ครบ" });
      return;
    }
    if (newPassword.length < 8) {
      setToast({ type: "error", message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "รหัสผ่านใหม่ไม่ตรงกัน" });
      return;
    }
    setSavingPassword(true);
    try {
      await authChangePassword(token, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ type: "success", message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-accent";
  const labelClass = "block text-xs font-medium text-text-secondary mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          บัญชีของฉัน
        </Link>

        <h1 className="text-2xl font-bold text-navy mb-6">แก้ไขข้อมูลส่วนตัว</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* คอลัมน์ซ้าย: ข้อมูลส่วนตัว + อีเมล */}
          <div className="space-y-6">
            {/* Personal info */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Icon
                  icon="fluent-emoji:identification-card"
                  width={30}
                  height={30}
                />
                <h2 className="text-base font-bold text-navy">ข้อมูลส่วนตัว</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className={labelClass}>เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-accent hover:bg-blue-hover disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {savingProfile ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  บันทึกข้อมูล
                </button>
              </div>
            </section>

            {/* Email */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Icon icon="fluent-emoji:e-mail" width={30} height={30} />
                <h2 className="text-base font-bold text-navy">อีเมล</h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                อีเมลปัจจุบัน:{" "}
                <span className="font-medium text-text-primary">
                  {user?.email}
                </span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>อีเมลใหม่</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={inputClass}
                    placeholder="อีเมลใหม่"
                  />
                </div>
                <div>
                  <label className={labelClass}>รหัสผ่านเพื่อยืนยัน</label>
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    className={inputClass}
                    placeholder="รหัสผ่านปัจจุบัน"
                  />
                </div>
                <button
                  onClick={handleChangeEmail}
                  disabled={savingEmail}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-accent hover:bg-blue-hover disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {savingEmail ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  เปลี่ยนอีเมล
                </button>
              </div>
            </section>
          </div>

          {/* คอลัมน์ขวา: เปลี่ยนรหัสผ่าน */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <Icon icon="fluent-emoji:locked-with-key" width={30} height={30} />
              <h2 className="text-base font-bold text-navy">เปลี่ยนรหัสผ่าน</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>รหัสผ่านปัจจุบัน</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    placeholder="รหัสผ่านปัจจุบัน"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>รหัสผ่านใหม่</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                />
              </div>
              <div>
                <label className={labelClass}>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-accent hover:bg-blue-hover disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {savingPassword ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <Footer />
      <FeedbackPanel />
    </div>
  );
}
