/*
 * /quan-tri/noi-dung — CMS nội dung: trang chủ & banner, ghi chú thanh
 * toán, hướng dẫn, FAQ, tin cập nhật, trang chính sách, xem trước email
 * (DESIGN §5 Quản trị · Nội dung, §1 copy seed, J6 email). Bản demo: lưu
 * chỉ đổi client state.
 */
import {
  getAnnouncements,
  getFaqs,
  getGuides,
  getLegalPage,
  getProducts,
  getSettings,
} from "@/demo";
import { ContentForms } from "./ContentForms";

export default async function AdminContentPage() {
  const [products, guides, faqs, announcements, settings, dieuKhoan, quyenRiengTu, hoanTien] =
    await Promise.all([
      getProducts(),
      getGuides(),
      getFaqs(),
      getAnnouncements(),
      getSettings(),
      getLegalPage("dieu-khoan"),
      getLegalPage("quyen-rieng-tu"),
      getLegalPage("chinh-sach-hoan-tien"),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Nội dung</h1>
      <ContentForms
        products={products}
        initialGuides={guides}
        initialFaqs={faqs}
        initialAnnouncements={announcements}
        legalPages={[dieuKhoan, quyenRiengTu, hoanTien].filter(
          (p) => p !== null,
        )}
        settings={settings}
      />
    </div>
  );
}
