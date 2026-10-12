/** Định dạng tiền VND theo DESIGN §6: 123.456 ₫. Đầu vào là số nguyên VND. */
const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function formatVnd(amount: number): string {
  return vnd.format(amount);
}
