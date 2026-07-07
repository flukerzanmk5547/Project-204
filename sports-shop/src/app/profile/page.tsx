'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './profile.module.css';
// 🎯 ดึงข้อมูลสินค้าจากไฟล์คลังกลางจุดเดียว
import { ALL_PRODUCTS } from '../data/products';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  memberLevel?: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [favIds, setFavIds] = useState<number[]>([]);
  
  // States สำหรับโหมดแก้ไขข้อมูล
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAvatar, setEditAvatar] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setEditName(parsedUser.name || '');
      setEditPhone(parsedUser.phone || ''); 
      setEditAddress(parsedUser.address || '');
      setEditAvatar(parsedUser.avatar || ''); 

      const storedFavs = localStorage.getItem(`wishlist_${parsedUser.email}`);
      if (storedFavs) {
        setFavIds(JSON.parse(storedFavs));
      } else {
        setFavIds([]);
      }
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const trimmed = input.substring(0, 10);
    
    let formatted = trimmed;
    if (trimmed.length > 3 && trimmed.length <= 6) {
      formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else if (trimmed.length > 6) {
      formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
    }
    
    setEditPhone(formatted);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name: editName,
      phone: editPhone,
      address: editAddress,
      avatar: editAvatar 
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const allUsersData = localStorage.getItem('allUsers');
    if (allUsersData) {
      const usersList = JSON.parse(allUsersData);
      
      const updatedUsersList = usersList.map((user: any) => {
        if (user.email === currentUser.email) {
          return {
            ...user,
            name: editName,
            phone: editPhone,
            address: editAddress,
            avatar: editAvatar 
          };
        }
        return user;
      });

      localStorage.setItem('allUsers', JSON.stringify(updatedUsersList));
    }

    setIsEditing(false);
  };

  // 🎯 กรองสินค้าอัตโนมัติจากไฟล์ข้อมูลกลาง โดยเทียบกับ ID ที่ผู้ใช้กดไลก์ไว้
  const favoriteProducts = ALL_PRODUCTS.filter(p => favIds.includes(p.id));

  return (
    <div className={styles.container}>
      <header className={styles.miniNavbar}>
        <span className={styles.shopName}>SPORTS SHOP</span>
        <Link href="/" className={styles.backLink}>← กลับหน้าแรก</Link>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>👤 โปรไฟล์ของฉัน</h1>
        
        {currentUser ? (
          <div className={styles.infoBox}>
            {!isEditing ? (
              <div className={styles.profileView}>
                <div className={styles.avatarCircle}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className={styles.avatarImage} />
                  ) : (
                    <span style={{ fontSize: '3.5rem' }}>🏃‍♂️</span> 
                  )}
                </div>
                <div className={styles.profileDetails}>
                  <p><strong>ชื่อผู้ใช้งาน:</strong> <span className={styles.highlightText}>{currentUser.name}</span></p>
                  <p><strong>อีเมลบัญชี:</strong> {currentUser.email}</p>
                  <p><strong>เบอร์โทรศัพท์:</strong> {currentUser.phone || 'ยังไม่มีข้อมูลเบอร์โทรศัพท์ 📞'}</p>
                  <p><strong>ที่อยู่จัดส่ง:</strong> {currentUser.address || 'ยังไม่มีข้อมูลที่อยู่จัดส่ง 🏠'}</p>
                  <p><strong>ระดับสมาชิก:</strong> {currentUser.memberLevel || 'ยังไม่มีระดับสมาชิก 🏅'}</p>
                  <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>⚙️ แก้ไขข้อมูลโปรไฟล์</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                <h3>🛠️ แก้ไขข้อมูลส่วนตัว</h3>
                
                <div className={styles.inputGroup}>
                  <label>รูปโปรไฟล์ของฉัน (Custom)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <div className={styles.avatarCircleSmall}>
                      {editAvatar ? (
                        <img src={editAvatar} alt="Preview" className={styles.avatarImage} />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>📸</span>
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className={styles.fileInput}
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload" className={styles.fileInputLabel}>
                        เลือกรูปภาพใหม่
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>ชื่อ - นามสกุล</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>

                <div className={styles.inputGroup}>
                  <label>เบอร์โทรศัพท์</label>
                  <input 
                    type="text" 
                    placeholder="เช่น 099-999-9999" 
                    value={editPhone} 
                    onChange={handlePhoneChange} 
                    maxLength={12} 
                    required 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>ที่อยู่ปัจจุบัน</label>
                  <textarea rows={3} placeholder="กรอกที่อยู่จัดส่ง" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
                </div>

                <div className={styles.btnFormGroup}>
                  <button type="submit" className={styles.btnSave}>💾 บันทึกข้อมูล</button>
                  <button type="button" className={styles.btnCancel} onClick={() => setIsEditing(false)}>ยกเลิก</button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.errorBox}>ยังไม่ได้เข้าสู่ระบบ กรุณากลับไปล็อกอินก่อนน้า</div>
        )}

        <h2 className={styles.subTitle}>❤️ สินค้าที่ฉันถูกใจ ({favoriteProducts.length})</h2>
        
        {favoriteProducts.length > 0 ? (
          <div className={styles.grid}>
            {favoriteProducts.map(product => (
              <div key={product.id} className={styles.card}>
                <div className={styles.cardImage}>
                  {product.image && product.image.startsWith('http') ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      onError={(e) => {
                        // ถ้าโหลดรูปภาพไม่ขึ้น (เช่น URL เสีย หรือไม่มีเน็ต) ให้ซ่อนรูปนี้และสลับไปแสดงอิโมจิแทนทันที
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  ) : null}
                  
                  {/* กล่องแสดงอิโมจิสำรอง (จะทำงานเมื่อไม่มี Link รูป หรือรูปโหลดไม่ขึ้น) */}
                  <span 
                    style={{ 
                      display: (product.image && product.image.startsWith('http')) ? 'none' : 'flex', 
                      fontSize: '2.5rem', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%' 
                    }}
                  >
                    {product.displayImg || "👕"}
                  </span>
                </div>
                <span className={styles.cardCategory}>{product.category}</span>
                <h4 className={styles.cardName}>{product.name}</h4>
                <p className={styles.cardPrice}>{product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>ยังไม่มีสินค้าที่กดถูกใจไว้เลย ลองไปกดหัวใจดูน้า</p>
        )}
      </main>
    </div>
  );
}