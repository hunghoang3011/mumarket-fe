/*
 * GameCard (DESIGN §5): thứ tự ảnh → tên → trạng thái → mô tả → giá → hành
 * động. Dọc (≥1200px, ảnh 3:4) và ngang (<1200px, ảnh 1:1) cùng thứ tự DOM.
 * Viền bronze, ornament M2 hai góc trên ảnh, halo M4 tĩnh khi hover/focus.
 * Ảnh và tên là link tới trang chi tiết; cả thẻ không phải một link lớn.
 */
import Link from "next/link";
import { startingOffer, trialOf, effectivePrice } from "@/demo";
import type { Product } from "@/demo/types";
import { formatVnd } from "../format/money";
import { GameArt } from "./GameArt";
import { StatusLabel } from "./StatusLabel";

/** Ornament góc M2 trên ảnh: lớp hoa văn mây tường (class corner-brackets) */

export function GameCard({
  product,
  layout,
}: {
  product: Product;
  layout: "vertical" | "horizontal";
}) {
  const start = startingOffer(product.slug);
  const trial = trialOf(product.slug);
  const sellable = start !== null || trial !== null;
  const trialOnly = start === null && trial !== null;

  const priceBlock = (
    <div className="bg-surface-page/0">
      {start ? (
        <>
          <p className="text-xl font-semibold text-text-primary">
            Từ {formatVnd(effectivePrice(start))}
          </p>
          <p className="mt-0.5 text-sm text-text-muted">
            {start.durationDays} ngày · tối đa {start.deviceCap} máy
          </p>
        </>
      ) : (
        <p className="text-base font-semibold text-text-secondary">Chưa mở bán</p>
      )}
      {trial ? (
        <p className="mt-1 text-sm text-info">
          Có dùng thử {trial.durationDays} ngày
        </p>
      ) : null}
    </div>
  );

  const actions = sellable ? (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-[480px]:flex-col max-[480px]:items-stretch">
      <Link
        href={`/phan-mem/${product.slug}#goi`}
        className="btn-metal inline-flex min-h-11 flex-1 items-center justify-center rounded-control px-4 py-2 text-center"
      >
        {trialOnly ? "Dùng thử" : "Mua gói"}
      </Link>
      <Link
        href={`/phan-mem/${product.slug}`}
        className="content-link inline-flex min-h-11 items-center justify-center text-sm"
      >
        Xem chi tiết
      </Link>
    </div>
  ) : (
    <Link
      href={`/phan-mem/${product.slug}`}
      className="content-link inline-flex min-h-11 items-center text-sm"
    >
      Xem chi tiết
    </Link>
  );

  const body = (
    <>
      <Link
        href={`/phan-mem/${product.slug}`}
        className="text-lg font-semibold leading-snug text-action hover:text-link xl:text-xl"
      >
        {product.name}
      </Link>
      <div className="mt-1.5">
        <StatusLabel axis="software" value={product.softwareStatus} />
      </div>
      {product.shortDescription ? (
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
          {product.shortDescription}
        </p>
      ) : null}
      <div className="mt-3">{priceBlock}</div>
      <div className="mt-3">{actions}</div>
    </>
  );

  if (layout === "vertical") {
    return (
      <article
        data-testid={`game-card-${product.slug}`}
        className="panel-lacquer halo-frame relative flex w-[208px] flex-col rounded-panel p-3 xl:w-[220px]"
      >
        <div className="corner-brackets frame-gold relative rounded-detail">
          <Link href={`/phan-mem/${product.slug}`} tabIndex={-1} aria-hidden>
            <GameArt
              slug={product.slug}
              crop="card"
              className="aspect-[3/4] w-full rounded-detail"
            />
          </Link>
        </div>
        <div className="mt-3 flex flex-1 flex-col px-1">{body}</div>
      </article>
    );
  }

  return (
    <article
      data-testid={`game-card-${product.slug}`}
      className="panel-lacquer halo-frame relative flex gap-4 rounded-panel p-3"
    >
      <div className="corner-brackets frame-gold relative shrink-0 rounded-detail">
        <Link href={`/phan-mem/${product.slug}`} tabIndex={-1} aria-hidden>
          <GameArt
            slug={product.slug}
            crop="square"
            className="h-24 w-24 rounded-detail sm:h-28 sm:w-28"
          />
        </Link>
      </div>
      <div className="min-w-0 flex-1">{body}</div>
    </article>
  );
}
