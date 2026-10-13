// Chụp nhanh các route chính ở 1280 & 375 để kiểm tra thị giác (dev tool).
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const routes = ["/", "/phan-mem", "/phan-mem/mu-luc-dia-vng", "/bang-gia", "/ho-tro"];
const browser = await chromium.launch();
for (const vp of [
  { name: "1280", width: 1280, height: 860 },
  { name: "375", width: 375, height: 740 },
]) {
  const page = await browser.newPage({ viewport: vp });
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    const name = r === "/" ? "home" : r.replaceAll("/", "_").replace(/^_/, "");
    await page.screenshot({ path: `/tmp/ga-shot-${vp.name}-${name}.png` });
  }
  await page.close();
}
await browser.close();
console.log("done");
