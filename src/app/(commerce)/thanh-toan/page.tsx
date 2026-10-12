/*
 * Route /thanh-toan (DESIGN §5; J1 mua mới ?goi=…, J4 gia hạn ?gia-han=BQ-…; R3).
 * Bắt buộc đăng nhập: khách → /dang-nhap?next=<đường dẫn kèm query gốc>.
 * Gói/bản quyền không tìm thấy → thông báo inline + lối về, không 404 cứng.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getAllOffers,
  getLicense,
  getOrders,
  getProduct,
  getSettings,
  offersOf,
} from "@/demo";
import { getDemoSession } from "@/demo/session";
import { LinkButton } from "@/shared/ui/Button";
import { Notice } from "@/shared/ui/Notice";
import { CheckoutView } from "./CheckoutView";

export const metadata: Metadata = { title: "Thanh toán" };

/** Dựng lại query string gốc từ searchParams để giữ ý định qua đăng nhập. */
function queryStringOf(
  params: Record<string, string | string[] | undefined>,
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.append(key, value);
    else if (Array.isArray(value)) {
      for (const v of value) qs.append(key, v);
    }
  }
  return qs.toString();
}

function InvalidNotice({
  title,
  children,
  actionHref,
  actionLabel,
}: {
  title: string;
  children: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Thanh toán</h1>
      <Notice tone="warning" title={title}>
        <p>{children}</p>
        <p className="mt-3">
          <LinkButton href={actionHref} variant="outline" size="sm">
            {actionLabel}
          </LinkButton>
        </p>
      </Notice>
    </div>
  );
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getDemoSession();
  if (session.role === "guest") {
    const qs = queryStringOf(params);
    redirect(
      `/dang-nhap?next=${encodeURIComponent(`/thanh-toan${qs ? `?${qs}` : ""}`)}`,
    );
  }

  const goi = typeof params.goi === "string" ? params.goi : null;
  const giaHan = typeof params["gia-han"] === "string" ? params["gia-han"] : null;

  if (goi) {
    const [offers, orders, settings] = await Promise.all([
      getAllOffers(),
      getOrders(),
      getSettings(),
    ]);
    // Gói dùng thử không đi qua chuyển khoản (J2) — coi như không hợp lệ ở đây.
    const offer =
      offers.find((o) => o.id === goi && o.active && o.kind !== "trial") ??
      null;
    const product = offer ? await getProduct(offer.productSlug) : null;
    if (!offer || !product) {
      return (
        <InvalidNotice
          title="Không tìm thấy gói đã chọn"
          actionHref="/bang-gia"
          actionLabel="Xem bảng giá"
        >
          Vui lòng chọn lại gói từ bảng giá.
        </InvalidNotice>
      );
    }
    return (
      <CheckoutView
        mode="purchase"
        offer={offer}
        product={product}
        settings={settings}
        existingOrders={orders}
      />
    );
  }

  if (giaHan) {
    const [license, settings, orders] = await Promise.all([
      getLicense(giaHan),
      getSettings(),
      getOrders(),
    ]);
    if (!license) {
      return (
        <InvalidNotice
          title="Không tìm thấy bản quyền này"
          actionHref="/tai-khoan"
          actionLabel="Về Phần mềm của tôi"
        >
          Kiểm tra lại mã tham chiếu hoặc xem danh sách bản quyền của bạn.
        </InvalidNotice>
      );
    }
    const product = await getProduct(license.productSlug);
    // Chỉ các gói cùng sản phẩm VÀ cùng số máy (J4: đổi số máy là mua mới).
    const renewalOffers = offersOf(license.productSlug).filter(
      (o) => o.deviceCap === license.deviceCap,
    );
    if (!product || renewalOffers.length === 0) {
      return (
        <InvalidNotice
          title="Chưa mở bán"
          actionHref={`/phan-mem/${license.productSlug}#goi`}
          actionLabel="Mua bản quyền mới với số máy khác"
        >
          Thông tin gói sẽ hiển thị khi được cấu hình.
        </InvalidNotice>
      );
    }
    return (
      <CheckoutView
        mode="renewal"
        license={license}
        renewalOffers={renewalOffers}
        product={product}
        settings={settings}
        existingOrders={orders}
      />
    );
  }

  return (
    <InvalidNotice
      title="Chưa có gói nào được chọn"
      actionHref="/bang-gia"
      actionLabel="Xem bảng giá"
    >
      Chọn một gói từ bảng giá, hoặc mở gia hạn từ bản quyền của bạn.
    </InvalidNotice>
  );
}
