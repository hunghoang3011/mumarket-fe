/*
 * Empty / Notice (DESIGN §7, §9): tiêu đề ngắn, giải thích, hành động.
 * Lỗi tiền/quyền là thông báo inline bền — không chỉ toast.
 */
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

const TONE = {
  info: { cls: "bg-info-bg text-info border-info", icon: "info" },
  success: { cls: "bg-success-bg text-success border-success", icon: "check" },
  warning: { cls: "bg-warning-bg text-warning border-warning", icon: "alert" },
  danger: { cls: "bg-danger-bg text-danger border-danger", icon: "alert" },
  neutral: { cls: "bg-surface-panel text-neutral border-border-subtle", icon: "info" },
} as const satisfies Record<string, { cls: string; icon: IconName }>;

export function Notice({
  tone = "info",
  title,
  children,
  role,
}: {
  tone?: keyof typeof TONE;
  title?: string;
  children: ReactNode;
  role?: "alert" | "status";
}) {
  const t = TONE[tone];
  return (
    <div
      role={role ?? (tone === "danger" ? "alert" : undefined)}
      className={`flex gap-3 rounded-panel border px-4 py-3 ${t.cls}`}
    >
      <span className="mt-0.5 shrink-0">
        <Icon name={t.icon} size={20} />
      </span>
      <div className="text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}

export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-panel border border-border-subtle bg-surface-panel px-6 py-8">
      <p className="text-base font-semibold text-text-primary">{title}</p>
      {children ? <div className="text-sm text-text-secondary">{children}</div> : null}
      {action}
    </div>
  );
}
