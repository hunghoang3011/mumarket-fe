/*
 * Route /dang-nhap (DESIGN §4; hành trình J1).
 * Đã đăng nhập → chuyển thẳng tới next (mặc định /tai-khoan).
 * ?da-dat-lai=1 → thông báo đặt lại mật khẩu thành công (từ /quen-mat-khau).
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDemoSession } from "@/demo/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = typeof params.next === "string" ? params.next : undefined;
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/tai-khoan";

  const session = await getDemoSession();
  if (session.role !== "guest") redirect(next);

  return (
    <>
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <div className="mt-6">
        <LoginForm next={next} resetDone={params["da-dat-lai"] === "1"} />
      </div>
    </>
  );
}
