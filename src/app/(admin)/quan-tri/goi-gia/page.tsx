/*
 * /quan-tri/goi-gia — các gói theo sản phẩm: loại, số máy, giá, khuyến mãi,
 * đang bán + form thêm gói (DESIGN §5 Quản trị · Sản phẩm). Bản demo: thêm
 * và bật/tắt chỉ đổi client state.
 */
import { getAllOffers, getProducts } from "@/demo";
import { OffersAdmin } from "./OffersAdmin";

export default async function AdminOffersPage() {
  const [products, offers] = await Promise.all([getProducts(), getAllOffers()]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Gói giá</h1>
      <OffersAdmin products={products} initialOffers={offers} />
    </div>
  );
}
