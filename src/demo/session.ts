import { cookies } from "next/headers";
import { DEMO_ENABLED, DEMO_ROLE_COOKIE } from "./config";
import { demoUsers } from "./fixtures/content";
import type { DemoRole, DemoSession } from "./types";

/**
 * Phiên demo đọc từ cookie (server-side). Khi DEMO tắt luôn là khách —
 * các trang yêu cầu đăng nhập sẽ hiển thị trạng thái chưa đăng nhập.
 */
export async function getDemoSession(): Promise<DemoSession> {
  if (!DEMO_ENABLED) return { role: "guest", user: null };
  const store = await cookies();
  const raw = store.get(DEMO_ROLE_COOKIE)?.value;
  const role: DemoRole =
    raw === "customer" || raw === "admin" ? raw : "guest";
  return { role, user: role === "guest" ? null : demoUsers[role] };
}
