/*
 * /quan-tri/cau-hinh — ngân hàng nhận tiền, liên hệ, cờ chức năng kèm mô tả
 * tác động (DESIGN §5 Quản trị · Cấu hình, J6, R7). Bản demo: lưu chỉ đổi
 * client state; thao tác thật sẽ yêu cầu xác nhận 2 lớp và ghi nhật ký audit.
 */
import { getFlags, getSettings } from "@/demo";
import { SettingsAdmin } from "./SettingsAdmin";

export default async function AdminSettingsPage() {
  const [settings, flags] = await Promise.all([getSettings(), getFlags()]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Cấu hình</h1>
      <SettingsAdmin settings={settings} initialFlags={flags} />
    </div>
  );
}
