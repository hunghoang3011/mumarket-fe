/*
 * Trang chủ — thứ tự MUST giữ (DESIGN §5):
 * Hero → NGŨ ĐẠI THẾ GIỚI → ĐỒNG HÀNH… → 4 bước mua → Cập nhật mới.
 * Copy gốc §1, chữ là DOM (không nằm trong ảnh).
 */
import Link from "next/link";
import { getAllOffers, getAnnouncements, getProducts } from "@/demo";
import { formatDate } from "@/shared/format/date";
import { EditorialTitle } from "@/shared/ui/EditorialTitle";
import { GameCard } from "@/shared/ui/GameCard";
import { HeroArt } from "@/shared/ui/HeroArt";
import { Icon } from "@/shared/ui/Icon";
import { LinkButton } from "@/shared/ui/Button";
import type { IconName } from "@/shared/ui/Icon";

const BENEFITS: { icon: IconName; label: string }[] = [
  { icon: "settings", label: "Giao diện dễ sử dụng" },
  { icon: "edit", label: "Tùy chỉnh linh hoạt" },
  { icon: "refresh", label: "Cập nhật phiên bản" },
  { icon: "mail", label: "Hỗ trợ kỹ thuật" },
];

const STEPS = [
  "Chọn tựa game",
  "Lựa chọn gói phần mềm",
  "Thanh toán và nhận License",
  "Tải xuống và kích hoạt",
];

export default async function HomePage() {
  const [products, announcements, offers] = await Promise.all([
    getProducts(),
    getAnnouncements(),
    getAllOffers(),
  ]);
  const latest = [...announcements]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
  const hasTrial = offers.some((o) => o.kind === "trial");

  return (
    <>
      {/* 1. Hero — một h1 duy nhất; mobile ảnh 4:5 trên + chữ dưới nền đặc,
             desktop ảnh nền + scrim + panel chữ trái (tối đa 560px) */}
      <section aria-label="Giới thiệu" className="relative">
        <div className="sm:relative sm:h-[600px]">
          <div className="relative aspect-[4/5] sm:absolute sm:inset-0 sm:aspect-auto">
            <HeroArt className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-surface-page sm:hidden" />
            <div className="scrim-hero absolute inset-0 hidden sm:block" />
          </div>
          <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-8">
            <div className="panel-lacquer corner-brackets w-full max-w-[560px] rounded-panel px-4 py-6 sm:p-8">
              <p className="text-base font-medium tracking-[0.18em] text-action">
                Công Nghệ Khai Mở – Chinh Phục Tam Giới
              </p>
              <h1 className="title-gold mt-3 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.2] [text-wrap:balance]">
                THẦN BINH CÔNG NGHỆ CHINH PHỤC NGŨ ĐẠI THẾ GIỚI
              </h1>
              <p className="mt-4 text-base text-text-secondary">
                Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp
                &amp; MU.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton href="/phan-mem">KHÁM PHÁ PHẦN MỀM</LinkButton>
                <LinkButton href="/bang-gia" variant="outline">
                  XEM BẢNG GIÁ
                </LinkButton>
                <span className="seal-mark sm:ml-3" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NGŨ ĐẠI THẾ GIỚI */}
      <section
        aria-labelledby="t-home-worlds"
        className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16"
      >
        <EditorialTitle id="t-home-worlds">NGŨ ĐẠI THẾ GIỚI</EditorialTitle>
        <p className="mt-3 max-w-[68ch] text-base text-text-secondary">
          Khám phá hệ sinh thái phần mềm được phát triển dành riêng cho từng
          tựa game.
        </p>
        {/* ≥1200px: năm thẻ dọc một hàng */}
        <div className="mt-8 hidden justify-between xl:flex">
          {products.map((p) => (
            <GameCard key={p.slug} product={p} layout="vertical" />
          ))}
        </div>
        {/* 640–1199px: thẻ ngang hai cột (2+2+1, cuối canh giữa) */}
        <div className="mt-8 hidden grid-cols-2 gap-4 sm:grid xl:hidden">
          {products.map((p, i) => (
            <div
              key={p.slug}
              className={i === products.length - 1 && products.length % 2 === 1 ? "col-span-2 mx-auto w-full max-w-[calc(50%-8px)]" : ""}
            >
              <GameCard product={p} layout="horizontal" />
            </div>
          ))}
        </div>
        {/* <640px: thẻ ngang một cột */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:hidden">
          {products.map((p) => (
            <GameCard key={p.slug} product={p} layout="horizontal" />
          ))}
        </div>
      </section>

      {/* 3. ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC */}
      <section aria-labelledby="t-home-benefits" className="band-lacquer">
        <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
          <EditorialTitle id="t-home-benefits">
            ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC
          </EditorialTitle>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-0 xl:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <li
                key={b.label}
                className={`flex items-center gap-3 sm:px-6 ${
                  i > 0 ? "sm:border-l sm:border-border-subtle" : "sm:pl-0"
                }`}
              >
                <span className="text-action">
                  <Icon name={b.icon} size={24} />
                </span>
                <span className="text-base font-medium text-text-primary">
                  {b.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Bốn bước mua */}
      <section
        aria-labelledby="t-home-steps"
        className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16"
      >
        <EditorialTitle id="t-home-steps">
          MUA PHẦN MỀM TRONG BỐN BƯỚC
        </EditorialTitle>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {STEPS.map((step, i) => (
            <li key={step} className="relative flex flex-col items-start gap-3 xl:px-6 xl:first:pl-0 xl:last:pr-0">
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-12 top-5 hidden h-px w-[calc(100%-48px)] bg-border-ornament xl:block"
                />
              ) : null}
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-action bg-surface-panel text-base font-semibold text-action">
                {i + 1}
              </span>
              <p className="text-base font-medium text-text-primary">{step}</p>
              {i === 2 ? (
                <p className="text-sm text-text-muted">
                  Bản quyền được cấp sau khi khoản chuyển được xác nhận.
                </p>
              ) : null}
            </li>
          ))}
        </ol>
        {hasTrial ? (
          <p className="mt-6 text-sm text-info">
            Dùng thử không cần chuyển khoản.
          </p>
        ) : null}
      </section>

      {/* 5. Cập nhật mới */}
      <section
        aria-labelledby="t-home-news"
        className="mx-auto max-w-[1200px] px-4 pb-16 pt-4 xl:px-8"
      >
        <EditorialTitle id="t-home-news">CẬP NHẬT MỚI</EditorialTitle>
        {latest.length === 0 ? (
          <p className="mt-6 text-sm text-text-muted">
            Chưa có cập nhật nào được đăng.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
            {latest.map((a) => {
              const game = a.productSlug
                ? products.find((p) => p.slug === a.productSlug)?.name
                : null;
              return (
                <li key={a.slug}>
                  <Link
                    href={`/cap-nhat/${a.slug}`}
                    className="flex min-h-11 flex-wrap items-baseline gap-x-3 gap-y-1 py-3 hover:bg-surface-panel"
                  >
                    <span className="text-sm text-text-muted">
                      {formatDate(a.publishedAt)}
                    </span>
                    <span className="text-sm text-text-muted" aria-hidden>
                      ·
                    </span>
                    <span className="text-sm text-text-secondary">
                      {game ?? "Chung"}
                    </span>
                    <span className="text-base font-medium text-link">
                      {a.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
