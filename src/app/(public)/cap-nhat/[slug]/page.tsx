/*
 * /cap-nhat/[slug] — chi tiết tin cập nhật (DESIGN §4, §5).
 * Breadcrumb → h1 tiêu đề → meta (ngày · game) → các đoạn body (≤68ch).
 * Có productSlug → link "Xem phần mềm". Slug lạ → 404.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnnouncement, getProduct } from "@/demo";
import { formatDate } from "@/shared/format/date";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);
  if (!announcement) notFound();
  const product = announcement.productSlug
    ? await getProduct(announcement.productSlug)
    : null;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link
              href="/"
              className="text-text-muted underline-offset-2 hover:text-link hover:underline"
            >
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true" className="text-text-muted">
            /
          </li>
          <li>
            <Link
              href="/cap-nhat"
              className="text-text-muted underline-offset-2 hover:text-link hover:underline"
            >
              Cập nhật
            </Link>
          </li>
          <li aria-hidden="true" className="text-text-muted">
            /
          </li>
          <li aria-current="page" className="text-text-secondary">
            {announcement.title}
          </li>
        </ol>
      </nav>

      <h1 className="mt-6 text-2xl font-semibold text-text-primary sm:text-3xl">
        {announcement.title}
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        {formatDate(announcement.publishedAt)}
        <span aria-hidden="true"> · </span>
        {product ? product.name : "Chung"}
      </p>

      <div className="mt-8 max-w-[68ch] space-y-4 text-base text-text-secondary">
        {announcement.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {product ? (
        <p className="mt-8">
          <Link href={`/phan-mem/${product.slug}`} className="content-link">
            Xem phần mềm
          </Link>
        </p>
      ) : null}
    </div>
  );
}
