/*
 * /tai-khoan/ban-quyen/[ma] — chi tiết bản quyền (DESIGN §5, J4).
 * Server tra cứu fixture; bản quyền cấp trong phiên demo (lớp phủ
 * localStorage) chỉ client đọc được nên việc quyết định notFound nằm
 * trong LicenseDetail sau khi gộp lớp phủ.
 * ?xem-ma=1: mở sẵn hộp thoại xác nhận mật khẩu (từ nút "Xem mã bản quyền").
 */
import { getLicense, getOrders } from "@/demo";
import { LicenseDetail } from "./LicenseDetail";

export default async function LicenseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ma: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { ma } = await params;
  const sp = await searchParams;
  const [license, orders] = await Promise.all([getLicense(ma), getOrders()]);

  return (
    <LicenseDetail
      refCode={ma}
      fixtureLicense={license}
      orders={orders}
      autoReveal={sp["xem-ma"] === "1"}
    />
  );
}
