import type { Metadata } from "next";
import { Noto_Sans_Thai, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { FavoritesProvider } from "@/lib/FavoritesContext";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-thai",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SportGear Thailand | อุปกรณ์กีฬาครบวงจร",
  description: "ร้านขายอุปกรณ์กีฬาออนไลน์ สินค้าคุณภาพ ราคาดี ส่งฟรีทั่วไทย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} ${cinzel.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
