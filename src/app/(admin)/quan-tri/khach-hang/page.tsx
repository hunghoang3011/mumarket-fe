/*
 * /quan-tri/khach-hang — danh sách khách (DESIGN §5 Quản trị). Bản demo một
 * khách duy nhất (alice@example.test) nên bảng một dòng + ghi chú demo;
 * "Xem" mở rộng inline qua query ?xem=1 (không cần JS): danh sách mã bản
 * quyền và mã đơn có link tới chi tiết đơn.
 */
import Link from "next/link";
import { getLicenses, getOrders } from "@/demo";
import { DEMO_ENABLED } from "@/demo/config";
import { demoUsers } from "@/demo/fixtures/content";
import { formatVnd } from "@/shared/format/money";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Empty, Notice } from "@/shared/ui/Notice";
import { paymentAxisOf } from "@/shared/ui/OrderStatus";
import { StatusLabel } from "@/shared/ui/StatusLabel";

interface CustomerRow {
  id: string;
  email: string;
  displayName: string;
  licenseCount: number;
  orderCount: number;
  suspended: boolean;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { xem } = await searchParams;
  const expanded = xem === "1";

  const [licenses, orders] = await Promise.all([getLicenses(), getOrders()]);
  const customer = DEMO_ENABLED ? demoUsers.customer : null;

  const rows: CustomerRow[] = customer
    ? [
        {
          id: customer.email,
          email: customer.email,
          displayName: customer.displayName,
          licenseCount: licenses.length,
          orderCount: orders.length,
          suspended: customer.suspended,
        },
      ]
    : [];

  const columns: Column<CustomerRow>[] = [
    { key: "email", header: "Email", render: (r) => r.email },
    { key: "name", header: "Tên hiển thị", render: (r) => r.displayName },
    {
      key: "licenses",
      header: "Số bản quyền",
      align: "right",
      render: (r) => r.licenseCount,
    },
    {
      key: "orders",
      header: "Số đơn",
      align: "right",
      render: (r) => r.orderCount,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) =>
        r.suspended ? (
          <span className="text-danger">Tạm khóa</span>
        ) : (
          <span className="text-success">Hoạt động</span>
        ),
    },
    {
      key: "view",
      header: "Thao tác",
      render: () =>
        expanded ? (
          <Link
            href="/quan-tri/khach-hang"
            className="text-link underline underline-offset-2 hover:text-action"
          >
            Thu gọn
          </Link>
        ) : (
          <Link
            href="/quan-tri/khach-hang?xem=1"
            className="text-link underline underline-offset-2 hover:text-action"
          >
            Xem
          </Link>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Khách hàng</h1>
      <DataTable
        columns={columns}
        rows={rows}
        caption="Danh sách khách hàng"
        empty={
          <Empty title="Chưa có khách hàng nào">
            <p>Khách đăng ký tài khoản sẽ xuất hiện tại đây.</p>
          </Empty>
        }
      />
      {expanded && customer ? (
        <section
          aria-label={`Chi tiết khách ${customer.email}`}
          className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel p-5"
        >
          <h2 className="text-lg font-semibold text-text-primary">
            {customer.displayName} — {customer.email}
          </h2>
          <Notice tone="neutral">
            Tài khoản khách demo duy nhất — mọi đơn và bản quyền trong bản demo
            đều thuộc tài khoản này.
          </Notice>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Bản quyền ({licenses.length})
            </h3>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {licenses.map((l) => (
                <li
                  key={l.reference}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="font-medium text-text-primary">
                    {l.reference}
                  </span>
                  <span className="text-text-secondary">{l.productName}</span>
                  <StatusLabel axis="license" value={l.status} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Đơn hàng ({orders.length})
            </h3>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {orders.map((o) => (
                <li key={o.code} className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/quan-tri/don-hang/${o.code}`}
                    className="font-medium text-link underline underline-offset-2 hover:text-action"
                  >
                    {o.code}
                  </Link>
                  <span className="text-text-secondary">{o.productName}</span>
                  <span className="text-text-secondary">
                    {formatVnd(o.amountVnd)}
                  </span>
                  <StatusLabel axis="order" value={o.status} />
                  <StatusLabel axis="payment" value={paymentAxisOf(o)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
