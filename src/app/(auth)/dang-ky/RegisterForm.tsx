"use client";

/*
 * /dang-ky — form tạo tài khoản demo (DESIGN §4, §7; J1).
 * Hợp lệ → /xac-thuc?next=…&email=… (mã 6 số trên cùng tab, không mất next).
 * Lỗi inline sát field, giữ nguyên dữ liệu đã nhập.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {},
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: { password?: string; confirm?: string } = {};
    if (password.length < 8) errs.password = "Mật khẩu cần ít nhất 8 ký tự.";
    if (confirm !== password) errs.confirm = "Mật khẩu xác nhận không khớp.";
    setErrors(errs);
    if (errs.password || errs.confirm) return;
    router.push(
      `/xac-thuc?next=${encodeURIComponent(next)}&email=${encodeURIComponent(email)}`,
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field
        label="Tên hiển thị"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Mật khẩu"
        type="password"
        autoComplete="new-password"
        required
        hint="Tối thiểu 8 ký tự."
        error={errors.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Field
        label="Xác nhận mật khẩu"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirm}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Tạo tài khoản
      </Button>
    </form>
  );
}
