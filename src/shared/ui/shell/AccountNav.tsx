"use client";

/*
 * Điều hướng khu khách hàng (DESIGN §4): bốn mục.
 * ≥1024px sidebar 240px; nhỏ hơn: thanh menu ngang bốn mục.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/tai-khoan", label: "Phần mềm của tôi", icon: "package" },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng", icon: "wallet" },
  { href: "/tai-khoan/ho-tro", label: "Hỗ trợ", icon: "mail" },
  { href: "/tai-khoan/cai-dat", label: "Cài đặt", icon: "settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/tai-khoan") {
    return pathname === "/tai-khoan" || pathname.startsWith("/tai-khoan/ban-quyen");
  }
  return pathname.startsWith(href);
}

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Tài khoản"
      className="lg:w-60 lg:shrink-0"
    >
      <ul className="flex gap-1 overflow-x-auto rounded-panel border border-border-subtle bg-surface-panel p-1 lg:flex-col lg:gap-1">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap rounded-control px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-surface-raised text-link"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
