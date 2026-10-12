/*
 * Tầng truy vấn dữ liệu cho toàn bộ giao diện.
 * DEMO bật → đọc fixtures trong src/demo/fixtures/. DEMO tắt → trả về
 * trạng thái trống/"chưa cấu hình" trung thực (sẵn sàng thay bằng backend).
 */
import { DEMO_ENABLED } from "./config";
import { demoProducts, demoOffers } from "./fixtures/catalog";
import { demoOrders, demoReceipts, demoBank } from "./fixtures/commerce";
import { demoLicenses, demoTrialedProductSlugs } from "./fixtures/licensing";
import {
  demoAnnouncements,
  demoAuditEvents,
  demoFaqs,
  demoFlags,
  demoGuides,
  demoLegalPages,
  demoSettings,
  demoTickets,
} from "./fixtures/content";
import type {
  Announcement,
  AuditEvent,
  BankReceipt,
  Faq,
  FeatureFlags,
  Guide,
  LegalPage,
  License,
  Offer,
  Order,
  Product,
  SiteSettings,
  Ticket,
} from "./types";

export {
  effectivePrice,
  offersOf,
  trialOf,
  startingOffer,
} from "./fixtures/catalog";
export { DEMO_NOW } from "./fixtures/catalog";

export async function getProducts(): Promise<Product[]> {
  return DEMO_ENABLED ? demoProducts : [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!DEMO_ENABLED) return null;
  return demoProducts.find((p) => p.slug === slug) ?? null;
}

export async function getAllOffers(): Promise<Offer[]> {
  if (!DEMO_ENABLED) return [];
  return demoOffers.filter((o) => o.active);
}

export async function getOrder(code: string): Promise<Order | null> {
  if (!DEMO_ENABLED) return null;
  return demoOrders.find((o) => o.code === code) ?? null;
}

export async function getOrders(): Promise<Order[]> {
  return DEMO_ENABLED ? demoOrders : [];
}

export async function getLicenses(): Promise<License[]> {
  return DEMO_ENABLED ? demoLicenses : [];
}

export async function getLicense(ref: string): Promise<License | null> {
  if (!DEMO_ENABLED) return null;
  return demoLicenses.find((l) => l.reference === ref) ?? null;
}

export async function getTrialedSlugs(): Promise<string[]> {
  return DEMO_ENABLED ? demoTrialedProductSlugs : [];
}

export async function getReceipts(): Promise<BankReceipt[]> {
  return DEMO_ENABLED ? demoReceipts : [];
}

export async function getTickets(): Promise<Ticket[]> {
  return DEMO_ENABLED ? demoTickets : [];
}

export async function getTicket(id: string): Promise<Ticket | null> {
  if (!DEMO_ENABLED) return null;
  return demoTickets.find((t) => t.id === id) ?? null;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return DEMO_ENABLED ? demoAnnouncements : [];
}

export async function getAnnouncement(
  slug: string,
): Promise<Announcement | null> {
  if (!DEMO_ENABLED) return null;
  return demoAnnouncements.find((a) => a.slug === slug) ?? null;
}

export async function getGuides(): Promise<Guide[]> {
  return DEMO_ENABLED ? demoGuides : [];
}

export async function getGuide(slug: string): Promise<Guide | null> {
  if (!DEMO_ENABLED) return null;
  return demoGuides.find((g) => g.slug === slug) ?? null;
}

export async function getFaqs(): Promise<Faq[]> {
  return DEMO_ENABLED ? demoFaqs : [];
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  if (!DEMO_ENABLED) return null;
  return demoLegalPages.find((l) => l.slug === slug) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!DEMO_ENABLED) {
    return { bank: null, contactEmail: null, contactNote: null, paymentNote: null };
  }
  return { ...demoSettings, bank: demoBank };
}

export async function getFlags(): Promise<FeatureFlags> {
  if (!DEMO_ENABLED) {
    return {
      sales: false,
      trials: false,
      support_new_tickets: false,
      announcements_public: false,
    };
  }
  return demoFlags;
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  return DEMO_ENABLED ? demoAuditEvents : [];
}
