/*
 * StatusLabel (DESIGN §7 + §3): mỗi trục một nhãn riêng —
 * đơn / thanh toán / bản quyền / phần mềm. Nhãn chữ + icon + token ngữ nghĩa;
 * không bao giờ phân biệt chỉ bằng màu. Dạng pill chỉ dành cho nhãn trạng thái.
 */
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  info: "bg-info-bg text-info",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-surface-raised text-neutral",
};

const DEFS = {
  order: {
    pending_payment: { label: "Chờ thanh toán", tone: "warning", icon: "clock" },
    paid: { label: "Đã thanh toán", tone: "success", icon: "check" },
    cancelled: { label: "Đã hủy", tone: "neutral", icon: "close" },
    expired: { label: "Hết hạn thanh toán", tone: "danger", icon: "clock" },
  },
  payment: {
    none: { label: "Chưa có thông báo", tone: "neutral", icon: "info" },
    reported: {
      label: "Đã ghi nhận thông báo chuyển khoản",
      tone: "info",
      icon: "info",
    },
    unresolved: { label: "Cần đối soát", tone: "warning", icon: "alert" },
    received: { label: "Đã nhận tiền", tone: "success", icon: "check" },
  },
  license: {
    unactivated: { label: "Chưa kích hoạt", tone: "info", icon: "key" },
    active: { label: "Đang hiệu lực", tone: "success", icon: "check" },
    expired: { label: "Hết hạn", tone: "danger", icon: "clock" },
    suspended: { label: "Tạm khóa", tone: "warning", icon: "ban" },
    revoked: { label: "Đã thu hồi", tone: "danger", icon: "ban" },
  },
  software: {
    operational: {
      label: "Hoạt động bình thường",
      tone: "success",
      icon: "check",
    },
    updating: {
      label: "Đang cập nhật theo bản game mới",
      tone: "info",
      icon: "refresh",
    },
    paused: { label: "Tạm ngừng hoạt động", tone: "warning", icon: "alert" },
    unreleased: { label: "Chưa phát hành", tone: "neutral", icon: "clock" },
  },
  ticket: {
    open: { label: "Mới gửi", tone: "info", icon: "mail" },
    waiting_customer: { label: "Chờ khách trả lời", tone: "warning", icon: "clock" },
    waiting_admin: { label: "Chờ cửa hàng trả lời", tone: "warning", icon: "clock" },
    resolved: { label: "Đã giải quyết", tone: "success", icon: "check" },
  },
} as const satisfies Record<
  string,
  Record<string, { label: string; tone: Tone; icon: IconName }>
>;

export type StatusAxis = keyof typeof DEFS;
export type StatusValue<A extends StatusAxis> = keyof (typeof DEFS)[A] & string;

export function StatusLabel<A extends StatusAxis>({
  axis,
  value,
  size = "sm",
}: {
  axis: A;
  value: StatusValue<A>;
  size?: "sm" | "md";
}) {
  const def = (DEFS[axis] as Record<string, { label: string; tone: Tone; icon: IconName }>)[
    value
  ];
  if (!def) return null;
  return (
    <span
      data-testid={`status-${axis}-${value}`}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${TONE_CLASS[def.tone]} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      <Icon name={def.icon} size={16} />
      {def.label}
    </span>
  );
}
