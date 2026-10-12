"use client";

/*
 * Chi tiết bản quyền (DESIGN §5, J4):
 * - Thông tin bản quyền, xem mã (xác nhận lại mật khẩu, cửa sổ 10 phút),
 *   danh sách máy (sửa tên / gỡ — gỡ LUÔN hỏi mật khẩu), lịch sử gia hạn,
 *   các đơn liên quan.
 * - Bản quyền tạo trong phiên demo nằm ở lớp phủ localStorage: fixture
 *   không có thì tra lớp phủ; cả hai đều không có → notFound().
 * - Đồng hồ demo cố định (demoNow): cửa sổ xem mã 10 phút tính theo giờ
 *   demo, nên trong một phiên demo sau khi xác nhận sẽ không bị hỏi lại.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import { demoNow } from "@/demo/ops";
import { useHydrated } from "@/shared/ui/useHydrated";
import type { License, LicenseDevice, Order } from "@/demo/types";
import { daysUntil, formatDate, formatDateTime } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { CopyValue } from "@/shared/ui/CopyValue";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";
import { Dialog } from "@/shared/ui/Dialog";
import { Field } from "@/shared/ui/Field";
import { Icon } from "@/shared/ui/Icon";
import { Notice } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";
import { mergeOrdersWithOverlay } from "../../LicenseSections";

const REVEAL_WINDOW_MS = 10 * 60 * 1000;

export function LicenseDetail({
  refCode,
  fixtureLicense,
  orders,
  autoReveal,
}: {
  refCode: string;
  fixtureLicense: License | null;
  orders: Order[];
  autoReveal: boolean;
}) {
  const overlay = useDemoOverlay();
  const mounted = useHydrated();
  const [revealOpen, setRevealOpen] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [removeTarget, setRemoveTarget] = useState<LicenseDevice | null>(null);
  const [removePassword, setRemovePassword] = useState("");

  // Bản quyền sau khi gộp lớp phủ: ẩn máy đã gỡ, áp tên máy đã sửa.
  const base =
    fixtureLicense ??
    overlay.grantedLicenses.find((l) => l.reference === refCode) ??
    null;
  const license = base
    ? {
        ...base,
        devices: base.devices
          .filter((d) => !overlay.devicesRemoved.includes(d.id))
          .map((d) => ({
            ...d,
            label: overlay.deviceLabels[d.id] ?? d.label,
          })),
      }
    : null;
  const removedNames = base
    ? base.devices
        .filter((d) => overlay.devicesRemoved.includes(d.id))
        .map((d) => overlay.deviceLabels[d.id] ?? d.label)
    : [];

  // Cửa sổ xem mã còn hạn khi mốc lưu trong lớp phủ muộn hơn "bây giờ" demo.
  const revealUntil = overlay.revealUntil[refCode];
  const revealed = revealUntil != null && revealUntil > demoNow();

  // Mở sẵn dialog khi vào từ nút "Xem mã bản quyền" (?xem-ma=1) mà chưa
  // xác nhận mật khẩu — suy ra từ props, không cần effect.
  const revealDialogOpen =
    revealOpen || (autoReveal && !revealed && !autoDismissed);
  const closeRevealDialog = () => {
    setRevealOpen(false);
    setAutoDismissed(true);
  };

  if (!license) {
    // Fixture không có: chờ mount để đọc lớp phủ trước khi kết luận 404.
    if (!mounted) {
      return <p className="text-sm text-text-muted">Đang tải…</p>;
    }
    notFound();
  }

  const daysLeft = license.expiresAt
    ? daysUntil(license.expiresAt, demoNow())
    : null;
  const relatedOrders = mergeOrdersWithOverlay(orders, overlay)
    .filter(
      (o) => o.licenseRef === refCode || o.renewalTargetRef === refCode,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const confirmReveal = () => {
    const until = new Date(
      new Date(demoNow()).getTime() + REVEAL_WINDOW_MS,
    ).toISOString();
    writeOverlay({
      revealUntil: { ...overlay.revealUntil, [refCode]: until },
    });
    setPassword("");
    closeRevealDialog();
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    writeOverlay({
      devicesRemoved: overlay.devicesRemoved.includes(removeTarget.id)
        ? overlay.devicesRemoved
        : [...overlay.devicesRemoved, removeTarget.id],
    });
    setRemovePassword("");
    setRemoveTarget(null);
  };

  const orderColumns: Column<Order & { id: string }>[] = [
    {
      key: "code",
      header: "Mã đơn",
      render: (o) => (
        <Link href={`/don-hang/${o.code}`} className="content-link font-medium">
          {o.code}
        </Link>
      ),
    },
    {
      key: "date",
      header: "Ngày",
      render: (o) => formatDate(o.createdAt),
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
      key: "status",
      header: "Trạng thái",
      render: (o) => <StatusLabel axis="order" value={o.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Đường dẫn" className="text-sm text-text-muted">
        <Link href="/tai-khoan" className="content-link">
          Phần mềm của tôi
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page" className="text-text-secondary">
          {license.reference}
        </span>
      </nav>
      <h1 className="text-2xl font-semibold text-text-primary">
        Bản quyền {license.reference}
      </h1>

      {/* Thông tin bản quyền */}
      <section
        aria-label="Thông tin bản quyền"
        className="rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <dl className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <dt className="w-32 shrink-0 text-sm text-text-muted">Game</dt>
            <dd className="text-sm text-text-primary">
              <Link
                href={`/phan-mem/${license.productSlug}`}
                className="content-link"
              >
                {license.productName}
              </Link>
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="w-32 shrink-0 text-sm text-text-muted">Trạng thái</dt>
            <dd>
              <StatusLabel axis="license" value={license.status} />
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="w-32 shrink-0 text-sm text-text-muted">Thời hạn</dt>
            <dd className="text-sm text-text-primary">
              {license.expiresAt ? (
                <>
                  Hết hạn {formatDate(license.expiresAt)}
                  {license.status === "active" &&
                  daysLeft !== null &&
                  daysLeft <= 3 ? (
                    <span className="text-warning"> (còn {daysLeft} ngày)</span>
                  ) : null}
                </>
              ) : (
                <>{license.durationDays} ngày — chưa kích hoạt</>
              )}
            </dd>
          </div>
          {license.status === "unactivated" ? (
            <p className="text-sm text-text-muted sm:pl-32">
              Tính hạn từ lần kích hoạt đầu.
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <dt className="w-32 shrink-0 text-sm text-text-muted">Số máy</dt>
            <dd className="text-sm text-text-primary">
              {license.devices.length}/{license.deviceCap} máy
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="w-32 shrink-0 text-sm text-text-muted">
              Ngày kích hoạt
            </dt>
            <dd className="text-sm text-text-primary">
              {license.activatedAt
                ? formatDate(license.activatedAt)
                : "Chưa kích hoạt"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Xem mã bản quyền */}
      <section
        aria-label="Mã bản quyền"
        className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Mã bản quyền
        </h2>
        <div data-testid="license-reveal">
          {revealed ? (
            <div className="flex flex-col gap-2">
              <CopyValue
                label="Mã bản quyền"
                value={`GA-DEMO-${license.reference}`}
                copyLabel="mã bản quyền"
                large
              />
              <p className="text-sm text-warning">
                Mã bản quyền là bí mật. Không chia sẻ.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-text-secondary">
                Mã bị ẩn. Xác nhận lại mật khẩu để xem; trong 10 phút sau đó
                xem lại không cần nhập lại.
              </p>
              <Button variant="outline" onClick={() => setRevealOpen(true)}>
                Xem mã bản quyền
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Máy đã đăng ký */}
      <section
        aria-label="Máy đã đăng ký"
        className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Máy đã đăng ký ({license.devices.length}/{license.deviceCap})
        </h2>
        {removedNames.length > 0 ? (
          <Notice tone="success" title="Đã gỡ máy">
            Đã gỡ {removedNames.join(", ")}. Phần mềm trên máy đã gỡ sẽ dừng ở
            lần kiểm tra kế tiếp; hạn bản quyền không thay đổi.
          </Notice>
        ) : null}
        {license.devices.length === 0 ? (
          <p className="text-sm text-text-muted">Chưa có máy nào đăng ký.</p>
        ) : (
          <ul data-testid="license-device-list" className="flex flex-col gap-3">
            {license.devices.map((device) => (
              <li
                key={device.id}
                className="flex flex-col gap-2 rounded-control border border-border-subtle px-3 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  {editingId === device.id ? (
                    <form
                      className="flex flex-wrap items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const label = editValue.trim();
                        if (label) {
                          writeOverlay({
                            deviceLabels: {
                              ...overlay.deviceLabels,
                              [device.id]: label,
                            },
                          });
                        }
                        setEditingId(null);
                      }}
                    >
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        aria-label="Tên máy mới"
                        className="min-h-8 rounded-control border border-border-control bg-surface-input px-2 py-1 text-sm text-text-primary"
                      />
                      <Button type="submit" size="sm" variant="primary">
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Hủy
                      </Button>
                    </form>
                  ) : (
                    <p className="flex items-center gap-2 font-medium text-text-primary">
                      <span className="break-all">{device.label}</span>
                      <button
                        type="button"
                        aria-label={`Sửa tên máy ${device.label}`}
                        className="inline-flex min-h-6 min-w-6 items-center justify-center text-link hover:text-action"
                        onClick={() => {
                          setEditingId(device.id);
                          setEditValue(device.label);
                        }}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                    </p>
                  )}
                  <p className="mt-1 text-sm text-text-muted">
                    Đăng ký {formatDate(device.registeredAt)} · Lần dùng cuối{" "}
                    {device.lastSeenAt
                      ? formatDateTime(device.lastSeenAt)
                      : "Chưa từng"}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setRemoveTarget(device)}
                >
                  Gỡ máy
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Lịch sử gia hạn */}
      <section
        aria-label="Lịch sử gia hạn"
        className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Lịch sử gia hạn
        </h2>
        {license.renewals.length === 0 ? (
          <p className="text-sm text-text-muted">Chưa có lần gia hạn nào.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm text-text-primary">
            {license.renewals.map((r) => (
              <li key={`${r.at}-${r.orderCode}`}>
                {formatDate(r.at)} · +{r.addedDays} ngày · đơn{" "}
                <Link href={`/don-hang/${r.orderCode}`} className="content-link">
                  {r.orderCode}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Đơn liên quan */}
      <section aria-label="Đơn liên quan" className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Đơn liên quan
        </h2>
        <DataTable
          columns={orderColumns}
          rows={relatedOrders.map((o) => ({ ...o, id: o.code }))}
          caption={`Các đơn liên quan tới bản quyền ${license.reference}`}
          empty={
            <p className="text-sm text-text-muted">
              Chưa có đơn nào liên quan.
            </p>
          }
        />
      </section>

      {/* Hộp thoại xác nhận mật khẩu để xem mã */}
      <Dialog
        open={revealDialogOpen}
        title="Xác nhận lại mật khẩu"
        confirmLabel="Xem mã bản quyền"
        onConfirm={confirmReveal}
        onClose={() => {
          setPassword("");
          closeRevealDialog();
        }}
      >
        <div className="flex flex-col gap-3">
          <p>Nhập lại mật khẩu để xem mã bản quyền {license.reference}.</p>
          <Field
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
            hint="Bản demo: nhập mật khẩu bất kỳ."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </Dialog>

      {/* Hộp thoại gỡ máy — luôn hỏi lại mật khẩu (J4) */}
      <Dialog
        open={removeTarget !== null}
        title={removeTarget ? `Gỡ máy ${removeTarget.label}` : "Gỡ máy"}
        confirmLabel="Gỡ máy"
        confirmVariant="danger"
        onConfirm={confirmRemove}
        onClose={() => {
          setRemovePassword("");
          setRemoveTarget(null);
        }}
      >
        <div className="flex flex-col gap-3">
          <p>
            Máy: <strong className="text-text-primary">{removeTarget?.label}</strong>
          </p>
          <p>
            Phần mềm trên máy này sẽ dừng ở lần kiểm tra kế tiếp (thường trong
            vòng 5 phút). Hạn bản quyền không thay đổi.
          </p>
          <Field
            label="Xác nhận lại mật khẩu"
            type="password"
            autoComplete="current-password"
            hint="Bản demo: nhập mật khẩu bất kỳ."
            value={removePassword}
            onChange={(e) => setRemovePassword(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
}
