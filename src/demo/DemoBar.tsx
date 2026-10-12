"use client";

/*
 * Thanh công cụ demo — chỉ hiển thị khi DEMO bật (src/demo/config.ts).
 * Đổi nhân cách (khách / khách hàng / quản trị) qua cookie, đặt lại lớp
 * phủ thao tác demo trong localStorage.
 */
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { DEMO_ENABLED, DEMO_ROLE_COOKIE } from "./config";
import { resetOverlay } from "./store";
import type { DemoRole } from "./types";

const ROLES: { value: DemoRole; label: string }[] = [
  { value: "guest", label: "Khách" },
  { value: "customer", label: "Khách hàng" },
  { value: "admin", label: "Quản trị" },
];

function currentRole(): DemoRole {
  const match = document.cookie.match(new RegExp(`(?:^|; )${DEMO_ROLE_COOKIE}=([^;]*)`));
  const v = match?.[1];
  return v === "customer" || v === "admin" ? v : "guest";
}

const roleListeners = new Set<() => void>();

/** Ghi cookie vai trò (ngoài component để tuân quy tắc immutability). */
function writeRoleCookie(r: DemoRole): void {
  document.cookie = `${DEMO_ROLE_COOKIE}=${r}; path=/; max-age=31536000; samesite=lax`;
  roleListeners.forEach((l) => l());
}

/** Vai trò demo từ cookie; server snapshot luôn 'guest' → không lệch hydration. */
function useDemoRole(): DemoRole {
  return useSyncExternalStore(
    (listener) => {
      roleListeners.add(listener);
      return () => roleListeners.delete(listener);
    },
    () => currentRole(),
    () => "guest" as DemoRole,
  );
}

export function DemoBar() {
  const router = useRouter();
  const actual = useDemoRole();
  const [open, setOpen] = useState(false);

  if (!DEMO_ENABLED) return null;

  const pick = (r: DemoRole) => {
    writeRoleCookie(r);
    router.refresh();
  };

  return (
    <div className="fixed bottom-3 right-3 z-toast">
      {open ? (
        <div className="w-64 rounded-panel border border-action bg-surface-raised p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wide text-action">
              CHẾ ĐỘ DEMO
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-detail px-2 py-1 text-xs text-text-muted hover:text-text-primary"
            >
              Thu gọn
            </button>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Dữ liệu giả lập phục vụ trình diễn giao diện — không phải dữ liệu thật.
          </p>
          <div className="mt-2 flex flex-col gap-1" role="group" aria-label="Nhân cách demo">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => pick(r.value)}
                aria-pressed={actual === r.value}
                className={`min-h-11 rounded-control border px-3 text-left text-sm ${
                  actual === r.value
                    ? "border-action bg-[rgb(212_168_67/0.12)] text-link"
                    : "border-border-subtle text-text-secondary hover:text-text-primary"
                }`}
              >
                {r.label}
                {r.value === "admin" ? " (khu quản trị)" : r.value === "customer" ? " (đã đăng nhập)" : " (chưa đăng nhập)"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              resetOverlay();
              router.refresh();
            }}
            className="mt-2 min-h-11 w-full rounded-control border border-border-subtle px-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Đặt lại dữ liệu demo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-11 rounded-full border border-action bg-surface-raised px-4 text-xs font-bold tracking-wide text-action shadow-xl"
        >
          DEMO · {ROLES.find((r) => r.value === actual)?.label}
        </button>
      )}
    </div>
  );
}
