/*
 * Artwork tạm (M1) cho năm game — placeholder SVG tự dựng, composition và
 * palette khác nhau thật sự. KHÔNG phải artwork có quyền sử dụng; khi chủ
 * sở hữu cung cấp ảnh thật (≥1600px + tiêu điểm), thay component này bằng
 * pipeline crop 3:4 / 1:1 / 16:10 (DESIGN §6, §15).
 *
 * Ba biến thể crop mô phỏng đúng cơ chế tiêu điểm:
 * - "card"  3:4   (thẻ dọc ≥1200px)
 * - "square" 1:1  (thẻ ngang, menu, nhóm sản phẩm)
 * - "cover" 16:10 (đầu trang sản phẩm)
 */
import type { JSX } from "react";

export type ArtCrop = "card" | "square" | "cover";

const VIEWBOX: Record<ArtCrop, string> = {
  card: "75 0 450 600",
  square: "0 0 600 600",
  cover: "0 110 600 375",
};

function Stars({ seed }: { seed: number }) {
  const pts: JSX.Element[] = [];
  let s = seed;
  for (let i = 0; i < 40; i++) {
    s = (s * 9301 + 49297) % 233280;
    const x = (s / 233280) * 600;
    s = (s * 9301 + 49297) % 233280;
    const y = (s / 233280) * 320;
    s = (s * 9301 + 49297) % 233280;
    const r = 0.6 + (s / 233280) * 1.4;
    pts.push(<circle key={i} cx={x} cy={y} r={r} fill="rgb(245 235 214 / 0.5)" />);
  }
  return <g>{pts}</g>;
}

/** Võ Lâm Miễn Phí — núi kiếm và chùa trên đỉnh, xanh thiên thanh + vàng */
function SceneVoLamMienPhi() {
  return (
    <>
      <defs>
        <linearGradient id="vlmp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1626" />
          <stop offset="1" stopColor="#123043" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#vlmp-sky)" />
      <Stars seed={11} />
      <circle cx="440" cy="120" r="46" fill="#e6c064" opacity="0.9" />
      <circle cx="440" cy="120" r="60" fill="#e6c064" opacity="0.12" />
      <path d="M0 480 L150 240 L300 470 Z" fill="#0d2436" />
      <path d="M180 600 L360 200 L540 600 Z" fill="#10293c" />
      <path d="M330 260 L360 200 L390 260 Z" fill="#d4a843" opacity="0.85" />
      <g fill="#1b3a50">
        <rect x="240" y="430" width="120" height="14" />
        <rect x="258" y="404" width="84" height="12" />
        <rect x="272" y="382" width="56" height="10" />
        <path d="M236 430 L300 414 L364 430 Z" fill="#8c622b" />
        <path d="M254 404 L300 392 L346 404 Z" fill="#8c622b" />
        <path d="M268 382 L300 372 L332 382 Z" fill="#8c622b" />
      </g>
      <path d="M0 560 Q150 520 300 552 T600 540 V600 H0 Z" fill="#081420" />
    </>
  );
}

