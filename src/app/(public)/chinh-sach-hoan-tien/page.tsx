/*
 * /chinh-sach-hoan-tien — Chính sách hoàn tiền (DESIGN §4).
 * Nội dung mẫu demo từ fixtures; nội dung chính thức do chủ sở hữu cung cấp.
 */
import { LegalBody } from "../LegalBody";

export default async function RefundPolicyPage() {
  return (
    <LegalBody
      slug="chinh-sach-hoan-tien"
      fallbackTitle="Chính sách hoàn tiền"
    />
  );
}
