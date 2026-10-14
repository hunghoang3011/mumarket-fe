/*
 * Cầu nối dữ liệu demo dùng chung với bản web (src/demo/fixtures — pure TS).
 * Một nguồn duy nhất: sửa fixture là cả hai app đổi theo.
 */
import {
  demoProducts,
  demoOffers,
  offersOf,
  trialOf,
  startingOffer,
  effectivePrice,
  DEMO_NOW,
} from "../../src/demo/fixtures/catalog";
import { demoOrders } from "../../src/demo/fixtures/commerce";
import { demoLicenses } from "../../src/demo/fixtures/licensing";
import { demoAnnouncements } from "../../src/demo/fixtures/content";
import type {
  LicenseStatus,
  SoftwareStatus,
} from "../../src/demo/types";

export {
  demoProducts,
  demoOffers,
  demoOrders,
  demoLicenses,
  demoAnnouncements,
  offersOf,
  trialOf,
  startingOffer,
  effectivePrice,
  DEMO_NOW,
};

/* Intl trên Hermes có thể thiếu locale — fallback nhóm nghìn thủ công. */
export function formatVnd(amount: number): string {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  } catch {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
  }
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    const d = new Date(iso);
    const vn = new Date(d.getTime() + 7 * 3600_000);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(vn.getUTCDate())}/${p(vn.getUTCMonth() + 1)}/${vn.getUTCFullYear()}`;
  }
}

/* Nhãn trục trạng thái — port từ DESIGN §3 / StatusLabel web. */
export const SOFTWARE_LABEL: Record<
  SoftwareStatus,
  { label: string; fg: string; bg: string }
> = {
  operational: { label: "Hoạt động bình thường", fg: "#82D5AA", bg: "#11261E" },
  updating: { label: "Đang cập nhật theo bản game mới", fg: "#92C5FF", bg: "#0E2035" },
  paused: { label: "Tạm ngừng hoạt động", fg: "#F0A35E", bg: "#2B2212" },
  unreleased: { label: "Chưa phát hành", fg: "#B8C1CF", bg: "#132238" },
};

export const LICENSE_LABEL: Record<
  LicenseStatus,
  { label: string; fg: string; bg: string }
> = {
  unactivated: { label: "Chưa kích hoạt", fg: "#92C5FF", bg: "#0E2035" },
  active: { label: "Đang hiệu lực", fg: "#82D5AA", bg: "#11261E" },
  expired: { label: "Hết hạn", fg: "#FF9A99", bg: "#30191D" },
  suspended: { label: "Tạm khóa", fg: "#F0A35E", bg: "#2B2212" },
  revoked: { label: "Đã thu hồi", fg: "#FF9A99", bg: "#30191D" },
};

/* Chữ Hán thư pháp theo game (khớp bản web) */
export const HANZI_BY_SLUG: Record<string, string> = {
  "vo-lam-mien-phi": "武",
  "vo-lam-mobile-1": "俠",
  "kiem-the-origin": "劍",
  "mu-luc-dia-vng": "魔",
  "vo-lam-2-pc": "風",
};

/* Palette artwork theo game (thay ảnh SVG của bản web trên mobile nhanh) */
export const ART_BY_SLUG: Record<string, [string, string]> = {
  "vo-lam-mien-phi": ["#123043", "#081420"],
  "vo-lam-mobile-1": ["#33221A", "#1C1220"],
  "kiem-the-origin": ["#12291D", "#08160F"],
  "mu-luc-dia-vng": ["#2B1220", "#0C0810"],
  "vo-lam-2-pc": ["#182C40", "#0A1220"],
};
