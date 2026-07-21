"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { BackofficeProvider } from "@/components/backoffice/BackofficeContext";
import Sidebar from "@/components/backoffice/Sidebar";
import Topbar from "@/components/backoffice/Topbar";
import { useAuth } from "@/lib/AuthContext";

const LOGIN_PATH = "/backoffice/login";

function AccessDenied({ reason }: { reason: "guest" | "role" }) {
  return (
    <div className="bo-root grid min-h-screen place-items-center px-4">
      <div className="bo-panel w-full max-w-md p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
          <ShieldAlert size={30} />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-[#0b1f3f]">
          ไม่มีสิทธิ์เข้าถึง
        </h1>
        <p className="mt-2 text-sm text-[#64748b]">
          {reason === "guest"
            ? "กรุณาเข้าสู่ระบบด้วยบัญชีที่มีสิทธิ์ผู้ขาย (Reseller) หรือผู้ดูแลระบบ (Manager)"
            : "บัญชีของคุณไม่มีสิทธิ์เข้าถึงระบบจัดการหลังบ้าน หากต้องการสิทธิ์ กรุณาติดต่อผู้ดูแลระบบ"}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={LOGIN_PATH}
            className="bo-btn-gold rounded-lg px-5 py-2.5 text-sm font-bold"
          >
            เข้าสู่ระบบพนักงาน
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-[#e4e9f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#2d6be7]"
          >
            กลับหน้าร้าน
          </Link>
        </div>
      </div>
    </div>
  );
}

function BackofficeGuard({ children }: { children: React.ReactNode }) {
  const { loading, isLoggedIn, isReseller } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === LOGIN_PATH;

  // เด้ง guest ไปหน้า login พนักงาน
  useEffect(() => {
    if (!loading && !isLoggedIn && !isLoginPage) {
      router.replace(LOGIN_PATH);
    }
  }, [loading, isLoggedIn, isLoginPage, router]);

  // หน้า login มี layout เต็มจอของตัวเอง ไม่ต้องผ่าน guard / sidebar
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="bo-root grid min-h-screen place-items-center">
        <Loader2 size={30} className="animate-spin text-[#3d7bf7]" />
      </div>
    );
  }

  if (!isLoggedIn) return <AccessDenied reason="guest" />;
  // isReseller = reseller ขึ้นไป (รวม manager)
  if (!isReseller) return <AccessDenied reason="role" />;

  return (
    <div className="bo-root min-h-screen">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="bo-scroll mx-auto max-w-[1700px] px-4 pb-6 pt-[calc(4rem+1.5rem)] sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackofficeProvider>
      <BackofficeGuard>{children}</BackofficeGuard>
    </BackofficeProvider>
  );
}
