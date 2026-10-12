"use client";

/*
 * /quan-tri/don-hang — danh sách đơn (DESIGN §5 Quản trị · Đơn hàng, J5).
 * Toàn trang là client leaf vì gộp lớp phủ demo (đơn tạo trong phiên từ
 * /thanh-toan, báo chuyển khoản, duyệt đơn); nguồn nền là fixtures demo,
 * tôn trọng DEMO_ENABLED giống getOrders(). Bộ lọc ?loc=da-bao = đơn đang
 * chờ thanh toán mà khách đã báo chuyển khoản.
 * Bản demo một khách duy nhất (alice@example.test) nên cột Khách cố định.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DEMO_ENABLED } from "@/demo/config";
import { demoOrders } from "@/demo/fixtures/commerce";
import { demoUsers } from "@/demo/fixtures/content";
import { useDemoOverlay } from "@/demo/store";
import type { Order } from "@/demo/types";
import { mergeOrdersWithOverlay } from "@/app/(customer)/tai-khoan/LicenseSections";
import { formatVnd } from "@/shared/format/money";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Empty } from "@/shared/ui/Notice";
import { paymentAxisOf } from "@/shared/ui/OrderStatus";
import { StatusLabel } from "@/shared/ui/StatusLabel";

const CUSTOMER_EMAIL = DEMO_ENABLED ? demoUsers.customer.email : "";

type Row = Order & { id: string };

const columns: Column<Row>[] = [
  {
    key: "code",
    header: "Mã",
    render: (r) => <span className="font-medium">{r.code}</span>,
  },
  { key: "customer", header: "Khách", render: () => CUSTOMER_EMAIL },
  {
    key: "product",
    header: "Game/Gói",
    render: (r) => (
      <span className="flex flex-col gap-0.5">
        <span>{r.productName}</span>
        <span className="text-text-muted">{r.offerLabel}</span>
      </span>
    ),
  },
  {
    key: "amount",
    header: "Số tiền",
    align: "right",
    render: (r) => formatVnd(r.amountVnd),
  },
  {
    key: "status",
    header: "Trạng thái đơn",
    render: (r) => <StatusLabel axis="order" value={r.status} />,
  },
  {
    key: "payment",
    header: "Thanh toán",
    render: (r) => <StatusLabel axis="payment" value={paymentAxisOf(r)} />,
  },
  {
    key: "open",
    header: "Thao tác",
    render: (r) => (
      <Link
        href={`/quan-tri/don-hang/${r.code}`}
        className="text-link underline underline-offset-2 hover:text-action"
      >
        Mở
      </Link>
    ),
  },
];

export default function AdminOrdersPage() {
  const overlay = useDemoOverlay();
  const searchParams = useSearchParams();
  const filtering = searchParams.get("loc") === "da-bao";

  const all = mergeOrdersWithOverlay(DEMO_ENABLED ? demoOrders : [], overlay)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const shown = filtering
    ? all.filter((o) => o.status === "pending_payment" && o.hasPaymentReport)
    : all;
  const rows: Row[] = shown.map((o) => ({ ...o, id: o.code }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Đơn hàng</h1>
      {filtering ? (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span
            data-testid="admin-order-filter"
            className="inline-flex items-center gap-1.5 rounded-full bg-info-bg px-3 py-1 font-medium text-info"
          >
            Đang lọc: Đã báo chuyển khoản
          </span>
          <Link
            href="/quan-tri/don-hang"
            className="text-link underline underline-offset-2 hover:text-action"
          >
            Bỏ lọc
          </Link>
        </p>
      ) : null}
      <DataTable
        columns={columns}
        rows={rows}
        caption="Danh sách đơn hàng"
        empty={
          <Empty
            title={
              filtering
                ? "Không có đơn nào đã báo chuyển khoản"
                : "Chưa có đơn hàng nào"
            }
            action={
              filtering ? (
                <Link
                  href="/quan-tri/don-hang"
                  className="text-link underline underline-offset-2 hover:text-action"
                >
                  Bỏ lọc
                </Link>
              ) : undefined
            }
          >
            {filtering ? (
              <p>Khi khách báo đã chuyển khoản, đơn sẽ xuất hiện tại đây.</p>
            ) : (
              <p>Đơn do khách tạo từ trang Thanh toán sẽ xuất hiện tại đây.</p>
            )}
          </Empty>
        }
      />
    </div>
  );
}
