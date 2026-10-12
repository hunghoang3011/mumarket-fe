"use client";

/*
 * /quen-mat-khau — đặt lại mật khẩu 3 bước cùng trang (DESIGN §4, §10).
 * Thông báo gửi mã không tiết lộ email có tồn tại hay không.
 * Demo: mã là 6 chữ số bất kỳ; hoàn tất → /dang-nhap?da-dat-lai=1.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { CodeInput } from "@/shared/ui/CodeInput";
import { Field } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";

type Step = "email" | "code" | "password";

export function ResetForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const sendCode = (e: FormEvent) => {
    e.preventDefault();
    setStep("code");
  };

  const checkCode = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Mã gồm 6 chữ số.");
      return;
    }
    setStep("password");
  };

  const reset = (e: FormEvent) => {
    e.preventDefault();
    const errs: { password?: string; confirm?: string } = {};
    if (password.length < 8) errs.password = "Mật khẩu cần ít nhất 8 ký tự.";
    if (confirm !== password) errs.confirm = "Mật khẩu xác nhận không khớp.";
    setErrors(errs);
    if (errs.password || errs.confirm) return;
    setLoading(true);
    router.push("/dang-nhap?da-dat-lai=1");
  };

  return (
    <div className="flex flex-col gap-4">
      {step !== "email" ? (
        <Notice tone="info">
          Nếu email tồn tại trong hệ thống, mã đặt lại đã được gửi.
        </Notice>
      ) : null}

      {step === "email" ? (
        <form onSubmit={sendCode} className="flex flex-col gap-4">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Gửi mã đặt lại
          </Button>
        </form>
      ) : null}

      {step === "code" ? (
        <form onSubmit={checkCode} className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Nhập mã 6 số vừa gửi tới {email}.
          </p>
          <CodeInput
            label="Mã đặt lại"
            value={code}
            onChange={(v) => {
              setCode(v);
              setCodeError(null);
            }}
            error={codeError ?? undefined}
          />
          <Button type="submit" className="w-full">
            Xác nhận mã
          </Button>
        </form>
      ) : null}

      {step === "password" ? (
        <form onSubmit={reset} className="flex flex-col gap-4">
          <Field
            label="Mật khẩu mới"
            type="password"
            autoComplete="new-password"
            required
            hint="Tối thiểu 8 ký tự."
            error={errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field
            label="Xác nhận mật khẩu mới"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirm}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full">
            Đặt lại mật khẩu
          </Button>
        </form>
      ) : null}

      <p className="text-sm">
        <Link href="/dang-nhap" className="content-link">
          Về trang đăng nhập
        </Link>
      </p>
    </div>
  );
}
