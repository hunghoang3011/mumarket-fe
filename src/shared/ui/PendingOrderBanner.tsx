/*
 * PendingOrderBanner (DESIGN §7): hiện ở trang sản phẩm và Phần mềm của tôi
 * khi khách có đơn đang chờ / đã báo chuyển khoản.
 */
import Link from "next/link";
import type { Order } from "@/demo/types";
import { Icon } from "./Icon";

export function PendingOrderBanner({ order }: { order: Order }) {
  if (order.status !== "pending_payment") return null;
  return (
    <div
      data-testid="pending-order-banner"
      className="flex flex-wrap items-center gap-3 rounded-panel border border-warning bg-warning-bg px-4 py-3"
    >
      <span className="text-warning">
        <Icon name="clock" size={20} />
      </span>
      <p className="text-sm text-text-primary">
        {order.hasPaymentReport ? (
          <>
            Đơn {order.code} ({order.productName} — {order.offerLabel}) đang
            chờ xác nhận tiền.
          </>
        ) : (
          <>
            Đơn {order.code} ({order.productName} — {order.offerLabel}) đang
            chờ thanh toán.
          </>
        )}
      </p>
      <Link
        href={`/don-hang/${order.code}`}
        className="content-link ml-auto inline-flex min-h-11 items-center text-sm font-medium"
      >
        Mở đơn {order.code}
      </Link>
    </div>
  );
}
