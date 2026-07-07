'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './address.module.css';

interface AddressItem {
  id: string;
  type: 'home' | 'work';
  receiverName: string;
  receiverPhone: string;
  addressDetails: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  
  // States สำหรับการควบคุมฟอร์ม เพิ่ม/แก้ไข
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Field States ในฟอร์ม
  const [type, setType] = useState<'home' | 'work'>('home');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // 🎯 States ใหม่สำหรับควบคุม Custom Delete Confirmation Modal 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ดึงข้อมูล User และที่อยู่จาก LocalStorage
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      
      const storedAddresses = localStorage.getItem(`addresses_${parsedUser.email}`);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      }
    }
  }, []);

  const saveToLocalStorage = (updatedList: AddressItem[], email: string) => {
    setAddresses(updatedList);
    localStorage.setItem(`addresses_${email}`, JSON.stringify(updatedList));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const trimmed = input.substring(0, 10);
    let formatted = trimmed;
    if (trimmed.length > 3 && trimmed.length <= 6) {
      formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else if (trimmed.length > 6) {
      formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
    }
    setReceiverPhone(formatted);
  };

  const openForm = (item: AddressItem | null = null) => {
    if (item) {
      setEditingId(item.id);
      setType(item.type);
      setReceiverName(item.receiverName);
      setReceiverPhone(item.receiverPhone);
      setAddressDetails(item.addressDetails);
      setPostalCode(item.postalCode);
    } else {
      setEditingId(null);
      setType('home');
      setReceiverName('');
      setReceiverPhone('');
      setAddressDetails('');
      setPostalCode('');
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    let updatedList = [...addresses];

    if (editingId) {
      updatedList = updatedList.map((item) =>
        item.id === editingId
          ? { ...item, type, receiverName, receiverPhone, addressDetails, postalCode }
          : item
      );
    } else {
      const newAddress: AddressItem = {
        id: Date.now().toString(),
        type,
        receiverName,
        receiverPhone,
        addressDetails,
        postalCode,
        isDefault: addresses.length === 0
      };
      updatedList.push(newAddress);
    }

    saveToLocalStorage(updatedList, currentUser.email);
    setIsFormOpen(false);
  };

  // 🛠️ เปลี่ยนฟังก์ชันเปิด Modal แจ้งเตือนลบแทนของเดิม
  const triggerDeleteConfirm = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  // 🚀 ฟังก์ชันยืนยันการลบจริงจากตัว Custom Modal
  const confirmDelete = () => {
    if (!currentUser || !deleteTargetId) return;
    
    const updatedList = addresses.filter((item) => item.id !== deleteTargetId);
    
    if (addresses.find(item => item.id === deleteTargetId)?.isDefault && updatedList.length > 0) {
      updatedList[0].isDefault = true;
    }
    
    saveToLocalStorage(updatedList, currentUser.email);
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleSetDefault = (id: string) => {
    if (!currentUser) return;
    const updatedList = addresses.map((item) => ({
      ...item,
      isDefault: item.id === id
    }));
    saveToLocalStorage(updatedList, currentUser.email);
  };

  return (
    <div className={styles.container}>
      <header className={styles.miniNavbar}>
        <span className={styles.shopName}>SPORTS SHOP</span>
        <div className={styles.navLinks}>
          <Link href="/profile" className={styles.backLink}>👤 โปรไฟล์</Link>
          <Link href="/" className={styles.backLink}>← หน้าแรก</Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>📍 สมุดบันทึกที่อยู่ของฉัน</h1>
          {!isFormOpen && (
            <button className={styles.btnAdd} onClick={() => openForm(null)}>➕ เพิ่มที่อยู่ใหม่</button>
          )}
        </div>

        {/* 📋 ฟอร์ม เพิ่ม/แก้ไข ข้อมูลที่อยู่ */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className={styles.addressForm}>
            <h3>{editingId ? '📝 แก้ไขข้อมูลที่อยู่' : '➕ เพิ่มที่อยู่จัดส่งใหม่'}</h3>
            
            <div className={styles.inputGroup}>
              <label>หมวดหมู่ประเภทที่อยู่</label>
              <div className={styles.typeSelector}>
                <button
                  type="button"
                  className={type === 'home' ? styles.typeBtnActive : styles.typeBtn}
                  onClick={() => setType('home')}
                >
                  🏠 บ้าน
                </button>
                <button
                  type="button"
                  className={type === 'work' ? styles.typeBtnActive : styles.typeBtn}
                  onClick={() => setType('work')}
                >
                  🏢 บริษัท / ที่ทำงาน
                </button>
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label>ชื่อ - นามสกุล</label>
                <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="เช่น สมชาย ศรีสบายใจ" required />
              </div>
              <div className={styles.inputGroup}>
                <label>เบอร์โทรศัพท์</label>
                <input type="text" value={receiverPhone} onChange={handlePhoneChange} placeholder="เช่น 089-XXX-XXXX" maxLength={12} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>รายละเอียดที่อยู่จัดส่ง</label>
              <textarea rows={3} value={addressDetails} onChange={(e) => setAddressDetails(e.target.value)} placeholder="ระบุ บ้านเลขที่, หมู่บ้าน, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด" required />
            </div>

            <div className={styles.inputGroup} style={{ maxWidth: '300px' }}>
              <label>รหัสไปรษณีย์</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').substring(0, 5))} placeholder="เช่น 10220" required />
            </div>

            <div className={styles.btnFormGroup}>
              <button type="submit" className={styles.btnSave}>💾 บันทึกที่อยู่</button>
              <button type="button" className={styles.btnCancel} onClick={() => setIsFormOpen(false)}>ยกเลิก</button>
            </div>
          </form>
        )}

        {/* 📦 แสดงรายการที่อยู่ทั้งหมด */}
        {currentUser ? (
          <div className={styles.addressGrid}>
            {addresses.length > 0 ? (
              addresses.map((item) => (
                <div key={item.id} className={item.isDefault ? styles.addressCardDefault : styles.addressCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.typeBadge}>
                      {item.type === 'home' ? '🏠 บ้าน' : '🏢 ที่ทำงาน'}
                    </span>
                    {item.isDefault && <span className={styles.defaultBadge}>🌟 ที่อยู่หลัก</span>}
                  </div>
                  
                  <div className={styles.cardBody}>
                    <p><strong>ชื่อ-นามสกุล:</strong> {item.receiverName} | 📞 {item.receiverPhone}</p>
                    <p className={styles.detailsText}><strong>ที่อยู่:</strong> {item.addressDetails} {item.postalCode}</p>
                  </div>

                  <div className={styles.cardActions}>
                    {!item.isDefault && (
                      <button className={styles.btnSetDefault} onClick={() => handleSetDefault(item.id)}>ตั้งเป็นที่อยู่หลัก</button>
                    )}
                    <button className={styles.btnEdit} onClick={() => openForm(item)}>✏️ แก้ไข</button>
                    {/* ✨ ปรับมาเรียกใช้ Custom Alert Modal ตรงนี้จ้า */}
                    <button className={styles.btnDelete} onClick={() => triggerDeleteConfirm(item.id)}>🗑️ ลบ</button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>ยังไม่มีการบันทึกข้อมูลที่อยู่จัดส่งเลย ลองกดเพิ่มที่อยู่ด้านบนดูน้าเธอ! 📍</p>
            )}
          </div>
        ) : (
          <div className={styles.errorBox}>กรุณาเข้าสู่ระบบก่อนใช้งานหน้าจัดการที่อยู่นะจ๊ะ</div>
        )}
      </main>

      {/* 🏆 [เพิ่มฟีเจอร์ใหม่]: หน้าต่างป๊อปอัปแจ้งเตือนลบสุดสวย (Custom Delete Confirmation Modal) */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>คุณแน่ใจนะว่าจะลบที่อยู่นี้?</h2>
            <p>หากเผลอกดลบไป ข้อมูลที่อยู่นี้จะหายไปจากสมุดบันทึกทันทีเลย</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnConfirm} onClick={confirmDelete}>ยืนยันการลบ</button>
              <button className={styles.modalBtnCancel} onClick={() => setIsDeleteModalOpen(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}