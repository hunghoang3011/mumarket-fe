"use client";

/*
 * CodeInput (DESIGN §7): một ô duy nhất, inputmode numeric,
 * autocomplete one-time-code, dán cả mã 6 số được.
 */
import { useId } from "react";

export function CodeInput({
  label,
  value,
  onChange,
  error,
  hint,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        aria-invalid={error ? true : undefined}
        className={`w-40 rounded-control border bg-surface-input px-3 py-2.5 text-center text-2xl font-semibold tracking-[0.35em] text-text-primary min-h-11 ${
          error ? "border-danger" : "border-border-control"
        }`}
      />
      {hint && !error ? (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
