/* Token màu port từ src/shared/styles/tokens.css — giữ đồng bộ với web. */
export const colors = {
  page: "#080B12",
  panel: "#0B1423",
  raised: "#132238",
  input: "#080B12",

  lacquerHi: "#2C1A10",
  lacquer: "#1C110A",
  lacquerLo: "#120A06",

  textPrimary: "#F5EBD6",
  textSecondary: "#C6C0B5",
  textMuted: "#A39E95",

  gold: "#D4A843",
  goldHi: "#E6C064",
  goldShine: "#F7E7AE",
  goldLo: "#C29535",
  edge: "#8C622B",
  onGold: "#080B12",
  link: "#FFD978",

  info: "#92C5FF",
  infoBg: "#0E2035",
  success: "#82D5AA",
  successBg: "#11261E",
  warning: "#F0A35E",
  warningBg: "#2B2212",
  danger: "#FF9A99",
  dangerBg: "#30191D",

  cinnabar: "#8F1F14",
  cinnabarHi: "#C74731",

  borderSubtle: "#28364B",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 48,
} as const;

export const radius = { detail: 4, control: 6, panel: 8 } as const;
