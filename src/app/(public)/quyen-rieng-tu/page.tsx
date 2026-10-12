/*
 * /quyen-rieng-tu — Quyền riêng tư (DESIGN §4).
 * Nội dung mẫu demo từ fixtures; nội dung chính thức do chủ sở hữu cung cấp.
 */
import { LegalBody } from "../LegalBody";

export default async function PrivacyPage() {
  return <LegalBody slug="quyen-rieng-tu" fallbackTitle="Quyền riêng tư" />;
}
