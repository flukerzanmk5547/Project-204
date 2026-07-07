export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  displayPrice: number;
  rating: number;
  stock: number;
  colors: string[];
  image: string;
  displayImg: string;
  description: string;
}

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pro Run Zoom X',
    category: 'รองเท้าวิ่ง',
    price: '4,500 บาท',
    displayPrice: 4500,
    rating: 4.8,
    stock: 15,
    colors: ['#ef4444', '#3b82f6', '#0f172a'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    description: 'รองเท้าวิ่งสำหรับนักกีฬามืออาชีพ พื้นรองรับแรงกระแทกได้ดีเยี่ยม'
  },
  {
    id: 2,
    name: 'Aero Speed Badminton Racket',
    category: 'อุปกรณ์กีฬา',
    price: '2,800 บาท',
    displayPrice: 2800,
    rating: 4.5,
    stock: 8,
    colors: ['#eab308', '#0f172a'],
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    description: 'ไม้แบดมินตันเฟรมคาร์บอนน้ำหนักเบา เพิ่มความเร็วในการสวิง'
  },
  {
    id: 3,
    name: 'Pro Football Jersey',
    category: 'เสื้อผ้ากีฬา',
    price: '990 บาท',
    displayPrice: 990,
    rating: 4.6,
    stock: 25,
    colors: ['#10b981', '#ffffff'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    description: 'เสื้อกีฬาผ้าโพลีเอสเตอร์ระบายอากาศได้ดีเยี่ยมสำหรับลงสนาม'
  },
  {
    id: 4,
    name: 'Leather Basketball Size 7',
    category: 'อุปกรณ์กีฬา',
    price: '2,400 บาท',
    displayPrice: 2400,
    rating: 4.9,
    stock: 12,
    colors: ['#d97706'],
    image: 'https://images.unsplash.com/photo-1519861531473-9200262b8841?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1519861531473-9200262b8841?w=800&q=80',
    description: 'ลูกบาสเกตบอลหนังแท้ มาตรฐานสากล ผิวสัมผัสยึดเกาะได้ดี'
  },
  {
    id: 5,
    name: 'Sport Water Bottle 1L',
    category: 'อุปกรณ์เสริม',
    price: '790 บาท',
    displayPrice: 790,
    rating: 4.4,
    stock: 40,
    colors: ['#0f172a', '#64748b'],
    image: 'https://images.unsplash.com/photo-1619096316415-891d4e082103?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1619096316415-891d4e082103?w=800&q=80',
    description: 'ขวดน้ำสำหรับนักกีฬา ทนทาน เก็บอุณหภูมิได้ดีเยี่ยม'
  },
  {
    id: 6,
    name: 'Professional Match Soccer Ball',
    category: 'อุปกรณ์กีฬา',
    price: '1,590 บาท',
    displayPrice: 1590,
    rating: 4.7,
    stock: 20,
    colors: ['#ffffff', '#ff0000'],
    image: 'https://images.unsplash.com/photo-1614632537423-146c21c6b03d?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1614632537423-146c21c6b03d?w=800&q=80',
    description: 'ลูกฟุตบอลเย็บด้วยมือ ทนทานต่อการใช้งานหนักในสนาม'
  },
  {
    id: 7,
    name: 'Pro Goalkeeper Gloves',
    category: 'อุปกรณ์กีฬา',
    price: '1,250 บาท',
    displayPrice: 1250,
    rating: 4.6,
    stock: 10,
    colors: ['#000000', '#ff0000'],
    image: 'https://images.unsplash.com/photo-1596464972782-969411653155?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1596464972782-969411653155?w=800&q=80',
    description: 'ถุงมือโกล์มืออาชีพ ยึดเกาะลูกบอลได้ดีในทุกสภาพอากาศ'
  },
  {
    id: 8,
    name: 'Carbon Fiber Tennis Racket',
    category: 'อุปกรณ์กีฬา',
    price: '5,400 บาท',
    displayPrice: 5400,
    rating: 4.8,
    stock: 6,
    colors: ['#3b82f6', '#ffffff'],
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    description: 'ไม้เทนนิสคาร์บอนไฟเบอร์ น้ำหนักสมดุล ควบคุมทิศทางแม่นยำ'
  },
  {
    id: 9,
    name: 'Professional Swimming Goggles',
    category: 'อุปกรณ์กีฬา',
    price: '690 บาท',
    displayPrice: 690,
    rating: 4.3,
    stock: 30,
    colors: ['#0f172a', '#3b82f6'],
    image: 'https://images.unsplash.com/photo-1576610616245-a13180459c25?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1576610616245-a13180459c25?w=800&q=80',
    description: 'แว่นตาว่ายน้ำกันฝ้ามุมมองกว้าง ออกแบบมาเพื่อลดแรงต้านน้ำ'
  },
  {
    id: 10,
    name: 'Yoga Mat Anti-Slip',
    category: 'อุปกรณ์เสริม',
    price: '890 บาท',
    displayPrice: 890,
    rating: 4.5,
    stock: 25,
    colors: ['#ec4899', '#8b5cf6'],
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    description: 'เสื่อโยคะเกรดพรีเมียม หนานุ่ม กันลื่น มั่นคงทุกท่วงท่า'
  },
  {
    id: 11,
    name: 'Hex Dumbbell Set',
    category: 'อุปกรณ์กีฬา',
    price: '1,190 บาท',
    displayPrice: 1190,
    rating: 4.7,
    stock: 14,
    colors: ['#000000'],
    image: 'https://images.unsplash.com/photo-1599058917765-a780eda07fda?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1599058917765-a780eda07fda?w=800&q=80',
    description: 'ดัมเบลทรงหกเหลี่ยม ยางหุ้มกันกระแทก ด้ามจับถนัดมือ'
  },
  {
    id: 12,
    name: 'Cycling Helmet Aero',
    category: 'อุปกรณ์กีฬา',
    price: '1,850 บาท',
    displayPrice: 1850,
    rating: 4.6,
    stock: 9,
    colors: ['#ffffff', '#000000'],
    image: 'https://images.unsplash.com/photo-1572914844390-e74f85e927c8?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1572914844390-e74f85e927c8?w=800&q=80',
    description: 'หมวกจักรยานลู่ลม น้ำหนักเบา ปลอดภัยมาตรฐานสูง'
  },
  {
    id: 13,
    name: 'Compression Sport Shorts',
    category: 'เสื้อผ้ากีฬา',
    price: '590 บาท',
    displayPrice: 590,
    rating: 4.5,
    stock: 35,
    colors: ['#000000'],
    image: 'https://images.unsplash.com/photo-1515523110800-9415edd13b03?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1515523110800-9415edd13b03?w=800&q=80',
    description: 'กางเกงรัดกล้ามเนื้อช่วยเพิ่มความคล่องตัว ลดการบาดเจ็บ'
  },
  {
    id: 14,
    name: 'Gym Duffel Bag',
    category: 'อุปกรณ์เสริม',
    price: '1,390 บาท',
    displayPrice: 1390,
    rating: 4.7,
    stock: 18,
    colors: ['#0f172a', '#3b82f6'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description: 'กระเป๋ากีฬาจุของได้มาก มีช่องแยกใส่รองเท้า'
  },
  {
    id: 15,
    name: 'Sport Fitness Tracker',
    category: 'อุปกรณ์เสริม',
    price: '3,900 บาท',
    displayPrice: 3900,
    rating: 4.9,
    stock: 11,
    colors: ['#000000'],
    image: 'https://images.unsplash.com/photo-1557939591-665187114670?w=800&q=80',
    displayImg: 'https://images.unsplash.com/photo-1557939591-665187114670?w=800&q=80',
    description: 'นาฬิกาติดตามกิจกรรมกีฬา วัดชีพจรและแคลอรี่แบบเรียลไทม์'
  }
];