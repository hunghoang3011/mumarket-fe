"use client";

/*
 * useHydrated: true sau khi client hydrate xong, false khi SSR.
 * Dùng khi quyết định render phụ thuộc dữ liệu chỉ có phía client
 * (localStorage demo overlay) mà không gây lệch hydration.
 */
import { useSyncExternalStore } from "react";

function subscribeNoop(): () => void {
  return () => {};
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
