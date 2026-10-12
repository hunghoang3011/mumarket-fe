"use client";

/*
 * Luồng trao đổi yêu cầu hỗ trợ (DESIGN §5):
 * tin nhắn khách = panel trái; tin cửa hàng = panel viền action; chữ thuần
 * giữ xuống dòng. Trả lời ghi vào overlay.ticketReplies[id].
 * id không có trong fixture lẫn lớp phủ (ticket local T-LOCAL-…) → notFound().
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { demoNow } from "@/demo/ops";
import { useHydrated } from "@/shared/ui/useHydrated";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { Ticket } from "@/demo/types";
import { formatDateTime } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Field";
import { StatusLabel } from "@/shared/ui/StatusLabel";
import { mergeTicketsWithOverlay } from "../TicketForm";

export function TicketThread({
  id,
  fixtureTicket,
}: {
  id: string;
  fixtureTicket: Ticket | null;
}) {
  const overlay = useDemoOverlay();
  const mounted = useHydrated();
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  // Gộp fixture + lớp phủ rồi tìm đúng ticket (kể cả ticket local T-LOCAL-).
  const ticket =
    mergeTicketsWithOverlay(fixtureTicket ? [fixtureTicket] : [], overlay).find(
      (t) => t.id === id,
    ) ?? null;

  if (!ticket) {
    // Fixture không có: chờ mount để đọc lớp phủ trước khi kết luận 404.
    if (!mounted) {
      return <p className="text-sm text-text-muted">Đang tải…</p>;
    }
    notFound();
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) {
      setError("Nhập nội dung trả lời.");
      return;
    }
    writeOverlay({
      ticketReplies: {
        ...overlay.ticketReplies,
        [id]: [
          ...(overlay.ticketReplies[id] ?? []),
          { from: "customer", body: reply.trim(), at: demoNow() },
        ],
      },
    });
    setReply("");
    setError(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Đường dẫn" className="text-sm text-text-muted">
        <Link href="/tai-khoan/ho-tro" className="content-link">
          Hỗ trợ
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page" className="text-text-secondary">
          {ticket.id}
        </span>
      </nav>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-text-primary">
          {ticket.subject}
        </h1>
        <StatusLabel axis="ticket" value={ticket.state} size="md" />
      </div>

      <ul className="flex flex-col gap-3" aria-label="Trao đổi">
        {ticket.messages.map((m, i) => (
          <li
            key={`${m.at}-${i}`}
            className={`max-w-[640px] rounded-panel border px-4 py-3 ${
              m.from === "admin"
                ? "border-action bg-surface-panel"
                : "border-border-subtle bg-surface-panel"
            }`}
          >
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text-secondary">
                {m.from === "admin" ? "Cửa hàng" : "Bạn"}
              </span>{" "}
              · {formatDateTime(m.at)}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm text-text-primary">
              {m.body}
            </p>
          </li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <Textarea
          label="Trả lời"
          rows={4}
          hint="Không gửi mật khẩu hoặc mã bản quyền."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          error={error}
        />
        <div>
          <Button type="submit">Gửi trả lời</Button>
        </div>
      </form>
    </div>
  );
}
