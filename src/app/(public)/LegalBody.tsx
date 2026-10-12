/*
 * Thân trang chính sách dùng chung cho /dieu-khoan, /quyen-rieng-tu,
 * /chinh-sach-hoan-tien (DESIGN §4; J6).
 * Nội dung do chủ sở hữu cung cấp qua CMS — giữ nguyên văn, không bịa thêm.
 * Thiếu nội dung → trạng thái trung thực (§9), không để section trống.
 */
import { getLegalPage } from "@/demo";

export async function LegalBody({
  slug,
  fallbackTitle,
}: {
  slug: string;
  /** Tiêu đề dự phòng khi trang chưa được cấu hình trong CMS */
  fallbackTitle: string;
}) {
  const page = await getLegalPage(slug);
  const body = page?.body ?? [];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
        {page?.title ?? fallbackTitle}
      </h1>
      {body.length === 0 ? (
        <p className="mt-6 max-w-[68ch] text-base text-text-muted">
          Nội dung đang được cập nhật.
        </p>
      ) : (
        <div className="mt-6 max-w-[68ch] space-y-4 text-base text-text-secondary">
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}
