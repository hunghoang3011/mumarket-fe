"use client";

/*
 * Drawer (DESIGN §7): menu trên < 1200px. Escape đóng và trả focus,
 * khóa cuộn nền khi mở.
 */
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-overlay bg-[rgb(8_11_18/0.72)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto rounded-l-overlay border-l border-border-subtle bg-surface-raised p-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control text-text-secondary hover:text-text-primary"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
