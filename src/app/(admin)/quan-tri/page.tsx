"use client";

/*
 * /quan-tri — "Việc cần xử lý" (DESIGN §5 Quản trị): 4 số liệu có link tới
 * danh sách đã lọc. Không biểu đồ, M0 phẳng. Toàn trang là client leaf vì
 * số liệu gộp lớp phủ demo (đơn vừa duyệt, khoản vừa áp dụng, ticket vừa
 * trả lời phải ra khỏi hàng chờ); nguồn nền là fixtures demo, tôn trọng
 * DEMO_ENABLED giống các hàm get* trong src/demo.
 */
import Link from "next/link";
import { DEMO_ENABLED } from "@/demo/config";
import { demoOffers, demoProducts } from "@/demo/fixtures/catalog";
import { demoOrders, demoReceipts } from "@/demo/fixtures/commerce";
import { demoTickets } from "@/demo/fixtures/content";
import { useDemoOverlay } from "@/demo/store";
import type { TicketState } from "@/demo/types";
import { mergeOrdersWithOverlay } from "@/app/(customer)/tai-khoan/LicenseSections";
import { Icon } from "@/shared/ui/Icon";
import type { IconName } from "@/shared/ui/Icon";

interface WorkCard {
  label: string;
  count: number;
  href: string;
  icon: IconName;
}

export default function AdminHomePage() {
  const overlay = useDemoOverlay();

  const orders = mergeOrdersWithOverlay(
    DEMO_ENABLED ? demoOrders : [],
    overlay,
  );
  const reportedCount = orders.filter(
    (o) => o.status === "pending_payment" && o.hasPaymentReport,
  ).length;

  const receipts = DEMO_ENABLED ? demoReceipts : [];
  const unresolvedCount = receipts.filter((r) => {
    if (r.state !== "unresolved" || overlay.receiptsApplied[r.id]) return false;
    const returned = r.returnedVnd + (overlay.receiptsReturned[r.id] ?? 0);
    return returned < r.amountVnd;
  }).length;

  const tickets = DEMO_ENABLED ? demoTickets : [];
  const waitingTickets = tickets.filter((t) => {
    const state = (overlay.ticketStates[t.id] ?? t.state) as TicketState;
    return state === "waiting_admin" || state === "open";
  }).length;

  const products = DEMO_ENABLED ? demoProducts : [];
  const offers = DEMO_ENABLED ? demoOffers.filter((o) => o.active) : [];
  const unconfiguredCount = products.filter((p) => {
    const selling = offers.some(
      (o) => o.productSlug === p.slug && o.kind !== "trial",
    );
    return !selling || p.releases.length === 0;
  }).length;

  const cards: WorkCard[] = [
    {
      label: "Đơn đã báo chuyển khoản",
      count: reportedCount,
      href: "/quan-tri/don-hang?loc=da-bao",
      icon: "package",
    },
    {
      label: "Khoản tiền cần đối soát",
      count: unresolvedCount,
      href: "/quan-tri/thanh-toan",
      icon: "wallet",
    },
    {
      label: "Yêu cầu hỗ trợ chờ trả lời",
      count: waitingTickets,
      href: "/quan-tri/ho-tro",
      icon: "mail",
    },
    {
      label: "Thiếu cấu hình để mở bán",
      count: unconfiguredCount,
      href: "/quan-tri/san-pham",
      icon: "settings",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        Việc cần xử lý
      </h1>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="flex h-full flex-col gap-2 rounded-panel border border-border-subtle bg-surface-panel p-5 hover:border-border-control"
            >
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name={c.icon} size={16} />
                {c.label}
              </span>
              <span className="text-3xl font-semibold text-text-primary">
                {c.count}
              </span>
              <span className="mt-auto text-sm text-link underline underline-offset-2">
                Mở danh sách
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
