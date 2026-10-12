"use client";

/*
 * Khu vực "Phần mềm của tôi" (DESIGN §5, J4):
 * - Banner cho mỗi đơn pending_payment (fixture + đơn tạo trong phiên).
 * - Bản quyền nhóm theo sản phẩm; mỗi bản quyền một hàng (LicenseRow).
 * File này cũng xuất mergeOrdersWithOverlay/mergeLicensesWithOverlay —
 * hàm gộp lớp phủ demo dùng chung cho các trang trong khu khách hàng
 * (đơn hàng, chi tiết bản quyền) để không nhân bản logic.
 */
import Link from "next/link";
import { DEMO_NOW } from "@/demo";
import { useDemoOverlay } from "@/demo/store";
import type { DemoOverlay } from "@/demo/store";
import type { License, Order, Product } from "@/demo/types";
import { daysUntil, formatDate } from "@/shared/format/date";
import { LinkButton } from "@/shared/ui/Button";
import { GameArt } from "@/shared/ui/GameArt";
import { Icon } from "@/shared/ui/Icon";
import { Empty } from "@/shared/ui/Notice";
import { PendingOrderBanner } from "@/shared/ui/PendingOrderBanner";
import { StatusLabel } from "@/shared/ui/StatusLabel";

/** Gộp đơn fixture với lớp phủ demo: báo chuyển khoản, hủy, đã duyệt, đơn tạo trong phiên. */
export function mergeOrdersWithOverlay(
  base: Order[],
  overlay: DemoOverlay,
): Order[] {
  const byCode: Record<string, Order> = {};
  for (const order of [...base, ...overlay.createdOrders]) {
    const paid = overlay.paid[order.code];
    const reportedAt = overlay.reported[order.code];
    byCode[order.code] = {
      ...order,
      status: paid
        ? "paid"
        : overlay.cancelled.includes(order.code)
          ? "cancelled"
          : order.status,
      paidAt: paid?.paidAt ?? order.paidAt,
      licenseRef: paid?.licenseRef ?? order.licenseRef,
      hasPaymentReport:
        order.hasPaymentReport || reportedAt != null || paid != null,
      reportedAt: order.reportedAt ?? reportedAt ?? paid?.paidAt ?? null,
    };
  }
  return Object.values(byCode);
}

/** Gộp bản quyền fixture với lớp phủ demo: bản quyền cấp trong phiên, máy đã gỡ, tên máy đã sửa. */
export function mergeLicensesWithOverlay(
  base: License[],
  overlay: DemoOverlay,
): License[] {
  const byRef: Record<string, License> = {};
  for (const license of [...base, ...overlay.grantedLicenses]) {
    byRef[license.reference] = {
      ...license,
      devices: license.devices
        .filter((d) => !overlay.devicesRemoved.includes(d.id))
        .map((d) => ({ ...d, label: overlay.deviceLabels[d.id] ?? d.label })),
    };
  }
  return Object.values(byRef);
}

export function LicenseSections({
  licenses,
  orders,
  products,
}: {
  licenses: License[];
  orders: Order[];
  products: Product[];
}) {
  const overlay = useDemoOverlay();
  const allOrders = mergeOrdersWithOverlay(orders, overlay);
  const pending = allOrders.filter((o) => o.status === "pending_payment");
  const allLicenses = mergeLicensesWithOverlay(licenses, overlay);

  // Nhóm theo sản phẩm, giữ thứ tự xuất hiện đầu tiên của mỗi sản phẩm.
  const groups: { slug: string; name: string; items: License[] }[] = [];
  for (const license of allLicenses) {
    let group = groups.find((g) => g.slug === license.productSlug);
    if (!group) {
      group = {
        slug: license.productSlug,
        name: license.productName,
        items: [],
      };
      groups.push(group);
    }
    group.items.push(license);
  }

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 ? (
        <div className="flex flex-col gap-3" aria-label="Đơn đang chờ">
          {pending.map((order) => (
            <PendingOrderBanner key={order.code} order={order} />
          ))}
        </div>
      ) : null}

      {groups.length === 0 ? (
        <Empty
          title="Bạn chưa có phần mềm nào."
          action={
            <LinkButton href="/phan-mem" variant="outline">
              Xem năm phần mềm
            </LinkButton>
          }
        />
      ) : (
        groups.map((group) => (
          <ProductGroup
            key={group.slug}
            group={group}
            product={products.find((p) => p.slug === group.slug) ?? null}
          />
        ))
      )}
    </div>
  );
}

