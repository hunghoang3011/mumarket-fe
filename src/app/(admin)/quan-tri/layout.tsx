import Link from "next/link";
import { redirect } from "next/navigation";
import { getDemoSession } from "@/demo/session";
import { AdminNav } from "@/shared/ui/shell/AdminNav";
import { Wordmark } from "@/shared/ui/Wordmark";

/*
 * Khu quản trị: chỉ vai trò quản trị (demo). Toàn bộ M0 phẳng, dữ liệu trước.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getDemoSession();
  if (session.role !== "admin") {
    redirect(
      session.role === "customer"
        ? "/tai-khoan"
        : "/dang-nhap?next=/quan-tri",
    );
  }

  return (
    <>
      <header className="header-solid sticky top-0 z-sticky">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 lg:px-8">
          <Link href="/" aria-label="GALAXY AUTO — Về trang chủ">
            <Wordmark />
          </Link>
          <span className="rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning">
            Khu quản trị
          </span>
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
      <main id="noi-dung" className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-6 xl:flex-row">
          <AdminNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
    </>
  );
}
