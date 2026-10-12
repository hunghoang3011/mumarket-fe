import type { Offer, Product } from "../types";

/** Mốc "bây giờ" của dữ liệu demo — cố định để ảnh chụp/test lặp lại được. */
export const DEMO_NOW = "2026-10-13T07:05:00.000Z";

export const demoProducts: Product[] = [
  {
    slug: "vo-lam-mien-phi",
    name: "Auto Võ Lâm Miễn Phí",
    shortDescription: "Phần mềm hỗ trợ cày quái, làm nhiệm vụ cho Võ Lâm Miễn Phí.",
    softwareStatus: "operational",
    statusNote: null,
    statusUpdatedAt: "2026-10-10T02:00:00.000Z",
    softwareVersion: "3.2.1",
    supportedGameVersion: "1.9.4",
    features: [
      "Tự động đánh quái theo khu vực đã chọn",
      "Tự động nhặt vật phẩm theo bộ lọc",
      "Làm nhiệm vụ hằng ngày theo lịch trình",
      "Tùy chỉnh chu kỳ dùng kỹ năng",
    ],
    screenshots: [],
    installSteps: [
      "Tải gói cài đặt dành cho Windows từ mục Tải phần mềm.",
      "Giải nén và chạy GalaxyAuto.Setup.exe.",
      "Mở phần mềm, nhập mã bản quyền khi được hỏi.",
      "Chọn đường dẫn tới client game rồi nhấn Kích hoạt.",
    ],
    releases: [
      {
        version: "3.2.1",
        gameVersion: "1.9.4",
        releasedAt: "2026-10-08T03:00:00.000Z",
        notes: ["Theo kịp bản game 1.9.4", "Sửa lỗi nhận diện bản đồ Tương Dương"],
        downloadable: true,
      },
      {
        version: "3.2.0",
        gameVersion: "1.9.3",
        releasedAt: "2026-09-21T03:00:00.000Z",
        notes: ["Thêm bộ lọc vật phẩm theo cấp"],
        downloadable: true,
      },
      {
        version: "3.1.2",
        gameVersion: "1.9.3",
        releasedAt: "2026-09-02T03:00:00.000Z",
        notes: ["Sửa lỗi treo khi chuyển map"],
        downloadable: true,
      },
    ],
    hasDownload: true,
  },
  {
    slug: "vo-lam-mobile-1",
    name: "Auto Võ Lâm Mobile 1",
    shortDescription: "Auto dành riêng cho Võ Lâm Mobile 1 trên giả lập.",
    softwareStatus: "operational",
    statusNote: null,
    statusUpdatedAt: "2026-10-11T02:00:00.000Z",
    softwareVersion: "2.8.0",
    supportedGameVersion: "7.1.0",
    features: [
      "Tự động cày cấp trên giả lập Android",
      "Hỗ trợ nhiều cấu hình giả lập phổ biến",
      "Tự động tham gia hoạt động giờ vàng",
    ],
    screenshots: [],
    installSteps: [
      "Cài đặt giả lập Android được hỗ trợ.",
      "Tải và cài đặt phần mềm từ mục Tải phần mềm.",
      "Nhập mã bản quyền và chọn cấu hình giả lập.",
      "Nhấn Kích hoạt để bắt đầu tính hạn sử dụng.",
    ],
    releases: [
      {
        version: "2.8.0",
        gameVersion: "7.1.0",
        releasedAt: "2026-10-09T03:00:00.000Z",
        notes: ["Theo kịp bản game 7.1.0"],
        downloadable: true,
      },
      {
        version: "2.7.3",
        gameVersion: "7.0.2",
        releasedAt: "2026-09-15T03:00:00.000Z",
        notes: ["Sửa lỗi đăng nhập trên giả lập 64-bit"],
        downloadable: true,
      },
    ],
    hasDownload: true,
  },
  {
    slug: "kiem-the-origin",
    name: "Auto Kiếm Thế Origin",
    shortDescription: "Phần mềm hỗ trợ cho Kiếm Thế Origin.",
    softwareStatus: "updating",
    statusNote: "Phần mềm đang được cập nhật theo bản game mới.",
    statusUpdatedAt: "2026-10-12T09:30:00.000Z",
    softwareVersion: "1.5.2",
    supportedGameVersion: null,
    features: [
      "Tự động đánh quái và nhặt vật phẩm",
      "Tùy chỉnh linh hoạt theo phái",
    ],
    screenshots: [],
    installSteps: [
      "Tải gói cài đặt từ mục Tải phần mềm.",
      "Chạy file cài đặt và làm theo hướng dẫn.",
      "Nhập mã bản quyền để kích hoạt.",
    ],
    releases: [
      {
        version: "1.5.2",
        gameVersion: null,
        releasedAt: "2026-09-28T03:00:00.000Z",
        notes: ["Cập nhật bảo mật"],
        downloadable: false,
      },
    ],
    hasDownload: false,
  },
  {
    slug: "mu-luc-dia-vng",
    name: "Auto MU Lục Địa VNG",
    shortDescription: "Auto dành cho MU Lục Địa VNG: cày cấp, nhặt đồ, săn boss.",
    softwareStatus: "operational",
    statusNote: null,
    statusUpdatedAt: "2026-10-12T02:00:00.000Z",
    softwareVersion: "5.0.3",
    supportedGameVersion: "12.2",
    features: [
      "Tự động cày cấp theo bãi quái",
      "Tự động nhặt zen và vật phẩm theo lọc",
      "Hẹn giờ săn boss theo lịch",
      "Tự động về bãi sau khi chết",
    ],
    screenshots: [],
    installSteps: [
      "Tải gói cài đặt từ mục Tải phần mềm.",
      "Chạy GalaxyAuto.MU.exe với quyền quản trị.",
      "Nhập mã bản quyền khi được hỏi.",
      "Chọn cửa sổ game rồi nhấn Kích hoạt.",
    ],
    releases: [
      {
        version: "5.0.3",
        gameVersion: "12.2",
        releasedAt: "2026-10-11T03:00:00.000Z",
        notes: ["Theo kịp bản game 12.2", "Sửa lỗi nhận diện cửa sổ khi phóng to"],
        downloadable: true,
      },
      {
        version: "5.0.2",
        gameVersion: "12.1",
        releasedAt: "2026-09-25T03:00:00.000Z",
        notes: ["Thêm lịch săn boss tùy chỉnh"],
        downloadable: true,
      },
    ],
    hasDownload: true,
  },
  {
    slug: "vo-lam-2-pc",
    name: "Auto Võ Lâm 2.0 PC",
    shortDescription: null,
    softwareStatus: "paused",
    statusNote: "Phần mềm tạm ngừng hoạt động để cập nhật theo bản game mới.",
    statusUpdatedAt: "2026-10-06T02:00:00.000Z",
    softwareVersion: null,
    supportedGameVersion: null,
    features: [],
    screenshots: [],
    installSteps: [],
    releases: [],
    hasDownload: false,
  },
];

