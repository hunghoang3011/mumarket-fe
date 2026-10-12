import { describe, expect, it } from "vitest";
import { formatVnd } from "@/shared/format/money";
import { formatDate, formatDateTime, daysUntil } from "@/shared/format/date";
import {
  DEMO_NOW,
  effectivePrice,
  offersOf,
  startingOffer,
  trialOf,
} from "@/demo/fixtures/catalog";

describe("formatVnd", () => {
  const nbsp = String.fromCharCode(0xa0);

  it("định dạng VND kiểu vi-VN (Intl dùng khoảng trắng không ngắt trước ₫)", () => {
    expect(formatVnd(123456)).toBe(`123.456${nbsp}₫`);
    expect(formatVnd(100000)).toBe(`100.000${nbsp}₫`);
    expect(formatVnd(0)).toBe(`0${nbsp}₫`);
  });
});

describe("formatDate/formatDateTime (múi giờ Asia/Ho_Chi_Minh)", () => {
  it("đổi UTC sang giờ Việt Nam", () => {
    // 07:05 UTC = 14:05 VN
    expect(formatDateTime("2026-10-14T07:05:00.000Z")).toBe("14:05, 14/10/2026");
    expect(formatDate("2026-11-20T00:00:00.000Z")).toBe("20/11/2026");
  });

  it("kèm nhãn múi giờ khi cần", () => {
    expect(formatDateTime("2026-10-14T07:05:00.000Z", true)).toBe(
      "14:05, 14/10/2026 (giờ Việt Nam)",
    );
  });
});

describe("daysUntil", () => {
  it("đếm ngày tới hạn (làm tròn xuống)", () => {
    expect(daysUntil("2026-10-15T08:00:00.000Z", DEMO_NOW)).toBe(2);
    // 13/10 07:05 → 20/11 00:00 = 37 ngày rưỡi → floor 37
    expect(daysUntil("2026-11-20T00:00:00.000Z", DEMO_NOW)).toBe(37);
    expect(daysUntil("2026-10-12T00:00:00.000Z", DEMO_NOW)).toBeLessThan(0);
  });
});

describe("catalog helpers", () => {
  it("effectivePrice áp khuyến mãi cố định và phần trăm", () => {
    const fixed = offersOf("vo-lam-mobile-1").find((o) => o.id === "of-vlm1-7d");
    expect(effectivePrice(fixed!)).toBe(100000); // 123456 - 23456
    const percent = offersOf("kiem-the-origin").find((o) => o.id === "of-kto-90d");
    expect(effectivePrice(percent!)).toBe(351000); // 390000 * 90%
  });

  it("startingOffer là gói trả phí rẻ nhất, không tính dùng thử", () => {
    const start = startingOffer("vo-lam-mien-phi");
    expect(start?.kind).toBe("7_day");
    expect(effectivePrice(start!)).toBe(49000);
  });

  it("sản phẩm không gói trả phí → startingOffer null (Chưa mở bán)", () => {
    expect(startingOffer("vo-lam-2-pc")).toBeNull();
    expect(trialOf("vo-lam-2-pc")).toBeNull();
  });

  it("offersOf sắp theo thời hạn tăng dần và loại trial", () => {
    const offers = offersOf("mu-luc-dia-vng");
    expect(offers.map((o) => o.durationDays)).toEqual([7, 30, 90]);
    expect(offers.some((o) => o.kind === "trial")).toBe(false);
  });
});
