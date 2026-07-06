'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import styles from './login.module.css';

export default function AuthPage() {
  const router = useRouter();
  
  // โหมดสลับหน้า: 'login' หรือ 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');

  // --- ✨ STATE สำหรับควบคุม CUSTOM POP-UP ---
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', icon: '', action: () => {} });

  // --- 👁️ STATE สำหรับควบคุมการเปิด-ปิดตารหัสผ่าน ---
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // --- 🔑 STATE ของฝั่ง LOGIN ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- 📝 STATE ของฝั่ง REGISTER ---
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // ฟังก์ชันล้างข้อมูลทุกช่อง ป้องกันข้อมูลเก่าเด้งค้างตอนสลับฟอร์ม
  const clearAllInputs = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setErrorMessage('');
    setShowLoginPassword(false);
    setShowRegPassword(false);
    setShowRegConfirmPassword(false);
  };

  // ==========================================================================
  // 🛠️ LOGIC: ระบบตรวจสอบตอน LOGIN (ใช้บัญชีในเครื่องของเธอ ไม่ Hardcode เพิ่ม)
  // ==========================================================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validEmail = "admin@sport.com";
    const validPassword = "Password123";

    // ดึงกล่องรายชื่อรวมทั้งหมดจากเครื่องมาค้นหา
    const storedUsers = localStorage.getItem('allUsers');
    let isUserValid = false;
    let foundUserData: any = null;

    if (storedUsers) {
      const usersArray = JSON.parse(storedUsers);
      foundUserData = usersArray.find((u: any) => u.email === loginEmail && u.password === loginPassword);
      if (foundUserData) {
        isUserValid = true;
      }
    }

    if (!loginEmail || !loginPassword) {
      setErrorMessage('🚨 กรุณากรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่านให้ครบถ้วน');
      return;
    }

    const isAdminValid = loginEmail === validEmail && loginPassword === validPassword;

    if (isAdminValid || isUserValid) {
      // 💾 🎯 [จุดแก้ไขจุดเดียวที่เธอสั่ง]: ดึงเอาฟิลด์รูปโปรไฟล์และข้อมูลอื่น ๆ ที่มีอยู่จริงในวัตถุผู้ใช้ส่งไปด้วย
      const loggedInUser = isAdminValid 
        ? { name: "Admin", email: validEmail }
        : { 
            name: foundUserData.name, 
            email: foundUserData.email,
            phone: foundUserData.phone,      // ส่งค่าโทรศัพท์เดิมที่มีในไอดีไป
            address: foundUserData.address,  // ส่งค่าที่อยู่เดิมที่มีในไอดีไป
            avatar: foundUserData.avatar     // 🔥 ส่งรูปโปรไฟล์ Custom ล่าสุดไปด้วยจ้า!
          };
      
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

      setModalConfig({
        title: 'เข้าสู่ระบบสำเร็จ!',
        message: 'ยินดีต้อนรับกลับเข้าสู่ร้าน SPORTS SHOP กำลังพาวาร์ปไปหน้าหลัก...',
        icon: '🎉',
        action: () => {
          setShowModal(false);
          router.push('/'); 
        }
      });
      setShowModal(true);
    } else {
      setErrorMessage('❌ อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ==========================================================================
  // 🛠️ LOGIC: ระบบตรวจสอบตอน REGISTER
  // ==========================================================================
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setErrorMessage('🚨 กรุณากรอกข้อมูลสมัครสมาชิกให้ครบถ้วนทุกช่อง');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('🚨 รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษรขึ้นไป');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('🚨 รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน กรุณาเช็กความถูกต้อง');
      return;
    }

    const storedUsers = localStorage.getItem('allUsers');
    let usersArray = [];

    if (storedUsers) {
      try {
        usersArray = JSON.parse(storedUsers);
        if (!Array.isArray(usersArray)) usersArray = [];
      } catch (error) {
        usersArray = [];
      }
    }

    const newUser = {
      name: regName,
      email: regEmail,
      password: regPassword
    };

    usersArray.push(newUser); 
    localStorage.setItem('allUsers', JSON.stringify(usersArray)); 
    localStorage.setItem('registeredUser', JSON.stringify(newUser)); 

    const currentNewEmail = regEmail;
    clearAllInputs();
    setLoginEmail(currentNewEmail); 

    setModalConfig({
      title: 'สมัครสมาชิกสำเร็จ!',
      message: `ยินดีต้อนรับคุณ ${newUser.name}\nระบบได้ทำการเปิดใช้งานบัญชีของคุณเรียบร้อยแล้ว`,
      icon: '✅',
      action: () => {
        setShowModal(false);
        setMode('login'); 
      }
    });
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {errorMessage && (
          <div className={styles.alertError}>
            {errorMessage}
          </div>
        )}

        {/* 🔒 PART 1: เข้าสู่ระบบ (LOGIN) */}
        {mode === 'login' && (
          <div>
            <h2 className={styles.title}>SPORTS SHOP</h2>
            <p className={styles.subtitle}>เข้าสู่ระบบเพื่อเริ่มช้อปอุปกรณ์กีฬาพรีเมียม</p>

            <form onSubmit={handleLoginSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>อีเมล / ชื่อผู้ใช้</label>
                <input 
                  type="text" 
                  placeholder="admin@sport.com" 
                  className={styles.input}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>รหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showLoginPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={styles.input}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span 
                    onClick={() => setShowLoginPassword(!showLoginPassword)} 
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.1rem', userSelect: 'none' }}
                  >
                    {showLoginPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>

              <button type="submit" className={styles.button}>เข้าสู่ระบบ</button>
            </form>

            <p className={styles.footerText}>
              ยังไม่มีบัญชีใช่ไหม?{' '}
              <span className={styles.link} onClick={() => { clearAllInputs(); setMode('register'); }}>
                สมัครสมาชิก
              </span>
            </p>
          </div>
        )}

        {/* 📝 PART 2: สมัครสมาชิก (REGISTER) */}
        {mode === 'register' && (
          <div>
            <h2 className={styles.title}>สมัครสมาชิก</h2>
            <p className={styles.subtitle}>สร้างบัญชีสปอร์ตพรีเมียมของคุณ</p>

            <form onSubmit={handleRegisterSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>ชื่อ - นามสกุล</label>
                <input 
                  type="text" 
                  placeholder="สมชาย สายสปอร์ต" 
                  className={styles.input}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>อีเมล</label>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className={styles.input}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>รหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showRegPassword ? 'text' : 'password'} 
                    placeholder="รหัสผ่านขั้นต่ำ 6 ตัว" 
                    className={styles.input}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span 
                    onClick={() => setShowRegPassword(!showRegPassword)} 
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.1rem', userSelect: 'none' }}
                  >
                    {showRegPassword ? '👁️' : '🙈'}
                  </span>
                </div>
                <div className={styles.hintText}>*ความยาวอย่างน้อย 6 ตัวอักษรขึ้นไป</div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>ยืนยันรหัสผ่านอีกครั้ง</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showRegConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={styles.input}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span 
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} 
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.1rem', userSelect: 'none' }}
                  >
                    {showRegConfirmPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>

              <button type="submit" className={styles.button}>ยืนยันการสมัครสมาชิก</button>
            </form>

            <p className={styles.footerText}>
              มีบัญชีอยู่แล้วใช่ไหม? {' '}
              <span className={styles.link} onClick={() => { clearAllInputs(); setMode('login'); }}>
                เข้าสู่ระบบที่นี่
              </span>
            </p>
          </div>
        )}

        <p style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
          <Link href="/" className={styles.link}>← กลับหน้าแรก</Link>
        </p>
      </div>

      {/* DYNAMIC CUSTOM MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <span className={styles.modalIcon}>{modalConfig.icon}</span>
            <h3 className={styles.modalTitle}>{modalConfig.title}</h3>
            <p className={styles.modalMessage}>{modalConfig.message}</p>
            <button className={styles.modalButton} onClick={modalConfig.action}>
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}