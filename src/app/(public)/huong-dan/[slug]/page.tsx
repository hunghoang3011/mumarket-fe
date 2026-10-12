/*
 * /huong-dan/[slug] — chi tiết hướng dẫn (DESIGN §4, §5).
 * Breadcrumb → h1 tiêu đề → ngày đăng + game liên quan (link) → các bước
 * dạng <ol> đánh số, đoạn văn tối đa 68ch. Slug lạ → 404.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getProduct } from "@/demo";
import { formatDate } from "@/shared/format/date";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();
  const product = guide.productSlug
    ? await getProduct(guide.productSlug)
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
              href="/huong-dan"
              className="text-text-muted underline-offset-2 hover:text-link hover:underline"
            >
              Hướng dẫn
            </Link>
          </li>
          <li aria-hidden="true" className="text-text-muted">
            /
          </li>
          <li aria-current="page" className="text-text-secondary">
            {guide.title}
          </li>
        </ol>
      </nav>

      <h1 className="mt-6 text-2xl font-semibold text-text-primary sm:text-3xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        {formatDate(guide.publishedAt)}
        {product ? (
          <>
            <span aria-hidden="true"> · </span>
            <Link href={`/phan-mem/${product.slug}`} className="content-link">
              {product.name}
            </Link>
          </>
        ) : null}
      </p>

      <ol className="mt-8 max-w-[68ch] list-decimal space-y-3 pl-6 text-base text-text-secondary marker:text-text-muted">
        {guide.steps.map((step, i) => (
          <li key={i} className="pl-1">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
