/*
 * /quan-tri/san-pham — danh mục năm sản phẩm cố định (DESIGN §4) kèm trạng
 * thái phần mềm, phiên bản, trạng thái bán (DESIGN §5 Quản trị · Sản phẩm).
 * "Đang mở bán" = có ít nhất một gói trả phí đang active. Cảnh báo khi đang
 * bán mà phần mềm Tạm ngừng/Chưa phát hành. Toàn M0 phẳng.
 */
import Link from "next/link";
import { getAllOffers, getProducts } from "@/demo";
import type { Product } from "@/demo/types";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { GameArt } from "@/shared/ui/GameArt";
import { Empty, Notice } from "@/shared/ui/Notice";
import { StatusLabel } from "@/shared/ui/StatusLabel";

type Row = Product & { id: string; selling: boolean };

const columns: Column<Row>[] = [
  {
    key: "product",
    header: "Sản phẩm",
    render: (r) => (
      <span className="flex items-center gap-3">
        <GameArt
          slug={r.slug}
          crop="square"
          className="h-12 w-12 shrink-0 rounded-detail border border-border-subtle"
        />
        <span className="font-medium">{r.name}</span>
      </span>
    ),
  },
  {
    key: "status",
    header: "Trạng thái phần mềm",
    render: (r) => <StatusLabel axis="software" value={r.softwareStatus} />,
  },
  {
    key: "version",
    header: "Phiên bản",
    render: (r) => r.softwareVersion ?? "Chưa có thông tin",
  },
  {
    key: "selling",
    header: "Trạng thái bán",
    render: (r) =>
      r.selling ? (
        <span className="text-success">Đang mở bán</span>
      ) : (
        <span className="text-text-muted">Chưa mở bán</span>
      ),
  },
  {
    key: "action",
    header: "Thao tác",
    render: (r) => (
      <Link
        href={`/quan-tri/san-pham/${r.slug}`}
        className="text-link underline underline-offset-2 hover:text-action"
      >
        Chỉnh sửa
      </Link>
    ),
  },
];

export default async function AdminProductsPage() {
  const [products, offers] = await Promise.all([getProducts(), getAllOffers()]);
  const rows: Row[] = products.map((p) => ({
    ...p,
    id: p.slug,
    selling: offers.some(
      (o) => o.productSlug === p.slug && o.kind !== "trial" && o.active,
    ),
  }));
  const risky = rows.filter(
    (r) =>
      r.selling &&
      (r.softwareStatus === "paused" || r.softwareStatus === "unreleased"),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Sản phẩm</h1>
      {risky.length > 0 ? (
        <Notice
          tone="warning"
          title="Sản phẩm đang mở bán nhưng phần mềm không hoạt động"
        >
          {risky.map((r) => r.name).join("; ")} đang có gói trả phí mở bán
          trong khi trạng thái phần mềm là “Tạm ngừng hoạt động” hoặc “Chưa
          phát hành”. Kiểm tra lại trước khi khách mua.
        </Notice>
      ) : null}
      <DataTable
        columns={columns}
        rows={rows}
        caption="Danh sách năm sản phẩm cố định của cửa hàng"
        empty={<Empty title="Chưa có sản phẩm nào." />}
      />
    </div>
  );
}
