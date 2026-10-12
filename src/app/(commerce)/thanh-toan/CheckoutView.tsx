"use client";

/*
 * /thanh-toan — CheckoutView (DESIGN §5; J1 mua mới, J4 gia hạn; R3/D22).
 * Toàn vùng M0. Tạo đơn ghi vào lớp phủ demo (localStorage) rồi chuyển tới
 * /don-hang/[ma] — không gọi backend. Mua mới: chống đơn chờ trùng qua
 * overlay (đơn đã hủy/đã duyệt trong phiên không chặn nữa).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEMO_NOW, effectivePrice } from "@/demo";
import { demoNow, newOrderCode } from "@/demo/ops";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type {
  License,
  Offer,
  Order,
  Product,
  SiteSettings,
} from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { Notice } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";

const DAY_MS = 86_400_000;

/** Nhãn gói thống nhất toàn site: "30 ngày · tối đa 2 máy" (DESIGN §3). */
function offerLabelOf(o: Offer): string {
  return `${o.durationDays} ngày · tối đa ${o.deviceCap} máy`;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <dt className="w-36 shrink-0 text-sm text-text-muted">{label}</dt>
      <dd className="min-w-0 text-sm font-medium text-text-primary">
        {children}
      </dd>
    </div>
  );
}

export type CheckoutViewProps = {
  product: Product;
  settings: SiteSettings;
  existingOrders: Order[];
} & (
  | { mode: "purchase"; offer: Offer }
  | { mode: "renewal"; license: License; renewalOffers: Offer[] }
);

