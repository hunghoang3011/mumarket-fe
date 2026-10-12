/*
 * Route /quen-mat-khau (DESIGN §4, §10): đặt lại mật khẩu 3 bước trên cùng
 * trang (email → mã 6 số → mật khẩu mới). Xong → /dang-nhap?da-dat-lai=1.
 */
import type { Metadata } from "next";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Đặt lại mật khẩu" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>
      <div className="mt-6">
        <ResetForm />
      </div>
    </>
  );
}
