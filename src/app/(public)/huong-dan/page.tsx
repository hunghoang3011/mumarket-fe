/*
 * /huong-dan — danh sách hướng dẫn (DESIGN §4, §5; J6).
 * Hàng: tiêu đề link + game liên quan (nếu có) + ngày đăng.
 * Trống → trạng thái trung thực (§9), không dữ liệu giả.
 */
import Link from "next/link";
import { getGuides, getProducts } from "@/demo";
import { formatDate } from "@/shared/format/date";
import { Empty } from "@/shared/ui/Notice";

export default async function GuidesPage() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);
  const sorted = [...guides].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="font-display text-2xl font-semibold text-action sm:text-3xl">
        Hướng dẫn
      </h1>
      <span className="divider-editorial mt-3" aria-hidden="true">
        <span />
      </span>

      {sorted.length === 0 ? (
        <div className="mt-8">
          <Empty title="Chưa có hướng dẫn nào được đăng." />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
          {sorted.map((g) => {
            const game = g.productSlug
              ? products.find((p) => p.slug === g.productSlug)?.name
              : null;
            return (
              <li key={g.slug}>
                <Link
                  href={`/huong-dan/${g.slug}`}
                  className="flex min-h-11 flex-wrap items-baseline gap-x-3 gap-y-1 py-3 hover:bg-surface-panel"
                >
                  <span className="text-base font-medium text-link">
                    {g.title}
                  </span>
                  {game ? (
                    <span className="text-sm text-text-secondary">{game}</span>
                  ) : null}
                  <span className="text-sm text-text-muted">
                    {formatDate(g.publishedAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
