import Link from "next/link";
import { getDemoSession } from "@/demo/session";
import { Wordmark } from "@/shared/ui/Wordmark";

/*
 * Nhóm giao dịch (/thanh-toan, /don-hang) — DESIGN §4/§5.
 * Header tối giản giống khu khách hàng nhưng KHÔNG guard ở layout:
 * trang nào cần đăng nhập tự redirect (ví dụ /thanh-toan giữ query qua next).
 */
export default async function CommerceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getDemoSession();

  return (
    <>
      <header className="header-solid sticky top-0 z-sticky">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 lg:h-16 lg:px-8">
          <Link href="/" aria-label="GALAXY AUTO — Về trang chủ">
            <Wordmark />
          </Link>
          {session.role === "guest" ? (
            <Link
              href="/dang-nhap"
              className="ml-auto inline-flex min-h-11 items-center rounded-control border border-border-subtle px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
            >
              Đăng nhập
            </Link>
          ) : (
            <>
              <span className="ml-auto text-sm text-text-secondary">
                {session.user?.displayName}
              </span>
              <Link
                href="/dang-nhap"
                className="inline-flex min-h-11 items-center rounded-control border border-border-subtle px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                Đăng xuất
              </Link>
            </>
          )}
        </div>
      </header>
      <main
        id="noi-dung"
        className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-8 lg:py-8"
      >
        {children}
      </main>
    </>
  );
}
