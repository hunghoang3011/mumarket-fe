"use client";

/*
 * ReceiptWorkbench (DESIGN §5 Quản trị · Đối soát, J5.2–3): form "Nhập khoản
 * tiền đã nhận" (gợi ý đơn bằng khớp CHÍNH XÁC mã GA+5 ký tự, không fuzzy);
 * trái/trên danh sách khoản tiền, phải/dưới chi tiết 4 chỉ số + lịch sử +
 * bảng so sánh với đơn gợi ý; ba nút tách biệt Áp dụng vào đơn · Duyệt muộn ·
 * Ghi nhận đã hoàn trả (khoản hoàn hết không còn nút Áp dụng).
 * Demo: áp dụng/duyệt muộn ghi overlay receiptsApplied + paid + cấp bản
 * quyền; hoàn trả ghi receiptsReturned; khoản nhập mới là state client.
 */
import { useState, type ReactNode } from "react";
import { demoNow, newLicenseRef } from "@/demo/ops";
import { demoBank } from "@/demo/fixtures/commerce";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { BankReceipt, License, Order } from "@/demo/types";
import { licenseGrantedByOrder, localInputToIso, parseAmount, toLocalInputValue } from "@/app/(admin)/quan-tri/don-hang/[ma]/PaymentConfirmPanel";
import { mergeLicensesWithOverlay, mergeOrdersWithOverlay } from "@/app/(customer)/tai-khoan/LicenseSections";
import { formatDateTime } from "@/shared/format/date";
import { formatVnd } from "@/shared/format/money";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Dialog } from "@/shared/ui/Dialog";
import { Field } from "@/shared/ui/Field";
import { Empty, Notice } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";

type ReceiptTab = "unresolved" | "applied" | "returned";

const STATE_PILL: Record<ReceiptTab, { label: string; cls: string }> = {
  unresolved: { label: "Cần đối soát", cls: "bg-warning-bg text-warning" },
  applied: { label: "Đã áp dụng", cls: "bg-success-bg text-success" },
  returned: { label: "Đã hoàn trả", cls: "bg-surface-raised text-neutral" },
};
const EMPTY_TAB: Record<ReceiptTab, string> = {
  unresolved: "Không còn khoản tiền nào cần đối soát",
  applied: "Chưa có khoản tiền nào được áp dụng",
  returned: "Chưa có khoản tiền nào được hoàn trả",
};

interface EffectiveReceipt extends BankReceipt {
  effectiveState: ReceiptTab;
  appliedTotal: number;
  returnedTotal: number;
  remaining: number;
  appliedCode: string | null;
  historyAll: BankReceipt["history"];
}

/** Khớp chính xác mã đơn (GA + 5 ký tự) trong nội dung chuyển khoản — không fuzzy. */
function extractOrderCode(memo: string): string | null {
  const normalized = memo.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/GA[A-Z0-9]{5}/);
  return match ? match[0] : null;
}

type FieldErrors = Partial<
  Record<"amount" | "bankRef" | "memo" | "receivedAt" | "reason", string>
>;
type DialogState =
  | { kind: "apply" | "late"; receipt: EffectiveReceipt; order: Order }
  | { kind: "return"; receipt: EffectiveReceipt };

