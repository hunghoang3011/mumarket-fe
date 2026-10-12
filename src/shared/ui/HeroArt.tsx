/*
 * Hero M1 — cảnh Golden Immortal Galaxy tự dựng: tiền/trung/hậu cảnh,
 * cung điện tiên lơ lửng + chiến binh, thiên hà xanh đen, một điểm sáng
 * chính dẫn về khu chữ (bên trái). Không phải artwork có quyền; không
 * tuyên bố khớp bất kỳ ảnh tham chiếu nào (DESIGN §0, §15).
 */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060a14" />
          <stop offset="0.55" stopColor="#0b1426" />
          <stop offset="1" stopColor="#122238" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="0.34" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#e6c064" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e6c064" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5ebd6" stopOpacity="0.10" />
          <stop offset="1" stopColor="#f5ebd6" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="640" fill="url(#hero-sky)" />

      {/* Thiên hà */}
      <g fill="#f5ebd6">
        {[
          [80, 60, 1.6], [150, 130, 1], [220, 40, 1.3], [310, 90, 1],
          [420, 50, 1.8], [520, 120, 1], [640, 60, 1.4], [760, 100, 1],
          [880, 50, 1.6], [990, 110, 1.2], [1080, 60, 1.5], [1140, 150, 1],
          [60, 210, 1.1], [180, 250, 1], [700, 200, 1.2], [940, 210, 1],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={0.55} />
        ))}
      </g>
      <path
        d="M-40 200 Q 300 60 640 140 T 1240 90"
        stroke="#92c5ff"
        strokeWidth="42"
        strokeLinecap="round"
        fill="none"
        opacity="0.06"
      />

      {/* Điểm sáng chính duy nhất (M4) */}
      <rect width="1200" height="640" fill="url(#hero-glow)" />
      <circle cx="408" cy="268" r="54" fill="#e6c064" opacity="0.9" />
      <circle cx="408" cy="268" r="76" fill="none" stroke="#e6c064" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* Hậu cảnh: dãy núi tiên xa */}
      <path d="M0 420 L140 250 L260 400 L380 300 L520 430 Z" fill="#0c1828" />
      <path d="M700 430 L830 280 L950 410 L1060 320 L1200 440 Z" fill="#0c1828" />

      {/* Trung cảnh: đảo tiên lơ lửng + cung điện */}
      <g>
        <path d="M760 470 Q 900 430 1040 465 L 1000 520 Q 900 545 800 522 Z" fill="#16283c" />
        <path d="M800 522 Q 900 545 1000 520 L 900 590 Z" fill="#0e1c2c" />
        <g fill="#1e3448">
          <rect x="820" y="390" width="160" height="18" />
          <path d="M812 390 L900 368 L988 390 Z" fill="#8c622b" />
          <rect x="846" y="342" width="108" height="16" />
          <path d="M838 342 L900 324 L962 342 Z" fill="#8c622b" />
          <rect x="872" y="300" width="56" height="14" />
          <path d="M864 300 L900 286 L936 300 Z" fill="#8c622b" />
          <path d="M897 286 L900 262 L903 286 Z" fill="#d4a843" />
        </g>
        <g fill="#e6c064" opacity="0.75">
          <rect x="852" y="412" width="12" height="20" />
          <rect x="894" y="412" width="12" height="20" />
          <rect x="936" y="412" width="12" height="20" />
          <rect x="888" y="352" width="10" height="14" />
          <rect x="906" y="352" width="10" height="14" />
        </g>
      </g>

      {/* Đảo nhỏ bay lệch */}
      <g opacity="0.9">
        <path d="M180 420 Q 260 400 330 418 L 305 450 Q 250 462 205 448 Z" fill="#142436" />
        <rect x="238" y="372" width="34" height="10" fill="#1e3448" />
        <path d="M232 372 L255 360 L278 372 Z" fill="#8c622b" />
      </g>

      {/* Tiền cảnh: chiến binh đứng trên phiến đá */}
      <g>
        <path d="M60 640 L 96 520 L 150 512 L 190 640 Z" fill="#0a1420" />
        <g fill="#0f1c2c">
          <circle cx="128" cy="446" r="13" />
          <path d="M118 458 Q 128 452 138 458 L 146 520 L 110 520 Z" />
          <path d="M112 470 L 76 520 L 84 528 L 118 492 Z" />
          <path d="M142 468 L 178 430 L 184 436 L 150 482 Z" />
        </g>
        <path d="M178 430 L 214 372" stroke="#d4a843" strokeWidth="3" strokeLinecap="round" />
        <path d="M206 360 L 222 376 L 208 382 Z" fill="#e6c064" />
      </g>

      {/* Sương linh khí */}
      <rect x="0" y="470" width="1200" height="90" fill="url(#hero-mist)" />
      <path d="M0 560 Q 300 530 620 556 T 1200 548 V640 H0 Z" fill="#0a121e" />
    </svg>
  );
}
