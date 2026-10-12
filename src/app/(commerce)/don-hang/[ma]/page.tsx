/*
 * Route /don-hang/[ma] (DESIGN §5; J3 nguyên bảng).
 * Server tra đơn fixture; đơn tạo trong phiên demo nằm ở overlay phía client
 * nên page truyền fixture (có thể null) sang OrderView để merge tại chỗ.
 */
import type { Metadata } from "next";
import { getLicenses, getOrder, getSettings } from "@/demo";
import { OrderView } from "./OrderView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ma: string }>;
}): Promise<Metadata> {
  const { ma } = await params;
  return { title: `Đơn hàng ${ma}` };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ ma: string }>;
}) {
  const { ma } = await params;
  const [order, licenses, settings] = await Promise.all([
    getOrder(ma),
    getLicenses(),
    getSettings(),
  ]);
  return (
    <OrderView
      code={ma}
      fixtureOrder={order}
      fixtureLicenses={licenses}
      paymentNote={settings.paymentNote}
    />
  );
}
