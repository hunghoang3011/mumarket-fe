/*
 * Wordmark "GALAXY AUTO" (DESIGN §1): chữ serif 700 + một nét khắc vàng mảnh.
 * Hai bản: đầy đủ và "GA". Không ship font riêng cho logo.
 */
export function Wordmark({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark";
  className?: string;
}) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 48 48"
        className={className ?? "h-8 w-8"}
        role="img"
        aria-label="GALAXY AUTO"
      >
        <title>GALAXY AUTO</title>
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight={700}
          fontSize="22"
          fill="var(--text-primary)"
        >
          GA
        </text>
        <path d="M8 39h32" stroke="var(--action-primary)" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 220 32"
      className={className ?? "h-7 w-auto"}
      role="img"
      aria-label="GALAXY AUTO"
    >
      <title>GALAXY AUTO</title>
      <text
        x="0"
        y="22"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize="19"
        letterSpacing="0.04em"
        fill="var(--text-primary)"
      >
        GALAXY AUTO
      </text>
      <path d="M2 28h120" stroke="var(--action-primary)" strokeWidth="1" />
      <path d="M122 28h8" stroke="var(--metal-edge)" strokeWidth="1" />
    </svg>
  );
}
