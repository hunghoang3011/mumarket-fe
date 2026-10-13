import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif_Display } from "next/font/google";
import localFont from "next/font/local";
import { DemoBar } from "@/demo/DemoBar";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
});

/*
 * Ma Shan Zheng (OFL) — subset 33 chữ Hán trang trí (~9.7KB), tự host.
 * CHỈ dùng cho trang trí CJK aria-hidden; chữ tiếng Việt không dùng font
 * này (không có glyph). Tái tạo: node scripts/subset-brush-font.mjs
 */
const brushHanzi = localFont({
  src: "./fonts/brush-hanzi.woff2",
  variable: "--font-brush-hanzi",
  display: "swap",
});

/* Demo đọc cookie phiên (DemoBar) mỗi request — toàn bộ route render động. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "GALAXY AUTO — Công Nghệ Khai Mở – Chinh Phục Tam Giới",
    template: "%s — GALAXY AUTO",
  },
  description:
    "Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp & MU.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${notoSerifDisplay.variable} ${brushHanzi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-page text-text-primary">
        {children}
        <DemoBar />
      </body>
    </html>
  );
}
