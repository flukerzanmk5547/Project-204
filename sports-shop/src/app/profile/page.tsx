'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './profile.module.css';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  memberLevel?: string; // เก็บระดับสมาชิกของลูกค้า
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [favIds, setFavIds] = useState<number[]>([]);
  
  // 📝 States สำหรับโหมดแก้ไขข้อมูล
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAvatar, setEditAvatar] = useState<string>('');

  const allProducts = [
    { id: 1, name: "Pro Run Zoom X", category: "รองเท้าวิ่ง", price: "4,500 บาท", image: "👟" },
    { id: 2, name: "Aero Speed 100", category: "ไม้แบดมินตัน", price: "2,800 บาท", image: "🏸" },
    { id: 3, name: "Super Dry Fit Jersey", category: "เสื้อผ้ากีฬา", price: "990 บาท", image: "👕" }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setEditName(parsedUser.name || '');
      setEditPhone(parsedUser.phone || ''); 
      setEditAddress(parsedUser.address || '');
      setEditAvatar(parsedUser.avatar || ''); 

      // 🎯 ดึงคีย์รายการหัวใจแยกรายบุคคลตามอีเมลไอดีของตนเอง
      const storedFavs = localStorage.getItem(`wishlist_${parsedUser.email}`);
      if (storedFavs) {
        setFavIds(JSON.parse(storedFavs));
      } else {
        setFavIds([]);
      }
    }
  }, []);

  // 📱 ฟังก์ชัน Auto Format จัดระเบียบเบอร์โทรศัพท์ตอนพิมพ์ (0XX-XXX-XXXX)
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

  // 📸 ฟังก์ชันแปลงไฟล์รูปภาพเป็น Base64
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

  // 💾 บันทึกข้อมูลลงเครื่องอัปเดตเข้าคลังหลัก (allUsers)
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

    // 1. บันทึกลงเซสชันกระเป๋าปัจจุบัน
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 🛠️ 2. วิ่งไปอัปเดตข้อมูลรูปภาพและเบอร์โทรกลับเข้าสู่คลังผู้ใช้รวม (allUsers) 
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

  const favoriteProducts = allProducts.filter(p => favIds.includes(p.id));

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
              /* 👀 โหมดแสดงผลปกติ */
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
                  {/* 🎯 [ปรับระดับสมาชิก]: ถ้าไม่มีข้อมูลยศ ให้แสดงว่ายังไม่มีระดับสมาชิกก่อนเลยจ้า */}
                  <p><strong>ระดับสมาชิก:</strong> {currentUser.memberLevel || 'ยังไม่มีระดับสมาชิก 🏅'}</p>
                  <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>⚙️ แก้ไขข้อมูลโปรไฟล์</button>
                </div>
              </div>
            ) : (
              /* 📝 โหมดแก้ไขพร้อมช่องอัปโหลดรูป */
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
                <div className={styles.cardImage}>{product.image}</div>
                <span className={styles.cardCategory}>{product.category}</span>
                <h4 className={styles.cardName}>{product.name}</h4>
                <p className={styles.cardPrice}>{product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>ยังไม่มีสินค้าที่กดถูกใจไว้เลย ลองไปกดหัวใจที่หน้าแรกดูน้าเธอ!</p>
        )}
      </main>
    </div>
  );
}