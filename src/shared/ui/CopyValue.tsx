"use client";

/*
 * CopyValue (DESIGN §7): nhãn + giá trị đầy đủ + nút sao chép + phản hồi
 * "Đã sao chép …". Clipboard lỗi → bôi chọn thủ công; không toast giả.
 */
import { useRef, useState } from "react";
import { Button } from "./Button";

export function CopyValue({
  label,
  value,
  copyLabel,
  large = false,
}: {
  label: string;
  value: string;
  /** Nhãn trong phản hồi, ví dụ "nội dung chuyển khoản" → "Đã sao chép nội dung chuyển khoản." */
  copyLabel?: string;
  large?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
      const range = document.createRange();
      if (valueRef.current) {
        range.selectNodeContents(valueRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <span
          ref={valueRef}
          className={`font-semibold text-text-primary break-all ${
            large ? "text-xl" : "text-base"
          }`}
        >
          {value}
        </span>
        <Button variant="outline" size="sm" onClick={copy}>
          Sao chép
        </Button>
        <span aria-live="polite" className="text-sm">
          {copied ? (
            <span className="text-success">
              Đã sao chép {copyLabel ?? label.toLowerCase()}.
            </span>
          ) : null}
          {failed ? (
            <span className="text-warning">
              Không sao chép được — vui lòng bôi đen và sao chép thủ công.
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}
