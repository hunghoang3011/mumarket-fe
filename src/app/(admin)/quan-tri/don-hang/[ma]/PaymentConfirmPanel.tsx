"use client";

/*
 * PaymentConfirmPanel (DESIGN §5 Quản trị · Chi tiết đơn, J5.1/J5.4):
 * - Đơn chờ thanh toán → khối "Xác nhận đã nhận tiền" (snapshot chỉ đọc;
 *   sửa số tiền khác dự kiến → chế độ "Ghi nhận khoản tiền lệch", lý do bắt
 *   buộc, khoản tiền không cấp bản quyền mà đi sang Đối soát).
 * - Đơn đã thanh toán → thông tin duyệt + "Ghi nhận hoàn tiền đơn đã thanh
 *   toán" (tách khỏi thu hồi bản quyền, J5.4).
 * Demo: xác nhận đúng tiền ghi overlay paid + grantedLicenses; khoản lệch
 * chỉ hiện thông báo (fixture RC-2026-1041 đã mô phỏng sẵn trạng thái đó).
 */
import Link from "next/link";
import { useState } from "react";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import { demoNow, licenseFromOrder, newLicenseRef } from "@/demo/ops";
import type { License, Order } from "@/demo/types";
import { formatDateTime } from "@/shared/format/date";
import { formatVnd } from "@/shared/format/money";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Field } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";

