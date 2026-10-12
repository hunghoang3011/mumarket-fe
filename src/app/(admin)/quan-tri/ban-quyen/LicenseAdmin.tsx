"use client";

/*
 * LicenseAdmin (DESIGN §5 Quản trị · Bản quyền, J5.4):
 * - Tìm theo mã tham chiếu hoặc email (demo một khách: alice@example.test
 *   khớp tất cả bản quyền).
 * - Hành động là nút rõ ràng trong bảng, KHÔNG nằm trong menu ba chấm:
 *   Tạm khóa (lý do bắt buộc) · Khôi phục · Thu hồi bản quyền (danger, nêu
 *   hậu quả vĩnh viễn + lý do bắt buộc). Trạng thái sau thao tác là state
 *   client của phiên demo.
 * - "Cấp bản quyền thủ công" ghi overlay grantedLicenses (unactivated) —
 *   bản quyền mới hiện ngay ở khu khách hàng.
 */
import { useState } from "react";
import { DEMO_ENABLED } from "@/demo/config";
import { demoUsers } from "@/demo/fixtures/content";
import { newLicenseRef } from "@/demo/ops";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { License, LicenseStatus, Product } from "@/demo/types";
import { mergeLicensesWithOverlay } from "@/app/(customer)/tai-khoan/LicenseSections";
import { formatDate } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Dialog } from "@/shared/ui/Dialog";
import { Field, Select, Textarea } from "@/shared/ui/Field";
import { Empty, Notice } from "@/shared/ui/Notice";
import { StatusLabel } from "@/shared/ui/StatusLabel";

const CUSTOMER_EMAIL = DEMO_ENABLED ? demoUsers.customer.email : "";

interface ActionTarget {
  kind: "suspend" | "restore" | "revoke";
  license: License;
  status: LicenseStatus;
}

interface GrantErrors {
  email?: string;
  days?: string;
  devices?: string;
  reason?: string;
}