function ProductGroup({
  group,
  product,
}: {
  group: { slug: string; name: string; items: License[] };
  product: Product | null;
}) {
  // Chỉ bản quyền đang hiệu lực hoặc chưa kích hoạt mới được tải (J4).
  const canDownload = group.items.some(
    (l) => l.status === "active" || l.status === "unactivated",
  );
  return (
    <section
      aria-label={group.name}
      className="overflow-hidden rounded-panel border border-border-subtle bg-surface-panel"
    >
      <header className="flex flex-wrap items-center gap-3 px-4 py-3">
        <GameArt
          slug={group.slug}
          crop="square"
          className="h-12 w-12 shrink-0 rounded-detail"
        />
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text-primary">
            {group.name}
          </h2>
          <p className="text-sm text-text-muted">
            {product?.softwareVersion
              ? `Phiên bản ${product.softwareVersion}`
              : "Chưa có thông tin"}
          </p>
        </div>
        {product ? (
          <span className="ml-auto">
            <StatusLabel axis="software" value={product.softwareStatus} />
          </span>
        ) : null}
      </header>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border-subtle px-4 py-2 text-sm">
        {canDownload ? (
          <Link href={`/phan-mem/${group.slug}#tai`} className="content-link">
            Tải phần mềm
          </Link>
        ) : null}
        <Link href="/huong-dan/cai-dat-va-kich-hoat" className="content-link">
          Hướng dẫn kích hoạt
        </Link>
      </div>
      <ul className="flex flex-col">
        {group.items.map((license) => (
          <LicenseRow key={license.reference} license={license} />
        ))}
      </ul>
    </section>
  );
}

function LicenseRow({ license }: { license: License }) {
  const daysLeft = license.expiresAt
    ? daysUntil(license.expiresAt, DEMO_NOW)
    : null;
  const expiringSoon =
    license.status === "active" && daysLeft !== null && daysLeft <= 3;

  return (
    <li className="flex flex-col gap-3 border-t border-border-subtle px-4 py-3 lg:flex-row lg:items-center lg:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-text-primary">
            {license.reference}
          </span>
          <StatusLabel axis="license" value={license.status} />
        </div>
        <div className="mt-1 text-sm">
          {license.expiresAt ? (
            expiringSoon ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning">
                <Icon name="alert" size={16} />
                Hết hạn {formatDate(license.expiresAt)} (còn {daysLeft} ngày)
              </span>
            ) : (
              <span className="text-text-secondary">
                Hết hạn {formatDate(license.expiresAt)}
              </span>
            )
          ) : (
            <span className="text-text-secondary">
              Chưa kích hoạt — {license.durationDays} ngày tính từ lần kích
              hoạt đầu
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-text-muted">
          {license.devices.length}/{license.deviceCap} máy
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LinkButton
          variant="outline"
          size="sm"
          href={`/tai-khoan/ban-quyen/${license.reference}?xem-ma=1`}
        >
          Xem mã bản quyền
        </LinkButton>
        {license.renewable ? (
          <LinkButton
            variant="primary"
            href={`/thanh-toan?gia-han=${license.reference}`}
          >
            Gia hạn
          </LinkButton>
        ) : null}
        <LinkButton
          variant="ghost"
          size="sm"
          href={`/tai-khoan/ban-quyen/${license.reference}`}
        >
          Chi tiết
        </LinkButton>
      </div>
    </li>
  );
}
