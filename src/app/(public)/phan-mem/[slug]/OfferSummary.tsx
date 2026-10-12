"use client";

/*
 * OfferSummary — tóm tắt gói đã chọn + CTA trong vùng #goi (DESIGN §5):
 * game · gói · số máy · số tiền phải trả · quy tắc tính hạn · nhãn trạng
 * thái phần mềm (khi khác Hoạt động bình thường). Chưa chọn gói → CTA
 * disabled kèm chú thích "Chọn một gói". Đang có đơn chờ đúng gói → thay
 * CTA bằng link mở đơn. Đang có bản quyền → dòng gia hạn + CTA đổi nhãn.
 */
import Link from "next/link";
import { effectivePrice } from "@/demo";
import type { License, Offer, Order, SoftwareStatus } from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { Button, LinkButton } from "@/shared/ui/Button";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";

export function OfferSummary({
  productName,
  softwareStatus,
  selected,
  pendingOrder,
  ownedLicenses,
}: {
  productName: string;
  softwareStatus: SoftwareStatus;
  /** Gói đang chọn; null = chưa chọn → CTA disabled kèm chú thích */
  selected: Offer | null;
  /** Đơn pending_payment đúng gói đang chọn (nếu có) */
  pendingOrder: Order | null;
  /** Bản quyền khách đang có của game này */
  ownedLicenses: License[];
}) {
  const ctaLabel = ownedLicenses.length > 0 ? "Mua bản quyền mới" : "Mua gói";

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-page p-5">
      <dl className="space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-text-muted">Game</dt>
          <dd className="text-right font-medium text-text-primary">
            {productName}
          </dd>
        </div>
        {selected ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-text-muted">Gói</dt>
              <dd className="text-right text-text-primary">
                {selected.durationDays} ngày
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-text-muted">Số máy</dt>
              <dd className="text-right text-text-primary">
                tối đa {selected.deviceCap} máy
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      {selected ? (
        <div className="mt-4 border-t border-border-subtle pt-4">
          <p className="text-sm text-text-muted">Số tiền phải trả</p>
          <Price
            amountVnd={effectivePrice(selected)}
            originalVnd={selected.promotion ? selected.priceVnd : null}
            size="xl"
            className="mt-1"
          />
          <p className="mt-2 text-sm text-text-muted">
            Tính hạn từ lần kích hoạt đầu
          </p>
        </div>
      ) : null}

      {softwareStatus !== "operational" ? (
        <div className="mt-4">
          <StatusLabel axis="software" value={softwareStatus} size="md" />
        </div>
      ) : null}

      {ownedLicenses.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border-subtle pt-4 text-sm text-text-secondary">
          {ownedLicenses.map((l) => (
            <li key={l.reference}>
              Bạn có bản quyền {l.reference} (
              {l.expiresAt
                ? `hết hạn ${formatDate(l.expiresAt)}`
                : "chưa kích hoạt"}
              ) —{" "}
              <Link
                href={`/thanh-toan?gia-han=${l.reference}`}
                className="content-link"
              >
                Gia hạn bản quyền này
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        {pendingOrder ? (
          <p className="rounded-panel border border-warning bg-warning-bg px-4 py-3 text-sm text-text-primary">
            Bạn đang có đơn chờ thanh toán cho gói này.{" "}
            <Link
              href={`/don-hang/${pendingOrder.code}`}
              className="content-link font-medium"
            >
              Mở đơn {pendingOrder.code}
            </Link>
          </p>
        ) : selected ? (
          // Khách cũng dẫn thẳng tới /thanh-toan — trang đó tự yêu cầu đăng nhập (J1)
          <LinkButton
            href={`/thanh-toan?goi=${selected.id}`}
            className="w-full"
          >
            {ctaLabel}
          </LinkButton>
        ) : (
          <>
            <Button disabled className="w-full">
              {ctaLabel}
            </Button>
            <p className="mt-2 text-sm text-text-muted">Chọn một gói</p>
          </>
        )}
      </div>
    </div>
  );
}
