/*
 * /quan-tri/thanh-toan — "Đối soát" (DESIGN §5 Quản trị · Đối soát, J5.2–3).
 * Server tải khoản tiền/đơn/bản quyền fixture; bộ lọc 3 trạng thái nằm trong
 * query ?trang-thai= (mặc định unresolved). Thao tác nhập/áp dụng/duyệt
 * muộn/hoàn trả diễn ra ở client trong ReceiptWorkbench.
 */
import Link from "next/link";
import { getLicenses, getOrders, getReceipts } from "@/demo";
import { ReceiptWorkbench } from "./ReceiptWorkbench";

const TABS = [
  { value: "unresolved", label: "Cần đối soát" },
  { value: "applied", label: "Đã áp dụng" },
  { value: "returned", label: "Đã hoàn trả" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default async function AdminReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params["trang-thai"];
  const tab: TabValue =
    raw === "applied" || raw === "returned" ? raw : "unresolved";

  const [receipts, orders, licenses] = await Promise.all([
    getReceipts(),
    getOrders(),
    getLicenses(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Đối soát</h1>
      <nav aria-label="Lọc theo trạng thái khoản tiền">
        <ul className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <li key={t.value}>
              <Link
                href={`/quan-tri/thanh-toan?trang-thai=${t.value}`}
                aria-current={tab === t.value ? "true" : undefined}
                className={`inline-flex min-h-11 items-center rounded-control border px-4 text-sm font-medium ${
                  tab === t.value
                    ? "border-border-control bg-surface-raised text-text-primary"
                    : "border-border-subtle text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ReceiptWorkbench
        receipts={receipts}
        orders={orders}
        licenses={licenses}
        activeTab={tab}
      />
    </div>
  );
}
