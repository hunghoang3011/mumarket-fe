/*
 * /tai-khoan — "Phần mềm của tôi" (DESIGN §5, J4).
 * Server tải fixture; việc gộp lớp phủ demo (đơn/bản quyền tạo trong phiên,
 * máy đã gỡ, tên máy đã sửa) diễn ra ở client trong LicenseSections.
 */
import { getLicenses, getOrders, getProducts } from "@/demo";
import { LicenseSections } from "./LicenseSections";

export default async function AccountPage() {
  const [licenses, orders, products] = await Promise.all([
    getLicenses(),
    getOrders(),
    getProducts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        Phần mềm của tôi
      </h1>
      <LicenseSections
        licenses={licenses}
        orders={orders}
        products={products}
      />
    </div>
  );
}
