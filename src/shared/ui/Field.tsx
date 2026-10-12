"use client";

/*
 * Field / Select (DESIGN §7): label + control + hint + lỗi inline.
 * Lỗi gắn aria-describedby; không chặn dán; đúng autocomplete/inputmode.
 */
import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (id: string, describedBy: string | undefined) => ReactNode;
  htmlForId?: string;
}

function FieldShell({
  label,
  hint,
  error,
  required,
  children,
}: FieldShellProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children(id, describedBy)}
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

const CONTROL_CLASS =
  "w-full rounded-control border bg-surface-input px-3 py-2.5 text-base text-text-primary placeholder:text-text-muted min-h-11";
const CONTROL_OK = "border-border-control";
const CONTROL_ERR = "border-danger";

export function Field({
  label,
  hint,
  error,
  required,
  ...input
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          className={`${CONTROL_CLASS} ${error ? CONTROL_ERR : CONTROL_OK}`}
          {...input}
        />
      )}
    </FieldShell>
  );
}

export function Textarea({
  label,
  hint,
  error,
  required,
  ...rest
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <textarea
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          rows={rest.rows ?? 5}
          className={`${CONTROL_CLASS} ${error ? CONTROL_ERR : CONTROL_OK}`}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  children,
  ...rest
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          className={`${CONTROL_CLASS} ${error ? CONTROL_ERR : CONTROL_OK}`}
          {...rest}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
