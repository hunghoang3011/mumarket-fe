"use client";

/*
 * /quan-tri/don-hang/[ma] — chi tiết đơn (DESIGN §5 Quản trị · Chi tiết đơn,
 * J5.1). Toàn trang là client leaf vì đơn có thể được tạo trong phiên demo
 * (lớp phủ localStorage) và trạng thái đổi ngay khi admin xác nhận tiền;
 * nguồn nền là fixtures demo, tôn trọng DEMO_ENABLED giống getOrder().
 * Thông tin snapshot (game/gói/tiền/hạn/ngân hàng nhận) chỉ đọc — thao tác
 * xác nhận/hoàn tiền nằm trong PaymentConfirmPanel.
 */
import { notFound, useParams } from "next/navigation";
import { DEMO_ENABLED } from "@/demo/config";
import { demoLicenses } from "@/demo/fixtures/licensing";
import { demoOrders } from "@/demo/fixtures/commerce";
import { demoUsers } from "@/demo/fixtures/content";
import { useDemoOverlay } from "@/demo/store";
import {
  mergeLicensesWithOverlay,
  mergeOrdersWithOverlay,
} from "@/app/(customer)/tai-khoan/LicenseSections";
import { formatDateTime } from "@/shared/format/date";
import { OrderStatusTrio, paymentAxisOf } from "@/shared/ui/OrderStatus";
import { Price } from "@/shared/ui/Price";
import { PaymentConfirmPanel } from "./PaymentConfirmPanel";

const CUSTOMER_EMAIL = DEMO_ENABLED ? demoUsers.customer.email : "";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:grid sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="text-sm text-text-primary">{value}</dd>
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const { ma } = useParams<{ ma: string }>();
  const overlay = useDemoOverlay();

  const orders = mergeOrdersWithOverlay(
    DEMO_ENABLED ? demoOrders : [],
    overlay,
  );
  const order = orders.find((o) => o.code === ma);
  if (!order) notFound();

  const licenses = mergeLicensesWithOverlay(
    DEMO_ENABLED ? demoLicenses : [],
    overlay,
  );
  const license = order.licenseRef
    ? (licenses.find((l) => l.reference === order.licenseRef) ?? null)
    : null;
  const renewalTarget = order.renewalTargetRef
    ? (licenses.find((l) => l.reference === order.renewalTargetRef) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        Đơn {order.code}
      </h1>

      <OrderStatusTrio
        order={order.status}
        payment={paymentAxisOf(order)}
        license={license?.status ?? null}
      />

      <section
        aria-label="Thông tin đơn hàng"
        className="rounded-panel border border-border-subtle bg-surface-panel p-5"
      >
        <dl className="flex flex-col gap-3">
          <Item label="Mã đơn" value={order.code} />
          <Item label="Khách hàng" value={CUSTOMER_EMAIL} />
          <Item label="Sản phẩm" value={order.productName} />
          <Item label="Gói" value={order.offerLabel} />
          <Item
            label="Loại đơn"
            value={order.intent === "renewal" ? "Gia hạn" : "Mua mới"}
          />
          {order.renewalTargetRef ? (
            <Item
              label="Gia hạn cho bản quyền"
              value={order.renewalTargetRef}
            />
          ) : null}
          <Item
            label="Số tiền"
            value={
              <Price
                amountVnd={order.amountVnd}
                originalVnd={order.originalAmountVnd}
                size="sm"
              />
            }
          />
          <Item
            label="Thời điểm tạo"
            value={formatDateTime(order.createdAt, true)}
          />
          <Item
            label="Hạn thanh toán"
            value={formatDateTime(order.deadline, true)}
          />
          <Item label="Ngân hàng nhận" value={order.bank.bankName} />
          <Item label="Số tài khoản" value={order.bank.accountNumber} />
          <Item label="Chủ tài khoản" value={order.bank.beneficiary} />
          {order.reportedAt ? (
            <Item
              label="Khách báo chuyển khoản lúc"
              value={formatDateTime(order.reportedAt, true)}
            />
          ) : null}
          {order.unresolvedReason ? (
            <Item label="Ghi chú đối soát" value={order.unresolvedReason} />
          ) : null}
          {order.refunds.length > 0 ? (
            <Item
              label="Hoàn tiền đã ghi nhận"
              value={
                <ul className="flex flex-col gap-1">
                  {order.refunds.map((r) => (
                    <li key={r.at}>
                      <Price amountVnd={r.amountVnd} size="sm" /> —{" "}
                      {formatDateTime(r.at)} ({r.partial ? "một phần" : "toàn bộ"})
                    </li>
                  ))}
                </ul>
              }
            />
          ) : null}
        </dl>
      </section>

      <PaymentConfirmPanel
        order={order}
        renewalTarget={renewalTarget}
        existingRefs={licenses.map((l) => l.reference)}
      />
    </div>
  );
}
