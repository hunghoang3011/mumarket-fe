/*
 * Trang /bang-gia (DESIGN §5): hàng chip anchor tới từng game; mỗi game một
 * section — h2 tên game + nhãn trạng thái + link "Xem chi tiết" + bảng gói
 * (Thời hạn | Số máy | Giá | Mua gói), hàng dùng thử đứng đầu với pill riêng.
 * Mobile (<640px): ẩn thead, mỗi gói xếp thành hai dòng ("N ngày · tối đa M
 * máy" / giá + nút), không cuộn ngang — vẫn table ngữ nghĩa với data-th.
 * "Mua gói" đi thẳng tới /thanh-toan?goi=… (J1). Không quy đổi giá/ngày.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { effectivePrice, getProducts, offersOf, trialOf } from "@/demo";
import type { Offer, Product } from "@/demo/types";
import { LinkButton } from "@/shared/ui/Button";
import { Empty } from "@/shared/ui/Notice";
import { Price } from "@/shared/ui/Price";
import { StatusLabel } from "@/shared/ui/StatusLabel";

export const metadata: Metadata = { title: "Bảng giá" };

/** Hàng dùng thử — đứng đầu bảng, pill riêng, không hiển thị như giá 0 ₫ */
function TrialRow({ product, trial }: { product: Product; trial: Offer }) {
  return (
    <tr className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-subtle py-3 sm:table-row">
      <td
        data-th="Thời hạn"
        className="w-full text-text-primary sm:w-auto sm:table-cell sm:py-3 sm:pr-4"
      >
        <span className="mr-2 inline-flex items-center rounded-full bg-info-bg px-2.5 py-0.5 text-xs font-medium text-info">
          Dùng thử
        </span>
        <span className="sm:hidden">
          {trial.durationDays} ngày · tối đa {trial.deviceCap} máy
        </span>
        <span className="hidden sm:inline">{trial.durationDays} ngày</span>
      </td>
      <td
        data-th="Số máy"
        className="hidden text-text-secondary sm:table-cell sm:py-3 sm:pr-4"
      >
        tối đa {trial.deviceCap} máy
      </td>
      <td data-th="Giá" className="sm:table-cell sm:py-3 sm:pr-4 sm:text-right">
        <span className="text-sm text-text-secondary">
          Không cần chuyển khoản
        </span>
      </td>
      <td className="ml-auto sm:table-cell sm:py-3 sm:text-right">
        <LinkButton href={`/phan-mem/${product.slug}#goi`} variant="outline">
          Dùng thử
        </LinkButton>
      </td>
    </tr>
  );
}

function PaidRow({ offer }: { offer: Offer }) {
  return (
    <tr className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-subtle py-3 sm:table-row">
      <td
        data-th="Thời hạn"
        className="w-full text-text-primary sm:w-auto sm:table-cell sm:py-3 sm:pr-4"
      >
        <span className="sm:hidden">
          {offer.durationDays} ngày · tối đa {offer.deviceCap} máy
        </span>
        <span className="hidden sm:inline">{offer.durationDays} ngày</span>
      </td>
      <td
        data-th="Số máy"
        className="hidden text-text-secondary sm:table-cell sm:py-3 sm:pr-4"
      >
        tối đa {offer.deviceCap} máy
      </td>
      <td data-th="Giá" className="sm:table-cell sm:py-3 sm:pr-4 sm:text-right">
        <Price
          amountVnd={effectivePrice(offer)}
          originalVnd={offer.promotion ? offer.priceVnd : null}
          size="sm"
          align="right"
        />
      </td>
      <td className="ml-auto sm:table-cell sm:py-3 sm:text-right">
        <LinkButton href={`/thanh-toan?goi=${offer.id}`}>Mua gói</LinkButton>
      </td>
    </tr>
  );
}

export default async function PricingPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="text-3xl font-semibold text-text-primary">Bảng giá</h1>

      {/* Chip anchor tới section từng game */}
      <nav aria-label="Chọn game" className="mt-6 flex flex-wrap gap-2">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`#${p.slug}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border-subtle px-4 text-sm text-text-secondary hover:border-action hover:text-link"
          >
            {p.name}
          </Link>
        ))}
      </nav>

      {products.map((p) => {
        const trial = trialOf(p.slug);
        const offers = offersOf(p.slug);
        return (
          <section
            key={p.slug}
            id={p.slug}
            aria-labelledby={`t-gia-${p.slug}`}
            className="mt-10 border-t border-border-subtle pt-8"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2
                id={`t-gia-${p.slug}`}
                className="text-xl font-semibold text-text-primary"
              >
                {p.name}
              </h2>
              <StatusLabel axis="software" value={p.softwareStatus} />
              <Link
                href={`/phan-mem/${p.slug}`}
                className="content-link ml-auto inline-flex min-h-11 items-center text-sm"
              >
                Xem chi tiết
              </Link>
            </div>

            {offers.length === 0 && !trial ? (
              <div className="mt-4">
                <Empty title="Chưa mở bán. Thông tin gói sẽ hiển thị khi được cấu hình." />
              </div>
            ) : (
              <table className="mt-4 block w-full text-sm sm:table">
                <caption className="sr-only">Gói giá {p.name}</caption>
                <thead className="hidden sm:table-header-group">
                  <tr className="border-b border-border-subtle text-left text-text-muted">
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Thời hạn
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Số máy
                    </th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">
                      Giá
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                  {trial ? <TrialRow product={p} trial={trial} /> : null}
                  {offers.map((o) => (
                    <PaidRow key={o.id} offer={o} />
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      })}
    </div>
  );
}
