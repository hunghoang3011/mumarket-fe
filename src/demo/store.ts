"use client";

/*
 * Lớp phủ thao tác demo trên localStorage: ghi nhận các hành động giả lập
 * (báo chuyển khoản, hủy đơn, duyệt đơn, đổi tên máy…) để bản demo "sống"
 * mà không cần backend. Xóa hoàn toàn bằng nút "Đặt lại dữ liệu demo".
 */
import { useSyncExternalStore } from "react";
import { DEMO_STORAGE_KEY } from "./config";
import type { License, Order } from "./types";

export interface DemoOverlay {
  /** Đơn đã báo chuyển khoản: mã đơn → thời điểm báo */
  reported: Record<string, string>;
  /** Đơn khách tự hủy */
  cancelled: string[];
  /** Đơn admin đã xác nhận tiền: mã đơn → kết quả */
  paid: Record<string, { paidAt: string; licenseRef: string }>;
  /** Đơn tạo trong phiên demo (từ /thanh-toan) */
  createdOrders: Order[];
  /** Bản quyền cấp trong phiên demo (duyệt đơn, dùng thử, cấp thủ công) */
  grantedLicenses: License[];
  /** Nhận dùng thử trong phiên demo: slug sản phẩm */
  trialClaimed: string[];
  /** Khoản tiền đã áp dụng vào đơn: id khoản → mã đơn */
  receiptsApplied: Record<string, string>;
  /** Khoản tiền đã hoàn trả thêm: id khoản → tổng VND đã hoàn trong phiên */
  receiptsReturned: Record<string, number>;
  /** Máy đã gỡ (id máy) và tên máy đã sửa */
  devicesRemoved: string[];
  deviceLabels: Record<string, string>;
  /** Cho phép xem mã bản quyền tới thời điểm nào (cửa sổ 10 phút) */
  revealUntil: Record<string, string>;
  /** Tin nhắn thêm vào yêu cầu hỗ trợ */
  ticketReplies: Record<
    string,
    { from: "customer" | "admin"; body: string; at: string }[]
  >;
  ticketStates: Record<string, string>;
  /** Bật/tắt email nhắc hết hạn; null = theo fixture */
  reminderEnabled: boolean | null;
}

const EMPTY: DemoOverlay = {
  reported: {},
  cancelled: [],
  paid: {},
  createdOrders: [],
  grantedLicenses: [],
  trialClaimed: [],
  receiptsApplied: {},
  receiptsReturned: {},
  devicesRemoved: [],
  deviceLabels: {},
  revealUntil: {},
  ticketReplies: {},
  ticketStates: {},
  reminderEnabled: null,
};

let cache: DemoOverlay = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): DemoOverlay {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  if (!raw) {
    cache = EMPTY;
    return cache;
  }
  try {
    cache = { ...EMPTY, ...(JSON.parse(raw) as Partial<DemoOverlay>) };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function writeOverlay(patch: Partial<DemoOverlay>): void {
  const next = { ...read(), ...patch };
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  cacheRaw = null;
  listeners.forEach((l) => l());
}

export function resetOverlay(): void {
  window.localStorage.removeItem(DEMO_STORAGE_KEY);
  cacheRaw = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === DEMO_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Hook đọc lớp phủ demo; re-render khi overlay đổi. */
export function useDemoOverlay(): DemoOverlay {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
