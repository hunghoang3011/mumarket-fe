"use client";

/*
 * /don-hang/[ma] — OrderView (DESIGN §5; J3 nguyên bảng; §7).
 * Đơn = fixture (server) ?? overlay.createdOrders; áp overlay
 * reported/cancelled/paid. QR và mọi trường chữ đọc từ CÙNG snapshot đơn
 * đã merge (D21). Tự cập nhật 30s khi đơn còn chờ; live region chỉ đọc khi
 * trạng thái đổi.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { demoNow } from "@/demo/ops";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { License, Order, OrderStatus } from "@/demo/types";
import { formatDate, formatDateTime, formatTime } from "@/shared/format/date";
import { formatVnd } from "@/shared/format/money";
import { Button, LinkButton } from "@/shared/ui/Button";
import { CopyValue } from "@/shared/ui/CopyValue";
import { Dialog } from "@/shared/ui/Dialog";
import { Notice } from "@/shared/ui/Notice";
import { OrderStatusTrio, paymentAxisOf } from "@/shared/ui/OrderStatus";
import { PaymentQR } from "@/shared/ui/PaymentQR";
import { Price } from "@/shared/ui/Price";

const ORDER_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  expired: "Hết hạn thanh toán",
};

export function OrderView({
  code,
  fixtureOrder,
  fixtureLicenses,
  paymentNote,
}: {
  code: string;
  fixtureOrder: Order | null;
  fixtureLicenses: License[];
  paymentNote: string | null;
}) {
  const overlay = useDemoOverlay();
  const [justReported, setJustReported] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const prevStatus = useRef<OrderStatus | null>(null);

  const base =
    fixtureOrder ??
    overlay.createdOrders.find((o) => o.code === code) ??
    null;

  const order: Order | null = useMemo(() => {
    if (!base) return null;
    const merged: Order = { ...base };
    const reportedAt = overlay.reported[merged.code];
    if (reportedAt) {
      merged.hasPaymentReport = true;
      merged.reportedAt = reportedAt;
    }
    if (overlay.cancelled.includes(merged.code)) merged.status = "cancelled";
    const paid = overlay.paid[merged.code];
    if (paid) {
      merged.status = "paid";
      merged.paidAt = paid.paidAt;
      merged.licenseRef = paid.licenseRef;
    }
    return merged;
  }, [base, overlay]);

  const license = order?.licenseRef
    ? ([...fixtureLicenses, ...overlay.grantedLicenses].find(
        (l) => l.reference === order.licenseRef,
      ) ?? null)
    : null;

  // Polling demo: 30s/lần khi đơn còn chờ, dừng khi paid/expired/cancelled.
  // Mốc "lần cuối" chỉ hiển thị sau khi có tick đầu tiên → không lệch hydration.
  const active = order?.status === "pending_payment";
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setLastChecked(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [active]);

  // Live region: chỉ thông báo khi trạng thái thực sự đổi.
  useEffect(() => {
    if (!order) return;
    if (prevStatus.current && prevStatus.current !== order.status) {
      setAnnouncement(
        `Trạng thái đơn đã thay đổi: ${ORDER_LABEL[order.status]}.`,
      );
    }
    prevStatus.current = order.status;
  }, [order]);

  if (!order) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Đơn hàng {code}</h1>
        <Notice tone="warning">
          <p>Không tìm thấy đơn này.</p>
          <p className="mt-2">
            <Link href="/tai-khoan/don-hang" className="content-link font-medium">
              Xem danh sách đơn hàng
            </Link>
          </p>
        </Notice>
      </div>
    );
  }

  const supportHref = `/tai-khoan/ho-tro?don=${order.code}`;
  const showTransfer =
    order.status === "pending_payment" && !order.hasPaymentReport;
  const showReported = order.hasPaymentReport && order.status !== "paid";
  const showRecreate =
    (order.status === "cancelled" || order.status === "expired") &&
    !order.hasPaymentReport &&
    !order.unresolvedReason;

  // Snapshot duy nhất cho QR và các trường chữ.
  const qrSnapshot = {
    bin: order.bank.bin,
    accountNumber: order.bank.accountNumber,
    amount: order.amountVnd,
    transferReference: order.code,
  };

  const report = () => {
    writeOverlay({
      reported: { ...overlay.reported, [order.code]: demoNow() },
    });
    setJustReported(true);
  };

  const cancel = () => {
    writeOverlay({ cancelled: [...overlay.cancelled, order.code] });
    setCancelOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Đơn hàng {order.code}</h1>
        <p className="mt-1 text-sm text-text-muted">
          Mã đơn cũng là nội dung chuyển khoản.
        </p>
      </div>

      <OrderStatusTrio
        order={order.status}
        payment={paymentAxisOf(order)}
        license={license?.status ?? null}
      />

      {active && lastChecked ? (
        <p className="text-sm text-text-muted">
          Tự cập nhật lần cuối: {formatTime(lastChecked)}
        </p>
      ) : null}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* J3: khoản tiền cần đối soát */}
      {order.unresolvedReason ? (
        <Notice tone="warning" title="Cần đối soát">
          <p>{order.unresolvedReason}</p>
          <p className="mt-2">
            <Link href={supportHref} className="content-link font-medium">
              Liên hệ hỗ trợ
            </Link>
          </p>
        </Notice>
      ) : null}

      {/* J3: đã báo chuyển khoản (mọi trạng thái đơn trừ đã thanh toán) */}
      {showReported ? (
        <Notice tone="info">
          <p>
            {justReported
              ? "Đã ghi nhận thông báo chuyển khoản. Khoản tiền vẫn đang chờ xác nhận."
              : "Đã ghi nhận thông báo chuyển khoản — chưa xác nhận tiền."}
          </p>
          {order.status === "expired" ? (
            <p className="mt-1">
              Không chuyển lại chỉ vì đơn đã hết hạn. Liên hệ hỗ trợ để kiểm
              tra khoản đã chuyển.
            </p>
          ) : null}
          <p className="mt-2">
            <Link href={supportHref} className="content-link font-medium">
              Liên hệ hỗ trợ
            </Link>
          </p>
        </Notice>
      ) : null}

      {/* J3: đã thanh toán */}
      {order.status === "paid" ? (
        <>
          <Notice tone="success">
            <p>
              Đã thanh toán lúc{" "}
              {order.paidAt ? formatDateTime(order.paidAt) : ""}.
            </p>
            {order.licenseRef ? (
              <p className="mt-1">
                Mã tham chiếu bản quyền:{" "}
                <span className="font-semibold">{order.licenseRef}</span>
              </p>
            ) : null}
          </Notice>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/tai-khoan">Đến Phần mềm của tôi</LinkButton>
            <LinkButton
              variant="outline"
              href={`/phan-mem/${order.productSlug}#tai`}
            >
              Tải phần mềm
            </LinkButton>
            <LinkButton
              variant="outline"
              href="/huong-dan/cai-dat-va-kich-hoat"
            >
              Hướng dẫn kích hoạt
            </LinkButton>
          </div>
        </>
      ) : null}

      {/* J3: hủy/hết hạn, chưa báo, chưa có khoản tiền */}
      {showRecreate ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`/phan-mem/${order.productSlug}#goi`}>
              Tạo đơn mới
            </LinkButton>
            <LinkButton variant="outline" href={supportHref}>
              Liên hệ hỗ trợ
            </LinkButton>
          </div>
          <p className="text-sm text-text-secondary">
            Nếu đã chuyển khoản, liên hệ hỗ trợ trước khi tạo đơn mới.
          </p>
        </div>
      ) : null}

      {/* Khối chuyển khoản M0 — chỉ khi đơn còn chờ và chưa báo */}
      {showTransfer ? (
        <section className="rounded-panel border border-border-subtle bg-surface-panel p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Chuyển khoản ngân hàng</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">Số tiền phải trả</span>
              <Price
                amountVnd={order.amountVnd}
                originalVnd={order.originalAmountVnd}
                size="xl"
              />
            </div>
            <CopyValue
              label="Nội dung chuyển khoản"
              value={order.code}
              copyLabel="nội dung chuyển khoản"
              large
            />
            <p className="text-sm text-text-muted">
              Giữ nguyên nội dung {order.code}. Ngân hàng có thể tự thêm chữ
              vào nội dung; điều này không ảnh hưởng.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <PaymentQR snapshot={qrSnapshot} />
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <CopyValue label="Ngân hàng" value={order.bank.bankName} />
              <CopyValue
                label="Số tài khoản"
                value={order.bank.accountNumber}
                copyLabel="số tài khoản"
              />
              <CopyValue
                label="Chủ tài khoản"
                value={order.bank.beneficiary}
                copyLabel="chủ tài khoản"
              />
              <CopyValue
                label="Số tiền"
                value={formatVnd(order.amountVnd)}
                copyLabel="số tiền"
              />
              <CopyValue
                label="Nội dung"
                value={order.code}
                copyLabel="nội dung chuyển khoản"
              />
            </div>
          </div>

          <p className="mt-6 text-sm">
            <span className="text-text-muted">Hạn thanh toán: </span>
            <span className="font-medium text-text-primary">
              {formatDateTime(order.deadline, true)}
            </span>
          </p>

          {paymentNote ? (
            <div className="mt-4">
              <Notice tone="info">{paymentNote}</Notice>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button onClick={report}>Tôi đã chuyển khoản</Button>
            <Button variant="ghost" onClick={() => setCancelOpen(true)}>
              Hủy đơn
            </Button>
          </div>
        </section>
      ) : null}

      {/* Tóm tắt nội dung đơn + lịch sử hoàn trả */}
      <section className="rounded-panel border border-border-subtle bg-surface-panel p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Nội dung đơn</h2>
        <dl className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="w-36 shrink-0 text-sm text-text-muted">Phần mềm</dt>
            <dd className="text-sm font-medium text-text-primary">
              {order.productName}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="w-36 shrink-0 text-sm text-text-muted">Gói</dt>
            <dd className="text-sm font-medium text-text-primary">
              {order.offerLabel}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="w-36 shrink-0 text-sm text-text-muted">Loại đơn</dt>
            <dd className="text-sm font-medium text-text-primary">
              {order.intent === "renewal" ? "Gia hạn" : "Mua mới"}
            </dd>
          </div>
          {order.renewalTargetRef ? (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="w-36 shrink-0 text-sm text-text-muted">
                Gia hạn cho
              </dt>
              <dd className="text-sm font-medium text-text-primary">
                {order.renewalTargetRef}
              </dd>
            </div>
          ) : null}
          {order.renewalEstimateExpiry && order.status !== "paid" ? (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="w-36 shrink-0 text-sm text-text-muted">
                Hạn mới dự kiến
              </dt>
              <dd className="text-sm font-medium text-text-primary">
                {formatDate(order.renewalEstimateExpiry)}
              </dd>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="w-36 shrink-0 text-sm text-text-muted">Số tiền</dt>
            <dd className="text-sm font-medium text-text-primary">
              <Price
                amountVnd={order.amountVnd}
                originalVnd={order.originalAmountVnd}
                size="sm"
              />
            </dd>
          </div>
          {order.refunds.map((r) => (
            <div
              key={r.at}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <dt className="w-36 shrink-0 text-sm text-text-muted">
                Lịch sử
              </dt>
              <dd className="text-sm text-text-secondary">
                Đã hoàn trả {formatVnd(r.amountVnd)} (
                {r.partial ? "một phần" : "toàn bộ"}) ngày {formatDate(r.at)}.
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Dialog
        open={cancelOpen}
        title={`Hủy đơn ${order.code}?`}
        confirmLabel="Hủy đơn"
        cancelLabel="Giữ đơn"
        confirmVariant="danger"
        onConfirm={cancel}
        onClose={() => setCancelOpen(false)}
      >
        <p className="text-sm text-text-secondary">
          Đơn {order.code} sẽ chuyển sang trạng thái Đã hủy và không thanh
          toán được nữa. Nếu bạn đã chuyển khoản nhưng chưa báo, hãy quay lại
          và dùng nút “Tôi đã chuyển khoản”, hoặc liên hệ hỗ trợ.
        </p>
      </Dialog>
    </div>
  );
}
