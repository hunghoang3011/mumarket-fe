"use client";

/*
 * Điều hướng quản trị (DESIGN §4): nhóm theo việc.
 * ≥1200px sidebar 256px; dưới: nút mở drawer.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Icon } from "../Icon";

interface NavItem {
  href: string;
  label: string;
}
interface NavGroup {
  title: string | null;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    title: null,
    items: [{ href: "/quan-tri", label: "Việc cần xử lý" }],
  },
  {
    title: "Bán hàng",
    items: [
      { href: "/quan-tri/don-hang", label: "Đơn hàng" },
      { href: "/quan-tri/thanh-toan", label: "Đối soát" },
      { href: "/quan-tri/ban-quyen", label: "Bản quyền" },
      { href: "/quan-tri/khach-hang", label: "Khách hàng" },
    ],
  },
  {
    title: "Sản phẩm",
    items: [
      { href: "/quan-tri/san-pham", label: "Sản phẩm" },
      { href: "/quan-tri/phien-ban", label: "Phiên bản" },
      { href: "/quan-tri/goi-gia", label: "Gói giá" },
    ],
  },
  {
    title: "Nội dung & hỗ trợ",
    items: [
      { href: "/quan-tri/noi-dung", label: "Nội dung" },
      { href: "/quan-tri/ho-tro", label: "Hỗ trợ" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/quan-tri/cau-hinh", label: "Cấu hình" },
      { href: "/quan-tri/nhat-ky", label: "Nhật ký" },
    ],
  },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Quản trị">
      <ul className="flex flex-col gap-1">
        {GROUPS.map((g, gi) => (
          <li key={g.title ?? "root"}>
            {g.title ? (
              <p
                className={`px-3 text-xs font-semibold uppercase tracking-wide text-text-muted ${
                  gi > 0 ? "mt-4" : ""
                }`}
              >
                {g.title}
              </p>
            ) : null}
            <ul className="mt-1 flex flex-col gap-1">
              {g.items.map((item) => {
                const active =
                  item.href === "/quan-tri"
                    ? pathname === "/quan-tri"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-control px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-surface-raised text-link"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AdminNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu quản trị"
          className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-text-primary hover:text-link"
        >
          <Icon name="menu" size={24} />
          Menu quản trị
        </button>
        <Drawer open={open} title="Menu quản trị" onClose={() => setOpen(false)}>
          <NavList onNavigate={() => setOpen(false)} />
        </Drawer>
      </div>
      <aside className="hidden w-64 shrink-0 xl:block">
        <NavList />
      </aside>
    </>
  );
}
