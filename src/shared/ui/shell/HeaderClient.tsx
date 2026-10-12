"use client";

/*
 * Khung header công khai: M3 kính khi nằm trên hero, chuyển nền đặc khi
 * rời hero; nút Menu mở Drawer dưới 1200px.
 */
import { useEffect, useState } from "react";

export function HeaderFrame({
  children,
  overHero,
}: {
  children: React.ReactNode;
  overHero: boolean;
}) {
  const [solid, setSolid] = useState(!overHero);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setSolid(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  return (
    <header
      className={`sticky top-0 z-sticky ${solid ? "header-solid" : "header-glass"}`}
    >
      {children}
    </header>
  );
}

// (Nút Menu nằm trong MobileNav.tsx)

