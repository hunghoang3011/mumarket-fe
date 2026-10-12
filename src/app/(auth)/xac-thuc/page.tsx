/*
 * Route /xac-thuc (DESIGN §4; J1/D04): nhập mã 6 số trên cùng tab.
 * Cần ?email=… (đi từ /dang-ky); thiếu email → quay lại trang đăng ký.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyForm } from "./VerifyForm";

export const metadata: Metadata = { title: "Xác thực email" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = typeof params.next === "string" ? params.next : undefined;
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/tai-khoan";
  const email = typeof params.email === "string" ? params.email : "";
  if (!email) redirect(`/dang-ky?next=${encodeURIComponent(next)}`);

  return (
    <>
      <h1 className="text-2xl font-semibold">Xác thực email</h1>
      <div className="mt-6">
        <VerifyForm next={next} email={email} />
      </div>
    </>
  );
}
