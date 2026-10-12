/*
 * OrderStatus (DESIGN §7): ba dòng có nhãn — Trạng thái đơn / Thanh toán /
 * Bản quyền. Dữ liệu từ props; không thanh tiến trình giả.
 */
import type { LicenseStatus, OrderStatus, PaymentAxis } from "@/demo/types";
import { StatusLabel } from "./StatusLabel";

export function OrderStatusTrio({
  order,
  payment,
  license,
}: {
  order: OrderStatus;
  payment: PaymentAxis;
  license: LicenseStatus | null;
}) {
  return (
    <dl data-testid="order-status" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <dt className="w-28 shrink-0 text-sm text-text-muted">Trạng thái đơn</dt>
        <dd>
          <StatusLabel axis="order" value={order} size="md" />
        </dd>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <dt className="w-28 shrink-0 text-sm text-text-muted">Thanh toán</dt>
        <dd data-testid="payment-status">
          <StatusLabel axis="payment" value={payment} size="md" />
        </dd>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <dt className="w-28 shrink-0 text-sm text-text-muted">Bản quyền</dt>
        <dd>
          {license ? (
            <StatusLabel axis="license" value={license} size="md" />
          ) : (
            <span className="text-sm text-text-muted">Chưa có</span>
          )}
        </dd>
      </div>
    </dl>
  );
}

/** Trục thanh toán suy ra từ dữ liệu đơn (bảng J3). */
export function paymentAxisOf(o: {
  status: OrderStatus;
  hasPaymentReport: boolean;
  unresolvedReason: string | null;
  paidAt: string | null;
}): PaymentAxis {
  if (o.paidAt) return "received";
  if (o.unresolvedReason) return "unresolved";
  if (o.hasPaymentReport) return "reported";
  return "none";
}
