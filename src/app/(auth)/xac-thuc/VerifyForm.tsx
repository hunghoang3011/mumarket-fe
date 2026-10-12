"use client";

/*
 * /xac-thuc — form nhập mã 6 số (DESIGN §4, §10; J1/D04).
 * Demo chấp nhận đúng 6 chữ số bất kỳ → cookie phiên customer → quay về next.
 * "Gửi lại mã" khoá 60 giây kèm đếm ngược bằng chữ (không countdown áp lực —
 * đây là nhịp gửi lại mã, không phải hạn mua hàng).
 */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { DEMO_ROLE_COOKIE } from "@/demo/config";
import { Button } from "@/shared/ui/Button";
import { CodeInput } from "@/shared/ui/CodeInput";
import { Notice } from "@/shared/ui/Notice";

const RESEND_SECONDS = 60;

export function VerifyForm({ next, email }: { next: string; email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!/^\d{6}$/.test(code)) {
      setError("Mã gồm 6 chữ số.");
      return;
    }
    setLoading(true);
    document.cookie = `${DEMO_ROLE_COOKIE}=customer; path=/; max-age=31536000; samesite=lax`;
    router.push(next);
    router.refresh();
  };

  const resend = () => {
    setResent(true);
    setResendIn(RESEND_SECONDS);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">
        Nhập mã 6 số vừa gửi tới {email}.
      </p>
      {resent ? <Notice tone="info">Đã gửi lại mã.</Notice> : null}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <CodeInput
          label="Mã xác thực"
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(null);
          }}
          error={error ?? undefined}
        />
        <Button type="submit" loading={loading} className="w-full">
          Xác nhận
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-text-muted">Không nhận được?</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={resendIn > 0}
          onClick={resend}
        >
          {resendIn > 0 ? `Gửi lại sau ${resendIn} giây` : "Gửi lại mã"}
        </Button>
      </div>
    </div>
  );
}
