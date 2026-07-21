"use client";

import {
  Plus,
  QrCode,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Landmark,
} from "lucide-react";
import {
  Panel,
  PageTitle,
  GoldButton,
  GhostButton,
  StatusBadge,
} from "@/components/backoffice/ui";
import Icon3D from "@/components/backoffice/Icon3D";
import { boPaymentAccounts } from "@/lib/backofficeMock";

const bankColor: Record<string, string> = {
  SCB: "from-[#4e2a84] to-[#7b2ff7]",
  KBANK: "from-[#0a6640] to-[#13a05f]",
  GSB: "from-[#c0328c] to-[#e0559f]",
  KTB: "from-[#0a4ba0] to-[#1f7fe0]",
};

export default function PaymentAccountsPage() {
  return (
    <div>
      <PageTitle
        icon={<Icon3D name="payments" size={28} />}
        title="บัญชีรับเงิน"
        subtitle="จัดการบัญชีรับเงิน PromptPay และการเชื่อมต่อ LINE bot"
        action={
          <GoldButton>
            <Plus size={16} /> เพิ่มบัญชี
          </GoldButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {boPaymentAccounts.map((acc) => (
          <Panel key={acc.id} glow className="overflow-hidden">
            {/* card top like a treasure chest / bank card */}
            <div
              className={`relative flex items-center justify-between bg-gradient-to-br ${
                bankColor[acc.bank] ?? "from-[#e4e9f2] to-[#eef3fb]"
              } p-5`}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                  {acc.bank}
                </p>
                <h3 className="mt-0.5 font-cinzel text-lg font-bold text-white">
                  {acc.label}
                </h3>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
                <Landmark size={22} />
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-[#334155]">
                <QrCode size={16} className="text-[#2d6be7]" />
                <span className="font-mono tracking-wide">{acc.promptpay}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#eef2f7] pt-4">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#94a3b8]" />
                  <span className="text-xs text-[#64748b]">LINE Bot</span>
                  {acc.lineConnected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 size={14} /> เชื่อมแล้ว
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                      <XCircle size={14} /> ยังไม่เชื่อม
                    </span>
                  )}
                </div>
                <StatusBadge status={acc.active ? "active" : "inactive"} />
              </div>

              <div className="mt-4 flex gap-2">
                {!acc.lineConnected && (
                  <GoldButton size="sm" className="flex-1 justify-center">
                    <QrCode size={14} /> สแกนเชื่อม LINE
                  </GoldButton>
                )}
                <GhostButton className={acc.lineConnected ? "flex-1 justify-center" : ""}>
                  <Pencil size={14} /> แก้ไข
                </GhostButton>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-[#94a3b8] ring-1 ring-[#e4e9f2] transition hover:text-rose-400 hover:ring-rose-500/40">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
