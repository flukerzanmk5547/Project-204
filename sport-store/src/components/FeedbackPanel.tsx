"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const ratingLabels = { low: "ไม่พอใจอย่างมาก", high: "พอใจอย่างมาก" };

const purposeOptions = [
  "ซื้อสินค้า",
  "ดูสินค้าใหม่",
  "เปรียบเทียบราคา",
  "หาข้อมูลสินค้า",
  "ติดตามคำสั่งซื้อ",
  "อื่นๆ",
];

interface FeedbackFormProps {
  rating: number | null;
  setRating: (v: number) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  achieved: string | null;
  setAchieved: (v: string) => void;
  submitted: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

function FeedbackForm({
  rating,
  setRating,
  purpose,
  setPurpose,
  achieved,
  setAchieved,
  submitted,
  onSubmit,
  onClose,
}: FeedbackFormProps) {
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-navy">ขอบคุณครับ!</h3>
        <p className="text-sm text-text-secondary text-center">
          ความคิดเห็นของคุณช่วยเราปรับปรุงบริการให้ดีขึ้น
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-bold text-navy mb-1">คุณคิดเห็นอย่างไร</h2>
      <p className="text-sm text-text-secondary mb-6">
        ความคิดเห็นของคุณช่วยเราในการปรับปรุงเว็บไซต์
      </p>

      {/* Rating */}
      <div className="mb-6">
        <p className="text-sm font-bold text-text-primary mb-3">
          โดยรวมแล้วคุณพอใจกับเว็บไซต์แค่ไหน? <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={`w-11 h-11 border-2 rounded-md text-base font-semibold transition-all ${
                rating === num
                  ? "border-blue-accent bg-blue-accent text-white scale-105"
                  : "border-gray-300 text-text-primary hover:border-blue-accent hover:text-blue-accent"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-text-secondary">
          <span>{ratingLabels.low}</span>
          <span>{ratingLabels.high}</span>
        </div>
      </div>

      {/* Purpose */}
      <div className="mb-6">
        <p className="text-sm font-bold text-text-primary mb-3">
          เป้าหมายในการใช้เว็บไซต์ของคุณในวันนี้คือ? <span className="text-red-500">*</span>
        </p>
        <div className="relative">
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full appearance-none border-2 border-gray-300 rounded-md px-4 py-3 text-sm text-text-primary focus:border-blue-accent focus:outline-none transition-colors bg-white"
          >
            <option value="" disabled></option>
            {purposeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Achieved Goal */}
      <div className="mb-8">
        <p className="text-sm font-bold text-text-primary mb-3">
          คุณได้บรรลุจุดประสงค์หลักในการเยี่ยมชมวันนี้หรือไม่? <span className="text-red-500">*</span>
        </p>
        <div className="border-2 border-gray-300 rounded-md overflow-hidden">
          {["ใช่", "ไม่"].map((option) => (
            <label
              key={option}
              onClick={() => setAchieved(option)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                achieved === option ? "bg-blue-50" : "hover:bg-gray-50"
              } ${option === "ใช่" ? "border-b-2 border-gray-300" : ""}`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  achieved === option ? "border-blue-accent" : "border-gray-400"
                }`}
              >
                {achieved === option && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-accent" />
                )}
              </div>
              <span className="text-sm text-text-primary">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 px-6 border-2 border-navy text-navy font-semibold rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          ปิด
        </button>
        <button
          onClick={onSubmit}
          disabled={!rating || !purpose || !achieved}
          className="flex-1 py-2.5 px-6 bg-blue-accent text-white font-semibold rounded-md hover:bg-blue-hover transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ส่ง
        </button>
      </div>

      <p className="text-center text-[10px] text-text-secondary mt-4">
        Powered by <span className="font-bold text-text-primary text-xs">SportGear</span>
      </p>
    </>
  );
}

export default function FeedbackPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [purpose, setPurpose] = useState("");
  const [achieved, setAchieved] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(null);
      setPurpose("");
      setAchieved(null);
    }, 2000);
  };

  const formProps: FeedbackFormProps = {
    rating,
    setRating,
    purpose,
    setPurpose,
    achieved,
    setAchieved,
    submitted,
    onSubmit: handleSubmit,
    onClose: () => setIsOpen(false),
  };

  return (
    <>
      {/* Trigger Tab - fixed on right edge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-accent hover:bg-blue-hover text-white text-xs font-semibold py-3 px-2 rounded-l-lg shadow-lg transition-all hover:pr-3"
        style={{ writingMode: "vertical-rl" }}
        aria-label="แบบสอบถามความคิดเห็น"
      >
        คุณคิดเห็นอย่างไร
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Desktop: Slide-in panel from right */}
      <div
        className={`hidden sm:block fixed top-0 right-0 h-full w-[420px] bg-white z-70 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <svg viewBox="0 0 200 30" className="h-6 w-auto fill-navy" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" letterSpacing="2">SPORTGEAR</text>
          </svg>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="ปิด">
            <X size={22} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-65px)] px-6 py-6">
          <FeedbackForm {...formProps} />
        </div>
      </div>

      {/* Mobile: Center modal popup */}
      <div
        className={`sm:hidden fixed inset-0 z-70 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-xl shadow-2xl w-full max-w-[380px] max-h-[85vh] overflow-y-auto transform transition-all duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          <div className="flex justify-center pt-6 pb-2">
            <svg viewBox="0 0 200 30" className="h-7 w-auto fill-navy" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" letterSpacing="2">SPORTGEAR</text>
            </svg>
          </div>
          <div className="px-5 pb-6">
            <FeedbackForm {...formProps} />
          </div>
        </div>
      </div>
    </>
  );
}
