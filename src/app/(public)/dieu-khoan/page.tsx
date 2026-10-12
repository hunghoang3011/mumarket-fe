/*
 * /dieu-khoan — Điều khoản sử dụng (DESIGN §4).
 * Nội dung mẫu demo từ fixtures; nội dung chính thức do chủ sở hữu cung cấp.
 */
import { LegalBody } from "../LegalBody";

export default async function TermsPage() {
  return <LegalBody slug="dieu-khoan" fallbackTitle="Điều khoản sử dụng" />;
}