export const demoOffers: Offer[] = [
  // Võ Lâm Miễn Phí: dùng thử + 3 gói trả phí
  { id: "of-vlmp-trial", productSlug: "vo-lam-mien-phi", kind: "trial", durationDays: 3, deviceCap: 1, priceVnd: 0, active: true, promotion: null },
  { id: "of-vlmp-7d", productSlug: "vo-lam-mien-phi", kind: "7_day", durationDays: 7, deviceCap: 1, priceVnd: 49000, active: true, promotion: null },
  { id: "of-vlmp-30d", productSlug: "vo-lam-mien-phi", kind: "30_day", durationDays: 30, deviceCap: 2, priceVnd: 129000, active: true, promotion: null },
  { id: "of-vlmp-90d", productSlug: "vo-lam-mien-phi", kind: "90_day", durationDays: 90, deviceCap: 2, priceVnd: 329000, active: true, promotion: null },

  // Võ Lâm Mobile 1: gói 7 ngày có khuyến mãi
  { id: "of-vlm1-7d", productSlug: "vo-lam-mobile-1", kind: "7_day", durationDays: 7, deviceCap: 2, priceVnd: 123456, active: true, promotion: { kind: "fixed_vnd", value: 23456 } },
  { id: "of-vlm1-30d", productSlug: "vo-lam-mobile-1", kind: "30_day", durationDays: 30, deviceCap: 2, priceVnd: 199000, active: true, promotion: null },
  { id: "of-vlm1-90d", productSlug: "vo-lam-mobile-1", kind: "90_day", durationDays: 90, deviceCap: 3, priceVnd: 499000, active: true, promotion: null },

  // Kiếm Thế Origin: 2 gói, phần mềm đang cập nhật
  { id: "of-kto-30d", productSlug: "kiem-the-origin", kind: "30_day", durationDays: 30, deviceCap: 1, priceVnd: 150000, active: true, promotion: null },
  { id: "of-kto-90d", productSlug: "kiem-the-origin", kind: "90_day", durationDays: 90, deviceCap: 1, priceVnd: 390000, active: true, promotion: { kind: "percent_bp", value: 1000 } },

  // MU Lục Địa VNG: dùng thử + 3 gói
  { id: "of-mu-trial", productSlug: "mu-luc-dia-vng", kind: "trial", durationDays: 3, deviceCap: 1, priceVnd: 0, active: true, promotion: null },
  { id: "of-mu-7d", productSlug: "mu-luc-dia-vng", kind: "7_day", durationDays: 7, deviceCap: 1, priceVnd: 59000, active: true, promotion: null },
  { id: "of-mu-30d", productSlug: "mu-luc-dia-vng", kind: "30_day", durationDays: 30, deviceCap: 2, priceVnd: 159000, active: true, promotion: null },
  { id: "of-mu-90d", productSlug: "mu-luc-dia-vng", kind: "90_day", durationDays: 90, deviceCap: 2, priceVnd: 419000, active: true, promotion: null },
];

/** Giá sau khuyến mãi (làm tròn xuống VND nguyên). */
export function effectivePrice(offer: Offer): number {
  if (!offer.promotion) return offer.priceVnd;
  if (offer.promotion.kind === "fixed_vnd") {
    return Math.max(1, offer.priceVnd - offer.promotion.value);
  }
  return Math.max(1, Math.floor((offer.priceVnd * (10000 - offer.promotion.value)) / 10000));
}

/** Gói trả phí rẻ nhất đang mở của một sản phẩm — không tính dùng thử (D03). */
export function startingOffer(productSlug: string): Offer | null {
  const paid = demoOffers.filter(
    (o) => o.productSlug === productSlug && o.active && o.kind !== "trial",
  );
  if (paid.length === 0) return null;
  return paid.reduce((a, b) => (effectivePrice(a) <= effectivePrice(b) ? a : b));
}

export function offersOf(productSlug: string): Offer[] {
  return demoOffers
    .filter((o) => o.productSlug === productSlug && o.active && o.kind !== "trial")
    .sort((a, b) => a.durationDays - b.durationDays);
}

export function trialOf(productSlug: string): Offer | null {
  return (
    demoOffers.find(
      (o) => o.productSlug === productSlug && o.active && o.kind === "trial",
    ) ?? null
  );
}
