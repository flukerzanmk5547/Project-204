// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // 🔥 ดึงระบบจัดการลิงก์ข้ามหน้าของ Next.js มาใช้
import styles from './page.module.css'; // 🔥 ดึงไฟล์ CSS ที่เราแยกไว้ตะกี้เข้ามา

export default function HomePage() {
  const backgroundImages = [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const products = [
    { id: 1, name: "Pro Run Zoom X", category: "รองเท้าวิ่ง", price: "4,500 บาท", image: "👟" },
    { id: 2, name: "Aero Speed 100", category: "ไม้แบดมินตัน", price: "2,800 บาท", image: "🏸" },
    { id: 3, name: "Super Dry Fit Jersey", category: "เสื้อผ้ากีฬา", price: "990 บาท", image: "👕" }
  ];

  return (
    <div className={styles.container}>
      {/* Navbar ส่วนบน */}
      <nav className={styles.navbar}>
        <div>
          <span className={styles.shopName}>SPORTS SHOP</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/">หน้าแรก</Link>
          <Link href="/products">สินค้าทั้งหมด</Link>
          <Link href="/cart">ตะกร้าสินค้า</Link>
          <Link href="/login">เข้าสู่ระบบ</Link>
        </div>
      </nav>

      {/* Hero Banner ภาพสไลด์ */}
      <header className={styles.hero}>
        <div 
          className={styles.heroBg} 
          style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }} 
        />
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <h1>WELCOME TO SPORTS SHOP</h1>
          <p>ศูนย์รวมอุปกรณ์กีฬาและเสื้อผ้าแบรนด์แท้ระดับพรีเมียมคัดสรรเพื่อคุณ</p>
          <Link href="/products">
            <button className={styles.btnPrimary}>เลือกชมสินค้าเลย</button>
          </Link>
        </div>
      </header>

      {/* โซนสินค้าแนะนำ */}
      <main className={styles.mainContent}>
        <h2 className={styles.sectionTitle}>🔥 สินค้าแนะนำยอดฮิต</h2>
        
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.cardImage}>{product.image}</div>
              <span className={styles.cardCategory}>{product.category}</span>
              <h3 className={styles.cardName}>{product.name}</h3>
              <p className={styles.cardPrice}>{product.price}</p>
              <button className={styles.btnSecondary}>ดูรายละเอียดสินค้า</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}