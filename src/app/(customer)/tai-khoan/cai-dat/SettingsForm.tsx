"use client";

/*
 * Form cài đặt tài khoản (DESIGN §5) — bản demo:
 * - Tên hiển thị: lưu giả, chỉ hiện Notice xác nhận (không đổi phiên demo).
 * - Đổi mật khẩu: kiểm tra khớp phía client, thông báo thành công giả.
 * - Email nhắc sắp hết hạn: ghi thật vào overlay.reminderEnabled.
 */
import { useState } from "react";
import { useDemoOverlay, writeOverlay } from "@/demo/store";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";

export function SettingsForm({
  displayName,
  reminderEnabled,
}: {
  displayName: string;
  reminderEnabled: boolean;
}) {
  const overlay = useDemoOverlay();

  const [name, setName] = useState(displayName);
  const [nameSaved, setNameSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwErrors, setPwErrors] = useState<{
    current?: string;
    next?: string;
    confirm?: string;
  }>({});
  const [pwSaved, setPwSaved] = useState(false);

  const reminderOn = overlay.reminderEnabled ?? reminderEnabled;

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaved(true);
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { current?: string; next?: string; confirm?: string } = {};
    if (!currentPw) next.current = "Nhập mật khẩu hiện tại.";
    if (!newPw) next.next = "Nhập mật khẩu mới.";
    if (newPw && confirmPw !== newPw)
      next.confirm = "Mật khẩu xác nhận không khớp.";
    setPwErrors(next);
    if (next.current || next.next || next.confirm) return;
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tên hiển thị */}
      <section
        aria-label="Tên hiển thị"
        className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Tên hiển thị
        </h2>
        {nameSaved ? (
          <Notice tone="success">Đã lưu tên hiển thị.</Notice>
        ) : null}
        <form onSubmit={submitName} className="flex flex-col gap-4">
          <Field
            label="Tên hiển thị"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameSaved(false);
            }}
          />
          <div>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </section>

      {/* Đổi mật khẩu */}
      <section
        aria-label="Đổi mật khẩu"
        className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Đổi mật khẩu
        </h2>
        {pwSaved ? (
          <Notice tone="success">
            Đã đổi mật khẩu (bản demo — mật khẩu thật không thay đổi).
          </Notice>
        ) : null}
        <form onSubmit={submitPassword} className="flex flex-col gap-4">
          <Field
            label="Mật khẩu hiện tại"
            type="password"
            autoComplete="current-password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            error={pwErrors.current}
          />
          <Field
            label="Mật khẩu mới"
            type="password"
            autoComplete="new-password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            error={pwErrors.next}
          />
          <Field
            label="Xác nhận mật khẩu mới"
            type="password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            error={pwErrors.confirm}
          />
          <div>
            <Button type="submit">Đổi mật khẩu</Button>
          </div>
        </form>
      </section>

      {/* Email */}
      <section
        aria-label="Thông báo email"
        className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-panel px-4 py-4"
      >
        <h2 className="text-base font-semibold text-text-primary">Email</h2>
        <label className="flex items-center gap-3 text-sm text-text-primary">
          <input
            type="checkbox"
            className="h-5 w-5 shrink-0 accent-action"
            checked={reminderOn}
            onChange={(e) => writeOverlay({ reminderEnabled: e.target.checked })}
          />
          Email nhắc sắp hết hạn
        </label>
        <p className="text-sm text-text-muted">
          Email giao dịch (đơn hàng, bản quyền) luôn được gửi.
        </p>
      </section>
    </div>
  );
}