/** datetime-local cần giờ địa phương; demo hiển thị giờ Việt Nam (+07:00). Dùng chung với ReceiptWorkbench. */
export function toLocalInputValue(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function localInputToIso(value: string): string | null {
  const withOffset = value.length === 16 ? `${value}:00+07:00` : `${value}+07:00`;
  const d = new Date(withOffset);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function parseAmount(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Bản quyền được cấp khi duyệt đơn: mua mới → bản mới; gia hạn → cộng hạn vào bản đích. */
export function licenseGrantedByOrder(
  order: Order,
  ref: string,
  paidAt: string,
  renewalTarget: License | null,
): License {
  if (order.intent === "renewal" && renewalTarget) {
    const baseMs = new Date(renewalTarget.expiresAt ?? paidAt).getTime();
    return {
      ...renewalTarget,
      expiresAt: new Date(baseMs + order.durationDays * 86_400_000).toISOString(),
      renewals: [
        ...renewalTarget.renewals,
        { at: paidAt, addedDays: order.durationDays, orderCode: order.code },
      ],
    };
  }
  return licenseFromOrder(order, ref);
}

interface FormErrors {
  bankRef?: string;
  receivedAt?: string;
  amount?: string;
  reason?: string;
}

export function PaymentConfirmPanel({
  order,
  renewalTarget,
  existingRefs,
}: {
  order: Order;
  renewalTarget: License | null;
  existingRefs: string[];
}) {
  const overlay = useDemoOverlay();

  const [bankRef, setBankRef] = useState("");
  const [receivedAt, setReceivedAt] = useState(() => toLocalInputValue(demoNow()));
  const [amount, setAmount] = useState(String(order.amountVnd));
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [deviationRecorded, setDeviationRecorded] = useState(false);

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundTxn, setRefundTxn] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundErrors, setRefundErrors] = useState<FormErrors>({});
  const [refundDone, setRefundDone] = useState<string[]>([]);

  const receivedAmount = parseAmount(amount);
  const deviating = receivedAmount != null && receivedAmount !== order.amountVnd;

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!bankRef.trim()) next.bankRef = "Nhập mã giao dịch ngân hàng.";
    if (!localInputToIso(receivedAt)) next.receivedAt = "Chọn thời điểm nhận.";
    if (receivedAmount == null) next.amount = "Nhập số tiền thực nhận.";
    if (deviating && !reason.trim()) {
      next.reason = "Nhập lý do ghi nhận khoản tiền lệch.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const confirm = () => {
    if (busy) return;
    setBusy(true);
    const paidAt = localInputToIso(receivedAt) ?? demoNow();
    if (!deviating) {
      const isRenewal = order.intent === "renewal" && renewalTarget != null;
      const ref = isRenewal ? renewalTarget.reference : newLicenseRef(existingRefs);
      const granted = licenseGrantedByOrder(order, ref, paidAt, renewalTarget);
      writeOverlay({
        paid: { ...overlay.paid, [order.code]: { paidAt, licenseRef: ref } },
        grantedLicenses: [...overlay.grantedLicenses, granted],
      });
      setJustConfirmed(true);
    } else {
      setDeviationRecorded(true);
    }
    setBusy(false);
    setConfirmOpen(false);
  };

  const submitRefund = () => {
    const next: FormErrors = {};
    const value = parseAmount(refundAmount);
    if (value == null) next.amount = "Nhập số tiền hoàn.";
    else if (value > order.amountVnd) {
      next.amount = "Số tiền hoàn không được lớn hơn số tiền của đơn.";
    }
    if (!refundTxn.trim()) next.bankRef = "Nhập mã giao dịch chuyển đi.";
    if (!refundReason.trim()) next.reason = "Nhập lý do hoàn tiền.";
    setRefundErrors(next);
    if (Object.keys(next).length > 0 || value == null) return;
    setRefundDone((prev) => [...prev, `${formatVnd(value)} — ${refundTxn.trim()}`]);
    setRefundOpen(false);
    setRefundAmount("");
    setRefundTxn("");
    setRefundReason("");
  };

  return (
    <section data-testid="admin-confirm-payment" className="flex flex-col gap-4">
      {justConfirmed ? (
        <Notice tone="success" role="status">
          Đã xác nhận. Đơn chuyển sang Đã thanh toán.
        </Notice>
      ) : null}

      {order.status === "pending_payment" && !deviationRecorded ? (
        <div className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel p-5">
          <h2 className="text-lg font-semibold text-text-primary">
            {deviating ? "Ghi nhận khoản tiền lệch" : "Xác nhận đã nhận tiền"}
          </h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex flex-wrap items-baseline gap-2">
              <dt className="w-40 shrink-0 text-text-muted">Số tiền dự kiến</dt>
              <dd>
                <Price
                  amountVnd={order.amountVnd}
                  originalVnd={order.originalAmountVnd}
                  size="sm"
                />
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <dt className="w-40 shrink-0 text-text-muted">Tài khoản nhận</dt>
              <dd className="text-text-primary">
                {order.bank.bankName} — {order.bank.accountNumber} —{" "}
                {order.bank.beneficiary}
              </dd>
            </div>
          </dl>
          {deviating ? (
            <Notice tone="warning">
              Khoản tiền sẽ vào trạng thái Cần đối soát.
            </Notice>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Mã giao dịch ngân hàng"
              required
              value={bankRef}
              onChange={(e) => setBankRef(e.target.value)}
              error={errors.bankRef}
              autoComplete="off"
            />
            <Field
              label="Thời điểm nhận"
              required
              type="datetime-local"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
              error={errors.receivedAt}
              hint="Giờ Việt Nam"
            />
            <Field
              label="Số tiền thực nhận"
              required
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              hint="Đơn vị: đồng"
            />
            {deviating ? (
              <Field
                label="Lý do"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={errors.reason}
                hint="Ví dụ: khách chuyển thiếu 60.000 ₫ so với đơn"
              />
            ) : null}
          </div>
          <div>
            <Button onClick={submit} loading={busy}>
              {deviating ? "Ghi nhận khoản tiền lệch" : "Xác nhận đã nhận tiền"}
            </Button>
          </div>
        </div>
      ) : null}

      {deviationRecorded ? (
        <Notice tone="success" role="status" title="Đã ghi nhận khoản tiền lệch">
          <p>
            Khoản tiền đang ở mục Đối soát.{" "}
            <Link
              href="/quan-tri/thanh-toan"
              className="text-link underline underline-offset-2 hover:text-action"
            >
              Mở mục Đối soát
            </Link>
          </p>
        </Notice>
      ) : null}

      {order.status === "paid" ? (
        <div className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel p-5">
          <h2 className="text-lg font-semibold text-text-primary">
            Đã duyệt thanh toán
          </h2>
          <p className="text-sm text-text-secondary">
            Nhận tiền lúc{" "}
            {order.paidAt ? formatDateTime(order.paidAt, true) : "—"}
            {order.licenseRef
              ? ` — bản quyền ${order.licenseRef} đã được cấp${
                  order.intent === "renewal" ? " (gia hạn)" : ""
                }.`
              : "."}
          </p>
          {refundDone.length > 0 ? (
            <Notice tone="success" role="status" title="Đã ghi nhận khoản hoàn tiền thực tế">
              <p>
                Thao tác này không tự chuyển tiền hoặc thu hồi bản quyền.
              </p>
              <ul className="mt-1 list-disc pl-5">
                {refundDone.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Notice>
          ) : null}
          <div>
            <Button variant="danger" onClick={() => setRefundOpen(true)}>
              Ghi nhận hoàn tiền đơn đã thanh toán
            </Button>
          </div>
        </div>
      ) : null}

      {order.status === "cancelled" || order.status === "expired" ? (
        <div className="flex flex-col gap-3">
          <Notice tone="neutral">
            {order.status === "cancelled"
              ? "Đơn đã hủy — không còn thao tác xác nhận tiền trên đơn này."
              : "Đơn hết hạn thanh toán — không còn thao tác xác nhận tiền trên đơn này."}
          </Notice>
          {order.unresolvedReason ? (
            <Notice tone="warning" title="Có khoản tiền cần đối soát">
              <p>
                {order.unresolvedReason}.{" "}
                <Link
                  href="/quan-tri/thanh-toan"
                  className="text-link underline underline-offset-2 hover:text-action"
                >
                  Mở mục Đối soát
                </Link>
              </p>
            </Notice>
          ) : null}
        </div>
      ) : null}

      <Dialog
        open={confirmOpen}
        title={
          deviating
            ? `Ghi nhận khoản tiền lệch cho đơn ${order.code}`
            : `Xác nhận đã nhận tiền cho đơn ${order.code}`
        }
        confirmLabel={
          deviating ? "Ghi nhận khoản tiền lệch" : "Xác nhận đã nhận tiền"
        }
        loading={busy}
        onConfirm={confirm}
        onClose={() => setConfirmOpen(false)}
      >
        {deviating ? (
          <p>
            Khoản tiền {receivedAmount != null ? formatVnd(receivedAmount) : ""}{" "}
            lệch so với số tiền dự kiến {formatVnd(order.amountVnd)} sẽ vào trạng
            thái Cần đối soát. Đơn {order.code} chưa được cấp bản quyền.
          </p>
        ) : (
          <p>
            Xác nhận đã nhận {formatVnd(order.amountVnd)} cho đơn {order.code}.
            {order.intent === "renewal" && renewalTarget
              ? ` Hệ thống sẽ gia hạn ${order.durationDays} ngày cho bản quyền ${renewalTarget.reference}.`
              : " Hệ thống sẽ cấp bản quyền mới cho đơn này."}
          </p>
        )}
      </Dialog>

      <Dialog
        open={refundOpen}
        title={`Ghi nhận hoàn tiền đơn ${order.code}`}
        confirmLabel="Ghi nhận hoàn tiền"
        confirmVariant="danger"
        onConfirm={submitRefund}
        onClose={() => setRefundOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p>
            Ghi nhận khoản hoàn tiền đã chuyển ngoài hệ thống. Thao tác không tự
            chuyển tiền hoặc thu hồi bản quyền — thu hồi bản quyền là thao tác
            riêng tại mục Bản quyền.
          </p>
          <Field
            label={`Số tiền hoàn (tối đa ${formatVnd(order.amountVnd)})`}
            required
            inputMode="numeric"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            error={refundErrors.amount}
          />
          <Field
            label="Mã giao dịch chuyển đi"
            required
            value={refundTxn}
            onChange={(e) => setRefundTxn(e.target.value)}
            error={refundErrors.bankRef}
            autoComplete="off"
          />
          <Field
            label="Lý do"
            required
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            error={refundErrors.reason}
          />
        </div>
      </Dialog>
    </section>
  );
}
