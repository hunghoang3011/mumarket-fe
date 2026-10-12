"use client";

/*
 * Form cấu hình (DESIGN §5 Quản trị · Cấu hình, J6, R7): ngân hàng nhận
 * tiền (đổi chỉ áp dụng cho đơn tạo sau khi lưu; bản thật yêu cầu xác nhận
 * 2 lớp), liên hệ, và bốn cờ chức năng — mỗi cờ kèm mô tả tác động chính
 * xác. Bản demo: lưu/bật/tắt chỉ đổi client state + thông báo.
 */
import { useState, type FormEvent } from "react";
import type { FeatureFlags, SiteSettings } from "@/demo/types";
import { Button } from "@/shared/ui/Button";
import { Field, Textarea } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";

const DEMO_SAVED = "Đã lưu (bản demo — dữ liệu trở lại mẫu khi tải lại).";

const FLAG_META: { key: keyof FeatureFlags; label: string; impact: string }[] =
  [
    {
      key: "sales",
      label: "Bán hàng",
      impact:
        "Chặn tạo đơn mua mới và đơn gia hạn mới; đơn đã tạo vẫn xử lý tiếp.",
    },
    {
      key: "trials",
      label: "Dùng thử",
      impact: "Chặn nhận dùng thử mới; không ảnh hưởng bán hàng.",
    },
    {
      key: "support_new_tickets",
      label: "Tạo yêu cầu hỗ trợ mới",
      impact: "Khách không tạo yêu cầu mới; yêu cầu cũ vẫn trả lời được.",
    },
    {
      key: "announcements_public",
      label: "Tin cập nhật công khai",
      impact: "Ẩn tin cập nhật khỏi trang công khai.",
    },
  ];

export function SettingsAdmin({
  settings,
  initialFlags,
}: {
  settings: SiteSettings;
  initialFlags: FeatureFlags;
}) {
  const [bankName, setBankName] = useState(settings.bank?.bankName ?? "");
  const [bin, setBin] = useState(settings.bank?.bin ?? "");
  const [accountNumber, setAccountNumber] = useState(
    settings.bank?.accountNumber ?? "",
  );
  const [beneficiary, setBeneficiary] = useState(
    settings.bank?.beneficiary ?? "",
  );
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [contactNote, setContactNote] = useState(settings.contactNote ?? "");
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags);
  const [savedBlock, setSavedBlock] = useState<string | null>(null);
  const [flagChanged, setFlagChanged] = useState(false);

  function save(block: string) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSavedBlock(block);
    };
  }

  function toggleFlag(key: keyof FeatureFlags) {
    setFlags((f) => ({ ...f, [key]: !f[key] }));
    setFlagChanged(true);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section aria-labelledby="ngan-hang" className="flex flex-col gap-4">
        <h2 id="ngan-hang" className="text-lg font-semibold text-text-primary">
          Ngân hàng
        </h2>
        <Notice tone="info">
          Thay đổi ngân hàng chỉ áp dụng cho đơn tạo sau khi lưu.
        </Notice>
        {savedBlock === "bank" ? (
          <Notice tone="success" role="status">
            {DEMO_SAVED}
          </Notice>
        ) : null}
        <form onSubmit={save("bank")} className="flex flex-col gap-4">
          <Field
            label="Tên ngân hàng"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Mã BIN"
              inputMode="numeric"
              value={bin}
              onChange={(e) => setBin(e.target.value)}
            />
            <Field
              label="Số tài khoản"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              hint="Trên bản thật, đổi tài khoản nhận tiền yêu cầu xác nhận lại mật khẩu và mã xác thực 2 lớp."
            />
          </div>
          <Field
            label="Chủ tài khoản"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
          <div>
            <Button type="submit">Lưu ngân hàng</Button>
          </div>
        </form>
      </section>

      <section aria-labelledby="lien-he" className="flex flex-col gap-4">
        <h2 id="lien-he" className="text-lg font-semibold text-text-primary">
          Liên hệ
        </h2>
        {savedBlock === "contact" ? (
          <Notice tone="success" role="status">
            {DEMO_SAVED}
          </Notice>
        ) : null}
        <form onSubmit={save("contact")} className="flex flex-col gap-4">
          <Field
            label="Email liên hệ"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <Textarea
            label="Ghi chú liên hệ"
            rows={3}
            value={contactNote}
            onChange={(e) => setContactNote(e.target.value)}
          />
          <div>
            <Button type="submit">Lưu liên hệ</Button>
          </div>
        </form>
      </section>

      <section aria-labelledby="co" className="flex flex-col gap-4">
        <h2 id="co" className="text-lg font-semibold text-text-primary">
          Cờ chức năng
        </h2>
        {flagChanged ? (
          <Notice tone="info" role="status">
            Đã ghi nhận thay đổi cờ (demo) — thao tác thật sẽ ghi vào nhật ký
            audit.
          </Notice>
        ) : null}
        <ul className="flex flex-col gap-3">
          {FLAG_META.map((f) => {
            const on = flags[f.key];
            return (
              <li
                key={f.key}
                className="flex flex-wrap items-center gap-3 rounded-panel border border-border-subtle px-4 py-3"
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={f.label}
                  data-testid={`module-toggle-${f.key}`}
                  onClick={() => toggleFlag(f.key)}
                  className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full border px-0.5 ${
                    on
                      ? "justify-end border-action bg-action"
                      : "justify-start border-border-control bg-surface-input"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-6 w-6 rounded-full ${
                      on ? "bg-on-action" : "bg-text-muted"
                    }`}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {f.label}{" "}
                    <span className="font-normal text-text-muted">
                      — {on ? "Đang bật" : "Đang tắt"}
                    </span>
                  </p>
                  <p className="text-sm text-text-muted">
                    Tác động khi tắt: {f.impact}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
