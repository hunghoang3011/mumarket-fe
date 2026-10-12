import { describe, expect, it } from "vitest";
import {
  buildVietQrPayload,
  crc16CcittFalse,
  decodeTlv,
} from "@/shared/vietqr/payload";
import { demoBank, demoOrders } from "@/demo/fixtures/commerce";

describe("crc16CcittFalse", () => {
  it("khớp vector chuẩn: CRC của '123456789' = 0x29B1", () => {
    expect(crc16CcittFalse("123456789")).toBe(0x29b1);
  });

  it("chuỗi rỗng giữ init 0xFFFF", () => {
    expect(crc16CcittFalse("")).toBe(0xffff);
  });
});

describe("buildVietQrPayload", () => {
  const snapshot = {
    bin: demoBank.bin,
    accountNumber: demoBank.accountNumber,
    amount: 100000,
    transferReference: "GA7K3MQ",
  };

  it("payload chứa đúng các trường snapshot", () => {
    const payload = buildVietQrPayload(snapshot);
    const top = decodeTlv(payload.slice(0, -8)); // bỏ 6304XXXX
    expect(top["00"]).toBe("01");
    expect(top["01"]).toBe("12");
    expect(top["53"]).toBe("704");
    expect(top["54"]).toBe("100000");
    expect(top["58"]).toBe("VN");

    const merchant = decodeTlv(top["38"]!);
    expect(merchant["00"]).toBe("A000000727");
    expect(merchant["02"]).toBe("QRIBFTTA");
    const acquirer = decodeTlv(merchant["01"]!);
    expect(acquirer["00"]).toBe("970436");
    expect(acquirer["01"]).toBe("0123456789");

    const additional = decodeTlv(top["62"]!);
    expect(additional["08"]).toBe("GA7K3MQ");
  });

  it("CRC cuối payload khớp tính toán lại (round-trip)", () => {
    const payload = buildVietQrPayload(snapshot);
    const body = payload.slice(0, -4);
    const crc = payload.slice(-4);
    expect(body.endsWith("6304")).toBe(true);
    expect(crc).toBe(
      crc16CcittFalse(body).toString(16).toUpperCase().padStart(4, "0"),
    );
  });

  it("từ chối số tiền không phải số nguyên dương", () => {
    expect(() => buildVietQrPayload({ ...snapshot, amount: 0 })).toThrow();
    expect(() => buildVietQrPayload({ ...snapshot, amount: -5 })).toThrow();
    expect(() => buildVietQrPayload({ ...snapshot, amount: 100.5 })).toThrow();
  });

  it("payload của đơn fixture GA7K3MQ khớp đúng snapshot đơn", () => {
    const order = demoOrders.find((o) => o.code === "GA7K3MQ");
    expect(order).toBeDefined();
    const payload = buildVietQrPayload({
      bin: order!.bank.bin,
      accountNumber: order!.bank.accountNumber,
      amount: order!.amountVnd,
      transferReference: order!.code,
    });
    const top = decodeTlv(payload.slice(0, -8));
    expect(top["54"]).toBe(String(order!.amountVnd));
    expect(decodeTlv(top["62"]!)["08"]).toBe(order!.code);
  });
});
