/*
 * Wordmark "GALAXY AUTO" (DESIGN §1): chữ serif 700 dát vàng gradient +
 * nét khắc vàng mảnh. Hai bản: đầy đủ và "GA". Không ship font riêng.
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
        <defs>
          <linearGradient id="wm-g-ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold-shine)" />
            <stop offset="0.55" stopColor="var(--action-primary)" />
            <stop offset="1" stopColor="var(--metal-edge)" />
          </linearGradient>
        </defs>
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight={700}
          fontSize="22"
          fill="url(#wm-g-ga)"
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
      <defs>
        <linearGradient id="wm-g-full" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-shine)" />
          <stop offset="0.55" stopColor="var(--action-primary)" />
          <stop offset="1" stopColor="var(--metal-edge)" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="22"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize="19"
        letterSpacing="0.04em"
        fill="url(#wm-g-full)"
      >
        GALAXY AUTO
      </text>
      <path d="M2 28h120" stroke="var(--action-primary)" strokeWidth="1" />
      <path d="M122 28h8" stroke="var(--metal-edge)" strokeWidth="1" />
    </svg>
  );
}
