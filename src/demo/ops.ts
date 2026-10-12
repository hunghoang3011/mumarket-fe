/*
 * Nghiệp vụ demo phía client: sinh mã đơn theo đúng bảng chữ R3
 * (GA + 5 ký tự, không 0/O/1/I/L), tổng hợp bản quyền từ đơn đã duyệt.
 * Backend thật làm việc này trong transaction — đây chỉ là giả lập demo.
 */
import { DEMO_NOW } from "./fixtures/catalog";
import type { License, Order } from "./types";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function newOrderCode(existing: string[]): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = "GA";
    for (let i = 0; i < 5; i++) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    if (!existing.includes(code)) return code;
  }
  return `GA${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

export function newLicenseRef(existing: string[]): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    let ref = "BQ-";
    for (let i = 0; i < 6; i++) {
      ref += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    if (!existing.includes(ref)) return ref;
  }
  return `BQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Bản quyền mới ở trạng thái Chưa kích hoạt — hạn chưa chạy (J4). */
export function licenseFromOrder(order: Order, ref: string): License {
  return {
    reference: ref,
    productSlug: order.productSlug,
    productName: order.productName,
    status: "unactivated",
    durationDays: order.durationDays,
    deviceCap: order.deviceCap,
    devices: [],
    activatedAt: null,
    expiresAt: null,
    isTrial: order.amountVnd === 0,
    renewable: false,
    renewals: [],
  };
}

/** Thời điểm hiện tại của demo — dùng mốc cố định để màn hình lặp lại được. */
export function demoNow(): string {
  return DEMO_NOW;
}
