/*
 * Tiêu đề editorial (DESIGN §6): Noto Serif Display 600, chữ hoa, vàng
 * gradient khắc khối, dưới là đường chia M2 (120px, giữa hình thoi 8px).
 * watermark: một chữ Hán thư pháp mờ phía sau — trang trí, aria-hidden,
 * CHỈ ký tự có trong subset brush-hanzi.
 */
export function EditorialTitle({
  children,
  as: Tag = "h2",
  id,
  watermark,
  className,
}: {
  children: string;
  as?: "h1" | "h2" | "h3";
  /** id để section aria-labelledby trỏ tới đúng heading này */
  id?: string;
  /** Một ký tự CJK trong subset (ví dụ "武") — mờ, aria-hidden */
  watermark?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {watermark ? (
        <span
          aria-hidden="true"
          className="brush-wm -top-10 left-0 text-[7rem] opacity-[0.07]"
        >
          {watermark}
        </span>
      ) : null}
      <Tag
        id={id}
        className="title-gold relative font-display text-2xl font-semibold uppercase tracking-[0.02em] sm:text-3xl"
      >
        {children}
      </Tag>
      <span className="divider-editorial mt-3" aria-hidden="true">
        <span />
      </span>
    </div>
  );
}
