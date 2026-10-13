/*
 * Subset Ma Shan Zheng (OFL) chỉ giữ các chữ Hán trang trí dùng trong UI —
 * font gốc ~5.8MB, bản subset vài KB. Chữ tiếng Việt KHÔNG dùng font này
 * (không có glyph) — brush font chỉ cho trang trí thuần CJK, aria-hidden.
 *
 * Chạy: node scripts/subset-brush-font.mjs
 * Nguồn font: /tmp/fonts/MaShanZheng-Regular.ttf (tải từ google/fonts).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import subsetFont from "subset-font";

/* Bộ ký tự trang trí đang dùng (xem README mục Font). Thêm chữ mới → chạy lại script. */
const TEXT =
  "武林仙俠劍氣長存江湖魔風天山令域心月水龍鳳雲" +
  "剑侠气风云龙凤茶道义·";

const font = await readFile("/tmp/fonts/MaShanZheng-Regular.ttf");
const woff2 = await subsetFont(font, TEXT, { targetFormat: "woff2" });

await mkdir("src/app/fonts", { recursive: true });
await writeFile("src/app/fonts/brush-hanzi.woff2", woff2);
console.log(`subset ${TEXT.length} ký tự → ${(woff2.byteLength / 1024).toFixed(1)} KB`);
