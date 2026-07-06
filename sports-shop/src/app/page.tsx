'use client'; // บรรทัดนี้สำคัญมากนะเธอ เพราะเรามีการใช้กลไกเลื่อนภาพอัตโนมัติ

import { useState, useEffect } from 'react';

export default function HomePage() {
  // 1. รายภาพพื้นหลังเกี่ยวกับกีฬาที่จะเอามาสลับกัน (ดึงภาพสวย ๆ จาก Unsplash)
  const backgroundImages = [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1920&auto=format&fit=crop", // วิ่งลู่
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1920&auto=format&fit=crop", // ฟิตเนส/เทรนนิ่ง
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"  // อุปกรณ์และเส้นชัย
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 2. ตั้งเวลาให้รูปภาพเปลี่ยนสลับอัตโนมัติทุก ๆ 4 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000); // 4000 มิลลิวินาที = 4 วินาที

    return () => clearInterval(timer); // เคลียร์ตารางเวลาเมื่อปิดหน้าเว็บ
  }, [backgroundImages.length]);

  // จำลองข้อมูลสินค้าในร้าน
  const products = [
    { id: 1, name: "Pro Run Zoom X", category: "รองเท้าวิ่ง", price: "4,500 บาท", image: "👟" },
    { id: 2, name: "Aero Speed 100", category: "ไม้แบดมินตัน", price: "2,800 บาท", image: "🏸" },
    { id: 3, name: "Super Dry Fit Jersey", category: "เสื้อผ้ากีฬา", price: "990 บาท", image: "👕" }
  ];

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      margin: 0
    }}>
      {/* แถบเมนูด้านบน (Navbar) */}
      <nav style={{
        backgroundColor: '#002244',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '4px solid #00A3E0',
        position: 'relative',
        zIndex: 10
      }}>
        <div>
          <span style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            SPORTS SHOP
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '500' }}>หน้าแรก</a>
          <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>สินค้าทั้งหมด</a>
          <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>ติดต่อเรา</a>
        </div>
      </nav>

      {/* 🎬 ส่วนแบนเนอร์หน้าร้านที่มีพื้นหลังเลื่อนสลับกัน (Hero Section with Background Carousel) */}
      <header style={{
        position: 'relative',
        color: '#ffffff',
        padding: '8rem 2rem',
        textAlign: 'center',
        overflow: 'hidden',
        backgroundColor: '#002244' // สีพื้นฐานกรณีรูปยังโหลดไม่เสร็จ
      }}>
        {/* เลเยอร์รูปภาพพื้นหลังที่ทำ Effect Fade สลับกันอย่างนุ่มนวล */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out', // เอฟเฟกต์เฟดตอนเปลี่ยนรูป
          zIndex: 1
        }} />

        {/* แผ่นสีน้ำเงินเข้มโปร่งแสงมาครอบทับ (Overlay) เพื่อให้ตัวหนังสืออ่านง่ายขึ้นและคุมโทนร้าน */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 34, 68, 0.85) 0%, rgba(0, 51, 102, 0.85) 100%)',
          zIndex: 2
        }} />

        {/* เนื้อหาข้อความภายในแบนเนอร์ */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            WELCOME TO SPORTS SHOP
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '2.5rem', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            ศูนย์รวมอุปกรณ์กีฬาและเสื้อผ้าแบรนด์แท้ระดับพรีเมียมคัดสรรเพื่อคุณ
          </p>
          <button style={{
            backgroundColor: '#00A3E0',
            color: 'white',
            border: 'none',
            padding: '0.9rem 2.5rem',
            fontSize: '1.15rem',
            fontWeight: 'bold',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 163, 224, 0.5)',
            transition: 'transform 0.2s'
          }}>
            เลือกชมสินค้าเลย
          </button>
        </div>
      </header>

      {/* 📦 ส่วนแสดงสินค้าแนะนำ */}
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2.5rem', color: '#002244', fontWeight: 'bold' }}>
          🔥 สินค้าแนะนำยอดฮิต
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>{product.image}</div>
              <span style={{ fontSize: '0.85rem', color: '#00A3E0', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {product.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#002244', fontWeight: 'bold' }}>
                {product.name}
              </h3>
              <p style={{ fontSize: '1.2rem', color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>
                {product.price}
              </p>
              <button style={{
                width: '100%',
                backgroundColor: '#002244',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                ดูรายละเอียดสินค้า
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}