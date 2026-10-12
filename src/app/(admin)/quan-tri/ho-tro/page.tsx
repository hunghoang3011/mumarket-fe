/*
 * /quan-tri/ho-tro — danh sách yêu cầu hỗ trợ, trả lời và đánh dấu đã giải
 * quyết (DESIGN §5 Quản trị, J6). Trả lời/đổi trạng thái ghi vào lớp phủ
 * demo (localStorage), không gọi backend.
 */
import { getTickets } from "@/demo";
import { DEMO_ENABLED } from "@/demo/config";
import { demoUsers } from "@/demo/fixtures/content";
import { AdminTickets } from "./AdminTickets";

export default async function AdminSupportPage() {
  const tickets = await getTickets();
  // Demo một khách duy nhất — không có getter riêng nên đọc fixture người dùng.
  const customerName = DEMO_ENABLED ? demoUsers.customer.displayName : "—";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Hỗ trợ</h1>
      <AdminTickets tickets={tickets} customerName={customerName} />
    </div>
  );
}
