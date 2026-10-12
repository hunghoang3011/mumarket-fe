/*
 * DTO dùng chung cho tầng dữ liệu demo. Hình dáng bám theo R11/DESIGN §3.
 * Khi nối backend thật, các hàm trong src/demo/index.ts được thay bằng
 * truy vấn thật trả về cùng kiểu — giao diện không đổi.
 */

export type SoftwareStatus =
  | "operational"
  | "updating"
  | "paused"
  | "unreleased";
export type OrderStatus = "pending_payment" | "paid" | "cancelled" | "expired";
/** Trục thanh toán: không phải trạng thái đơn */
export type PaymentAxis = "none" | "reported" | "unresolved" | "received";
export type LicenseStatus =
  | "unactivated"
  | "active"
  | "expired"
  | "suspended"
  | "revoked";
export type OfferKind = "trial" | "7_day" | "30_day" | "90_day" | "custom";
export type OrderIntent = "purchase" | "renewal";
export type DemoRole = "guest" | "customer" | "admin";

export interface Promotion {
  kind: "percent_bp" | "fixed_vnd";
  /** 1–9999 điểm cơ bản, hoặc số VND trừ thẳng */
  value: number;
}

export interface Offer {
  id: string;
  productSlug: string;
  kind: OfferKind;
  durationDays: number;
  deviceCap: number;
  /** Số nguyên VND; gói dùng thử luôn 0 và không bao giờ hiển thị như giá */
  priceVnd: number;
  active: boolean;
  promotion: Promotion | null;
}

export interface Release {
  version: string;
  gameVersion: string | null;
  releasedAt: string;
  notes: string[];
  downloadable: boolean;
}

export interface Product {
  slug: string;
  name: string;
  shortDescription: string | null;
  softwareStatus: SoftwareStatus;
  statusNote: string | null;
  statusUpdatedAt: string | null;
  softwareVersion: string | null;
  supportedGameVersion: string | null;
  features: string[];
  screenshots: string[];
  installSteps: string[];
  releases: Release[];
  hasDownload: boolean;
}

export interface BankSnapshot {
  bankName: string;
  bin: string;
  accountNumber: string;
  beneficiary: string;
}

export interface Order {
  code: string; // = nội dung chuyển khoản, ví dụ GA7K3MQ
  status: OrderStatus;
  intent: OrderIntent;
  productSlug: string;
  productName: string;
  offerLabel: string; // "30 ngày · tối đa 2 máy"
  durationDays: number;
  deviceCap: number;
  amountVnd: number;
  originalAmountVnd: number | null; // khi có khuyến mãi
  renewalTargetRef: string | null; // BQ-… khi gia hạn
  renewalEstimateExpiry: string | null;
  bank: BankSnapshot;
  createdAt: string;
  deadline: string;
  paidAt: string | null;
  licenseRef: string | null;
  hasPaymentReport: boolean;
  reportedAt: string | null;
  unresolvedReason: string | null;
  refunds: { amountVnd: number; at: string; partial: boolean }[];
}

export interface LicenseDevice {
  id: string;
  label: string;
  registeredAt: string;
  lastSeenAt: string | null;
}

export interface License {
  reference: string; // BQ-XXXXXX, không bí mật
  productSlug: string;
  productName: string;
  status: LicenseStatus;
  durationDays: number;
  deviceCap: number;
  devices: LicenseDevice[];
  activatedAt: string | null;
  expiresAt: string | null; // null khi chưa kích hoạt
  isTrial: boolean;
  renewable: boolean;
  renewals: { at: string; addedDays: number; orderCode: string }[];
}

export type ReceiptState = "unresolved" | "applied" | "returned";

export interface BankReceipt {
  id: string;
  state: ReceiptState;
  amountVnd: number;
  appliedVnd: number;
  returnedVnd: number;
  bankReference: string;
  memo: string;
  receivedAt: string;
  receivingAccount: string;
  suggestedOrderCode: string | null;
  appliedOrderCode: string | null;
  reason: string | null;
  history: { at: string; actor: string; action: string }[];
}

export type TicketState =
  | "open"
  | "waiting_customer"
  | "waiting_admin"
  | "resolved";

export interface Ticket {
  id: string;
  subject: string;
  state: TicketState;
  productSlug: string | null;
  orderCode: string | null;
  licenseRef: string | null;
  createdAt: string;
  messages: { at: string; from: "customer" | "admin"; body: string }[];
}

export interface Announcement {
  slug: string;
  title: string;
  productSlug: string | null;
  publishedAt: string;
  excerpt: string;
  body: string[];
}

export interface Guide {
  slug: string;
  title: string;
  productSlug: string | null;
  publishedAt: string;
  steps: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  body: string[];
}

export interface SiteSettings {
  bank: BankSnapshot | null;
  contactEmail: string | null;
  contactNote: string | null;
  paymentNote: string | null;
}

export interface FeatureFlags {
  sales: boolean;
  trials: boolean;
  support_new_tickets: boolean;
  announcements_public: boolean;
}

export interface DemoUser {
  email: string;
  displayName: string;
  role: DemoRole;
  emailVerified: boolean;
  reminderEnabled: boolean;
  suspended: boolean;
}

export interface AuditEvent {
  at: string;
  actor: string;
  action: string;
  target: string;
}

/** Phiên demo: đọc từ cookie, chỉ tồn tại khi DEMO bật */
export interface DemoSession {
  role: DemoRole;
  user: DemoUser | null;
}
