"use client";

/*
 * /dang-nhap — form đăng nhập demo (DESIGN §4, §10; J1).
 * Demo: nhập email bất kỳ; email chứa "admin" → vai trò quản trị.
 * Đặt cookie phiên ga_demo_role rồi quay về đúng `next` (mặc định /tai-khoan).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { DEMO_ROLE_COOKIE } from "@/demo/config";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";

export function LoginForm({
  next,
  resetDone,
}: {
  next: string;
  resetDone: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const role = email.toLowerCase().includes("admin") ? "admin" : "customer";
    document.cookie = `${DEMO_ROLE_COOKIE}=${role}; path=/; max-age=31536000; samesite=lax`;
    router.push(next);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      {resetDone ? (
        <Notice tone="success">
          Đã đặt lại mật khẩu. Đăng nhập bằng mật khẩu mới.
        </Notice>
      ) : null}
      <form onSubmit={submit} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full">
          Đăng nhập
        </Button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href="/quen-mat-khau" className="content-link">
          Quên mật khẩu?
        </Link>
        <Link
          href={`/dang-ky?next=${encodeURIComponent(next)}`}
          className="content-link"
        >
          Tạo tài khoản
        </Link>
      </div>
      <Notice tone="neutral">
        Bản demo: nhập email bất kỳ để đăng nhập; email chứa &quot;admin&quot;
        vào khu quản trị.
      </Notice>
    </div>
  );
}
