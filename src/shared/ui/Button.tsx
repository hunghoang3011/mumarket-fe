/*
 * Button / LinkButton (DESIGN §7).
 * - primary: vật liệu M2 kim loại, tối thiểu 44×44.
 * - outline / ghost / danger theo bảng vật liệu.
 * - loading giữ nguyên nhãn và kích thước, chống submit trùng.
 * - Thao tác dùng <button>, điều hướng dùng <Link>.
 */
import Link from "next/link";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-metal",
  outline:
    "border border-action text-link hover:bg-[rgb(212_168_67/0.12)] rounded-control",
  ghost:
    "text-link underline underline-offset-2 hover:text-action rounded-detail",
  danger:
    "bg-danger-bg text-danger border border-danger rounded-control hover:bg-[rgb(255_154_153/0.12)]",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: "min-h-11 min-w-11 px-4 py-2 text-base",
  sm: "min-h-8 px-3 py-1 text-sm",
};

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  return [
    "inline-flex items-center justify-center gap-2 font-medium select-none",
    "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text disabled:border-border-subtle disabled:shadow-none",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    extra ?? "",
  ].join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", loading = false, children, disabled, className, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={classes(variant, size, className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <span
            aria-hidden
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:hidden"
          />
        ) : null}
        <span className="inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}