/** Võ Lâm Mobile 1 — phố đèn lồng trôi, hổ phách ấm */
function SceneVoLamMobile1() {
  return (
    <>
      <defs>
        <linearGradient id="vlm1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#160f22" />
          <stop offset="1" stopColor="#33221a" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#vlm1-sky)" />
      <Stars seed={29} />
      <circle cx="130" cy="110" r="38" fill="#f0cd72" opacity="0.85" />
      <g>
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 90 + i * 105;
          const y = 190 + (i % 2) * 60;
          return (
            <g key={i}>
              <line x1={x} y1={y - 26} x2={x} y2={y - 12} stroke="#8c622b" strokeWidth="1.5" />
              <rect x={x - 14} y={y - 12} width="28" height="34" rx="13" fill="#d4a843" opacity="0.92" />
              <rect x={x - 14} y={y + 2} width="28" height="4" fill="#8c622b" />
              <line x1={x} y1={y + 22} x2={x} y2={y + 34} stroke="#8c622b" strokeWidth="1.5" />
            </g>
          );
        })}
      </g>
      <path d="M0 470 L90 380 L190 470 Z" fill="#241726" />
      <path d="M130 480 L300 330 L470 480 Z" fill="#2b1b28" />
      <path d="M380 470 L500 360 L600 460 V600 H0 V470 Z" fill="#1c1220" />
      <g fill="#3a2733">
        <rect x="150" y="480" width="300" height="18" />
        <path d="M140 480 L300 448 L460 480 Z" fill="#8c622b" />
        <rect x="180" y="498" width="240" height="102" fill="#241a26" />
        <rect x="210" y="518" width="26" height="40" fill="#e6c064" opacity="0.5" />
        <rect x="287" y="518" width="26" height="40" fill="#e6c064" opacity="0.5" />
        <rect x="364" y="518" width="26" height="40" fill="#e6c064" opacity="0.5" />
      </g>
    </>
  );
}

/** Kiếm Thế Origin — rừng trúc và nguyệt, lục + vàng */
function SceneKiemTheOrigin() {
  return (
    <>
      <defs>
        <linearGradient id="kto-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08160f" />
          <stop offset="1" stopColor="#12291d" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#kto-sky)" />
      <Stars seed={47} />
      <circle cx="300" cy="150" r="64" fill="#f5ebd6" opacity="0.92" />
      <circle cx="300" cy="150" r="84" fill="#f5ebd6" opacity="0.08" />
      <g stroke="#1d3d2b" strokeWidth="14" strokeLinecap="round">
        <line x1="90" y1="620" x2="70" y2="180" />
        <line x1="170" y1="620" x2="185" y2="140" />
        <line x1="430" y1="620" x2="415" y2="160" />
        <line x1="520" y1="620" x2="540" y2="200" />
      </g>
      <g stroke="#2a543c" strokeWidth="8" strokeLinecap="round">
        <line x1="70" y1="330" x2="20" y2="290" />
        <line x1="73" y1="270" x2="120" y2="240" />
        <line x1="184" y1="300" x2="140" y2="260" />
        <line x1="186" y1="230" x2="230" y2="200" />
        <line x1="416" y1="300" x2="370" y2="270" />
        <line x1="418" y1="240" x2="465" y2="215" />
        <line x1="538" y1="330" x2="585" y2="300" />
      </g>
      <path d="M0 540 Q200 500 340 535 T600 525 V600 H0 Z" fill="#0a1c13" />
      <path d="M255 560 L300 470 L345 560 Z" fill="#0f2418" />
      <path d="M300 470 L300 440" stroke="#8c622b" strokeWidth="3" />
      <circle cx="300" cy="436" r="5" fill="#d4a843" />
    </>
  );
}

/** MU Lục Địa VNG — thành trì bóng tối và đôi cánh, đỏ thẫm + vàng đồng */
function SceneMuLucDiaVng() {
  return (
    <>
      <defs>
        <linearGradient id="mu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120a12" />
          <stop offset="1" stopColor="#2b1220" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#mu-sky)" />
      <Stars seed={73} />
      <circle cx="300" cy="180" r="70" fill="#b03a2e" opacity="0.55" />
      <circle cx="300" cy="180" r="46" fill="#e6c064" opacity="0.18" />
      <g fill="#1c1020">
        <path d="M120 600 V330 L160 290 L200 330 V600 Z" />
        <path d="M400 600 V330 L440 290 L480 330 V600 Z" />
        <path d="M200 600 V380 L300 300 L400 380 V600 Z" fill="#241428" />
        <path d="M285 300 L300 260 L315 300 Z" fill="#8c622b" />
        <path d="M148 290 L160 262 L172 290 Z" fill="#8c622b" />
        <path d="M428 290 L440 262 L452 290 Z" fill="#8c622b" />
      </g>
      <g fill="#e6c064" opacity="0.55">
        <rect x="150" y="360" width="18" height="30" />
        <rect x="432" y="360" width="18" height="30" />
        <rect x="288" y="410" width="24" height="42" />
        <rect x="240" y="430" width="16" height="26" />
        <rect x="344" y="430" width="16" height="26" />
      </g>
      <path d="M60 340 Q180 300 300 330 Q420 300 540 340" stroke="#8c622b" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M0 560 Q200 520 400 555 T600 545 V600 H0 Z" fill="#0c0810" />
    </>
  );
}

