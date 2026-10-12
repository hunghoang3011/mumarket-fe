/*
 * Bộ icon outline duy nhất (DESIGN §6): nét 1.5px ở khung 24, cỡ 16/20/24.
 * Icon trang trí: aria-hidden. Icon-only control phải truyền aria-label qua props.
 */
import type { JSX } from "react";

export type IconName =
  | "check"
  | "alert"
  | "info"
  | "clock"
  | "copy"
  | "download"
  | "key"
  | "device"
  | "menu"
  | "close"
  | "chevron-down"
  | "arrow-right"
  | "plus"
  | "trash"
  | "edit"
  | "search"
  | "refresh"
  | "shield"
  | "ban"
  | "wallet"
  | "package"
  | "users"
  | "settings"
  | "log"
  | "book"
  | "mail";

const PATHS: Record<IconName, JSX.Element> = {
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.2v.3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 7.8v.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10.5" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  key: (
    <>
      <circle cx="8.5" cy="14.5" r="4.5" />
      <path d="m12 11 8-8" />
      <path d="m16.5 6.5 3 3" />
      <path d="m14 9 2 2" />
    </>
  ),
  device: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M9 20h6" />
      <path d="M12 16v4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  "arrow-right": (
    <>
      <path d="M4 12h15" />
      <path d="m14 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M5 7h14" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M7 7l1 13h8l1-13" />
    </>
  ),
  edit: (
    <>
      <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" />
      <path d="m12.5 7.5 4 4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 4.5v4h-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.3 3 7.4 7 8.5 4-1.1 7-4.2 7-8.5V6l-7-2.5Z" />
      <path d="m9 11.8 2.2 2.2 4-4.3" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6.2 6.2 11.6 11.6" />
    </>
  ),
  wallet: (
    <>
      <rect x="3.5" y="6" width="17" height="13" rx="1.5" />
      <path d="M3.5 9.5h17" />
      <path d="M16 14.5h2" />
    </>
  ),
  package: (
    <>
      <path d="m12 3.5 8 3.5v10l-8 3.5-8-3.5V7l8-3.5Z" />
      <path d="m4 7 8 3.5L20 7" />
      <path d="M12 10.5v10" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 19.5c.8-3.2 2.9-5 5.5-5s4.7 1.8 5.5 5" />
      <path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8" />
      <path d="M17.5 14.9c1.6.7 2.6 2.2 3 4.1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18" />
    </>
  ),
  log: (
    <>
      <path d="M6 3.5h9L19 7.5V20.5H6V3.5Z" />
      <path d="M14.5 3.5v4.5H19" />
      <path d="M9 12h6M9 15.5h6" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16.5H6.5A1.5 1.5 0 0 0 5 21V4.5Z" />
      <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
  title,
}: {
  name: IconName;
  size?: 16 | 20 | 24;
  className?: string;
  /** Khi có title, icon mang nghĩa; ngược lại aria-hidden */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
