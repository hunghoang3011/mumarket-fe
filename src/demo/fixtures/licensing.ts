import type { License } from "../types";

/*
 * Bản quyền của khách demo (alice):
 * - hai bản quyền CÙNG Auto MU Lục Địa VNG để kiểm tra phân biệt (D09);
 * - một bản chưa kích hoạt; một bản sắp hết hạn (còn 2 ngày);
 * - một bản dùng thử; một bản bị tạm khóa (sản phẩm khác).
 */
export const demoLicenses: License[] = [
  {
    reference: "BQ-7K3M2Q",
    productSlug: "mu-luc-dia-vng",
    productName: "Auto MU Lục Địa VNG",
    status: "active",
    durationDays: 90,
    deviceCap: 2,
    devices: [
      {
        id: "dev-01",
        label: "PC-NHA-01",
        registeredAt: "2026-08-22T05:00:00.000Z",
        lastSeenAt: "2026-10-13T06:50:00.000Z",
      },
      {
        id: "dev-02",
        label: "LAPTOP-CTY",
        registeredAt: "2026-09-01T09:20:00.000Z",
        lastSeenAt: "2026-10-12T15:05:00.000Z",
      },
    ],
    activatedAt: "2026-08-22T05:00:00.000Z",
    expiresAt: "2026-11-20T00:00:00.000Z",
    isTrial: false,
    renewable: true,
    renewals: [
      { at: "2026-09-18T06:00:00.000Z", addedDays: 30, orderCode: "GA6R1PL" },
    ],
  },
  {
    reference: "BQ-9X2P4D",
    productSlug: "mu-luc-dia-vng",
    productName: "Auto MU Lục Địa VNG",
    status: "unactivated",
    durationDays: 30,
    deviceCap: 2,
    devices: [],
    activatedAt: null,
    expiresAt: null,
    isTrial: false,
    renewable: false,
    renewals: [],
  },
  {
    reference: "BQ-3N8R6T",
    productSlug: "vo-lam-mien-phi",
    productName: "Auto Võ Lâm Miễn Phí",
    status: "active",
    durationDays: 3,
    deviceCap: 1,
    devices: [
      {
        id: "dev-03",
        label: "PC-NHA-01",
        registeredAt: "2026-10-12T08:00:00.000Z",
        lastSeenAt: "2026-10-13T06:30:00.000Z",
      },
    ],
    activatedAt: "2026-10-12T08:00:00.000Z",
    expiresAt: "2026-10-15T08:00:00.000Z",
    isTrial: true,
    renewable: false,
    renewals: [],
  },
  {
    reference: "BQ-5M7W2K",
    productSlug: "vo-lam-mobile-1",
    productName: "Auto Võ Lâm Mobile 1",
    status: "suspended",
    durationDays: 30,
    deviceCap: 2,
    devices: [
      {
        id: "dev-04",
        label: "NOX-INSTANCE-3",
        registeredAt: "2026-09-20T03:00:00.000Z",
        lastSeenAt: "2026-10-08T11:00:00.000Z",
      },
    ],
    activatedAt: "2026-09-20T03:00:00.000Z",
    expiresAt: "2026-10-20T03:00:00.000Z",
    isTrial: false,
    renewable: false,
    renewals: [],
  },
];

/** Bản quyền đã dùng thử — sản phẩm không được nhận dùng thử lần nữa. */
export const demoTrialedProductSlugs: string[] = ["vo-lam-mien-phi"];
