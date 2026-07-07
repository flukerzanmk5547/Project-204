'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import styles from './page.module.css'; 
// 🎯 เชื่อมต่อกับไฟล์คลังข้อมูลกลางเพื่อให้แสดงรูปภาพและข้อมูลชุดเดียวกัน
import { ALL_PRODUCTS, Product } from './data/products';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string; 
}

export default function HomePage() {
  const backgroundImages = [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      
      const storedFavs = localStorage.getItem(`wishlist_${parsedUser.email}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      } else {
        setFavorites([]);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.reload(); 
  };

  const toggleFavorite = (productId: number) => {
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนกดถูกใจสินค้านะคะ!');
      return;
    }

    let updatedFavs = [...favorites];
    if (favorites.includes(productId)) {
      updatedFavs = updatedFavs.filter(id => id !== productId);
    } else {
      updatedFavs.push(productId);
    }
    setFavorites(updatedFavs);
    localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updatedFavs));
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div>
          <span className={styles.shopName}>SPORTS SHOP</span>
        </div>
        <div className={styles.navLinks} style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">หน้าแรก</Link>
          <Link href="/products">สินค้าทั้งหมด</Link>
          <Link href="/cart">ตะกร้าสินค้า</Link>
          
          {currentUser ? (
            <div 
              className={styles.profileDropdownContainer}
              onMouseEnter={() => setIsDropdownOpen(true)}  
              onMouseLeave={() => setIsDropdownOpen(false)} 
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#00A3E0', 
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '1.5px solid #ffffff',
                  userSelect: 'none',
                  overflow: 'hidden' 
                }}>
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="Nav Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase() 
                  )}
                </div>
                <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '0.95rem' }}>
                  {currentUser.name}
                </span>
              </div>

              <div 
                className={styles.dropdownMenu} 
                style={{ display: isDropdownOpen ? 'flex' : 'none' }}
              >
                <div className={styles.dropdownTriangle}></div>
                <Link href="/profile" className={styles.dropdownLink}>โปรไฟล์ของฉัน</Link>
                <Link href="/address" className={styles.dropdownLink}>ที่อยู่ของฉัน</Link>
                <Link href="/orders" className={styles.dropdownLink}>ประวัติการสั่งซื้อ</Link>
                <hr className={styles.dropdownDivider} />
                <div onClick={handleLogout} className={styles.logoutButton}>ออกจากระบบ</div>
              </div>
            </div>
          ) : (
            <Link href="/login">เข้าสู่ระบบ</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>WELCOME TO SPORTS SHOP</h1>
          <p>ศูนย์รวมอุปกรณ์กีฬาและเสื้อผ้าแบรนด์แท้ระดับพรีเมียมคัดสรรเพื่อคุณ</p>
          <Link href="/products">
            <button className={styles.btnPrimary}>เลือกชมสินค้าเลย</button>
          </Link>
        </div>
      </header>

      {/* สินค้าแนะนำ */}
      <main className={styles.mainContent}>
        <h2 className={styles.sectionTitle}>🔥 สินค้าแนะนำยอดฮิต</h2>
        
        <div className={styles.grid}>
          {ALL_PRODUCTS.map((product: Product) => (
            <div key={product.id} className={styles.card} style={{ position: 'relative' }}>
              <button 
                onClick={() => toggleFavorite(product.id)}
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: '#ffffff', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px', display: 'flex', justifyContent: 'center',
                  alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: '1.1rem', zIndex: 10, transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {favorites.includes(product.id) ? '❤️' : '🖤'}
              </button>

              {/* 🎯 [จุดแก้ไข]: เปลี่ยนมาใช้กล่องดึงรูปภาพ และดัก Error ล้างปัญหาหน้าจอโล่ง/อิโมจิไม่เข้าพวก */}
              <div className={styles.cardImage}>
                {product.image && product.image.startsWith('http') ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                <span 
                  style={{ 
                    display: (product.image && product.image.startsWith('http')) ? 'none' : 'flex' 
                  }}
                  className={styles.fallbackEmoji}
                >
                </span>
              </div>

              <span className={styles.cardCategory}>{product.category}</span>
              <h3 className={styles.cardName}>{product.name}</h3>
              {/* เติมส่วนคำอธิบายสินค้าสั้น ๆ ให้การ์ดดูมีสไตล์ขึ้น */}
              <p className={styles.cardDescription}>{product.description}</p>
              <p className={styles.cardPrice}>{product.price}</p>
              <button className={styles.btnSecondary}>ดูรายละเอียดสินค้า</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}