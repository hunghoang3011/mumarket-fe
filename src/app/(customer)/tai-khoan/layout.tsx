import Link from "next/link";
import { redirect } from "next/navigation";
import { getDemoSession } from "@/demo/session";
import { AccountNav } from "@/shared/ui/shell/AccountNav";
import { Wordmark } from "@/shared/ui/Wordmark";

/*
 * Khu khách hàng: yêu cầu vai trò khách hàng (demo).
 * Khách → /dang-nhap?next=/tai-khoan (giữ ý định); quản trị → /quan-tri.
 */
export default async function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getDemoSession();
  if (session.role === "guest") redirect("/dang-nhap?next=/tai-khoan");
  if (session.role === "admin") redirect("/quan-tri");

  return (
    <>
      <header className="header-solid sticky top-0 z-sticky">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 lg:h-16 lg:px-8">
          <Link href="/" aria-label="GALAXY AUTO — Về trang chủ">
            <Wordmark />
          </Link>
          <span className="ml-auto text-sm text-text-secondary">
            {session.user?.displayName}
          </span>
          <Link
            href="/dang-nhap"
            className="inline-flex min-h-11 items-center rounded-control border border-border-subtle px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
          >
            Đăng xuất
          </Link>
        </div>
      </header>
      <main id="noi-dung" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
    </>
  );
}
