/*
 * Route /dang-ky (DESIGN §4; hành trình J1).
 * Giữ query next qua đăng ký → xác thực để quay về đúng ý định mua/gia hạn.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Tạo tài khoản" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = typeof params.next === "string" ? params.next : undefined;
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/tai-khoan";

  return (
    <>
      <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
      <div className="mt-6">
        <RegisterForm next={next} />
      </div>
      <p className="mt-4 text-sm text-text-secondary">
        Đã có tài khoản?{" "}
        <Link
          href={`/dang-nhap?next=${encodeURIComponent(next)}`}
          className="content-link"
        >
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
