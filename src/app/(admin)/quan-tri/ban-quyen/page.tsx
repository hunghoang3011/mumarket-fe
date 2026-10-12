/*
 * /quan-tri/ban-quyen — danh sách bản quyền (DESIGN §5 Quản trị · Bản quyền,
 * J5.4). Server tải bản quyền + sản phẩm fixture; tìm kiếm, tạm khóa, khôi
 * phục, thu hồi và cấp thủ công diễn ra ở client trong LicenseAdmin.
 * "Hoàn tiền đơn đã thanh toán" nằm ở chi tiết đơn, tách khỏi thu hồi.
 */
import { getLicenses, getProducts } from "@/demo";
import { LicenseAdmin } from "./LicenseAdmin";

export default async function AdminLicensesPage() {
  const [licenses, products] = await Promise.all([
    getLicenses(),
    getProducts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Bản quyền</h1>
      <LicenseAdmin licenses={licenses} products={products} />
    </div>
  );
}
