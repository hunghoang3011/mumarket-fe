# GALAXY AUTO — Frontend (bản demo giao diện)

Triển khai **chỉ phần giao diện** theo `DESIGN.md`: công khai Golden Immortal
Galaxy (M0–M4), khu khách hàng và quản trị phẳng ưu tiên dữ liệu. **Không có
backend, database hay devops** — mọi dữ liệu là giả lập khai báo riêng trong
`src/demo/`, dùng để trình diễn và phát triển UI trước khi có backend thật.

## Chạy

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Bật/tắt dữ liệu demo

- **Một điểm duy nhất:** biến môi trường `NEXT_PUBLIC_GALAXY_DEMO`
  (mặc định BẬT). Tắt: `NEXT_PUBLIC_GALAXY_DEMO=0 npm run dev` — mọi truy vấn
  trong `src/demo/index.ts` trả về trạng thái trống / "chưa cấu hình" trung
  thực, `DemoBar` ẩn, sẵn sàng thay bằng backend thật (cùng DTO trong
  `src/demo/types.ts`).
- **DemoBar** (góc phải dưới, chỉ khi demo bật): đổi nhân cách Khách / Khách
  hàng / Quản trị (cookie `ga_demo_role`) và "Đặt lại dữ liệu demo" (xóa lớp
  phủ thao tác trong localStorage `ga-demo-v1`).
- **Lớp phủ thao tác** (`src/demo/store.ts`): ghi nhận hành động giả lập trong
  phiên — báo chuyển khoản, hủy đơn, tạo đơn từ `/thanh-toan`, duyệt đơn,
  đối soát, gỡ máy, đổi tên máy, xem mã bản quyền, trả lời hỗ trợ, bật tắt
  email nhắc. Xóa hoàn toàn bằng nút trên DemoBar.
- Đăng nhập demo: email bất kỳ → khách hàng; email chứa `admin` → quản trị.
  Mã xác thực: 6 chữ số bất kỳ.

## Kiểm thử

```bash
npm run verify      # typecheck + lint + unit + build
npm run test:e2e    # Playwright smoke 3 viewport (tự khởi động production build)
```

## Cấu trúc

- `src/app/` — route theo DESIGN §4 (public / auth / commerce / customer / admin).
- `src/shared/ui/` — primitive §7 (Button, Field, Dialog, StatusLabel, Price,
  CopyValue, PaymentQR, DataTable, GameCard…); `src/shared/styles/tokens.css`
  là nguồn token duy nhất (§6), Tailwind chỉ có class ngữ nghĩa.
- `src/shared/vietqr/payload.ts` — dựng payload VietQR EMVCo + CRC16 từ
  snapshot đơn (bản demo mã hóa QR phía client bằng gói `qrcode`).
- `src/demo/` — toàn bộ dữ liệu giả lập: `types.ts` (DTO), `fixtures/`
  (catalog/commerce/licensing/content), `index.ts` (truy vấn), `store.ts`
  (lớp phủ thao tác), `session.ts` (vai trò), `DemoBar.tsx`, `config.ts` (cờ).

## Font & tài sản

- **Be Vietnam Pro** (400/500/600/700) + **Noto Serif Display** (600/700):
  nạp qua `next/font/google` (tự host khi build), subset vietnamese.
- **Ma Shan Zheng** (OFL, google/fonts) — nhưng KHÔNG ship full font (~5.8MB
  CJK, không có glyph tiếng Việt). Repo chỉ ship bản subset 33 chữ Hán trang
  trí (~9.7KB) tại `src/app/fonts/brush-hanzi.woff2`, tự host qua
  `next/font/local`. Tái tạo: tải `MaShanZheng-Regular.ttf` từ
  github.com/google/fonts rồi `node scripts/subset-brush-font.mjs`
  (sửa chuỗi TEXT trong script khi cần thêm ký tự).
- Artwork: placeholder SVG tự dựng (`GameArt.tsx`, `HeroArt.tsx`) — không
  phải ảnh có quyền; thay bằng pipeline ảnh thật khi chủ sở hữu cung cấp.

## Giới hạn của bản demo (trung thực)

- Artwork là **placeholder SVG tự dựng** — không tuyên bố khớp bất kỳ ảnh
  tham chiếu nào (DESIGN §0, §15).
- Không có xác thực, thanh toán, đối soát hay bản quyền thật; mọi thao tác
  chỉ đổi trạng thái phía client.
- Thông tin ngân hàng, liên hệ, nội dung chính sách trong fixtures là dữ liệu
  mẫu phục vụ demo.
