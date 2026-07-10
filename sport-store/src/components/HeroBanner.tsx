"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { getBanners } from "@/lib/api";

interface Slide {
  id: number | string;
  image: string;
  title: string;
  hashtag: string;
  cta: string;
  link?: string;
}

const fallbackSlides: Slide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&h=600&fit=crop",
    title: "ENJOY\nTHE RAIN",
    hashtag: "#พร้อมลุยป่าหน้าฝน",
    cta: "ค้นหาเพิ่มเติม",
    link: "/category/sports/outdoor",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&h=600&fit=crop",
    title: "TRAIN\nHARDER",
    hashtag: "#ออกกำลังกายให้สุด",
    cta: "ช้อปเลย",
    link: "/category/sports/fitness",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&h=600&fit=crop",
    title: "DIVE\nINTO SUMMER",
    hashtag: "#ว่ายน้ำสนุกหน้าร้อน",
    cta: "ดูสินค้า",
    link: "/category/sports/water-sports",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&h=600&fit=crop",
    title: "RIDE\nTHE WAVE",
    hashtag: "#ปั่นจักรยานท่องเที่ยว",
    cta: "สำรวจเพิ่มเติม",
    link: "/category/sports/cycling",
  },
  {
    id: 5,
    image: "https://picsum.photos/id/29/1600/600",
    title: "RUN\nYOUR WAY",
    hashtag: "#วิ่งเปลี่ยนชีวิต",
    cta: "เริ่มต้นเลย",
    link: "/category/sports/running-walking",
  },
];

export default function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    getBanners("hero")
      .then((banners) => {
        if (banners.length > 0) {
          setSlides(
            banners.map((b) => ({
              id: b.id,
              image: b.image,
              title: b.title,
              hashtag: b.hashtag ?? "",
              cta: b.cta ?? "ค้นหาเพิ่มเติม",
              link: b.link ?? undefined,
            }))
          );
          setCurrent(0);
        }
      })
      .catch(() => {
        /* ใช้ fallback ถ้า API ล่ม */
      });
  }, []);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      let target = index;
      if (target < 0) target = slides.length - 1;
      if (target >= slides.length) target = 0;
      setCurrent(target);
    },
    [slides.length]
  );

  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartTime.current = Date.now();
    setIsAutoPlaying(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const containerWidth = containerRef.current?.offsetWidth || 1;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragOffset) / elapsed;

    const threshold = containerWidth * 0.15;
    const isSwipe = Math.abs(dragOffset) > threshold || velocity > 0.5;

    if (isSwipe) {
      if (dragOffset < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setDragOffset(0);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handleDragEnd();

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  const getSlideTransform = () => {
    const slideWidthPct = 100 / slides.length;
    const base = -current * slideWidthPct;
    if (isDragging && containerRef.current) {
      const pxToPct =
        (dragOffset / containerRef.current.offsetWidth) * slideWidthPct;
      return `translateX(${base + pxToPct}%)`;
    }
    return `translateX(${base}%)`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden group select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Slides Track */}
      <div
        className={`flex h-full ${
          isDragging ? "" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          width: `${slides.length * 100}%`,
          transform: getSlideTransform(),
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative h-full shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 flex flex-col justify-center">
              <div className="max-w-xl font-[family-name:var(--font-noto-thai)]">
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight whitespace-pre-line drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4 drop-shadow-md">
                  {slide.hashtag}
                </p>
                <Link
                  href={slide.link ?? "#"}
                  className="inline-block mt-6 bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-3 rounded-full text-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          pauseAutoPlay();
          prevSlide();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        aria-label="ก่อนหน้า"
      >
        <ChevronLeft size={22} className="text-navy" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          pauseAutoPlay();
          nextSlide();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        aria-label="ถัดไป"
      >
        <ChevronRight size={22} className="text-navy" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              pauseAutoPlay();
              goTo(index);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current
                ? "bg-white scale-125 shadow-md"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`สไลด์ ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
