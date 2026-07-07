'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './products.module.css';
// 🎯 ดึงข้อมูลสินค้าจากไฟล์คลังกลางจุดเดียว
import { ALL_PRODUCTS, Product } from '../data/products';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      
      const storedFavs = localStorage.getItem(`wishlist_${parsedUser.email}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    }

    const initialColors: { [key: number]: string } = {};
    ALL_PRODUCTS.forEach(p => {
      initialColors[p.id] = p.colors[0];
    });
    setSelectedColors(initialColors);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.href = '/';
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

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้านะคะ!');
      return;
    }

    const color = selectedColors[product.id];
    const cartKey = `cart_${currentUser.email}`;
    const storedCart = localStorage.getItem(cartKey);
    let currentCart = storedCart ? JSON.parse(storedCart) : [];

    const existingIndex = currentCart.findIndex(
      (item: any) => item.id === product.id && item.color === color
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        displayPrice: product.displayPrice,
        image: product.image,
        displayImg: product.displayImg,
        color: color,
        quantity: 1
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    alert(`เพิ่ม ${product.name} (สี: ${color}) ลงตะกร้าเรียบร้อยแล้วจ้า! 🛒`);
  };

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ทั้งหมด', 'รองเท้าวิ่ง', 'เสื้อผ้ากีฬา', 'ไม้แบดมินตัน', 'อุปกรณ์กีฬา', 'อุปกรณ์เสริม'];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div>
          <span className={styles.shopName}>SPORTS SHOP</span>
        </div>
        <div className={styles.navLinks} style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">หน้าแรก</Link>
          <Link href="/products" className={styles.navLinkActive}>สินค้าทั้งหมด</Link>
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

      <main className={styles.mainContent}>
        <section className={styles.filterSection}>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้าอุปกรณ์กีฬา..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.categoryContainer}>
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? styles.catBtnActive : styles.catBtn}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                </div>

                <div className={styles.cardBody} style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
                  
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

                  <span className={styles.productCategory}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  
                  <div className={styles.metaInfoRow}>
                    <span className={styles.rating}>⭐ {product.rating}</span>
                    <span className={product.stock > 10 ? styles.inStock : styles.lowStock}>
                      คลัง: {product.stock} ชิ้น
                    </span>
                  </div>

                  <div className={styles.colorSection} style={{ justifyContent: 'center' }}>
                    <span className={styles.colorLabel}>ตัวเลือกสี:</span>
                    <div className={styles.colorPicker}>
                      {product.colors.map(color => (
                        <button
                          key={color}
                          className={selectedColors[product.id] === color ? styles.colorDotActive : styles.colorDot}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColors({ ...selectedColors, [product.id]: color })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.productPrice}>{product.price}</span>
                    <button className={styles.addToCartBtn} onClick={() => handleAddToCart(product)}>
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProducts}>ไม่พบสินค้าอุปกรณ์กีฬาที่ตรงกับเงื่อนไขการค้นหาของคุณครับ</div>
          )}
        </section>
      </main>
    </div>
  );
}