/*
 * Price (DESIGN §7): số nguyên VND đã xử lý; giá gốc gạch ngang khi có
 * khuyến mãi. Cột tiền canh phải (Be Vietnam Pro không có tabular-nums).
 */
import { formatVnd } from "../format/money";

export function Price({
  amountVnd,
  originalVnd,
  size = "md",
  align = "left",
  className,
}: {
  amountVnd: number;
  originalVnd?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "right";
  className?: string;
}) {
  const sizeClass = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];
  return (
    <span
      className={`inline-flex flex-col ${align === "right" ? "items-end text-right" : "items-start"} ${className ?? ""}`}
    >
      {originalVnd != null && originalVnd > amountVnd ? (
        <span className="text-sm text-text-muted line-through">
          {formatVnd(originalVnd)}
        </span>
      ) : null}
      <span className={`font-semibold text-text-primary ${sizeClass}`}>
        {formatVnd(amountVnd)}
      </span>
    </span>
  );
}
