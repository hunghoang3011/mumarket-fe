/*
 * /tai-khoan/ho-tro — danh sách yêu cầu + form gửi yêu cầu mới (DESIGN §5, J6).
 * Server tải fixture/cờ/cấu hình; danh sách và form gộp lớp phủ demo ở client.
 * Mở từ ngữ cảnh (?don= / ?game= / ?ban-quyen=) → form hiển thị chip kèm theo.
 */
import { getFlags, getSettings, getTickets } from "@/demo";
import { Notice } from "@/shared/ui/Notice";
import { TicketForm, TicketList } from "./TicketForm";

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [tickets, flags, settings] = await Promise.all([
    getTickets(),
    getFlags(),
    getSettings(),
  ]);
  const context = {
    orderCode: typeof sp.don === "string" ? sp.don : null,
    productSlug: typeof sp.game === "string" ? sp.game : null,
    licenseRef: typeof sp["ban-quyen"] === "string" ? sp["ban-quyen"] : null,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Hỗ trợ</h1>
      <Notice tone="warning">Không gửi mật khẩu hoặc mã bản quyền.</Notice>

      <section aria-label="Yêu cầu của bạn" className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Yêu cầu của bạn
        </h2>
        <TicketList tickets={tickets} />
      </section>

      <section aria-label="Gửi yêu cầu mới" className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Gửi yêu cầu mới
        </h2>
        {flags.support_new_tickets ? (
          <TicketForm context={context} />
        ) : (
          <Notice tone="info" title="Đang tạm ngừng nhận yêu cầu mới">
            Các yêu cầu đã gửi vẫn được trả lời.
            {settings.contactEmail
              ? ` Liên hệ khác: ${settings.contactEmail}.`
              : null}
          </Notice>
        )}
      </section>
    </div>
  );
}
