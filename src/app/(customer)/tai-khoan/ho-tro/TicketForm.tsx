"use client";

/*
 * Form gửi yêu cầu hỗ trợ + danh sách yêu cầu (DESIGN §5, J6).
 *
 * Ticket tạo trong phiên demo không có bảng riêng trong lớp phủ — tái dùng
 * hai trường sẵn có (ghi chú quy ước, cả trang chi tiết đọc cùng cách):
 * - id ticket mới: "T-LOCAL-<timestamp>"
 * - overlay.ticketReplies[id]  = mảng tin nhắn (tin đầu là nội dung gửi)
 * - overlay.ticketStates[id]   = CHỦ ĐỀ của ticket local (với id fixture,
 *   ticketStates[id] là trạng thái ghi đè — phân biệt bằng tiền tố T-LOCAL-)
 * Ticket local luôn hiển thị trạng thái "Mới gửi".
 */
import Link from "next/link";
import { useState } from "react";
import { demoNow } from "@/demo/ops";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import type { DemoOverlay } from "@/demo/store";
import type { Ticket, TicketState } from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { Field, Textarea } from "@/shared/ui/Field";
import { Empty, Notice } from "@/shared/ui/Notice";
import { StatusLabel } from "@/shared/ui/StatusLabel";

const TICKET_STATES: Record<TicketState, true> = {
  open: true,
  waiting_customer: true,
  waiting_admin: true,
  resolved: true,
};

const LOCAL_PREFIX = "T-LOCAL-";

export interface TicketContext {
  orderCode: string | null;
  productSlug: string | null;
  licenseRef: string | null;
}

/** Gộp ticket fixture với lớp phủ (ghi đè trạng thái, thêm tin nhắn, ticket local). */
export function mergeTicketsWithOverlay(
  base: Ticket[],
  overlay: DemoOverlay,
): Ticket[] {
  const fixture = base.map((t) => {
    const override = overlay.ticketStates[t.id];
    return {
      ...t,
      state: override != null && override in TICKET_STATES
        ? (override as TicketState)
        : t.state,
      messages: [...t.messages, ...(overlay.ticketReplies[t.id] ?? [])],
    };
  });
  const local: Ticket[] = Object.keys(overlay.ticketReplies)
    .filter((id) => id.startsWith(LOCAL_PREFIX))
    .map((id) => ({
      id,
      subject: overlay.ticketStates[id] ?? "Yêu cầu hỗ trợ",
      state: "open",
      productSlug: null,
      orderCode: null,
      licenseRef: null,
      createdAt: overlay.ticketReplies[id][0]?.at ?? demoNow(),
      messages: overlay.ticketReplies[id],
    }));
  return [...fixture, ...local].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  const overlay = useDemoOverlay();
  const all = mergeTicketsWithOverlay(tickets, overlay);

  if (all.length === 0) {
    return <Empty title="Bạn chưa có yêu cầu hỗ trợ nào." />;
  }
  return (
    <ul className="flex flex-col gap-2">
      {all.map((t) => (
        <li
          key={t.id}
          className="flex flex-col gap-2 rounded-panel border border-border-subtle bg-surface-panel px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
        >
          <Link
            href={`/tai-khoan/ho-tro/${t.id}`}
            className="content-link min-w-0 flex-1 font-medium"
          >
            {t.subject}
          </Link>
          <span className="flex items-center gap-3 text-sm text-text-muted">
            <StatusLabel axis="ticket" value={t.state} />
            {formatDate(t.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TicketForm({ context }: { context: TicketContext }) {
  const overlay = useDemoOverlay();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [sentId, setSentId] = useState<string | null>(null);

  const chips: string[] = [
    context.orderCode ? `đơn ${context.orderCode}` : "",
    context.productSlug ? `game ${context.productSlug}` : "",
    context.licenseRef ? `bản quyền ${context.licenseRef}` : "",
  ].filter((c) => c.length > 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { subject?: string; body?: string } = {};
    if (!subject.trim()) next.subject = "Nhập chủ đề.";
    if (!body.trim()) next.body = "Nhập nội dung.";
    setErrors(next);
    if (next.subject || next.body) return;

    const id = `${LOCAL_PREFIX}${Date.now()}`;
    writeOverlay({
      ticketReplies: {
        ...overlay.ticketReplies,
        [id]: [{ from: "customer", body: body.trim(), at: demoNow() }],
      },
      ticketStates: { ...overlay.ticketStates, [id]: subject.trim() },
    });
    setSubject("");
    setBody("");
    setSentId(id);
  };

  return (
    <div className="flex flex-col gap-3">
      {sentId ? (
        <Notice tone="success" title="Đã gửi yêu cầu hỗ trợ">
          Cửa hàng sẽ trả lời trong mục Hỗ trợ.{" "}
          <Link href={`/tai-khoan/ho-tro/${sentId}`} className="content-link">
            Mở yêu cầu vừa gửi
          </Link>
        </Notice>
      ) : null}
      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full bg-surface-raised px-2.5 py-0.5 text-xs font-medium text-neutral"
              >
                Kèm theo: {chip}
              </span>
            ))}
          </div>
        ) : null}
        <Field
          label="Chủ đề"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          error={errors.subject}
        />
        <Textarea
          label="Nội dung"
          required
          rows={5}
          hint="Mô tả vấn đề; ghi mã đơn hoặc mã tham chiếu liên quan nếu có."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={errors.body}
        />
        <div>
          <Button type="submit">Gửi yêu cầu hỗ trợ</Button>
        </div>
      </form>
    </div>
  );
}
