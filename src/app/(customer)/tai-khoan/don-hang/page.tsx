"use client";

/*
 * /tai-khoan/don-hang — danh sách đơn của khách (DESIGN §5).
 * Bắt buộc client: danh sách phải phản ánh lớp phủ demo trong localStorage
 * (đơn tạo trong phiên, báo chuyển khoản, hủy, đã duyệt) — server không
 * đọc được. Fixture tải một lần khi mount; lớp phủ gộp theo
 * mergeOrdersWithOverlay (dùng chung với trang Phần mềm của tôi).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders } from "@/demo";
import { useDemoOverlay } from "@/demo/store";
import type { Order } from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";
import { Empty } from "@/shared/ui/Notice";
import { paymentAxisOf } from "@/shared/ui/OrderStatus";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";
import { mergeOrdersWithOverlay } from "../LicenseSections";

const COLUMNS: Column<Order & { id: string }>[] = [
  {
    key: "date",
    header: "Ngày",
    render: (o) => formatDate(o.createdAt),
  },
  {
    key: "product",
    header: "Game/Gói",
    render: (o) => (
      <>
        <span className="font-medium">{o.productName}</span>
        <span className="block text-text-muted">{o.offerLabel}</span>
      </>
    ),
  },
  {
    key: "amount",
    header: "Số tiền",
    align: "right",
    render: (o) => (
      <Price
        amountVnd={o.amountVnd}
        originalVnd={o.originalAmountVnd}
        size="sm"
        align="right"
      />
    ),
  },
  {
    key: "order",
    header: "Trạng thái đơn",
    render: (o) => <StatusLabel axis="order" value={o.status} />,
  },
  {
    key: "payment",
    header: "Thanh toán",
    render: (o) => <StatusLabel axis="payment" value={paymentAxisOf(o)} />,
  },
  {
    key: "open",
    header: "",
    render: (o) => (
      <Link href={`/don-hang/${o.code}`} className="content-link font-medium">
        Mở
      </Link>
    ),
  },
];

export default function OrdersPage() {
  const overlay = useDemoOverlay();
  const [fixture, setFixture] = useState<Order[] | null>(null);

  useEffect(() => {
    let live = true;
    getOrders().then((orders) => {
      if (live) setFixture(orders);
    });
    return () => {
      live = false;
    };
  }, []);

  const rows = mergeOrdersWithOverlay(fixture ?? [], overlay)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((o) => ({ ...o, id: o.code }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Đơn hàng</h1>
      {fixture === null ? (
        <p className="text-sm text-text-muted">Đang tải…</p>
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows}
          caption="Danh sách đơn hàng của bạn"
          empty={<Empty title="Bạn chưa có đơn nào." />}
        />
      )}
    </div>
  );
}
