/*
 * Tiêu đề editorial (DESIGN §6): Noto Serif Display 600, chữ hoa, vàng đặc,
 * dưới là đường chia M2 (120px, giữa hình thoi 8px).
 */
export function EditorialTitle({
  children,
  as: Tag = "h2",
  id,
  className,
}: {
  children: string;
  as?: "h1" | "h2" | "h3";
  /** id để section aria-labelledby trỏ tới đúng heading này */
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Tag
        id={id}
        className="font-display text-2xl font-semibold uppercase tracking-[0.02em] text-action sm:text-3xl"
      >
        {children}
      </Tag>
      <span className="divider-editorial mt-3" aria-hidden="true">
        <span />
      </span>
    </div>
  );
}
