/*
 * /tai-khoan/ho-tro/[id] — luồng trao đổi của một yêu cầu hỗ trợ (DESIGN §5).
 * Ticket tạo trong phiên demo (T-LOCAL-…) chỉ có trong lớp phủ localStorage,
 * nên quyết định notFound nằm ở client sau khi gộp lớp phủ.
 */
import { getTicket } from "@/demo";
import { TicketThread } from "./TicketThread";

export default async function TicketThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicket(id);
  return <TicketThread id={id} fixtureTicket={ticket} />;
}
