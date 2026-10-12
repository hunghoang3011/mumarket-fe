/*
 * /quan-tri/nhat-ky — nhật ký audit chỉ ghi thêm (append-only), không có
 * sửa/xóa (DESIGN §5 Quản trị, R7). Toàn M0 phẳng.
 */
import { getAuditEvents } from "@/demo";
import type { AuditEvent } from "@/demo/types";
import { formatDateTime } from "@/shared/format/date";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Empty } from "@/shared/ui/Notice";

type Row = AuditEvent & { id: string };

const columns: Column<Row>[] = [
  {
    key: "at",
    header: "Thời điểm",
    render: (r) => formatDateTime(r.at),
  },
  { key: "actor", header: "Người thực hiện", render: (r) => r.actor },
  { key: "action", header: "Hành động", render: (r) => r.action },
  { key: "target", header: "Đối tượng", render: (r) => r.target },
];

export default async function AdminAuditPage() {
  const events = await getAuditEvents();
  const rows: Row[] = [...events]
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((e, i) => ({ ...e, id: `ev-${i}` }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Nhật ký</h1>
      <p className="text-sm text-text-muted">
        Nhật ký chỉ ghi thêm — không sửa, không xóa.
      </p>
      <DataTable
        columns={columns}
        rows={rows}
        caption="Nhật ký thao tác quản trị"
        empty={<Empty title="Chưa có sự kiện nào." />}
      />
    </div>
  );
}
