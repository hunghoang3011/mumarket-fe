/*
 * Header công khai (DESIGN §4):
 * wordmark · Trang Chủ · Phần Mềm ▾ · Bảng Giá · Hướng Dẫn · Cập Nhật ·
 * Hỗ Trợ · [Đăng nhập]/[Phần mềm của tôi]. Menu đầy đủ từ 1200px;
 * dưới đó: wordmark + nút phiên + nút Menu mở drawer cùng nội dung.
 */
import Link from "next/link";
import { getProducts } from "@/demo";
import { getDemoSession } from "@/demo/session";
import type { Product } from "@/demo/types";
import { GameArt } from "../GameArt";
import { StatusLabel } from "../StatusLabel";
import { Wordmark } from "../Wordmark";
import { HeaderFrame } from "./HeaderClient";
import { MobileNav } from "./MobileNav";
import { Dropdown } from "../Dropdown";

const NAV = [
  { href: "/", label: "Trang Chủ" },
  { href: "/bang-gia", label: "Bảng Giá" },
  { href: "/huong-dan", label: "Hướng Dẫn" },
  { href: "/cap-nhat", label: "Cập Nhật" },
  { href: "/ho-tro", label: "Hỗ Trợ" },
];

function sessionLink(role: string): { href: string; label: string } {
  if (role === "admin") return { href: "/quan-tri", label: "Quản trị" };
  if (role === "customer")
    return { href: "/tai-khoan", label: "Phần mềm của tôi" };
  return { href: "/dang-nhap", label: "Đăng nhập" };
}

function ProductMenuItems({ products }: { products: Product[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {products.map((p) => (
        <li key={p.slug}>
          <Link
            role="menuitem"
            href={`/phan-mem/${p.slug}`}
            className="flex items-center gap-3 rounded-control px-2 py-2 hover:bg-surface-panel"
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
  );
}

export async function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  const [products, session] = await Promise.all([getProducts(), getDemoSession()]);
  const sessionNav = sessionLink(session.role);

  return (
    <HeaderFrame overHero={overHero}>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-control focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-link"
      >
        Bỏ qua tới nội dung
      </a>
      <div className="mx-auto flex h-14 xl:h-16 max-w-[1200px] items-center gap-1 px-4 xl:px-8">
        <Link href="/" aria-label="GALAXY AUTO — Trang chủ" className="mr-2 flex shrink-0 items-center">
          <Wordmark className="h-6 w-auto xl:h-7" />
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden xl:flex items-center gap-1">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-control px-3 py-2 text-[15px] font-medium text-text-primary hover:text-link"
          >
            Trang Chủ
          </Link>
          <Dropdown label="Phần Mềm">
            <ProductMenuItems products={products} />
          </Dropdown>
          {NAV.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-control px-3 py-2 text-[15px] font-medium text-text-primary hover:text-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={sessionNav.href}
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-control border border-action px-3 py-2 text-sm font-semibold text-link hover:bg-[rgb(212_168_67/0.12)] xl:px-4 xl:text-[15px]"
          >
            {sessionNav.label}
          </Link>
          <div className="xl:hidden">
            <MobileNav products={products} sessionHref={sessionNav.href} sessionLabel={sessionNav.label} />
          </div>
        </div>
      </div>
    </HeaderFrame>
  );
}
