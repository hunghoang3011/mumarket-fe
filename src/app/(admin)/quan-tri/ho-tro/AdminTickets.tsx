"use client";

/*
 * Bàn làm việc hỗ trợ của quản trị (DESIGN §5 Quản trị, J6): bảng yêu cầu,
 * chọn một yêu cầu để xem thread chữ thuần và trả lời. Trả lời ghi
 * overlay.ticketReplies (from "admin") và chuyển trạng thái sang
 * waiting_customer ("Chờ khách trả lời"); "Đánh dấu đã giải quyết" ghi
 * ticketStates = resolved. Không có đính kèm.
 */
import { useState } from "react";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { Ticket, TicketState } from "@/demo/types";
import { formatDate, formatDateTime } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Textarea } from "@/shared/ui/Field";
import { Empty } from "@/shared/ui/Notice";
import { StatusLabel } from "@/shared/ui/StatusLabel";

function TicketThread({
  ticket,
  customerName,
}: {
  ticket: Ticket;
  customerName: string;
}) {
  const overlay = useDemoOverlay();
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string>();

  const state = (overlay.ticketStates[ticket.id] ?? ticket.state) as TicketState;
  const messages = [
    ...ticket.messages,
    ...(overlay.ticketReplies[ticket.id] ?? []),
  ].sort((a, b) => a.at.localeCompare(b.at));

  function send() {
    const body = reply.trim();
    if (!body) {
      setError("Nhập nội dung trả lời.");
      return;
    }
    setError(undefined);
    const at = new Date().toISOString();
    writeOverlay({
      ticketReplies: {
        ...overlay.ticketReplies,
        [ticket.id]: [
          ...(overlay.ticketReplies[ticket.id] ?? []),
          { from: "admin" as const, body, at },
        ],
      },
      ticketStates: { ...overlay.ticketStates, [ticket.id]: "waiting_customer" },
    });
    setReply("");
  }

  function resolve() {
    writeOverlay({
      ticketStates: { ...overlay.ticketStates, [ticket.id]: "resolved" },
    });
  }

  return (
    <section
      aria-labelledby={`ticket-${ticket.id}`}
      className="flex max-w-3xl flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2
          id={`ticket-${ticket.id}`}
          className="text-lg font-semibold text-text-primary"
        >
          {ticket.id} — {ticket.subject}
        </h2>
        <StatusLabel axis="ticket" value={state} />
      </div>
      <p className="text-sm text-text-muted">
        {[
          ticket.productSlug ? `Sản phẩm: ${ticket.productSlug}` : null,
          ticket.orderCode ? `Đơn: ${ticket.orderCode}` : null,
          ticket.licenseRef ? `Bản quyền: ${ticket.licenseRef}` : null,
        ]
          .filter(Boolean)
          .join(" · ") || "Không gắn sản phẩm/đơn cụ thể."}
      </p>

      <ol className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <li
            key={`${m.at}-${i}`}
            className="rounded-panel border border-border-subtle bg-surface-panel px-4 py-3"
          >
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text-secondary">
                {m.from === "customer" ? customerName : "Cửa hàng"}
              </span>
              {" · "}
              {formatDateTime(m.at)}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-text-primary">
              {m.body}
            </p>
          </li>
        ))}
      </ol>

      <Textarea
        label="Trả lời khách"
        rows={4}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        error={error}
        hint="Không yêu cầu khách gửi mật khẩu hoặc mã bản quyền."
      />
      <div className="flex flex-wrap gap-3">
        <Button onClick={send}>Gửi trả lời</Button>
        {state !== "resolved" ? (
          <Button variant="outline" onClick={resolve}>
            Đánh dấu đã giải quyết
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export function AdminTickets({
  tickets,
  customerName,
}: {
  tickets: Ticket[];
  customerName: string;
}) {
  const overlay = useDemoOverlay();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tickets.find((t) => t.id === selectedId) ?? null;

  const stateOf = (t: Ticket): TicketState =>
    (overlay.ticketStates[t.id] ?? t.state) as TicketState;

  const columns: Column<Ticket>[] = [
    { key: "id", header: "ID", render: (t) => t.id },
    { key: "subject", header: "Chủ đề", render: (t) => t.subject },
    { key: "customer", header: "Khách", render: () => customerName },
    {
      key: "state",
      header: "Trạng thái",
      render: (t) => <StatusLabel axis="ticket" value={stateOf(t)} />,
    },
    {
      key: "created",
      header: "Ngày",
      render: (t) => formatDate(t.createdAt),
    },
    {
      key: "action",
      header: "Thao tác",
      render: (t) => (
        <Button
          size="sm"
          variant="outline"
          aria-pressed={selectedId === t.id}
          onClick={() => setSelectedId(t.id)}
        >
          Trả lời
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={tickets}
        caption="Danh sách yêu cầu hỗ trợ"
        empty={<Empty title="Chưa có yêu cầu hỗ trợ nào." />}
      />
      {selected ? (
        <TicketThread
          key={selected.id}
          ticket={selected}
          customerName={customerName}
        />
      ) : null}
    </>
  );
}
