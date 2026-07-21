"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const TH_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
const TH_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];
const TH_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const atMidnight = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => {
  const r = atMidnight(d);
  r.setDate(r.getDate() + n);
  return r;
};
const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getTime() === b.getTime();
const shortLabel = (d: Date) =>
  `${d.getDate()} ${TH_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export default function DateRangePicker({
  onChange,
}: {
  onChange?: (range: DateRange) => void;
}) {
  const today = atMidnight(new Date());
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({ start: today, end: today });
  const [view, setView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = useMemo(() => {
    if (!range.start) return "เลือกช่วงเวลา";
    if (!range.end || sameDay(range.start, range.end))
      return shortLabel(range.start);
    return `${range.start.getDate()} ${TH_MONTHS_SHORT[range.start.getMonth()]} – ${shortLabel(range.end)}`;
  }, [range]);

  const commit = (r: DateRange) => {
    setRange(r);
    onChange?.(r);
  };

  const handleSelect = (d: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: d, end: null });
    } else if (d < range.start) {
      setRange({ start: d, end: null });
    } else {
      commit({ start: range.start, end: d });
    }
  };

  const applyPreset = (r: DateRange) => {
    commit(r);
    if (r.start) setView(new Date(r.start.getFullYear(), r.start.getMonth(), 1));
    setOpen(false);
  };

  const presets: { label: string; range: DateRange }[] = [
    { label: "วันนี้", range: { start: today, end: today } },
    { label: "เมื่อวาน", range: { start: addDays(today, -1), end: addDays(today, -1) } },
    { label: "7 วันล่าสุด", range: { start: addDays(today, -6), end: today } },
    { label: "30 วันล่าสุด", range: { start: addDays(today, -29), end: today } },
    {
      label: "เดือนนี้",
      range: {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      },
    },
    {
      label: "เดือนก่อน",
      range: {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      },
    },
  ];

  // build calendar grid
  const firstDow = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1),
    ),
  ];

  const inRange = (d: Date) =>
    range.start && range.end && d >= range.start && d <= range.end;

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-[#334155] shadow-sm transition ${
          open ? "border-[#3d7bf7]" : "border-[#e4e9f2] hover:border-[#3d7bf7]/50"
        }`}
      >
        <CalendarDays size={14} className="text-[#3d7bf7]" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 flex w-[300px] flex-col overflow-hidden rounded-xl border border-[#e4e9f2] bg-white shadow-xl sm:w-[440px] sm:flex-row">
          {/* presets */}
          <div className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-[#eef2f7] bg-[#f7f9fd] p-2 sm:w-[130px] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.range)}
                className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-medium text-[#475569] transition hover:bg-[#eaf1fe] hover:text-[#2159c4]"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* calendar */}
          <div className="flex-1 p-3">
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
                }
                className="grid h-7 w-7 place-items-center rounded-lg text-[#64748b] transition hover:bg-[#eef3fb]"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-[#0b1f3f]">
                {TH_MONTHS[view.getMonth()]} {view.getFullYear()}
              </span>
              <button
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
                }
                className="grid h-7 w-7 place-items-center rounded-lg text-[#64748b] transition hover:bg-[#eef3fb]"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {TH_DOW.map((d) => (
                <span
                  key={d}
                  className="grid h-8 place-items-center text-[11px] font-semibold text-[#94a3b8]"
                >
                  {d}
                </span>
              ))}
              {cells.map((d, i) => {
                if (!d) return <span key={i} />;
                const isStart = sameDay(d, range.start);
                const isEnd = sameDay(d, range.end);
                const isEndpoint = isStart || isEnd;
                const between = inRange(d) && !isEndpoint;
                const isToday = sameDay(d, today);
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(d)}
                    className={`grid h-8 place-items-center rounded-lg text-xs transition ${
                      isEndpoint
                        ? "bg-[#3d7bf7] font-bold text-white"
                        : between
                          ? "bg-[#eaf1fe] text-[#2159c4]"
                          : "text-[#334155] hover:bg-[#eef3fb]"
                    } ${isToday && !isEndpoint ? "ring-1 ring-[#3d7bf7]/40" : ""}`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex justify-end gap-2 border-t border-[#eef2f7] pt-3">
              <button
                onClick={() => applyPreset({ start: today, end: today })}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#64748b] hover:text-[#2d6be7]"
              >
                รีเซ็ต
              </button>
              <button
                onClick={() => {
                  if (range.start && !range.end)
                    commit({ start: range.start, end: range.start });
                  setOpen(false);
                }}
                className="bo-btn-gold rounded-lg px-4 py-1.5 text-xs font-bold"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
