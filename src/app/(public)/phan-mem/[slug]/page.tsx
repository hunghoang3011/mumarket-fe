/*
 * Trang sản phẩm /phan-mem/[slug] (DESIGN §5, hành trình J1–J2):
 * breadcrumb → cover 16:10 + thông tin → #goi vùng mua M0 → Tính năng →
 * Ảnh chụp → Cài đặt & kích hoạt → Tải phần mềm → Lịch sử phiên bản.
 * Slug không hợp lệ → 404. Nội dung tùy chọn thiếu gom vào MỘT thông báo
 * cuối trang, không xếp nhiều section trống.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLicenses,
  getOrders,
  getProduct,
  getTrialedSlugs,
  offersOf,
  trialOf,
} from "@/demo";
import { getDemoSession } from "@/demo/session";
import type { License, Order } from "@/demo/types";
import { formatDate, formatDateTime } from "@/shared/format/date";
import { LinkButton } from "@/shared/ui/Button";
import { GameArt } from "@/shared/ui/GameArt";
import { Empty, Notice } from "@/shared/ui/Notice";
import { PendingOrderBanner } from "@/shared/ui/PendingOrderBanner";
import { StatusLabel } from "@/shared/ui/StatusLabel";
import { OfferSelector } from "./OfferSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? product.name : "Phần mềm" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const session = await getDemoSession();
  const isCustomer = session.role === "customer";
  const [orders, licenses, trialedSlugs] = await Promise.all([
    isCustomer ? getOrders() : Promise.resolve<Order[]>([]),
    isCustomer ? getLicenses() : Promise.resolve<License[]>([]),
    isCustomer ? getTrialedSlugs() : Promise.resolve<string[]>([]),
  ]);

  const offers = offersOf(product.slug);
  const trial = trialOf(product.slug);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending_payment" && o.productSlug === product.slug,
  );
  const productLicenses = licenses.filter(
    (l) => l.productSlug === product.slug,
  );
  const canDownload =
    isCustomer &&
    product.hasDownload &&
    productLicenses.some(
      (l) => l.status === "active" || l.status === "unactivated",
    );
  const releases = [...product.releases].sort((a, b) =>
    b.releasedAt.localeCompare(a.releasedAt),
  );
  const latestVersion = releases[0]?.version ?? product.softwareVersion;

  // Nội dung tùy chọn còn thiếu — gom vào MỘT thông báo (DESIGN §5)
  const missing: string[] = [];
  if (product.features.length === 0) missing.push("tính năng");
  if (product.screenshots.length === 0) missing.push("ảnh chụp");
  if (product.installSteps.length === 0) missing.push("cài đặt & kích hoạt");
  if (releases.length === 0) missing.push("lịch sử phiên bản");

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 pt-8 xl:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <li>
              <Link href="/" className="content-link">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden className="text-text-muted">
              /
            </li>
            <li>
              <Link href="/phan-mem" className="content-link">
                Phần mềm
              </Link>
            </li>
            <li aria-hidden className="text-text-muted">
              /
            </li>
            <li aria-current="page" className="text-text-secondary">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Đầu trang: desktop cover 7/12 trái, thông tin 5/12 phải;
            mobile cùng thứ tự DOM xếp dọc */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="corner-brackets frame-gold relative rounded-panel lg:col-span-7">
            <GameArt
              slug={product.slug}
              crop="cover"
              className="aspect-[16/10] w-full rounded-panel"
            />
          </div>
          <div className="lg:col-span-5">
            <h1 className="text-3xl font-semibold leading-snug text-action">
              {product.name}
            </h1>
            <div className="mt-3">
              <StatusLabel
                axis="software"
                value={product.softwareStatus}
                size="md"
              />
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-44 shrink-0 text-text-muted">Cập nhật lúc</dt>
                <dd className="text-text-secondary">
                  {product.statusUpdatedAt
                    ? formatDateTime(product.statusUpdatedAt)
                    : "Chưa có thông tin"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-44 shrink-0 text-text-muted">
                  Phiên bản phần mềm
                </dt>
                <dd className="text-text-secondary">
                  {product.softwareVersion ?? "Chưa có thông tin"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-44 shrink-0 text-text-muted">
                  Phiên bản game hỗ trợ
                </dt>
                <dd className="text-text-secondary">
                  {product.supportedGameVersion ?? "Chưa có thông tin"}
                </dd>
              </div>
            </dl>
            <nav
              aria-label="Liên kết nhanh"
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
            >
              <Link href="#goi" className="content-link">
                Gói
              </Link>
              <span aria-hidden className="text-text-muted">
                ·
              </span>
              <Link href="#cai-dat" className="content-link">
                Cài đặt &amp; kích hoạt
              </Link>
              <span aria-hidden className="text-text-muted">
                ·
              </span>
              <Link href="#lich-su" className="content-link">
                Lịch sử phiên bản
              </Link>
            </nav>
          </div>
        </div>

        {pendingOrders[0] ? (
          <div className="mt-6">
            <PendingOrderBanner order={pendingOrders[0]} />
          </div>
        ) : null}
      </div>

      {/* #goi — vùng mua M0: nền phẳng, không ornament */}
      <section id="goi" aria-labelledby="t-goi" className="mt-10 bg-surface-panel">
        <div className="mx-auto max-w-[1200px] px-4 py-10 xl:px-8">
          <h2 id="t-goi" className="text-xl font-semibold text-text-primary">
            Gói
          </h2>
          {offers.length === 0 && !trial ? (
            <div className="mt-5">
              <Empty title="Chưa mở bán. Thông tin gói sẽ hiển thị khi được cấu hình." />
            </div>
          ) : (
            <OfferSelector
              slug={product.slug}
              productName={product.name}
              softwareStatus={product.softwareStatus}
              offers={offers}
              trial={trial}
              trialedBefore={trialedSlugs.includes(product.slug)}
              role={session.role}
              pendingOrders={pendingOrders}
              licenses={productLicenses}
            />
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 pb-16 xl:px-8">
        {product.features.length > 0 ? (
          <section
            id="tinh-nang"
            aria-labelledby="t-tinh-nang"
            className="mt-10"
          >
            <h2
              id="t-tinh-nang"
              className="text-xl font-semibold text-text-primary"
            >
              Tính năng
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-text-secondary">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {product.screenshots.length > 0 ? (
          <section aria-labelledby="t-anh-chup" className="mt-10">
            <h2
              id="t-anh-chup"
              className="text-xl font-semibold text-text-primary"
            >
              Ảnh chụp
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {product.screenshots.map((src, i) => (
                <li key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL ảnh do CMS cung cấp */}
                  <img
                    src={src}
                    alt={`Ảnh chụp ${product.name} ${i + 1}`}
                    loading="lazy"
                    className="w-full rounded-panel border border-border-subtle"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {product.installSteps.length > 0 ? (
          <section id="cai-dat" aria-labelledby="t-cai-dat" className="mt-10">
            <h2
              id="t-cai-dat"
              className="text-xl font-semibold text-text-primary"
            >
              Cài đặt &amp; kích hoạt
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-secondary">
              {product.installSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <section id="tai" aria-labelledby="t-tai" className="mt-10">
          <h2 id="t-tai" className="text-xl font-semibold text-text-primary">
            Tải phần mềm
          </h2>
          <div className="mt-4">
            {canDownload ? (
              <>
                <LinkButton href="#">Tải phần mềm</LinkButton>
                <p className="mt-2 text-sm text-text-muted">
                  Phiên bản mới nhất: {latestVersion ?? "Chưa có thông tin"}
                </p>
              </>
            ) : (
              <LinkButton href="#goi" variant="outline">
                Mua gói để tải
              </LinkButton>
            )}
          </div>
        </section>

        {releases.length > 0 ? (
          <section id="lich-su" aria-labelledby="t-lich-su" className="mt-10">
            <h2
              id="t-lich-su"
              className="text-xl font-semibold text-text-primary"
            >
              Lịch sử phiên bản
            </h2>
            <ul className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
              {releases.slice(0, 3).map((r) => (
                <li
                  key={r.version}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3"
                >
                  <span className="font-medium text-text-primary">
                    {r.version}
                  </span>
                  <span aria-hidden className="text-text-muted">
                    ·
                  </span>
                  <span className="text-sm text-text-muted">
                    {formatDate(r.releasedAt)}
                  </span>
                  <span aria-hidden className="text-text-muted">
                    ·
                  </span>
                  <span className="text-sm text-text-secondary">
                    {r.notes.join("; ")}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/cap-nhat"
              className="content-link mt-3 inline-flex min-h-11 items-center text-sm"
            >
              Xem tất cả
            </Link>
          </section>
        ) : null}

        {missing.length > 0 ? (
          <div className="mt-10">
            <Notice tone="neutral" role="status">
              Đang cập nhật: {missing.join(", ")}.
            </Notice>
          </div>
        ) : null}
      </div>
    </>
  );
}
