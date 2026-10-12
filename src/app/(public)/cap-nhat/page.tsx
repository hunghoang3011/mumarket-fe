/*
 * /cap-nhat — danh sách tin cập nhật, mới nhất trước (DESIGN §4, §5).
 * Hàng: ngày · game hoặc "Chung" · tiêu đề link + excerpt (giống hàng
 * "Cập nhật mới" ở trang chủ). Trống → đúng copy §5/§10.
 */
import Link from "next/link";
import { getAnnouncements, getProducts } from "@/demo";
import { formatDate } from "@/shared/format/date";
import { Empty } from "@/shared/ui/Notice";

export default async function AnnouncementsPage() {
  const [announcements, products] = await Promise.all([
    getAnnouncements(),
    getProducts(),
  ]);
  const sorted = [...announcements].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="font-display text-2xl font-semibold text-action sm:text-3xl">
        Cập nhật
      </h1>
      <span className="divider-editorial mt-3" aria-hidden="true">
        <span />
      </span>

      {sorted.length === 0 ? (
        <div className="mt-8">
          <Empty title="Chưa có cập nhật nào được đăng." />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
          {sorted.map((a) => {
            const game = a.productSlug
              ? products.find((p) => p.slug === a.productSlug)?.name
              : null;
            return (
              <li key={a.slug}>
                <Link
                  href={`/cap-nhat/${a.slug}`}
                  className="block py-4 hover:bg-surface-panel"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
                  </span>
                  <span className="mt-1 block max-w-[68ch] text-sm text-text-secondary">
                    {a.excerpt}
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