export function CheckoutView(props: CheckoutViewProps) {
  const { product, settings, existingOrders } = props;
  const router = useRouter();
  const overlay = useDemoOverlay();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    props.mode === "renewal" && props.renewalOffers.length === 1
      ? props.renewalOffers[0].id
      : null,
  );

  const allOrders = useMemo(
    () => [...existingOrders, ...overlay.createdOrders],
    [existingOrders, overlay.createdOrders],
  );

  // D22: đã có đơn chờ cho cùng gói + cùng ý định mua → mở lại đơn đó.
  const duplicate = useMemo(() => {
    if (props.mode !== "purchase") return null;
    const offer = props.offer;
    return (
      allOrders.find((o) => {
        const status = overlay.cancelled.includes(o.code)
          ? "cancelled"
          : overlay.paid[o.code]
            ? "paid"
            : o.status;
        return (
          status === "pending_payment" &&
          o.intent === "purchase" &&
          o.productSlug === offer.productSlug &&
          o.offerLabel === offerLabelOf(offer) &&
          o.durationDays === offer.durationDays &&
          o.deviceCap === offer.deviceCap
        );
      }) ?? null
    );
  }, [props, allOrders, overlay.cancelled, overlay.paid]);

  /** Hạn mới dự kiến (J4): max(DEMO_NOW, hạn hiện tại) + thời hạn gói. */
  const estimateFor = (durationDays: number): string => {
    const current =
      props.mode === "renewal" && props.license.expiresAt
        ? new Date(props.license.expiresAt).getTime()
        : 0;
    const base = Math.max(new Date(DEMO_NOW).getTime(), current);
    return new Date(base + durationDays * DAY_MS).toISOString();
  };

  const selectedOffer =
    props.mode === "renewal"
      ? (props.renewalOffers.find((o) => o.id === selectedId) ?? null)
      : props.offer;

  const createOrder = () => {
    if (loading || !selectedOffer || !settings.bank) return;
    setLoading(true);
    const now = demoNow();
    const renewal = props.mode === "renewal";
    const order: Order = {
      code: newOrderCode(allOrders.map((o) => o.code)),
      status: "pending_payment",
      intent: renewal ? "renewal" : "purchase",
      productSlug: product.slug,
      productName: product.name,
      offerLabel: offerLabelOf(selectedOffer),
      durationDays: selectedOffer.durationDays,
      deviceCap: selectedOffer.deviceCap,
      amountVnd: effectivePrice(selectedOffer),
      originalAmountVnd: selectedOffer.promotion
        ? selectedOffer.priceVnd
        : null,
      renewalTargetRef: renewal ? props.license.reference : null,
      renewalEstimateExpiry: renewal
        ? estimateFor(selectedOffer.durationDays)
        : null,
      bank: settings.bank,
      createdAt: now,
      deadline: new Date(new Date(now).getTime() + DAY_MS).toISOString(),
      paidAt: null,
      licenseRef: null,
      hasPaymentReport: false,
      reportedAt: null,
      unresolvedReason: null,
      refunds: [],
    };
    writeOverlay({ createdOrders: [...overlay.createdOrders, order] });
    router.push(`/don-hang/${order.code}`);
  };

  if (props.mode === "purchase" && duplicate) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Thanh toán</h1>
        <Notice tone="warning">
          <p>Bạn đang có đơn chờ thanh toán cho gói này.</p>
          <p className="mt-2">
            <Link
              href={`/don-hang/${duplicate.code}`}
              className="content-link font-medium"
            >
              Mở đơn {duplicate.code}
            </Link>
          </p>
        </Notice>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Thanh toán</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Nội dung trái */}
        <section className="rounded-panel border border-border-subtle bg-surface-panel p-4 sm:p-6">
          {props.mode === "purchase" ? (
            <>
              <h2 className="text-lg font-semibold">Gói đã chọn</h2>
              <dl className="mt-4 flex flex-col gap-3">
                <Row label="Phần mềm">{product.name}</Row>
                {product.softwareStatus !== "operational" ? (
                  <Row label="Trạng thái">
                    <StatusLabel
                      axis="software"
                      value={product.softwareStatus}
                    />
                  </Row>
                ) : null}
                <Row label="Gói">{props.offer.durationDays} ngày</Row>
                <Row label="Số máy">Tối đa {props.offer.deviceCap} máy</Row>
                <Row label="Quy tắc tính hạn">
                  Tính hạn từ lần kích hoạt đầu
                </Row>
                <Row label="Giá gói">
                  <Price
                    amountVnd={effectivePrice(props.offer)}
                    originalVnd={
                      props.offer.promotion ? props.offer.priceVnd : null
                    }
                    size="sm"
                  />
                </Row>
              </dl>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Gia hạn bản quyền</h2>
              <dl className="mt-4 flex flex-col gap-3">
                <Row label="Mã tham chiếu">{props.license.reference}</Row>
                <Row label="Phần mềm">{product.name}</Row>
                <Row label="Hạn hiện tại">
                  {props.license.expiresAt
                    ? formatDate(props.license.expiresAt)
                    : "Chưa kích hoạt"}
                </Row>
                <Row label="Số máy">Tối đa {props.license.deviceCap} máy</Row>
              </dl>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-text-secondary">
                  Chọn gói gia hạn
                </legend>
                <div className="mt-2 flex flex-col gap-2">
                  {props.renewalOffers.map((o) => {
                    const selected = o.id === selectedId;
                    return (
                      <label
                        key={o.id}
                        className={`flex min-h-11 cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 rounded-control border px-4 py-3 ${
                          selected
                            ? "border-action bg-surface-raised"
                            : "border-border-control"
                        }`}
                      >
                        <input
                          type="radio"
                          name="goi-gia-han"
                          value={o.id}
                          checked={selected}
                          onChange={() => setSelectedId(o.id)}
                          className="h-5 w-5 accent-action"
                        />
                        <span className="font-medium text-text-primary">
                          {o.durationDays} ngày · tối đa {o.deviceCap} máy
                        </span>
                        <span className="ml-auto">
                          <Price
                            amountVnd={effectivePrice(o)}
                            originalVnd={o.promotion ? o.priceVnd : null}
                            size="sm"
                            align="right"
                          />
                        </span>
                        <span className="w-full text-sm text-text-muted">
                          Hạn mới dự kiến: {formatDate(estimateFor(o.durationDays))}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <p className="mt-4 text-sm text-text-secondary">
                Hạn mới = thời điểm muộn hơn giữa lúc thanh toán được duyệt và
                hạn hiện tại, cộng thời hạn gói.
              </p>
              {props.license.status === "expired" ? (
                <p className="mt-2 text-sm text-text-secondary">
                  Thời gian gia hạn bắt đầu khi thanh toán được duyệt, không
                  phải lần mở phần mềm tiếp theo.
                </p>
              ) : null}
              <p className="mt-4 text-sm">
                <Link
                  className="content-link"
                  href={`/phan-mem/${product.slug}#goi`}
                >
                  Mua bản quyền mới với số máy khác
                </Link>
              </p>
            </>
          )}

          {settings.paymentNote ? (
            <div className="mt-6">
              <Notice tone="info">{settings.paymentNote}</Notice>
            </div>
          ) : null}
        </section>

        {/* Tóm tắt phải (sticky desktop) */}
        <aside className="h-fit rounded-panel border border-border-subtle bg-surface-panel p-4 sm:p-6 lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold">Tóm tắt thanh toán</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <Row label="Phần mềm">{product.name}</Row>
            {props.mode === "renewal" ? (
              <Row label="Bản quyền">{props.license.reference}</Row>
            ) : null}
            <Row label="Gói">
              {selectedOffer ? offerLabelOf(selectedOffer) : "Chưa chọn"}
            </Row>
            {props.mode === "purchase" ? (
              <Row label="Quy tắc tính hạn">Tính hạn từ lần kích hoạt đầu</Row>
            ) : null}
            {props.mode === "renewal" && selectedOffer ? (
              <Row label="Hạn mới dự kiến">
                {formatDate(estimateFor(selectedOffer.durationDays))}
              </Row>
            ) : null}
          </dl>

          <div className="mt-4 border-t border-border-subtle pt-4">
            <span className="text-sm text-text-muted">Số tiền phải trả</span>
            <div className="mt-1">
              {selectedOffer ? (
                <Price
                  amountVnd={effectivePrice(selectedOffer)}
                  originalVnd={
                    selectedOffer.promotion ? selectedOffer.priceVnd : null
                  }
                  size="xl"
                />
              ) : (
                <span className="text-sm text-text-muted">Chọn một gói</span>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-text-muted">
            Bằng việc tạo đơn, bạn đồng ý với{" "}
            <Link href="/dieu-khoan" className="content-link">
              Điều khoản
            </Link>{" "}
            và{" "}
            <Link href="/chinh-sach-hoan-tien" className="content-link">
              Chính sách hoàn tiền
            </Link>
            .
          </p>

          <Button
            className="mt-4 w-full"
            loading={loading}
            disabled={!selectedOffer}
            onClick={createOrder}
            data-testid="checkout-submit"
          >
            Tạo đơn chuyển khoản
          </Button>
          {!selectedOffer ? (
            <p className="mt-2 text-sm text-text-muted">
              Chọn một gói để tạo đơn.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
