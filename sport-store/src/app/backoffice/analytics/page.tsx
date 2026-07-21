"use client";

import Icon3D from "@/components/backoffice/Icon3D";
import BehaviorAnalytics from "@/components/backoffice/BehaviorAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Icon3D name="analytics" size={28} />
        <h1 className="text-xl font-bold text-[#1e293b]">
          วิเคราะห์พฤติกรรมลูกค้า
        </h1>
      </div>
      <BehaviorAnalytics />
    </div>
  );
}
