/*
 * Trang 404 toàn cục (App Router not-found): render trong root layout, không
 * phụ thuộc layout public — tự dựng khung tối giản: h1 + giải thích ngắn +
 * lối về trang chủ / trang phần mềm (DESIGN §9 trạng thái trung thực).
 */
import type { Metadata } from "next";
import { LinkButton } from "@/shared/ui/Button";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-text-primary">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 max-w-[52ch] text-base text-text-secondary">
        Đường dẫn bạn mở không tồn tại hoặc nội dung đã được di chuyển. Bạn có
        thể quay lại trang chủ hoặc xem danh sách phần mềm.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/">Về trang chủ</LinkButton>
        <LinkButton href="/phan-mem" variant="outline">
          Xem phần mềm
        </LinkButton>
      </div>
    </main>
  );
}
