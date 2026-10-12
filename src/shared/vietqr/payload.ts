/*
 * VietQR — payload EMVCo merchant-presented dựng từ snapshot đơn (R3).
 * Hàm thuần, test bằng vector cố định: CRC-16/CCITT-FALSE("123456789") = 0x29B1.
 */

export interface VietQrSnapshot {
  bin: string;
  accountNumber: string;
  /** Số nguyên VND */
  amount: number;
  /** Nội dung chuyển khoản = mã đơn, ví dụ GA7K3MQ */
  transferReference: string;
}

/** CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF, không đảo bit. */
export function crc16CcittFalse(input: string): number {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc;
}

/** TLV theo EMVCo: id 2 ký tự + độ dài 2 ký tự + giá trị. */
function tlv(id: string, value: string): string {
  if (value.length > 99) {
    throw new Error(`Trường VietQR ${id} dài ${value.length} vượt quá 99 ký tự`);
  }
  return id + value.length.toString().padStart(2, "0") + value;
}

/** Dựng payload đầy đủ kèm CRC. Trả về chuỗi sẵn sàng mã hóa QR. */
export function buildVietQrPayload(snapshot: VietQrSnapshot): string {
  if (!Number.isInteger(snapshot.amount) || snapshot.amount <= 0) {
    throw new Error("Số tiền VietQR phải là số nguyên dương");
  }
  const merchantAccount = tlv("00", "A000000727") + tlv(
    "01",
    tlv("00", snapshot.bin) + tlv("01", snapshot.accountNumber),
  ) + tlv("02", "QRIBFTTA");

  const body =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("38", merchantAccount) +
    tlv("53", "704") +
    tlv("54", String(snapshot.amount)) +
    tlv("58", "VN") +
    tlv("62", tlv("08", snapshot.transferReference)) +
    "6304";

  return body + crc16CcittFalse(body).toString(16).toUpperCase().padStart(4, "0");
}

/** Giải mã vòng lại một TLV một cấp; phục vụ test round-trip và kiểm tra QR. */
export function decodeTlv(payload: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;
  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const len = Number.parseInt(payload.slice(i + 2, i + 4), 10);
    out[id] = payload.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}