export function ReceiptWorkbench({
  receipts,
  orders,
  licenses,
  activeTab,
}: {
  receipts: BankReceipt[];
  orders: Order[];
  licenses: License[];
  activeTab: ReceiptTab;
}) {
  const overlay = useDemoOverlay();
  const [localReceipts, setLocalReceipts] = useState<BankReceipt[]>([]);
  const [localHistory, setLocalHistory] = useState<Record<string, BankReceipt["history"]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [addAmount, setAddAmount] = useState("");
  const [addBankRef, setAddBankRef] = useState("");
  const [addMemo, setAddMemo] = useState("");
  const [addReceivedAt, setAddReceivedAt] = useState(() => toLocalInputValue(demoNow()));
  const [addErrors, setAddErrors] = useState<FieldErrors>({});
  const [addDone, setAddDone] = useState<string | null>(null);

  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [dialogReason, setDialogReason] = useState("");
  const [retAmount, setRetAmount] = useState("");
  const [retTxn, setRetTxn] = useState("");
  const [dialogErrors, setDialogErrors] = useState<FieldErrors>({});

  const mergedOrders = mergeOrdersWithOverlay(orders, overlay);
  const mergedLicenses = mergeLicensesWithOverlay(licenses, overlay);

  const effective: EffectiveReceipt[] = [...receipts, ...localReceipts].map((r) => {
    const appliedCode = overlay.receiptsApplied[r.id] ?? r.appliedOrderCode;
    const appliedTotal = overlay.receiptsApplied[r.id] ? r.amountVnd : r.appliedVnd;
    const returnedTotal = r.returnedVnd + (overlay.receiptsReturned[r.id] ?? 0);
    const effectiveState: ReceiptTab = appliedCode
      ? "applied"
      : returnedTotal >= r.amountVnd
        ? "returned"
        : "unresolved";
    return {
      ...r,
      appliedCode,
      appliedTotal,
      returnedTotal,
      effectiveState,
      remaining: r.amountVnd - appliedTotal - returnedTotal,
      historyAll: [...r.history, ...(localHistory[r.id] ?? [])],
    };
  });

  const shown = effective.filter((r) => r.effectiveState === activeTab);
  const selected = shown.find((r) => r.id === selectedId) ?? shown[0] ?? null;
  const suggestedOrder = selected?.suggestedOrderCode
    ? (mergedOrders.find((o) => o.code === selected.suggestedOrderCode) ?? null)
    : null;
  const amountMatches =
    selected != null && suggestedOrder != null && selected.amountVnd === suggestedOrder.amountVnd;
  const canAct = selected != null && selected.effectiveState === "unresolved";

  const submitAdd = () => {
    const next: FieldErrors = {};
    const amountVnd = parseAmount(addAmount);
    const receivedIso = localInputToIso(addReceivedAt);
    if (amountVnd == null) next.amount = "Nhập số tiền đã nhận.";
    if (!addBankRef.trim()) next.bankRef = "Nhập mã giao dịch ngân hàng.";
    if (!addMemo.trim()) next.memo = "Nhập nội dung chuyển khoản.";
    if (!receivedIso) next.receivedAt = "Chọn thời điểm nhận.";
    setAddErrors(next);
    if (Object.keys(next).length > 0 || amountVnd == null || !receivedIso) return;

    const maxSeq = effective.reduce((max, r) => {
      const m = /^RC-2026-(\d+)$/.exec(r.id);
      return m ? Math.max(max, Number.parseInt(m[1], 10)) : max;
    }, 1052);
    const suggested = extractOrderCode(addMemo);
    const receipt: BankReceipt = {
      id: `RC-2026-${maxSeq + 1}`,
      state: "unresolved",
      amountVnd,
      appliedVnd: 0,
      returnedVnd: 0,
      bankReference: addBankRef.trim(),
      memo: addMemo.trim(),
      receivedAt: receivedIso,
      receivingAccount: demoBank.accountNumber,
      suggestedOrderCode: suggested,
      appliedOrderCode: null,
      reason: suggested ? null : "Không tìm thấy mã đơn trong nội dung",
      history: [
        {
          at: demoNow(),
          actor: "admin@galaxy.auto",
          action: suggested ? `Nhập khoản tiền đã nhận — gợi ý đơn ${suggested}` : "Nhập khoản tiền đã nhận (chưa biết đơn)",
        },
      ],
    };
    setLocalReceipts((prev) => [...prev, receipt]);
    setSelectedId(receipt.id);
    setAddDone(`Đã nhập khoản tiền ${receipt.id}. Khoản tiền đang ở mục Cần đối soát.`);
    setAddAmount("");
    setAddBankRef("");
    setAddMemo("");
  };

  const openDialog = (kind: "apply" | "late" | "return") => {
    if (!selected) return;
    setDialogReason("");
    setRetAmount("");
    setRetTxn("");
    setDialogErrors({});
    if (kind === "return") setDialog({ kind, receipt: selected });
    else if (suggestedOrder) setDialog({ kind, receipt: selected, order: suggestedOrder });
  };

  const confirmApply = (receipt: EffectiveReceipt, order: Order, late: boolean) => {
    if (late && !dialogReason.trim()) {
      setDialogErrors({ reason: "Nhập lý do duyệt muộn." });
      return;
    }
    if (busy) return;
    setBusy(true);
    const paidAt = demoNow();
    const target =
      order.intent === "renewal" && order.renewalTargetRef
        ? (mergedLicenses.find((l) => l.reference === order.renewalTargetRef) ?? null)
        : null;
    const ref = target ? target.reference : newLicenseRef(mergedLicenses.map((l) => l.reference));
    writeOverlay({
      receiptsApplied: { ...overlay.receiptsApplied, [receipt.id]: order.code },
      paid: { ...overlay.paid, [order.code]: { paidAt, licenseRef: ref } },
      grantedLicenses: [...overlay.grantedLicenses, licenseGrantedByOrder(order, ref, paidAt, target)],
    });
    setLocalHistory((prev) => ({
      ...prev,
      [receipt.id]: [
        ...(prev[receipt.id] ?? []),
        {
          at: paidAt,
          actor: "admin@galaxy.auto",
          action: late ? `Duyệt muộn đơn ${order.code} — ${dialogReason.trim()}` : `Áp dụng khoản tiền vào đơn ${order.code}`,
        },
      ],
    }));
    setFeedback(
      late
        ? `Đã duyệt muộn. Đơn ${order.code} chuyển sang Đã thanh toán.`
        : `Đã áp dụng khoản tiền vào đơn ${order.code}. Đơn chuyển sang Đã thanh toán.`,
    );
    setBusy(false);
    setDialog(null);
  };

  const confirmReturn = (receipt: EffectiveReceipt) => {
    const value = parseAmount(retAmount);
    const next: FieldErrors = {};
    if (value == null) next.amount = "Nhập số tiền đã hoàn trả.";
    else if (value > receipt.remaining) {
      next.amount = `Số tiền hoàn trả không được lớn hơn số còn lại (${formatVnd(receipt.remaining)}).`;
    }
    if (!retTxn.trim()) next.bankRef = "Nhập mã giao dịch chuyển đi.";
    if (!dialogReason.trim()) next.reason = "Nhập lý do hoàn trả.";
    setDialogErrors(next);
    if (Object.keys(next).length > 0 || value == null || busy) return;
    setBusy(true);
    writeOverlay({
      receiptsReturned: {
        ...overlay.receiptsReturned,
        [receipt.id]: (overlay.receiptsReturned[receipt.id] ?? 0) + value,
      },
    });
    setLocalHistory((prev) => ({
      ...prev,
      [receipt.id]: [
        ...(prev[receipt.id] ?? []),
        { at: demoNow(), actor: "admin@galaxy.auto", action: `Ghi nhận đã hoàn trả ${formatVnd(value)} — ${retTxn.trim()}` },
      ],
    }));
    setFeedback("Đã ghi nhận khoản hoàn trả thực tế. Thao tác này không tự chuyển tiền hoặc thu hồi bản quyền.");
    setBusy(false);
    setDialog(null);
  };

  const columns: Column<EffectiveReceipt>[] = [
    { key: "id", header: "Mã khoản", render: (r) => <span className="font-medium">{r.id}</span> },
    { key: "amount", header: "Số tiền", align: "right", render: (r) => formatVnd(r.amountVnd) },
    { key: "memo", header: "Nội dung chuyển khoản", render: (r) => r.memo },
    { key: "receivedAt", header: "Thời điểm nhận", render: (r) => formatDateTime(r.receivedAt) },
    { key: "suggested", header: "Gợi ý đơn", render: (r) => r.suggestedOrderCode ?? "—" },
    {
      key: "open",
      header: "Thao tác",
      render: (r) =>
        selected?.id === r.id ? (
          <span className="text-text-muted">Đang xem</span>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setSelectedId(r.id)}>Xem</Button>
        ),
    },
  ];

  // ---- Dữ liệu cho vùng chi tiết + dialog (tính khi có lựa chọn) ----
  const metrics: [string, number][] = selected
    ? [
        ["Đã nhận", selected.amountVnd],
        ["Đã áp dụng", selected.appliedTotal],
        ["Đã hoàn trả", selected.returnedTotal],
        ["Còn lại", selected.remaining],
      ]
    : [];

  const detailRows: [string, ReactNode][] = selected
    ? [
        ["Mã giao dịch ngân hàng", selected.bankReference],
        ["Nội dung chuyển khoản", selected.memo],
        ["Tài khoản nhận", selected.receivingAccount],
        ["Thời điểm nhận", formatDateTime(selected.receivedAt, true)],
        ...(selected.reason ? [["Ghi chú", selected.reason] as [string, ReactNode]] : []),
        ...(selected.appliedCode ? [["Đã áp dụng vào đơn", selected.appliedCode] as [string, ReactNode]] : []),
      ]
    : [];

  const deadlineText = !suggestedOrder
    ? ""
    : suggestedOrder.status === "pending_payment"
      ? suggestedOrder.deadline >= demoNow()
        ? `Còn hạn tới ${formatDateTime(suggestedOrder.deadline)}`
        : "Đã quá hạn thanh toán"
      : suggestedOrder.status === "paid"
        ? "Đơn đã thanh toán"
        : "Đơn không còn hiệu lực";

  const compareRows: [string, ReactNode, ReactNode][] =
    selected && suggestedOrder
      ? [
          ["Tài khoản nhận", selected.receivingAccount, `${suggestedOrder.bank.accountNumber}${selected.receivingAccount === suggestedOrder.bank.accountNumber ? " — khớp" : " — khác"}`],
          ["Mã trong nội dung", selected.suggestedOrderCode, `${suggestedOrder.code} — khớp chính xác`],
          ["Số tiền", formatVnd(selected.amountVnd), `Dự kiến ${formatVnd(suggestedOrder.amountVnd)}${amountMatches ? " — khớp" : ` — lệch ${formatVnd(Math.abs(selected.amountVnd - suggestedOrder.amountVnd))}`}`],
          ["Trạng thái đơn", "—", <StatusLabel key="st" axis="order" value={suggestedOrder.status} />],
          ["Còn hạn không", "—", deadlineText],
        ]
      : [];

  let dialogTitle = "";
  let dialogConfirm = "";
  let dialogContent: ReactNode = null;
  let dialogConfirmFn: (() => void) | undefined;
  if (dialog?.kind === "apply" || dialog?.kind === "late") {
    const { receipt, order } = dialog;
    const late = dialog.kind === "late";
    dialogTitle = late ? `Duyệt muộn đơn ${order.code}` : `Áp dụng khoản tiền vào đơn ${order.code}`;
    dialogConfirm = late ? "Duyệt muộn" : "Áp dụng vào đơn";
    dialogConfirmFn = () => confirmApply(receipt, order, late);
    dialogContent = (
      <div className="flex flex-col gap-4">
        <p>
          {late
            ? `Đơn ${order.code} đã ${order.status === "cancelled" ? "hủy" : "hết hạn thanh toán"}. Duyệt muộn sẽ xác nhận khoản tiền ${formatVnd(receipt.amountVnd)} và cấp bản quyền cho đơn này.`
            : `Khoản tiền ${formatVnd(receipt.amountVnd)} khớp đúng số tiền dự kiến của đơn ${order.code}. Hệ thống sẽ xác nhận đơn và ${order.intent === "renewal" ? `gia hạn bản quyền ${order.renewalTargetRef}` : "cấp bản quyền mới"}.`}
        </p>
        {late ? (
          <Field label="Lý do duyệt muộn" required value={dialogReason} onChange={(e) => setDialogReason(e.target.value)} error={dialogErrors.reason} />
        ) : null}
      </div>
    );
  } else if (dialog?.kind === "return") {
    const { receipt } = dialog;
    dialogTitle = `Ghi nhận đã hoàn trả khoản ${receipt.id}`;
    dialogConfirm = "Ghi nhận đã hoàn trả";
    dialogConfirmFn = () => confirmReturn(receipt);
    dialogContent = (
      <div className="flex flex-col gap-4">
        <p>
          Ghi nhận khoản hoàn trả đã chuyển ngoài hệ thống. Thao tác không tự
          chuyển tiền hoặc thu hồi bản quyền.
        </p>
        <Field label={`Số tiền đã hoàn trả (tối đa ${formatVnd(receipt.remaining)})`} required inputMode="numeric" value={retAmount} onChange={(e) => setRetAmount(e.target.value)} error={dialogErrors.amount} />
        <Field label="Mã giao dịch chuyển đi" required value={retTxn} onChange={(e) => setRetTxn(e.target.value)} error={dialogErrors.bankRef} autoComplete="off" />
        <Field label="Lý do" required value={dialogReason} onChange={(e) => setDialogReason(e.target.value)} error={dialogErrors.reason} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="receipt-workbench">
      <section
        aria-label="Nhập khoản tiền đã nhận"
        className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel p-5"
      >
        <h2 className="text-lg font-semibold text-text-primary">Nhập khoản tiền đã nhận</h2>
        <p className="text-sm text-text-secondary">
          Dùng khi khoản tiền về tài khoản nhưng chưa biết thuộc đơn nào. Hệ
          thống gợi ý đơn khi nội dung chứa đúng mã đơn (khớp chính xác).
        </p>
        {addDone ? <Notice tone="success" role="status">{addDone}</Notice> : null}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Số tiền" required inputMode="numeric" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} error={addErrors.amount} hint="Đơn vị: đồng" />
          <Field label="Mã giao dịch ngân hàng" required value={addBankRef} onChange={(e) => setAddBankRef(e.target.value)} error={addErrors.bankRef} autoComplete="off" />
          <Field label="Nội dung chuyển khoản" required value={addMemo} onChange={(e) => setAddMemo(e.target.value)} error={addErrors.memo} />
          <Field label="Thời điểm nhận" required type="datetime-local" value={addReceivedAt} onChange={(e) => setAddReceivedAt(e.target.value)} error={addErrors.receivedAt} hint="Giờ Việt Nam" />
        </div>
        <div>
          <Button onClick={submitAdd}>Nhập khoản tiền</Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {feedback ? (
          <div className="lg:col-span-2">
            <Notice tone="success" role="status">
              {feedback}
            </Notice>
          </div>
        ) : null}

        <DataTable
          columns={columns}
          rows={shown}
          caption="Danh sách khoản tiền"
          empty={<Empty title={EMPTY_TAB[activeTab]} />}
        />

        {selected ? (
          <section
            aria-label={`Chi tiết khoản tiền ${selected.id}`}
            className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-text-primary">{selected.id}</h2>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATE_PILL[selected.effectiveState].cls}`}
              >
                {STATE_PILL[selected.effectiveState].label}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {metrics.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-text-muted">{label}</dt>
                  <dd>
                    <Price amountVnd={value} size="sm" />
                  </dd>
                </div>
              ))}
            </dl>

            <dl className="flex flex-col gap-2 text-sm">
              {detailRows.map(([label, value]) => (
                <div key={label} className="flex flex-wrap gap-2">
                  <dt className="w-40 shrink-0 text-text-muted">{label}</dt>
                  <dd className="text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>

            {suggestedOrder ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-text-primary">
                  So sánh với đơn {suggestedOrder.code}
                </h3>
                <div className="overflow-x-auto rounded-panel border border-border-subtle">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border-subtle bg-surface-page">
                        {["Tiêu chí", "Khoản tiền", `Đơn ${suggestedOrder.code}`].map((h) => (
                          <th key={h} scope="col" className="px-3 py-2 text-left font-medium text-text-secondary">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {compareRows.map(([label, left, right], i) => (
                        <tr key={label} className={i < compareRows.length - 1 ? "border-b border-border-subtle" : ""}>
                          <th scope="row" className="px-3 py-2 text-left font-medium text-text-secondary">
                            {label}
                          </th>
                          <td className="px-3 py-2">{left}</td>
                          <td className="px-3 py-2">{right}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Notice tone="neutral">
                {selected.suggestedOrderCode
                  ? `Nội dung chứa mã ${selected.suggestedOrderCode} nhưng không có đơn nào mang mã này.`
                  : "Không tìm thấy mã đơn trong nội dung chuyển khoản."}
              </Notice>
            )}

            {canAct ? (
              <div className="flex flex-wrap gap-3">
                {suggestedOrder && suggestedOrder.status === "pending_payment" && amountMatches ? (
                  <Button onClick={() => openDialog("apply")}>Áp dụng vào đơn</Button>
                ) : null}
                {suggestedOrder &&
                (suggestedOrder.status === "cancelled" || suggestedOrder.status === "expired") &&
                amountMatches ? (
                  <Button variant="outline" onClick={() => openDialog("late")}>Duyệt muộn</Button>
                ) : null}
                {selected.remaining > 0 ? (
                  <Button variant="outline" onClick={() => openDialog("return")}>Ghi nhận đã hoàn trả</Button>
                ) : null}
              </div>
            ) : null}

            <div>
              <h3 className="text-base font-semibold text-text-primary">Lịch sử</h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-text-secondary">
                {selected.historyAll.map((h, i) => (
                  <li key={`${h.at}-${i}`}>
                    {formatDateTime(h.at)} — {h.action} ({h.actor})
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <Empty title="Chọn một khoản tiền để xem chi tiết" />
        )}
      </div>

      <Dialog open={dialog != null} title={dialogTitle} confirmLabel={dialogConfirm} loading={busy} onConfirm={dialogConfirmFn} onClose={() => setDialog(null)}>
        {dialogContent}
      </Dialog>
    </div>
  );
}