/** Võ Lâm 2.0 PC — biển bão và điện trên ghềnh, xanh thép + đồng */
function SceneVoLam2Pc() {
  return (
    <>
      <defs>
        <linearGradient id="vl2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1220" />
          <stop offset="1" stopColor="#182c40" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#vl2-sky)" />
      <Stars seed={97} />
      <g stroke="#9bc7ff" strokeWidth="2" fill="none" opacity="0.7">
        <path d="M120 60 L100 130 L128 124 L96 210" />
        <path d="M470 40 L450 110 L478 104 L446 190" />
      </g>
      <path d="M0 330 Q150 310 300 330 T600 325 V600 H0 Z" fill="#0d1c2c" />
      <g stroke="#28425c" strokeWidth="6" fill="none" opacity="0.9">
        <path d="M0 400 Q150 375 300 400 T600 395" />
        <path d="M0 460 Q150 435 300 460 T600 455" />
        <path d="M0 520 Q150 495 300 520 T600 515" />
      </g>
      <path d="M330 600 L350 330 L470 300 L520 600 Z" fill="#122334" />
      <g fill="#1a3247">
        <rect x="380" y="240" width="70" height="70" />
        <path d="M370 240 L415 212 L460 240 Z" fill="#8c622b" />
        <rect x="402" y="196" width="26" height="26" fill="#1a3247" />
        <path d="M396 196 L415 180 L434 196 Z" fill="#8c622b" />
      </g>
      <rect x="398" y="262" width="12" height="18" fill="#e6c064" opacity="0.7" />
      <rect x="422" y="262" width="12" height="18" fill="#e6c064" opacity="0.7" />
      <path d="M40 370 Q70 350 100 370 Q70 366 40 370 Z" fill="#f5ebd6" opacity="0.5" />
      <path d="M500 430 Q530 410 560 430 Q530 426 500 430 Z" fill="#f5ebd6" opacity="0.4" />
    </>
  );
}

const SCENES: Record<string, () => JSX.Element> = {
  "vo-lam-mien-phi": SceneVoLamMienPhi,
  "vo-lam-mobile-1": SceneVoLamMobile1,
  "kiem-the-origin": SceneKiemTheOrigin,
  "mu-luc-dia-vng": SceneMuLucDiaVng,
  "vo-lam-2-pc": SceneVoLam2Pc,
};

/* Lớp hoàn thiện chung cho mọi artwork: ánh đèn vàng từ đỉnh, vignette
   tối dần viền dưới, hạt nhiễu mờ — chống cảm giác "phẳng". */
function SceneFinish() {
  return (
    <>
      <defs>
        <radialGradient id="gf-top" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#e6c064" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#e6c064" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gf-vig" cx="0.5" cy="0.42" r="0.95">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.42" />
        </radialGradient>
        <filter id="gf-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#gf-top)" />
      <rect width="600" height="600" fill="url(#gf-vig)" />
      <rect width="600" height="600" filter="url(#gf-grain)" opacity="0.05" />
    </>
  );
}

export function GameArt({
  slug,
  crop = "card",
  className,
  title,
}: {
  slug: string;
  crop?: ArtCrop;
  className?: string;
  /** Có title → ảnh mang nghĩa; mặc định aria-hidden (tên game đã có trong DOM) */
  title?: string;
}) {
  const Scene = SCENES[slug] ?? SceneVoLamMienPhi;
  return (
    <svg
      viewBox={VIEWBOX[crop]}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <Scene />
      <SceneFinish />
    </svg>
  );
}