export function LicenseAdmin({
  licenses,
  products,
}: {
  licenses: License[];
  products: Product[];
}) {
  const overlay = useDemoOverlay();
  const merged = mergeLicensesWithOverlay(licenses, overlay);

  const [query, setQuery] = useState("");
  const [overrides, setOverrides] = useState<Record<string, LicenseStatus>>({});
  const [suspendedFrom, setSuspendedFrom] = useState<Record<string, LicenseStatus>>({});
  const [action, setAction] = useState<ActionTarget | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionError, setActionError] = useState<string>();
  const [feedback, setFeedback] = useState<string | null>(null);

  const [grantOpen, setGrantOpen] = useState(false);
  const [grantSlug, setGrantSlug] = useState(products[0]?.slug ?? "");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantDays, setGrantDays] = useState("30");
  const [grantDevices, setGrantDevices] = useState("1");
  const [grantReason, setGrantReason] = useState("");
  const [grantErrors, setGrantErrors] = useState<GrantErrors>({});

  const statusOf = (l: License): LicenseStatus =>
    overrides[l.reference] ?? l.status;

  const q = query.trim().toLowerCase();
  const filtered = merged.filter(
    (l) =>
      q === "" ||
      l.reference.toLowerCase().includes(q) ||
      CUSTOMER_EMAIL.toLowerCase().includes(q),
  );

  const confirmAction = () => {
    if (!action) return;
    if (action.kind !== "restore" && !actionReason.trim()) {
      setActionError(
        action.kind === "suspend"
          ? "Nhập lý do tạm khóa."
          : "Nhập lý do thu hồi.",
      );
      return;
    }
    const ref = action.license.reference;
    if (action.kind === "suspend") {
      setSuspendedFrom((prev) => ({ ...prev, [ref]: action.status }));
      setOverrides((prev) => ({ ...prev, [ref]: "suspended" }));
      setFeedback(`Đã tạm khóa bản quyền ${ref}.`);
    } else if (action.kind === "restore") {
      const back =
        suspendedFrom[ref] ?? (action.license.activatedAt ? "active" : "unactivated");
      setOverrides((prev) => ({ ...prev, [ref]: back }));
      setFeedback(`Đã khôi phục bản quyền ${ref}.`);
    } else {
      setOverrides((prev) => ({ ...prev, [ref]: "revoked" }));
      setFeedback(`Đã thu hồi bản quyền ${ref}. Thao tác này không hoàn tiền.`);
    }
    setAction(null);
    setActionReason("");
    setActionError(undefined);
  };

  const submitGrant = () => {
    const next: GrantErrors = {};
    const days = Number.parseInt(grantDays, 10);
    const devices = Number.parseInt(grantDevices, 10);
    if (!grantEmail.trim() || !grantEmail.includes("@")) {
      next.email = "Nhập email người nhận.";
    }
    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      next.days = "Số ngày từ 1 đến 3650.";
    }
    if (!Number.isInteger(devices) || devices < 1 || devices > 100) {
      next.devices = "Số máy từ 1 đến 100.";
    }
    if (!grantReason.trim()) next.reason = "Nhập lý do cấp thủ công.";
    setGrantErrors(next);
    const product = products.find((p) => p.slug === grantSlug);
    if (Object.keys(next).length > 0 || !product) return;

    const ref = newLicenseRef(merged.map((l) => l.reference));
    const license: License = {
      reference: ref,
      productSlug: product.slug,
      productName: product.name,
      status: "unactivated",
      durationDays: days,
      deviceCap: devices,
      devices: [],
      activatedAt: null,
      expiresAt: null,
      isTrial: false,
      renewable: false,
      renewals: [],
    };
    writeOverlay({ grantedLicenses: [...overlay.grantedLicenses, license] });
    setFeedback(`Đã cấp bản quyền ${ref}.`);
    setGrantOpen(false);
    setGrantEmail("");
    setGrantDays("30");
    setGrantDevices("1");
    setGrantReason("");
    setGrantErrors({});
  };

  const columns: Column<License & { id: string }>[] = [
    {
      key: "reference",
      header: "Mã tham chiếu",
      render: (l) => <span className="font-medium">{l.reference}</span>,
    },
    { key: "product", header: "Game", render: (l) => l.productName },
    { key: "customer", header: "Khách", render: () => CUSTOMER_EMAIL },
    {
      key: "status",
      header: "Trạng thái",
      render: (l) => <StatusLabel axis="license" value={statusOf(l)} />,
    },
    {
      key: "expiry",
      header: "Hạn",
      render: (l) =>
        statusOf(l) === "unactivated" ? (
          <span className="text-text-muted">Chưa chạy</span>
        ) : l.expiresAt ? (
          formatDate(l.expiresAt)
        ) : (
          "—"
        ),
    },
    {
      key: "devices",
      header: "Máy",
      render: (l) => `${l.devices.length}/${l.deviceCap}`,
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (l) => {
        const status = statusOf(l);
        return (
          <span className="flex flex-wrap gap-2">
            {status === "active" || status === "unactivated" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAction({ kind: "suspend", license: l, status });
                  setActionReason("");
                  setActionError(undefined);
                }}
              >
                Tạm khóa
              </Button>
            ) : null}
            {status === "suspended" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAction({ kind: "restore", license: l, status });
                  setActionReason("");
                  setActionError(undefined);
                }}
              >
                Khôi phục
              </Button>
            ) : null}
            {status !== "revoked" && status !== "expired" ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setAction({ kind: "revoke", license: l, status });
                  setActionReason("");
                  setActionError(undefined);
                }}
              >
                Thu hồi bản quyền
              </Button>
            ) : null}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:max-w-sm sm:flex-1">
          <Field
            label="Tìm theo mã tham chiếu hoặc email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            hint={`Khách demo: ${CUSTOMER_EMAIL}`}
            autoComplete="off"
          />
        </div>
        <Button onClick={() => setGrantOpen(true)}>Cấp bản quyền thủ công</Button>
      </div>

      {feedback ? (
        <Notice tone="success" role="status">
          {feedback}
        </Notice>
      ) : null}

      <DataTable
        columns={columns}
        rows={filtered.map((l) => ({ ...l, id: l.reference }))}
        caption="Danh sách bản quyền"
        empty={
          <Empty title="Không tìm thấy bản quyền nào">
            <p>Không có bản quyền nào khớp với nội dung tìm kiếm.</p>
          </Empty>
        }
      />

      <Dialog
        open={action?.kind === "suspend"}
        title={action ? `Tạm khóa bản quyền ${action.license.reference}` : ""}
        confirmLabel="Tạm khóa"
        onConfirm={confirmAction}
        onClose={() => setAction(null)}
      >
        {action?.kind === "suspend" ? (
          <div className="flex flex-col gap-4">
            <p>
              Bản quyền {action.license.reference} ({action.license.productName})
              sẽ ngừng hoạt động cho tới khi được khôi phục. Thời hạn không đổi.
            </p>
            <Field
              label="Lý do tạm khóa"
              required
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              error={actionError}
            />
          </div>
        ) : null}
      </Dialog>

      <Dialog
        open={action?.kind === "restore"}
        title={action ? `Khôi phục bản quyền ${action.license.reference}` : ""}
        confirmLabel="Khôi phục"
        onConfirm={confirmAction}
        onClose={() => setAction(null)}
      >
        {action?.kind === "restore" ? (
          <p>
            Bản quyền {action.license.reference} sẽ hoạt động trở lại với thời
            hạn như trước khi tạm khóa.
          </p>
        ) : null}
      </Dialog>

      <Dialog
        open={action?.kind === "revoke"}
        title={action ? `Thu hồi bản quyền ${action.license.reference}` : ""}
        confirmLabel="Thu hồi bản quyền"
        confirmVariant="danger"
        onConfirm={confirmAction}
        onClose={() => setAction(null)}
      >
        {action?.kind === "revoke" ? (
          <div className="flex flex-col gap-4">
            <p>
              Thu hồi là vĩnh viễn — bản quyền {action.license.reference} không
              thể khôi phục và khách mất quyền sử dụng phần mềm ngay. Thao tác
              này không hoàn tiền; hoàn tiền đơn đã thanh toán nằm ở chi tiết
              đơn.
            </p>
            <Field
              label="Lý do thu hồi"
              required
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              error={actionError}
            />
          </div>
        ) : null}
      </Dialog>

      <Dialog
        open={grantOpen}
        title="Cấp bản quyền thủ công"
        confirmLabel="Cấp bản quyền"
        onConfirm={submitGrant}
        onClose={() => setGrantOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p>
            Bản quyền mới ở trạng thái Chưa kích hoạt — hạn bắt đầu chạy từ lần
            kích hoạt đầu tiên của khách.
          </p>
          <Select
            label="Sản phẩm"
            required
            value={grantSlug}
            onChange={(e) => setGrantSlug(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </Select>
          <Field
            label="Email người nhận"
            required
            type="email"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            error={grantErrors.email}
            autoComplete="off"
          />
          <Field
            label="Số ngày (1–3650)"
            required
            inputMode="numeric"
            value={grantDays}
            onChange={(e) => setGrantDays(e.target.value)}
            error={grantErrors.days}
          />
          <Field
            label="Số máy (1–100)"
            required
            inputMode="numeric"
            value={grantDevices}
            onChange={(e) => setGrantDevices(e.target.value)}
            error={grantErrors.devices}
          />
          <Textarea
            label="Lý do cấp thủ công"
            required
            rows={3}
            value={grantReason}
            onChange={(e) => setGrantReason(e.target.value)}
            error={grantErrors.reason}
          />
        </div>
      </Dialog>
    </div>
  );
}
