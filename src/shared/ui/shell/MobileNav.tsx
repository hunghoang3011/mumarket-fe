"use client";

/*
 * Nút Menu + Drawer dưới 1200px — cùng nhãn/route với menu desktop (§4).
 */
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/demo/types";
import { Drawer } from "../Drawer";
import { GameArt } from "../GameArt";
import { Icon } from "../Icon";
import { StatusLabel } from "../StatusLabel";

const NAV = [
  { href: "/", label: "Trang Chủ" },
  { href: "/phan-mem", label: "Phần Mềm" },
  { href: "/bang-gia", label: "Bảng Giá" },
  { href: "/huong-dan", label: "Hướng Dẫn" },
  { href: "/cap-nhat", label: "Cập Nhật" },
  { href: "/ho-tro", label: "Hỗ Trợ" },
];

export function MobileNav({
  products,
}: {
  products: Product[];
  sessionHref: string;
  sessionLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-control px-2 py-2 text-sm font-medium text-text-primary hover:text-link sm:px-3 sm:text-[15px]"
      >
        <Icon name="menu" size={24} />
        <span className="hidden min-[420px]:inline">Menu</span>
      </button>
      <Drawer open={open} title="Menu" onClose={() => setOpen(false)}>
        <nav aria-label="Điều hướng chính (di động)">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-control px-3 py-3 text-base font-medium text-text-primary hover:bg-surface-panel"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Năm phần mềm
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/phan-mem/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-control px-3 py-2 hover:bg-surface-panel"
                >
                  <GameArt
                    slug={p.slug}
                    crop="square"
                    className="h-8 w-8 shrink-0 rounded-detail"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-text-primary">
                      {p.name}
                    </span>
                    <StatusLabel axis="software" value={p.softwareStatus} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}
