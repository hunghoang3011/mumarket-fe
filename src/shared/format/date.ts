/** Định dạng thời gian múi giờ Asia/Ho_Chi_Minh (DESIGN §6): "14:05, 14/10/2026". */

const dateFmt = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDate(iso: string | Date): string {
  return dateFmt.format(typeof iso === "string" ? new Date(iso) : iso);
}

export function formatTime(iso: string | Date): string {
  return timeFmt.format(typeof iso === "string" ? new Date(iso) : iso);
}

/** "14:05, 14/10/2026 (giờ Việt Nam)" khi cần ghi rõ múi giờ */
export function formatDateTime(iso: string | Date, withZone = false): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const base = `${formatTime(d)}, ${formatDate(d)}`;
  return withZone ? `${base} (giờ Việt Nam)` : base;
}

/** Số ngày còn lại (làm tròn xuống) từ now tới hạn; âm nếu đã quá hạn. */
export function daysUntil(expiryIso: string, nowIso: string): number {
  return Math.floor(
    (new Date(expiryIso).getTime() - new Date(nowIso).getTime()) / 86_400_000,
  );
}
