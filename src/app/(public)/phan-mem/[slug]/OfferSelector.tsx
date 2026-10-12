"use client";

/*
 * OfferSelector — vùng mua #goi của trang sản phẩm (DESIGN §5, J1–J2).
 * Khối dùng thử RIÊNG phía trên radio group "Chọn gói"; radio không chọn
 * sẵn trừ khi chỉ có một gói; không nhãn "Đề xuất". Chọn gói không tạo đơn.
 * Nhận dùng thử ghi vào overlay demo (localStorage) — không gọi API,
 * không bước ngân hàng (J2). Đơn/bản quyền của phiên demo được gộp từ
 * overlay để trạng thái nhất quán sau khi quay lại trang.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { effectivePrice } from "@/demo";
import { demoNow, licenseFromOrder, newLicenseRef } from "@/demo/ops";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type {
  DemoRole,
  License,
  Offer,
  Order,
  SoftwareStatus,
} from "@/demo/types";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Notice } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";
import { OfferSummary } from "./OfferSummary";

export function OfferSelector({
  slug,
  productName,
  softwareStatus,
  offers,
  trial,
  trialedBefore,
  role,
  pendingOrders,
  licenses,
}: {
  slug: string;
  productName: string;
  softwareStatus: SoftwareStatus;
  /** Gói trả phí đang mở, đã sắp thời hạn tăng dần */
  offers: Offer[];
  /** Gói dùng thử (nếu có) — khối riêng, không bao giờ hiển thị như giá 0 ₫ */
  trial: Offer | null;
  /** Server: slug nằm trong getTrialedSlugs() */
  trialedBefore: boolean;
  role: DemoRole;
  /** Đơn pending_payment của khách cho sản phẩm này (dữ liệu server) */
  pendingOrders: Order[];
  /** Bản quyền của khách cho sản phẩm này (dữ liệu server) */
  licenses: License[];
}) {
  const router = useRouter();
  const overlay = useDemoOverlay();
  // Không chọn sẵn — trừ khi chỉ có một gói (DESIGN §5)
  const [selectedId, setSelectedId] = useState<string | null>(
    offers.length === 1 ? offers[0].id : null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [claimedRef, setClaimedRef] = useState<string | null>(null);

  const trialed = trialedBefore || overlay.trialClaimed.includes(slug);
  const ownedLicenses: License[] = [
    ...licenses,
    ...overlay.grantedLicenses.filter(
      (l) =>
        l.productSlug === slug &&
        !licenses.some((base) => base.reference === l.reference),
    ),
  ];
  const pendingAll: Order[] = [
    ...pendingOrders,
    ...overlay.createdOrders.filter(
      (o) =>
        o.productSlug === slug &&
        o.status === "pending_payment" &&
        !overlay.cancelled.includes(o.code) &&
        !overlay.paid[o.code] &&
        !pendingOrders.some((base) => base.code === o.code),
    ),
  ];

  const selected = offers.find((o) => o.id === selectedId) ?? null;
  // Đơn không mang offerId — khớp theo sản phẩm + thời hạn + số máy + ý định mua
  const pendingForSelected = selected
    ? (pendingAll.find(
        (o) =>
          o.intent === "purchase" &&
          o.durationDays === selected.durationDays &&
          o.deviceCap === selected.deviceCap,
      ) ?? null)
    : null;

  function onTrialClick() {
    // Khách (và admin) phải đăng nhập trước; next giữ đúng vùng #goi (J1)
    if (role !== "customer") {
      router.push(`/dang-nhap?next=/phan-mem/${slug}%23goi`);
      return;
    }
    setConfirmOpen(true);
  }

  function confirmTrial() {
    if (!trial) return;
    const ref = newLicenseRef([
      ...licenses.map((l) => l.reference),
      ...overlay.grantedLicenses.map((l) => l.reference),
    ]);
    const now = demoNow();
    // Đơn giả amountVnd = 0 chỉ để tổng hợp bản quyền dùng thử qua
    // licenseFromOrder — dùng thử không tạo đơn, không có bước ngân hàng.
    const pseudoOrder: Order = {
      code: "",
      status: "paid",
      intent: "purchase",
      productSlug: slug,
      productName,
      offerLabel: `Dùng thử ${trial.durationDays} ngày · tối đa ${trial.deviceCap} máy`,
      durationDays: trial.durationDays,
      deviceCap: trial.deviceCap,
      amountVnd: 0,
      originalAmountVnd: null,
      renewalTargetRef: null,
      renewalEstimateExpiry: null,
      bank: { bankName: "", bin: "", accountNumber: "", beneficiary: "" },
      createdAt: now,
      deadline: now,
      paidAt: now,
      licenseRef: ref,
      hasPaymentReport: false,
      reportedAt: null,
      unresolvedReason: null,
      refunds: [],
    };
    writeOverlay({
      trialClaimed: [...overlay.trialClaimed, slug],
      grantedLicenses: [
        ...overlay.grantedLicenses,
        licenseFromOrder(pseudoOrder, ref),
      ],
    });
    setClaimedRef(ref);
    setConfirmOpen(false);
  }

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {claimedRef && trial ? (
          <Notice
            tone="success"
            role="status"
            title="Đã cấp bản quyền dùng thử"
          >
            <p>
              Bản quyền {claimedRef} ({trial.durationDays} ngày · tối đa{" "}
              {trial.deviceCap} máy) đã có trong tài khoản của bạn.
            </p>
            <Link href="/tai-khoan" className="content-link mt-1 inline-block">
              Đến Phần mềm của tôi
            </Link>
          </Notice>
        ) : null}

        {/* Khối dùng thử riêng, phía trên các gói trả phí */}
        {trial ? (
          <div className="mt-4 rounded-panel border border-border-subtle bg-surface-page p-4">
            {trialed ? (
              <p className="text-sm text-text-secondary">
                Bạn đã dùng thử phần mềm này.{" "}
                <Link href="/tai-khoan" className="content-link">
                  Đến Phần mềm của tôi
                </Link>
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm">
                  <span className="font-medium text-text-primary">
                    Dùng thử {trial.durationDays} ngày
                  </span>
                  <span className="text-text-secondary">
                    {" "}
                    · tối đa {trial.deviceCap} máy · không cần chuyển khoản
                  </span>
                </p>
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={onTrialClick}
                >
                  Dùng thử
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {offers.length > 0 ? (
          <fieldset className="mt-6">
            <legend className="text-base font-semibold text-text-primary">
              Chọn gói
            </legend>
            <div className="mt-3 space-y-3">
              {offers.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-start gap-3 rounded-panel border border-border-subtle bg-surface-page p-4 has-checked:border-action"
                >
                  <input
                    type="radio"
                    name={`goi-${slug}`}
                    value={o.id}
                    checked={selectedId === o.id}
                    onChange={() => setSelectedId(o.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-action"
                  />
                  <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span>
                      <span className="text-base font-medium text-text-primary">
                        {o.durationDays} ngày · tối đa {o.deviceCap} máy
                      </span>
                      <span className="mt-0.5 block text-sm text-text-muted">
                        Tính hạn từ lần kích hoạt đầu
                      </span>
                    </span>
                    <Price
                      amountVnd={effectivePrice(o)}
                      originalVnd={o.promotion ? o.priceVnd : null}
                      size="sm"
                      align="right"
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {trial ? (
          <Dialog
            open={confirmOpen}
            title={`Xác nhận dùng thử ${productName}`}
            confirmLabel="Nhận dùng thử"
            onConfirm={confirmTrial}
            onClose={() => setConfirmOpen(false)}
          >
            <ul className="space-y-1">
              <li>Thời hạn: dùng thử {trial.durationDays} ngày.</li>
              <li>Số máy: tối đa {trial.deviceCap} máy.</li>
              <li>
                Quy tắc: không cần chuyển khoản; thời hạn tính từ lần kích
                hoạt đầu tiên; mỗi tài khoản chỉ dùng thử một lần cho phần mềm
                này.
              </li>
            </ul>
          </Dialog>
        ) : null}
      </div>

      {/* Tóm tắt: bên phải trên desktop, dưới trên mobile */}
      <div className="lg:col-span-5">
        <OfferSummary
          productName={productName}
          softwareStatus={softwareStatus}
          selected={selected}
          pendingOrder={pendingForSelected}
          ownedLicenses={ownedLicenses}
        />
      </div>
    </div>
  );
}
