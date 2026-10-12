/*
 * /tai-khoan/cai-dat — tên hiển thị, đổi mật khẩu, email nhắc hết hạn
 * (DESIGN §5). Layout khu khách hàng đã chặn guest/admin nên user luôn có.
 */
import { getDemoSession } from "@/demo/session";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getDemoSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Cài đặt</h1>
      <SettingsForm
        displayName={session.user?.displayName ?? ""}
        reminderEnabled={session.user?.reminderEnabled ?? true}
      />
    </div>
  );
}
