"use client";

import { ChevronLeft, X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export interface CartProduct {
  id: string | number;
  image: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: CartProduct | null;
}

const sizes = [
  { label: "ไซส์เดียว", available: true },
];

export default function CartPanel({ isOpen, onClose, product }: CartPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("ไซส์เดียว");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuantity(1);
      setAdded(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  const discountPercent =
    product.originalPrice && product.discount
      ? product.discount
      : product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const content = (
    <>
      {added ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-navy">เพิ่มในตะกร้าแล้ว!</h3>
          <p className="text-sm text-text-secondary text-center">
            {product.name}
          </p>
        </div>
      ) : (
        <>
          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-navy">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-text-secondary line-through">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-0.5">
                {product.brand}
              </p>
              <p className="text-sm text-text-primary leading-snug line-clamp-2">
                {product.name}
              </p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-text-primary">ขนาด</span>
              <button className="text-sm text-blue-accent hover:underline">
                ค้นหาไซส์ของฉัน
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`flex items-center justify-between w-full px-4 py-3.5 transition-colors ${
                    selectedSize === size.label
                      ? "bg-white border-blue-accent"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium text-text-primary">
                    {size.label}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    มีสินค้า
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <span className="text-sm font-bold text-text-primary mb-3 block">
              จำนวน
            </span>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 border-2 border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus
                  size={18}
                  className={quantity <= 1 ? "text-gray-300" : "text-navy"}
                />
              </button>
              <div className="w-14 h-12 border-y-2 border-gray-300 flex items-center justify-center">
                <span className="text-base font-semibold text-navy">
                  {quantity}
                </span>
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 border-2 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} className="text-navy" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Desktop: Slide-in panel from right */}
      <div
        className={`hidden sm:block fixed top-0 right-0 h-full w-[420px] bg-white z-70 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={22} className="text-navy" />
          </button>
          <h2 className="text-base font-bold text-navy">
            ยืนยันรายละเอียดสินค้า
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {content}
          </div>

          {/* Add to Cart Button */}
          {!added && (
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-blue-accent hover:bg-blue-hover text-white font-semibold rounded-lg transition-colors text-sm"
              >
                เพิ่มในตะกร้า
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Full screen */}
      <div
        className={`sm:hidden fixed inset-0 z-70 bg-white transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={22} className="text-navy" />
          </button>
          <h2 className="text-base font-bold text-navy">
            ยืนยันรายละเอียดสินค้า
          </h2>
          <button
            onClick={onClose}
            className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {content}
          </div>

          {/* Add to Cart Button */}
          {!added && (
            <div className="px-4 pb-6 pt-3 border-t border-gray-100 bg-white">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-blue-accent hover:bg-blue-hover text-white font-bold rounded-lg transition-colors text-base"
              >
                เพิ่มในตะกร้า
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
