# GALAXY AUTO — Design

## 0. Trạng thái và thẩm quyền

- **Bản:** nháp 2026-10-13, thay bản 2026-10-12 (bản cũ lưu tại `.backup/2026-10-13/`).
- **Chưa có:** UI đã dựng, wireframe, font bundle, artwork có quyền sử dụng, dữ liệu sản phẩm/giá. Ảnh tham chiếu mà prompt gốc nhắc tới không có trong workspace; mọi composition là tự dựng và không được tuyên bố khớp ảnh đó.
- **Thẩm quyền:** tài liệu này sở hữu thương hiệu, kiến trúc thông tin và route, ngôn ngữ hình ảnh, component, hành trình J1–J6, thuật ngữ giao diện và gate D01–D23. `galaxy-auto.md` sở hữu quy tắc nghiệp vụ và bảo mật R2–R12. Thiết kế không nới quy tắc nghiệp vụ; khi hai tài liệu mâu thuẫn, sửa tài liệu và test trước, không vá bằng CSS.
- Chỉ một file `DESIGN.md` ở root; task 4 chép nguyên file này sang dự án triển khai.
- **Quy ước:** MUST = bắt buộc để nghiệm thu; SHOULD = mặc định, ngoại lệ phải có lý do; MAY = tùy chọn.

## 1. Thương hiệu

### Định vị

GALAXY AUTO là cửa hàng một người bán, bán phần mềm auto cho đúng năm game.

- **Khu công khai:** Golden Immortal Galaxy — cung điện tiên lơ lửng, núi tiên, thiên hà xanh đen, ánh vàng linh khí. Chất kim loại khắc của game launcher MU/Võ Lâm thể hiện ở nút, khung ảnh và đường chia.
- **Khu giao dịch, tài khoản, quản trị:** nền phẳng, dữ liệu trước, vàng chỉ cho hành động chính.
- Trong một màn hình, người mua phải biết: game nào, gói nào, trả bao nhiêu, tối đa mấy máy, hạn tính từ lúc nào.
- Không giả danh nhà phát hành game; không hứa an toàn tài khoản, tỷ lệ thành công, số người dùng hay thời gian duyệt tiền.

### Copy gốc — seed CMS

Giá trị mặc định, sửa được qua CMS; QA không được khôi phục bản seed khi CMS đã sửa. Headline được xuống dòng thích ứng nhưng không viết lại chữ.

| Khóa | Giá trị mặc định |
| --- | --- |
| `brand.name` | GALAXY AUTO |
| `brand.slogan` | Công Nghệ Khai Mở – Chinh Phục Tam Giới |
| `home.hero.title.first` / `.second` | THẦN BINH CÔNG NGHỆ / CHINH PHỤC NGŨ ĐẠI THẾ GIỚI |
| `home.hero.subtitle` | Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp & MU. |
| `home.hero.cta.primary` / `.secondary` | KHÁM PHÁ PHẦN MỀM (→ `/phan-mem`) / XEM BẢNG GIÁ (→ `/bang-gia`) |
| `home.products.title` / `.subtitle` | NGŨ ĐẠI THẾ GIỚI / Khám phá hệ sinh thái phần mềm được phát triển dành riêng cho từng tựa game. |
| `home.benefits.title` | ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC |
| `home.benefits.items` | Giao diện dễ sử dụng; Tùy chỉnh linh hoạt; Cập nhật phiên bản; Hỗ trợ kỹ thuật |
| `home.purchase.steps` | Chọn tựa game; Lựa chọn gói phần mềm; Thanh toán và nhận License; Tải xuống và kích hoạt |
| `home.purchase.caption` | Bản quyền được cấp sau khi khoản chuyển được xác nhận. (dưới bước 3, MUST) |

- Viết hoa toàn bộ chỉ dùng cho hai dòng hero, hai CTA hero và ba tiêu đề section ở trên. Nút, form, bảng, thông báo dùng chữ thường tự nhiên.
- Bốn benefit là nhãn; mô tả phụ chỉ hiện khi chủ sở hữu cung cấp nội dung thật.
- Từ ngữ fantasy chỉ dùng cho brand/editorial. Nhãn thao tác lấy từ bảng thuật ngữ ở §3.

### Wordmark

- SVG riêng “GALAXY AUTO”, dựng từ outline Noto Serif Display 700, thêm một nét khắc vàng mảnh; có `<title>GALAXY AUTO</title>`.
- Hai bản: đầy đủ (header, footer) và “GA” (favicon, app icon). Không ship thêm font thứ ba để có logo.

### Tránh

- Neon tím/xanh, viền phát sáng ở mọi thứ, glass lồng glass, particle hoặc glow lặp vô hạn, intro bắt chờ, scroll hijack.
- Bento/grid trang trí, logo wall, testimonial, số liệu hoặc badge “Hot/Bán chạy” không có nguồn, countdown tạo áp lực.
- Font giả Hán/trung cổ, chữ gradient/glow/emboss ở cỡ nhỏ, chữ nằm trong ảnh.
- Dashboard có biểu đồ trang trí; âm thanh/video tự phát.

## 2. Người dùng và mục tiêu

Personas là giả định thiết kế, chưa qua phỏng vấn.

| Nhóm | Việc cần làm | Rủi ro thiết kế phải xử lý |
| --- | --- | --- |
| Khách mới, dùng điện thoại | Chọn game/gói, đăng ký, chuyển khoản bằng app ngân hàng trên cùng máy | Mất gói đã chọn khi xác thực; gõ nhầm số tiền/nội dung; tưởng đã chuyển là đã có bản quyền |
| Khách đã mua | Tải đúng phiên bản, xem hạn và máy, gia hạn đúng bản quyền | Nhiều bản quyền cùng game khó phân biệt; không biết máy nào để gỡ |
| Khách cần hỗ trợ | Gửi yêu cầu kèm đúng đơn/bản quyền | Không có lối đi khi trạng thái bất thường; bị yêu cầu gửi mã bí mật |
| Quản trị viên | Xác nhận tiền nhanh, xử lý khoản lệch, quản lý sản phẩm/nội dung | Nhầm hoàn trả với thu hồi; bấm duyệt hai lần; màn quá trang trí khó quét |

**Mục tiêu đo được**

1. Từ trang chủ tới vùng chọn gói trong một click, không cần đăng nhập.
2. Trước khi tạo đơn thấy đủ: game, gói, số tiền, thời hạn, số máy, quy tắc tính hạn.
3. Trên điện thoại, chuyển khoản không phải gõ tay: lưu ảnh QR rồi quét trong app ngân hàng.
4. Sau khi báo đã chuyển, biết hệ thống đã ghi nhận gì, chưa xác minh gì, làm gì tiếp; không bị thúc chuyển lại.
5. Sau khi được cấp, tải phần mềm và tìm đúng bản quyền/gia hạn trên một màn hình.
6. Admin xác nhận một khoản chuyển khớp đúng ngay trên trang đơn; khoản lệch có màn đối soát riêng.

**Không làm:** giỏ hàng, nhiều người bán, chợ vật phẩm, đấu giá, affiliate, chat, trừ tiền tự động, tự chuyển/hoàn tiền, mã nguồn auto/client game, tính năng AI.

**Ngữ cảnh mặc định:** tiếng Việt, dark theme, mạng có thể chậm, người dùng có thể zoom, dùng bàn phím hoặc trình đọc màn hình. Không giả định người chơi MMORPG rành kỹ thuật.

## 3. Thuật ngữ giao diện

Thuật ngữ nội bộ không bao giờ hiện trên UI. “License” chỉ xuất hiện trong seed bước 3.

| Nội bộ | Nhãn trên UI | Ghi chú |
| --- | --- | --- |
| offer | Gói | “Gói 30 ngày” |
| trial | Dùng thử | Không bao giờ hiển thị như giá 0 ₫ |
| device cap | Tối đa N máy | “Tối đa 2 máy” |
| registered device | Máy đã đăng ký | Có tên máy, ngày đăng ký, lần dùng cuối |
| license | Bản quyền | |
| license key | Mã bản quyền | Bí mật; xem cần xác nhận lại mật khẩu |
| license reference | Mã tham chiếu | Không bí mật, ví dụ `BQ-7K3M2Q` |
| transfer reference | Nội dung chuyển khoản | Ví dụ `GA7K3MQ`; cũng là mã đơn |
| payment report | Thông báo đã chuyển khoản | Do khách gửi, chưa phải xác nhận tiền |
| verified receipt | Khoản tiền đã nhận | Admin nhập sau khi kiểm tra ngân hàng |
| settlement | Duyệt thanh toán | |
| unresolved | Cần đối soát | Tình trạng của khoản tiền, không phải trạng thái đơn |
| unresolved return | Hoàn trả khoản chuyển | Chỉ admin |
| settled refund | Hoàn tiền đơn đã thanh toán | Chỉ admin |
| revoke | Thu hồi bản quyền | Thao tác riêng, không đi kèm hoàn tiền |
| step-up | Xác nhận lại mật khẩu | Admin: kèm mã xác thực 2 lớp |
| release | Phiên bản | |

| Trục | Giá trị nội bộ → nhãn |
| --- | --- |
| Đơn hàng | `pending_payment` Chờ thanh toán · `paid` Đã thanh toán · `cancelled` Đã hủy · `expired` Hết hạn thanh toán |
| Thanh toán | Chưa có thông báo · Đã ghi nhận thông báo chuyển khoản · Cần đối soát · Đã nhận tiền |
| Bản quyền | `unactivated` Chưa kích hoạt · `active` Đang hiệu lực · expired Hết hạn · `suspended` Tạm khóa · `revoked` Đã thu hồi |
| Phần mềm | `operational` Hoạt động bình thường · `updating` Đang cập nhật theo bản game mới · `paused` Tạm ngừng hoạt động · `unreleased` Chưa phát hành |

## 4. Kiến trúc thông tin

### Header và footer

- Thứ tự: wordmark · Trang Chủ · Phần Mềm ▾ · Bảng Giá · Hướng Dẫn · Cập Nhật · Hỗ Trợ · [Đăng nhập] hoặc [Phần mềm của tôi].
- Menu đầy đủ từ 1200px. Dưới 1200px: wordmark, nút phiên (Đăng nhập/Phần mềm của tôi) và nút “Menu” mở drawer. Lý do: ước tính bằng độ rộng glyph Be Vietnam Pro Medium 15px, menu đầy đủ cần hơn 1.000px.
- “Phần Mềm” mở bằng click, Enter hoặc Space; Escape đóng và trả focus. Năm mục, mỗi mục: ảnh 1:1 32px, tên game, nhãn trạng thái phần mềm. Drawer có cùng nội dung.
- Header sticky cao 64px (desktop) / 56px (mobile); `scroll-padding-top` bằng chiều cao header.
- Footer: thông tin kinh doanh/liên hệ do chủ sở hữu cung cấp, hướng dẫn, điều khoản, quyền riêng tư, chính sách hoàn tiền, slogan. Không sinh địa chỉ, hotline hay chứng nhận.

### Danh mục cố định

| Tên hiển thị | Slug |
| --- | --- |
| Auto Võ Lâm Miễn Phí | `vo-lam-mien-phi` |
| Auto Võ Lâm Mobile 1 | `vo-lam-mobile-1` |
| Auto Kiếm Thế Origin | `kiem-the-origin` |
| Auto MU Lục Địa VNG | `mu-luc-dia-vng` |
| Auto Võ Lâm 2.0 PC | `vo-lam-2-pc` |

### Route

| Nhóm | Route |
| --- | --- |
| Công khai | `/`, `/phan-mem`, `/phan-mem/[slug]`, `/bang-gia`, `/huong-dan`, `/huong-dan/[slug]`, `/cap-nhat`, `/cap-nhat/[slug]`, `/ho-tro` |
| Chính sách | `/dieu-khoan`, `/quyen-rieng-tu`, `/chinh-sach-hoan-tien` (nội dung chủ sở hữu cung cấp) |
| Xác thực | `/dang-nhap`, `/dang-ky`, `/xac-thuc` (nhập mã 6 số), `/quen-mat-khau` (email → mã → mật khẩu mới) |
| Giao dịch | `/thanh-toan?goi=…` hoặc `/thanh-toan?gia-han=BQ-…`, `/don-hang/[ma]` |
| Khách hàng | `/tai-khoan` (Phần mềm của tôi), `/tai-khoan/ban-quyen/[ma]`, `/tai-khoan/don-hang`, `/tai-khoan/ho-tro`, `/tai-khoan/ho-tro/[id]`, `/tai-khoan/cai-dat` |
| Quản trị | `/quan-tri` (Việc cần xử lý), `/quan-tri/don-hang`, `/quan-tri/don-hang/[ma]`, `/quan-tri/thanh-toan` (Đối soát), `/quan-tri/ban-quyen`, `/quan-tri/khach-hang`, `/quan-tri/san-pham`, `/quan-tri/phien-ban`, `/quan-tri/goi-gia`, `/quan-tri/noi-dung`, `/quan-tri/ho-tro`, `/quan-tri/cau-hinh`, `/quan-tri/nhat-ky` |

- Menu khách hàng có bốn mục: Phần mềm của tôi, Đơn hàng, Hỗ trợ, Cài đặt. `/tai-khoan` vừa là trang tổng quan vừa là nơi thao tác chính.
- Menu quản trị nhóm theo việc: Việc cần xử lý · Bán hàng (Đơn hàng, Đối soát, Bản quyền, Khách hàng) · Sản phẩm (Sản phẩm, Phiên bản, Gói giá) · Nội dung & hỗ trợ · Hệ thống (Cấu hình, Nhật ký).
- Query string chỉ chứa định danh không bí mật (slug, id gói, mã đơn, mã tham chiếu) và bộ lọc/phân trang. Không chứa email, mã bản quyền hay bằng chứng ngân hàng.

## 5. Bố cục từng màn

### Trang chủ — thứ tự MUST giữ

1. **Header** (M3 trên hero).
2. **Hero** (M1):
   - Desktop: cao 560–640px, để mép trên hàng thẻ game lộ ra ở màn 1280×800. Chữ ở cột trái rộng tối đa 560px, nằm trên scrim `#080B12` đặc ≥ 85%; nhân vật và cung điện ở bên phải.
   - Nội dung: slogan (Be Vietnam Pro 500 16px, vàng), h1 gồm hai dòng headline, subtitle, hai CTA (vàng kim loại + viền vàng).
   - Mobile: ảnh crop 4:5 ở trên, mờ dần vào nền; chữ đặt bên dưới trên nền đặc, không đè lên chi tiết ảnh.
3. **NGŨ ĐẠI THẾ GIỚI:** tiêu đề, subtitle, năm thẻ game (xem bên dưới).
4. **ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC:** một dải M0, bốn mục ngăn bằng divider (icon 24px + nhãn + mô tả nếu có). Không đóng khung riêng từng mục.
5. **Bốn bước mua:** hàng bốn bước có số thứ tự và đường nối. Caption bắt buộc dưới bước 3. Khi có sản phẩm cấu hình dùng thử, thêm một dòng: “Dùng thử không cần chuyển khoản.”
6. **Cập nhật mới:** ba bài mới nhất dạng hàng (ngày · game · tiêu đề). Khi trống: “Chưa có cập nhật nào được đăng.”
7. **Footer.**

### Thẻ game

Từ trên xuống: ảnh → tên game → nhãn trạng thái phần mềm → mô tả ngắn (nếu có, tối đa 2 dòng) → khối giá M0 → hành động.

- **Khối giá:** dòng 1 “Từ 123.456 ₫” (20px, 600). Dòng 2 “30 ngày · tối đa 2 máy” (14px), là thời hạn và số máy của chính gói rẻ nhất. Nếu có dùng thử, thêm dòng “Có dùng thử 3 ngày” (info). Không có gói trả phí: “Chưa mở bán”.
- **Hành động:**
  - Mặc định: nút vàng “Mua gói” rộng hết thẻ → `/phan-mem/[slug]#goi`; link chữ “Xem chi tiết” → `/phan-mem/[slug]`.
  - Chỉ có dùng thử: nút chính là “Dùng thử”.
  - Không bán được: chỉ còn link “Xem chi tiết”.
- Ảnh và tên game cũng là link đến trang chi tiết. Cả thẻ không phải một link lớn.
- **Vật liệu:** viền 1px bronze; hai góc trên của ảnh có ornament M2. Hover/focus-within: viền chuyển vàng và có halo M4 tĩnh.
- **Bố cục theo độ rộng:**
  - ≥ 1200px: năm thẻ dọc trên một hàng (rộng khoảng 208–220px), ảnh 3:4 — giống màn chọn nhân vật/máy chủ. Tên game dài được xuống dòng.
  - 640–1199px: thẻ ngang hai cột (2+2+1, thẻ cuối canh giữa, cùng độ rộng).
  - < 640px: thẻ ngang một cột. Thẻ ngang: ảnh 1:1 rộng 96–112px bên trái, thông tin bên phải; dưới 480px, hàng hành động trải hết chiều rộng thẻ.

### Trang sản phẩm `/phan-mem/[slug]`

- **Đầu trang:**
  - Breadcrumb.
  - Desktop: ảnh cover 16:10 (M1) chiếm 7/12; bên phải là h1 tên game, trạng thái phần mềm + “cập nhật lúc …”, phiên bản phần mềm, phiên bản game hỗ trợ (từng trường thiếu ghi “Chưa có thông tin”), và link nhanh: Gói · Cài đặt & kích hoạt · Lịch sử phiên bản.
  - Mobile: các khối xếp theo cùng thứ tự DOM.
- **`#goi` — vùng mua (M0):**
  - Desktop: danh sách gói bên trái, tóm tắt và CTA bên phải. Mobile: danh sách → tóm tắt → CTA.
  - Gói dùng thử nằm trong khối riêng phía trên các gói trả phí.
  - Chọn gói không tạo đơn.
- **Tiếp theo:** Tính năng · Ảnh chụp · Cài đặt & kích hoạt (các bước đánh số) · Tải phần mềm (chủ bản quyền thấy nút tải; người khác thấy “Mua gói để tải”) · Lịch sử phiên bản (3 bản mới nhất + “Xem tất cả”).
- **Nội dung tùy chọn còn thiếu:** gom vào một thông báo: “Đang cập nhật: ảnh chụp, lịch sử phiên bản.” Không xếp nhiều section trống.

**Bộ chọn gói và tóm tắt**

- Radio group với legend “Chọn gói”, gói sắp theo thời hạn tăng dần. Mỗi dòng: thời hạn · tối đa N máy · giá phải trả (khi có khuyến mãi: giá gốc gạch ngang và mức giảm do server tính) · “Tính hạn từ lần kích hoạt đầu”.
- Không chọn sẵn, trừ khi chỉ có một gói. Không có nhãn “Đề xuất”.
- Khối dùng thử: “Dùng thử 3 ngày · tối đa 1 máy · không cần chuyển khoản”, nút viền “Dùng thử”. Đã dùng rồi: “Bạn đã dùng thử phần mềm này” + link tới bản quyền.
- Tóm tắt: game, gói, số máy, số tiền phải trả (24–32px), quy tắc tính hạn. Khi trạng thái phần mềm khác “Hoạt động bình thường”, hiện thêm nhãn đó. CTA “Mua gói”. Chưa chọn gói: CTA kèm chú thích “Chọn một gói”.
- Đang có đơn chờ cho đúng gói này: thay CTA bằng “Bạn đang có đơn chờ thanh toán cho gói này — Mở đơn GA7K3MQ”.
- Đang có bản quyền của game này: thêm dòng “Bạn có bản quyền BQ-7K3M2Q (hết hạn 20/11/2026) — Gia hạn bản quyền này”. Mua mới hiển thị là “Mua bản quyền mới”.

### Bảng giá `/bang-gia`

- Hàng chip năm game ở đầu trang (anchor). Mỗi game một section: h2 tên game, trạng thái, link “Xem chi tiết”.
- Gói trình bày dạng hàng: Thời hạn | Số máy | Giá | [Mua gói]. Dùng thử là hàng riêng đứng đầu, nhãn “Dùng thử”, nút “Dùng thử”.
- Mobile: mỗi gói hai dòng (“30 ngày · tối đa 2 máy” / giá + nút); không cuộn ngang.
- “Mua gói” ở trang này đi thẳng tới `/thanh-toan?goi=…`, vì mọi thông tin đã hiển thị. Không quy đổi giá/ngày hay giá/tháng.

### Thanh toán `/thanh-toan`

- Bắt buộc đăng nhập và đã xác thực email; nếu chưa → `/dang-nhap?next=…`, sau đó quay lại đúng gói/ý định.
- **Mua mới:** game, gói, thời hạn, tối đa máy, quy tắc tính hạn, số tiền phải trả. Ghi chú thời gian xử lý thanh toán do chủ sở hữu viết trong CMS; ô trống thì không hiện.
- **Gia hạn** (`?gia-han=BQ-…`):
  - Mã tham chiếu, hạn hiện tại, các gói cùng sản phẩm và cùng số máy (radio), thời hạn thêm, giá.
  - Hạn mới ghi rõ là “dự kiến”, kèm câu quy tắc ở J4.
  - Link riêng “Mua bản quyền mới với số máy khác”.
- Dòng chính sách: “Bằng việc tạo đơn, bạn đồng ý với Điều khoản và Chính sách hoàn tiền.” (link thật).
- CTA “Tạo đơn chuyển khoản”: chống bấm trùng, idempotent. Giá đổi từ lúc chọn → hiện giá mới và yêu cầu xác nhận lại.
- Desktop hai cột (nội dung trái, tóm tắt phải); mobile một cột.

### Đơn hàng `/don-hang/[ma]`

- **Đầu trang:** mã đơn (cũng là nội dung chuyển khoản) và ba dòng có nhãn: “Trạng thái đơn”, “Thanh toán”, “Bản quyền”.
- **Khối chuyển khoản (M0)** — mobile theo thứ tự:
  1. Số tiền và nội dung chuyển khoản, chữ to.
  2. Mã VietQR (tối thiểu 240px, trên nền trắng có vùng trống). Nút “Lưu ảnh QR”. Chú thích: “Mở ứng dụng ngân hàng, chọn Quét QR rồi chọn ảnh vừa lưu.”
  3. Ngân hàng, số tài khoản, chủ tài khoản, số tiền, nội dung — mỗi giá trị một nút sao chép.
  4. Hạn thanh toán: “14:05, 14/10/2026 (giờ Việt Nam)”.
  5. Nút “Tôi đã chuyển khoản”.
  6. “Hủy đơn” (link, chỉ khi chưa báo chuyển khoản).
  - Desktop: QR bên trái (quét bằng điện thoại), các trường bên phải.
- QR và các trường chữ hiển thị đúng cùng một snapshot của đơn.
- Lưu ý dưới nội dung chuyển khoản: “Giữ nguyên nội dung GA7K3MQ. Ngân hàng có thể tự thêm chữ vào nội dung; điều này không ảnh hưởng.”
- Trạng thái thay đổi theo bảng J3. Trang tự cập nhật mỗi 30 giây khi tab đang mở, dừng khi đơn đã thanh toán hoặc hết hạn; live region chỉ đọc khi trạng thái đổi.

### Phần mềm của tôi `/tai-khoan`

- **Đầu trang:** banner cho đơn đang chờ (“Đơn GA7K3MQ đang chờ thanh toán — Mở đơn”) và đơn đã báo chuyển khoản (“đang chờ xác nhận tiền”).
- **Nhóm theo sản phẩm:**
  - Đầu nhóm: ảnh 1:1 48px, tên game, phiên bản hiện hành, trạng thái phần mềm; hai hành động “Tải phần mềm” (khi có bản quyền được tải) và “Hướng dẫn kích hoạt”.
  - Mỗi bản quyền một hàng: mã tham chiếu, trạng thái, hạn (hoặc “Chưa kích hoạt — 30 ngày tính từ lần kích hoạt đầu”), “2/2 máy”, các nút “Xem mã bản quyền”, “Gia hạn” (khi đủ điều kiện), “Chi tiết”.
- Còn ≤ 3 ngày: nhãn cảnh báo “Hết hạn 20/11/2026 (còn 2 ngày)”.
- Trống: “Bạn chưa có phần mềm nào.” + link “Xem năm phần mềm”.
- **Chi tiết bản quyền `/tai-khoan/ban-quyen/[ma]`:**
  - Thông tin bản quyền, danh sách máy (tên máy sửa được, ngày đăng ký, lần dùng cuối, nút “Gỡ máy”), lịch sử gia hạn, các đơn liên quan.
  - Hộp thoại gỡ máy ghi tên máy và hậu quả: “Phần mềm trên máy này sẽ dừng ở lần kiểm tra kế tiếp (thường trong vòng 5 phút). Hạn bản quyền không thay đổi.”
- **Đơn hàng:** danh sách (ngày, game/gói, số tiền, trạng thái đơn, thanh toán) → `/don-hang/[ma]`.
- **Hỗ trợ:** danh sách yêu cầu và form mới; điền sẵn game/đơn/mã tham chiếu khi mở từ ngữ cảnh. Nhắc: “Không gửi mật khẩu hoặc mã bản quyền.”
- **Cài đặt:** tên hiển thị, đổi mật khẩu, bật/tắt email nhắc sắp hết hạn (mặc định bật). Email giao dịch luôn được gửi.
- Desktop ≥ 1024px: sidebar 240px; nhỏ hơn: thanh menu bốn mục hoặc drawer.

### Quản trị

- **`/quan-tri` — Việc cần xử lý:** số lượng có link tới danh sách đã lọc — Đơn đã báo chuyển khoản, Khoản tiền cần đối soát, Yêu cầu hỗ trợ chờ trả lời, Thiếu cấu hình để mở bán. Không biểu đồ.
- **Chi tiết đơn — đường xác nhận mặc định:**
  - Khối “Xác nhận đã nhận tiền”: số tiền dự kiến và tài khoản nhận lấy từ snapshot (chỉ đọc). Admin nhập mã giao dịch ngân hàng và thời điểm nhận.
  - Ô “Số tiền thực nhận” điền sẵn bằng số tiền dự kiến. Sửa khác đi → form chuyển thành “Ghi nhận khoản tiền lệch” và khoản tiền vào trạng thái cần đối soát.
  - Ô lý do chỉ hiện và bắt buộc khi duyệt muộn hoặc số tiền lệch.
  - Nút “Xác nhận đã nhận tiền” → hộp thoại xác nhận → kết quả từ server.
- **Đối soát `/quan-tri/thanh-toan`:**
  - Bộ lọc: Cần đối soát / Đã áp dụng / Đã hoàn trả. Có form “Nhập khoản tiền đã nhận” khi chưa biết đơn.
  - Chi tiết khoản tiền: đã nhận / đã áp dụng / đã hoàn trả / còn lại, lịch sử.
  - Gợi ý đơn khi nội dung chuyển khoản chứa đúng mã đơn (khớp chính xác, không fuzzy), kèm bảng so sánh tài khoản/mã/số tiền/điều kiện.
  - Ba nút tách biệt: “Áp dụng vào đơn”, “Duyệt muộn”, “Ghi nhận đã hoàn trả”.
  - Desktop: khoản tiền trái, đơn phải. Mobile: khoản tiền → đơn → hành động.
- **Bản quyền:** tìm theo mã tham chiếu/email; “Tạm khóa”, “Khôi phục”, “Thu hồi bản quyền” (danger), “Cấp bản quyền thủ công”. “Hoàn tiền đơn đã thanh toán” nằm ở chi tiết đơn, tách khỏi thu hồi.
- **Sản phẩm:** form theo từng slot; chọn trạng thái phần mềm + ghi chú; tải ảnh gốc, đặt tiêu điểm và xem trước ba crop; phiên bản; gói giá.
- **Nội dung / Cấu hình:** banner, hướng dẫn, FAQ, tin, trang chính sách, ghi chú thời gian xử lý thanh toán, xem trước email; ngân hàng (BIN, số tài khoản, chủ tài khoản), liên hệ, bảng cờ chức năng có mô tả tác động.
- Thao tác tài chính và bản quyền không bao giờ nằm trong menu icon ba chấm.

## 6. Ngôn ngữ hình ảnh

### Vật liệu — nơi được dùng

| Mã | Dùng ở | Không dùng ở |
| --- | --- | --- |
| M0 · Navy phẳng | Giá, gói, checkout, thông tin ngân hàng, tài khoản, quản trị, form, bảng | — (mặc định) |
| M1 · Cảnh thiên giới | Hero, ảnh cover sản phẩm, ảnh thẻ game | Nền form, tài khoản, mọi section |
| M2 · Kim loại khắc | Nút chính, góc khung ảnh hero/thẻ, đường chia tiêu đề editorial, wordmark | Viền quanh từng control, khung trong khung |
| M3 · Kính thiên giới | Header khi nằm trên hero | Dưới giá, trạng thái, field, thông tin ngân hàng; glass lồng nhau |
| M4 · Hào quang | Thẻ game khi hover/focus; một điểm sáng chính trong hero | Pulse lặp, viền cầu vồng, hover làm đổi kích thước |

Mỗi composition công khai có tối đa một lớp kính và một điểm sáng lớn. Tài khoản và quản trị chỉ dùng M0 cộng nút chính M2.

### Công thức vật liệu

| Thành phần | Giá trị |
| --- | --- |
| Nút chính (M2) | Nền gradient dọc `#E6C064 → #C29535`; viền 1px `#8C622B`; `box-shadow: inset 0 1px 0 rgb(255 217 120 / 0.6)`; chữ `#080B12` 600; radius 6px; cao ≥ 44px |
| Nút chính — hover / nhấn | Hover: gradient `#F0CD72 → #CFA23F`. Nhấn: đảo chiều gradient. Không glow, không dịch chuyển; gradient không animate (nếu cần mượt: pseudo-element đổi opacity 160ms) |
| Nút chính — disabled | Nền `#1A2433`, chữ `#8E97A5`, viền `#28364B`, không gradient; luôn kèm lý do bằng chữ |
| Nút viền | Nền trong suốt; viền 1px `#D4A843`; chữ `#FFD978`; hover nền `rgb(212 168 67 / 0.12)` |
| Nút nguy hiểm | Nền `#30191D`; viền và chữ `#FF9A99` |
| Link trong đoạn văn | `#FFD978`, luôn gạch chân |
| Tiêu đề editorial | Noto Serif Display 600, chữ hoa, `#D4A843` đặc; bên dưới là đường chia SVG 1px `#8C622B` dài 120px, giữa có hình thoi 8px `#D4A843` |
| Ornament góc | SVG 16–24px hình chữ L có móc mây, nét 1px `#8C622B` + highlight 1px `#D4A843`; chỉ ở góc khung hero và hai góc trên ảnh thẻ game |
| Header M3 | `rgb(8 11 18 / 0.85)` + `backdrop-filter: blur(8px)`; fallback `#080B12`; viền dưới 1px `rgb(212 168 67 / 0.25)`; rời hero thì chuyển nền đặc |
| Halo M4 | `box-shadow: 0 0 24px rgb(212 168 67 / 0.18)` trên pseudo-element, đổi opacity 200ms; tĩnh |
| Scrim hero | Desktop: `linear-gradient(90deg, rgb(8 11 18 / 0.92) 0 40%, transparent 70%)`. Mobile: chữ chỉ nằm trên vùng nền đặc ≥ 85% |

### Màu

Một nguồn duy nhất: `src/shared/styles/tokens.css`. Tailwind v4 dùng `@theme { --color-*: initial; … }` để chỉ còn token ngữ nghĩa — không tồn tại `bg-purple-500` hay `text-blue-500`. Không viết mã hex trực tiếp trong TSX.

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--surface-page` / `--surface-panel` / `--surface-raised` | `#080B12` / `#0B1423` / `#132238` | Nền trang / panel / dialog, drawer |
| `--surface-input` | `#080B12` | Field (luôn có viền `--border-control`) |
| `--text-primary` / `--text-secondary` / `--text-muted` | `#F5EBD6` / `#C6C0B5` / `#A39E95` | Chữ chính / phụ / mờ (cả ba cùng tông ấm) |
| `--action-primary` / `--on-action` / `--link` | `#D4A843` / `#080B12` / `#FFD978` | Vàng thương hiệu / chữ trên vàng / link |
| `--metal-gold-hi` / `-lo` / `-hover-hi` / `-hover-lo` / `--metal-edge` | `#E6C064` / `#C29535` / `#F0CD72` / `#CFA23F` / `#8C622B` | Nút M2 |
| `--border-subtle` / `--border-control` / `--border-ornament` | `#28364B` / `#6D7F99` / `#8C622B` | Chia khối / viền field và control / trang trí |
| `--focus-ring` / `--focus-offset` | `#9BC7FF` / `#080B12` | Ring 3px, offset tối 2px |
| `--status-info` / `-bg` | `#92C5FF` / `#0E2035` | Thông tin, chưa kích hoạt |
| `--status-success` / `-bg` | `#82D5AA` / `#11261E` | Kết quả đã được server xác nhận |
| `--status-warning` / `-bg` | `#F0A35E` / `#2B2212` | Chờ xử lý, sắp hết hạn; hue 28°, tách khỏi vàng thương hiệu 42° |
| `--status-danger` / `-bg` | `#FF9A99` / `#30191D` | Lỗi, thu hồi, thao tác phá hủy |
| `--status-neutral` | `#B8C1CF` | Thông tin trung tính |
| `--disabled-bg` / `--disabled-text` | `#1A2433` / `#8E97A5` | Control vô hiệu |

**Tương phản trên màu đặc** (tính theo công thức WCAG ngày 2026-10-13; composite trên ảnh, hover, alpha vẫn phải đo khi render):

| Cặp | Tỉ lệ |
| --- | --- |
| Chính / secondary / muted trên panel | 15.58 / 10.20 / 6.92 |
| Muted trên raised | 6.00 |
| Chữ tối trên nút vàng: `#E6C064` / `#C29535` / hover `#CFA23F` | 11.33 / 7.16 / 8.34 |
| Disabled chữ / nền | 5.30 |
| Link `#FFD978` trên panel | 13.57 |
| Info / success / warning / danger trên nền trạng thái | 9.13 / 9.13 / 7.54 / 8.06 |
| Viền control trên page / panel | 4.82 / 4.52 |
| Focus ring trên page | 11.25 |

**Cặp cấm cho chữ:** kem trên vàng (1.87); bronze làm chữ trên panel (3.42). Focus ring cạnh nút vàng chỉ đạt 1.27, vì vậy MUST có offset tối 2px.

Warning và vàng thương hiệu có độ sáng gần nhau (1.07:1), nên trạng thái phân biệt bằng hue, nền trạng thái, icon và nhãn chữ — không bao giờ chỉ bằng màu.

### Typography

| Vai trò | Font | Cỡ / line-height |
| --- | --- | --- |
| Hero | Noto Serif Display 700 | `clamp(2rem, 4.2vw, 3.5rem)` / ≥ 1.2; được xuống dòng |
| Tiêu đề editorial | Noto Serif Display 600 | 24–36px / ≥ 1.3 |
| Tiêu đề trang tài khoản/quản trị | Be Vietnam Pro 600 | 24–28px / ≥ 1.35 |
| Tên sản phẩm, tên gói | Be Vietnam Pro 600 | 18–20px / ≥ 1.4 |
| Body, input, nhãn control | Be Vietnam Pro 400/500/600 | 16px / ≥ 1.5 |
| Bảng, chữ phụ | Be Vietnam Pro 400/500 | 14px / ≥ 1.4; không nhỏ hơn |
| Giá nhấn mạnh | Be Vietnam Pro 600 | 24–32px / ≥ 1.3 |
| Nội dung chuyển khoản | Be Vietnam Pro 600 | 20px; giữ letter-spacing bình thường |

- Chỉ hai họ font, tự host WOFF2 kèm OFL. Serif chỉ dùng từ 24px trở lên; bảng, form, giá luôn dùng Be Vietnam Pro.
- **Đã kiểm trên file google/fonts ngày 2026-10-13:**
  - Noto Serif Display (variable `wght` 100–900, `wdth`) và Be Vietnam Pro (static) đủ chữ tiếng Việt và ký hiệu ₫.
  - Be Vietnam Pro **không có** tính năng `tnum` (chữ số rộng 385–710 đơn vị), nên `tabular-nums` không có tác dụng. Cột tiền canh phải, cùng một định dạng; không dựa vào số thẳng hàng tuyệt đối.
  - Kiểm lại trên đúng file WOFF2 sẽ ship.
- **Cấm:** Cinzel và Marcellus (đã kiểm: thiếu ư, ơ, ế, ệ, ₫), mọi font thiếu tiếng Việt, font bút lông giả Hán.
- Chỉ ship các weight đã liệt kê; không synthetic bold/italic; preload tối thiểu face quan trọng của route.
- Letter-spacing không vượt 0.02em. Không chữ gradient, glow, emboss; không cắt dấu vì fixed height hoặc `overflow: hidden`.
- **Định dạng:** tiền bằng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` → `123.456 ₫`; thời gian “14:05, 14/10/2026”, múi giờ `Asia/Ho_Chi_Minh` (lưu UTC). Chuẩn hóa NFC dữ liệu nhập.
- **Chuỗi kiểm thử** (NFC và NFD): `Đã chuyển khoản`, `Bản quyền chưa kích hoạt`, `Ngũ đại thế giới`, `123.456 ₫`, `CHINH PHỤC NGŨ ĐẠI THẾ GIỚI`, `Auto Võ Lâm Mobile 1`.

### Khoảng cách, bo góc, độ nổi, lớp

- Thang khoảng cách: 4, 8, 12, 16, 24, 32, 48, 64, 96px (viết bằng rem).
- Container công khai 1200px; gutter 16 / 24 / 32px; đoạn văn dài tối đa ~68ch. Section 48px (mobile) / 64px (desktop).
- Radius: 4px chi tiết nhỏ, 6px control, 8px panel, 12px dialog/drawer. Dạng pill chỉ dành cho nhãn trạng thái.
- Ba mức độ nổi: phẳng, panel nổi, overlay. Lớp: base 0, sticky 20, dropdown 30, overlay 40, toast 50. Toast không che focus hay nội dung dialog.

### Chuyển động

- Phản hồi UI 150–240ms; liệt kê rõ thuộc tính được animate, không `transition: all`; ưu tiên opacity/transform.
- Không parallax, tilt, nội dung ẩn chờ cuộn, scroll hijack, loader điện ảnh; không animate chữ số giá.
- Framer Motion chỉ dùng ở các leaf tương tác thật sự cần (drawer, dialog); hover/focus thường dùng CSS.
- Reduced motion tắt toàn bộ chuyển động không gian và trang trí; trạng thái và focus vẫn rõ.

### Hình ảnh và icon

- **Hero:** một cảnh có tiền, trung, hậu cảnh. Cung điện/núi tiên và chiến binh có thứ bậc rõ, không ghép mọi motif. Ánh sáng dẫn mắt về khu chữ; không đặt mặt người hay mũi vũ khí sau headline.
- **Mỗi game:**
  - Admin tải một ảnh gốc ≥ 1600px và đặt tiêu điểm; hệ thống suy ra ba crop: 3:4 (thẻ dọc), 1:1 (thẻ ngang, menu), 16:10 (cover). CMS xem trước cả ba.
  - Năm artwork phải khác nhau thật sự (không đổi hue một ảnh). Nhân vật MU chỉ dùng cho Auto MU Lục Địa VNG.
- **Icon:** một bộ outline duy nhất, nét 1.5px ở cỡ 24px; dùng cỡ 16/20/24. Không emoji cho trạng thái thanh toán/bản quyền. Icon trang trí `aria-hidden`; icon-only control có tên truy cập.
- **Ledger tài sản:** nguồn, tác giả/chủ quyền, quyền sử dụng, ngày, đường dẫn. Không hotlink, không logo/ảnh game chưa có quyền. Ảnh generated ghi provenance và điều kiện sử dụng.

## 7. Component

Hợp đồng dự kiến cho `src/shared/ui/` và UI của từng module — không phải thêm thư viện component.

| Component | Cấu trúc | Hành vi bắt buộc |
| --- | --- | --- |
| Button / LinkButton | primary (M2), outline, ghost, danger | Thao tác dùng `button`, điều hướng dùng link; primary ≥ 44×44; loading giữ nhãn và kích thước, chống submit trùng |
| Field / Select | label, input, hint, error | Lỗi inline + `aria-describedby`, focus lỗi đầu tiên; đúng `autocomplete`/`inputmode`; không chặn dán |
| CodeInput | 6 ô hoặc 1 ô `inputmode="numeric"` `autocomplete="one-time-code"` | Dán cả mã được; “Gửi lại mã” sau 60 giây |
| Dialog / Drawer | tiêu đề, nội dung, hủy/xác nhận | Giữ và trả focus; Escape khi an toàn; nêu rõ đối tượng và hậu quả; không lồng modal |
| Navigation / Dropdown | menu desktop, drawer | Bàn phím và cảm ứng đầy đủ; cùng nhãn/route; giữ focus khi đổi layout |
| GameCard | §5 | Hai biến thể dọc/ngang cùng thứ tự thông tin; không có nhãn “Đề xuất” |
| OfferSelector | radio group, khối dùng thử riêng | Không chọn sẵn gói đắt; chọn không submit |
| Price | số nguyên VND đã xử lý ở domain; giá gốc khi có khuyến mãi | Không suy giá gói custom; canh phải trong bảng |
| StatusLabel | nhãn chữ + icon + token ngữ nghĩa | Mỗi trục (đơn/thanh toán/bản quyền/phần mềm) một nhãn riêng |
| PaymentQR | ảnh PNG VietQR từ server, nút “Lưu ảnh QR”, chú thích | Cùng snapshot với các trường chữ. “Lưu ảnh QR” dùng Web Share với file PNG khi trình duyệt hỗ trợ (iOS mở được “Lưu hình ảnh” vào Ảnh), nếu không thì tải file; kèm gợi ý “hoặc nhấn giữ ảnh để lưu”. Lỗi tạo QR → vẫn còn chuyển khoản thủ công |
| CopyValue | nhãn, giá trị đầy đủ, nút sao chép, phản hồi | “Đã sao chép …”; clipboard lỗi → cho chọn thủ công; không toast thành công giả |
| OrderStatus | ba dòng: đơn, thanh toán, bản quyền + bước tiếp | Dữ liệu từ server; không thanh tiến trình giả |
| PendingOrderBanner | mã đơn, game/gói, link | Hiện ở trang sản phẩm và Phần mềm của tôi |
| LicenseRow | mã tham chiếu, trạng thái, hạn, x/N máy, hành động | Hai bản quyền cùng game phân biệt được; tải không cần xem mã |
| DeviceList | tên máy (sửa được), đăng ký, lần dùng cuối, gỡ | Gỡ máy cần xác nhận lại mật khẩu, quay về đúng bản quyền |
| PaymentConfirmPanel | snapshot, mã giao dịch, thời điểm, số tiền, lý do có điều kiện | Lệch tiền chuyển sang luồng đối soát; chống bấm hai lần |
| ReceiptWorkbench | khoản tiền, đơn gợi ý, số dư, lịch sử, hành động | Áp dụng / duyệt muộn / hoàn trả tách biệt; xung đột dữ liệu thì làm mới, không tự gửi lại |
| DataTable / Pagination | bảng ngữ nghĩa; mobile tóm tắt + chi tiết | Không giảm cỡ chữ; định danh, trạng thái, số tiền, hành động luôn truy cập được; bộ lọc nằm trong URL |
| TicketThread | trạng thái, tin nhắn chữ thuần, form trả lời | Chỉ chủ sở hữu; không đính kèm |
| Empty / Error / Toast | tiêu đề ngắn, giải thích, hành động | Lỗi tiền/quyền là thông báo inline bền, không chỉ toast |

- `tokens.css` giữ giá trị; primitive giữ hình học và trạng thái; CSS module giữ M1–M4 cho vùng được phép; module UI ghép nghiệp vụ; route chỉ ghép trang.
- Không prop kiểu `fantasy=true`; không theme riêng cho từng game.
- Primitive host (môi trường test riêng) trình bày đủ default, hover, focus, active, loading, error, disabled và nội dung dài; không đưa showcase vào ứng dụng chính.

## 8. Hành trình J1–J6

Nguồn duy nhất cho hành trình; quy tắc nghiệp vụ tham chiếu `galaxy-auto.md`.

### J1 · Mua gói

Chọn game → chọn gói → “Mua gói” → (đăng nhập/đăng ký + mã 6 số trên cùng tab) → `/thanh-toan` kiểm tra lại → “Tạo đơn chuyển khoản” → `/don-hang/[ma]` → lưu QR, chuyển khoản → “Tôi đã chuyển khoản” → admin xác nhận → email + Phần mềm của tôi.

- Xem giá không cần đăng nhập. `next` giữ sản phẩm, gói và ý định (mua/dùng thử/gia hạn); server kiểm tra lại giá và điều kiện trước khi tạo đơn (R3).
- Đã có đơn chờ cho cùng gói và cùng ý định → mở lại đơn đó, không tạo đơn mới (R3).
- Giá thay đổi → hiện khác biệt và xin xác nhận lại; không tự đổi gói.
- Chỉ dẫn chuyển khoản là snapshot của đơn; đổi cấu hình ngân hàng không ảnh hưởng đơn đã tạo. Sao chép thành công không có nghĩa là chuyển khoản thành công.

### J2 · Dùng thử

Khối “Dùng thử” → đăng nhập đã xác thực → xác nhận thời hạn/số máy/quy tắc → nhận bản quyền ngay → Phần mềm của tôi.

- Không đơn chờ, không thông tin ngân hàng, không QR. Bấm lại cùng request trả về đúng bản quyền đã cấp (R5).
- Đã dùng: nêu rõ và link tới bản quyền cũ. Cờ `trials` và `sales` độc lập (R7). Giá “Từ …” không tính gói dùng thử.

### J3 · Đơn và thanh toán — góc nhìn khách

| Tình huống | Hiển thị | Hành động |
| --- | --- | --- |
| Chờ thanh toán, chưa báo | Đơn: Chờ thanh toán · Thanh toán: Chưa có thông báo | QR, chỉ dẫn, “Tôi đã chuyển khoản”, “Hủy đơn” |
| Đã báo (đơn đang chờ, đã hủy hoặc hết hạn) | Thanh toán: Đã ghi nhận thông báo chuyển khoản — chưa xác nhận tiền. Đơn giữ nhãn trạng thái riêng | Mã đơn, Hỗ trợ. Nếu đơn hết hạn: “Không chuyển lại chỉ vì đơn đã hết hạn. Liên hệ hỗ trợ để kiểm tra khoản đã chuyển.” |
| Khoản tiền gắn với đơn nhưng cần đối soát | Thanh toán: Cần đối soát + lý do an toàn (ví dụ “Số tiền nhận khác số tiền của đơn”) | Hỗ trợ (điền sẵn đơn); không gợi ý chuyển bù |
| Hủy/hết hạn, chưa báo, chưa có khoản tiền | Đơn: Hết hạn thanh toán hoặc Đã hủy | “Tạo đơn mới” + “Nếu đã chuyển khoản, liên hệ hỗ trợ trước khi tạo đơn mới.” |
| Đã thanh toán | Đơn: Đã thanh toán lúc … · Bản quyền BQ-… | “Đến Phần mềm của tôi”, “Tải phần mềm”, “Hướng dẫn kích hoạt” |
| Có hoàn trả/hoàn tiền | Thêm dòng lịch sử: “Đã hoàn trả 50.000 ₫ (một phần) ngày …” | Trạng thái đơn và bản quyền không tự đổi |

- Báo chuyển khoản → đơn hết hạn → tải lại trang: thông báo vẫn còn. Khoản tiền chưa gắn với đơn của khách chỉ admin thấy.
- Hạn thanh toán do server quyết định, hiển thị ngày giờ kèm múi giờ; không đếm ngược.

### J4 · Sử dụng, thiết bị, gia hạn

- Bản quyền hợp lệ chưa kích hoạt: “Chưa kích hoạt”, tải được và hạn chưa chạy. Đã thanh toán hoặc đã tải không có nghĩa là “Đang hiệu lực”.
- Trạng thái, hạn và số máy (đã đăng ký/tối đa) hiển thị riêng. Số máy là số máy đã đăng ký, không phải số phiên game chạy cùng lúc.
- **Xem mã bản quyền:**
  - Lần đầu cần xác nhận lại mật khẩu; trong 10 phút sau đó xem lại cùng bản quyền không cần nhập lại (R7).
  - Gỡ máy luôn cần xác nhận mới. Xác nhận xong quay về đúng bản quyền và thao tác đang làm, không tự thực hiện thao tác khác.
- **Gia hạn:**
  - Mở từ đúng hàng bản quyền. Màn xác nhận ghi mã tham chiếu, hạn hiện tại, thời hạn thêm, số máy, giá.
  - Câu quy tắc: “Hạn mới = thời điểm muộn hơn giữa lúc thanh toán được duyệt và hạn hiện tại, cộng thời hạn gói.” (công thức tại R5).
  - Bản quyền đã hết hạn: “Thời gian gia hạn bắt đầu khi thanh toán được duyệt, không phải lần mở phần mềm tiếp theo.”
  - Hạn mới là “dự kiến” cho tới khi duyệt; sau khi duyệt hiển thị hạn thực tế. Đổi số máy là “Mua bản quyền mới”.
- Bản quyền bị tạm khóa/thu hồi trong lúc chờ duyệt → khoản tiền chuyển sang “Cần đối soát” (J3), không hiện màn thành công.

### J5 · Quản trị xác nhận và đối soát

1. **Mặc định — bắt đầu từ đơn:** Việc cần xử lý → đơn đã báo chuyển khoản → kiểm tra app ngân hàng → nhập mã giao dịch và thời điểm nhận → “Xác nhận đã nhận tiền” → hộp thoại xác nhận → kết quả từ server.
2. **Lệch tiền hoặc chưa biết đơn:** “Nhập khoản tiền đã nhận” → hệ thống gợi ý đơn khớp chính xác mã → so sánh tài khoản/mã/số tiền/điều kiện → “Áp dụng vào đơn” hoặc “Duyệt muộn” (bắt buộc lý do).
3. **Đã hoàn trả tiền ngoài hệ thống:** “Ghi nhận đã hoàn trả” với số tiền, mã giao dịch chuyển đi, lý do; số dư cập nhật; khoản đã hoàn trả hết không áp dụng được nữa.
4. “Ghi nhận hoàn tiền đơn đã thanh toán” và “Thu hồi bản quyền” là hai thao tác riêng, xác nhận riêng, hậu quả ghi rõ.

- Duyệt muộn, hoàn trả, hoàn tiền, thu hồi yêu cầu xác nhận lại (mật khẩu + mã 2 lớp). Xác nhận khoản khớp đúng hạn chỉ cần phiên quản trị 2 lớp và hộp thoại xác nhận (R7).
- Không ghép mờ, không sửa giá dự kiến, không chuyển tiền thật khi bấm “ghi nhận”. Xung đột đồng thời → làm mới số dư và hỏi lại, không tự gửi lại.

### J6 · Hỗ trợ, nội dung, cấu hình, email

- Hỗ trợ dùng FAQ, liên hệ công khai và yêu cầu hỗ trợ. Khi tắt tạo yêu cầu mới, yêu cầu cũ vẫn trả lời được và trang hiện kênh liên hệ khác.
- Xem trước CMS: crop desktop/mobile, alt, đoạn chữ dài, trạng thái chưa cấu hình. Bản nháp không lọt vào cache công khai.
- Bật/tắt cờ chức năng có mô tả tác động chính xác và lý do được ghi audit; tắt menu không đổi quyền đã mua.
- **Email giao dịch** (R8): đơn đã tạo · đã duyệt và cấp bản quyền · đã gia hạn · sắp hết hạn (trước 3 ngày). Tiếng Việt, chữ thuần, không chứa mã bản quyền, có link tới đúng trang.

## 9. Trạng thái dùng chung

| Trạng thái | Hiển thị | Không làm |
| --- | --- | --- |
| Đang tải | Skeleton đúng hình học hoặc “Đang tải…” | Hiện 0 ₫ hoặc badge thành công tạm |
| Đang gửi | Nhãn hành động + tiến trình ngắn; giữ dữ liệu form | Báo thành công trước khi server trả lời |
| Trống hợp lệ | Giải thích ngắn + hành động hợp lệ | Dữ liệu giả, biểu đồ số 0 |
| Chưa cấu hình | “Chưa mở bán” / “Chưa có thông tin” đúng trường | Suy ra giá, tương thích hay miễn phí |
| Lỗi nhập | Lỗi sát field, cách sửa, giữ dữ liệu | Toast chung rồi xóa form |
| Hết phiên | Đăng nhập lại, giữ ý định an toàn | Tự chạy lại thao tác nhạy cảm sau khi đăng nhập |
| Bị chặn | Lý do bằng chữ, lối đi khác nếu có | Nút disabled không giải thích; hẹn giờ tự bịa |
| Mất mạng | “Chưa thể cập nhật trạng thái mới…” + Thử lại | Tạo lại đơn; coi timeout là chuyển tiền thất bại |
| Dữ liệu cũ | Giá/số dư mới + yêu cầu xác nhận lại | Âm thầm áp dụng giá trị khác |
| Thành công | Kết quả đã xác nhận + bước tiếp theo | Màn ăn mừng che nút tải phần mềm |

## 10. Giọng văn

- Toàn bộ nội dung bằng tiếng Việt; ngoại lệ là tên thương hiệu, tên game, số phiên bản, mã định danh.
- Nhãn hành động cụ thể (“Mua gói”, “Tạo đơn chuyển khoản”, “Tải phần mềm”, “Gia hạn”, “Xem mã bản quyền”); tránh “Tiếp tục” khi người dùng không biết hậu quả.
- “Thông báo đã chuyển khoản” ≠ “Đã nhận tiền” ≠ “Đã cấp bản quyền” ≠ “Đang hiệu lực”; không gộp thành “Thành công”.
- Lỗi nói rõ điều gì đã xảy ra, điều gì chưa xảy ra và cách xử lý. Thông báo đăng nhập/đặt lại mật khẩu không tiết lộ email có tồn tại hay không.
- Chỉ nêu mốc thời gian có thật; không “chỉ còn 2 phút”, “duyệt trong 30 giây”, “nhiều người đang xem”.
- `[giá]`, `[mã đơn]`… là chỗ chờ dữ liệu, không được ship nguyên dạng; không lorem ipsum.

| Tình huống | Copy |
| --- | --- |
| Chưa có gói trả phí | Chưa mở bán. Thông tin gói sẽ hiển thị khi được cấu hình. |
| Mã xác thực | Nhập mã 6 số vừa gửi tới [email]. Không nhận được? Gửi lại sau [giây] giây. |
| Đơn chờ trùng | Bạn đang có đơn chờ thanh toán cho gói này. |
| Lưu QR | Mở ứng dụng ngân hàng, chọn Quét QR rồi chọn ảnh vừa lưu. |
| Nội dung chuyển khoản | Giữ nguyên nội dung [mã]. Ngân hàng có thể tự thêm chữ vào nội dung; điều này không ảnh hưởng. |
| Sao chép | Đã sao chép nội dung chuyển khoản. |
| Đã báo chuyển khoản | Đã ghi nhận thông báo chuyển khoản. Khoản tiền vẫn đang chờ xác nhận. |
| Giá thay đổi | Giá gói đã thay đổi. Vui lòng kiểm tra lại tổng tiền trước khi xác nhận. |
| Chưa kích hoạt | Thời hạn sử dụng bắt đầu từ lần kích hoạt đầu tiên. Tải phần mềm không bắt đầu tính hạn. |
| Phần mềm đang cập nhật | Phần mềm đang được cập nhật theo bản game mới. Xem mục Cập nhật trước khi mua. |
| Mất mạng | Chưa thể cập nhật trạng thái mới. Không tạo lại đơn hoặc chuyển thêm tiền trước khi kiểm tra. |
| Đã ghi nhận hoàn trả (admin) | Đã ghi nhận khoản hoàn trả thực tế. Thao tác này không tự chuyển tiền hoặc thu hồi bản quyền. |
| Email sắp hết hạn — tiêu đề | Bản quyền [mã tham chiếu] ([tên game]) hết hạn ngày [ngày] |

## 11. Accessibility

Mục tiêu WCAG 2.2 AA cùng các tiêu chí dự án nêu dưới đây; là mục tiêu nghiệm thu, chưa phải kết quả.

- Chữ thường ≥ 4.5:1, chữ lớn ≥ 3:1, chỉ báo control/trạng thái ≥ 3:1 với màu kề. Đo cả hover, selected, disabled và chữ trên ảnh.
- Trạng thái và lỗi luôn có chữ; không dùng glow thay focus; không bỏ outline khi chưa có thay thế.
- Mỗi trang một h1, heading đúng cấp; landmark header/nav/main/footer; skip link; ưu tiên HTML ngữ nghĩa trước ARIA.
- Bàn phím dùng được dropdown, radio gói, dialog, drawer, bảng, phân trang; focus trả về nút đã mở.
- Nút mua/sao chép/tải/gia hạn/lưu QR ≥ 44×44px (tiêu chí dự án); control khác đạt mức AA 24px. Sticky UI không che control đang focus hoặc lỗi.
- Hint không chỉ nằm trong placeholder; nhiều lỗi thì có tóm tắt lỗi; không chặn dán hay trình quản lý mật khẩu; live region chỉ đọc khi trạng thái thay đổi.
- Giữ zoom trình duyệt; kiểm tra zoom 200%, reflow 320px, tên dài, dấu NFD, bàn phím ảo trên mobile.
- Chữ trong ảnh không thay chữ DOM; ảnh trang trí không gây nhiễu trình đọc màn hình. Reduced motion được test như một chế độ thật.
- Axe chỉ là một nguồn bằng chứng, không thay đi thử bằng bàn phím và kiểm tra hoàn thành tác vụ.

## 12. Responsive

| Độ rộng | Công khai | Tài khoản / quản trị |
| --- | --- | --- |
| < 640px | Thẻ ngang một cột; header có drawer; hero ảnh trên, chữ dưới | Một cột; danh sách có nhãn |
| 640–1023px | Thẻ ngang hai cột | Thanh menu bốn mục; bảng chuyển thành tóm tắt + chi tiết |
| 1024–1199px | Thẻ ngang hai cột; header vẫn dùng drawer | Sidebar khách 240px; quản trị dùng drawer |
| ≥ 1200px | Năm thẻ dọc một hàng; menu đầy đủ; container 1200px | Sidebar quản trị 256px |

- Breakpoint: 640, 1024, 1200. Kiểm tra ở 320, 375, 768, 1024, 1199, 1200, 1280, 1440px.
- Thông tin quyết định mua giữ cùng thứ tự DOM ở mọi bố cục. Giá, số máy, mã đơn không bao giờ biến thành icon; nhãn được xuống dòng, không giảm xuống 10–12px.
- Thanh CTA cố định ở mobile là MAY: phải có `safe-area-inset-bottom` và khoảng đệm cuối trang, không đè lỗi/bàn phím; không đạt thì để CTA trong dòng nội dung.
- Bảng quản trị dày MAY cuộn ngang trong vùng có tên; cột bị ẩn ở dạng tóm tắt phải xem được trong chi tiết bằng click/bàn phím. Không cuộn ngang toàn trang.

## 13. Ràng buộc triển khai

- Stack, ranh giới module, cache và bảo mật theo R9–R11 của plan. Không thêm thư viện UI, icon, animation hay font chỉ để đạt hiệu ứng; mã hóa QR là dependency duy nhất được duyệt thêm (R10).
- **Ngân sách hiệu năng:**
  - JS công khai ban đầu ≤ 200KiB gzip; ảnh hero mobile ≤ 350KiB; LCP lab ≤ 2.5s; CLS ≤ 0.1; độ trễ tương tác đo lab ≤ 200ms.
  - Đo trên production build; không suy ra INP thực tế từ lab.
  - Không cắt nội dung, glyph hay artwork để lấy điểm.
- Artwork AVIF/WebP responsive, có width/height; ảnh hero (LCP) không lazy, ảnh dưới màn hình đầu lazy. Vật liệu không dùng canvas, WebGL hay video.
- **Bàn giao của task 4, trước khi viết component:**
  - `docs/design/journeys.md` (J1–J6 đối chiếu DTO của task 2).
  - `docs/design/wireframes/` cho mobile và desktop: trang chủ, trang sản phẩm có gói + dùng thử, đơn có QR, đơn đã báo rồi hết hạn, Phần mềm của tôi với hai bản quyền cùng game, xác nhận gia hạn, xác nhận tiền từ đơn, đối soát khoản lệch.
  - `docs/design/ux-acceptance.md` (D01–D23 → task/test).
  - Ledger tài sản/font và bằng chứng kiểm tra glyph/tương phản.
  - Review độc lập trước task 5.

## 14. Gate nghiệm thu

Mỗi gate pass/fail riêng; không điểm tổng hợp nào ghi đè một gate fail. Bằng chứng gồm: mã gate, route/trạng thái, viewport, lệnh và exit code, ảnh chụp/trace, kết luận.

| ID | Đạt khi | Ca phải bắt được | Task |
| --- | --- | --- | --- |
| D01 | Copy seed đúng §1; CMS sửa được giữ nguyên; chữ là DOM | Khôi phục copy cũ, chữ nằm trong ảnh | 4, 13, 24 |
| D02 | Đúng năm danh mục, trang riêng, artwork khác nhau, dữ liệu độc lập | Thẻ thứ sáu; giá game A đổi game B | 7, 13, 14 |
| D03 | Mọi gói cùng cấu trúc thời hạn/máy/giá/quy tắc; giá “Từ” không tính dùng thử | Thiếu số máy, “Từ 0 ₫”, nhãn đề xuất không nguồn | 2, 7, 14 |
| D04 | Mã 6 số trên cùng tab; quay về đúng ý định; server kiểm tra lại | Mất gói sau xác thực; tự gửi giá cũ | 3, 14, 15 |
| D05 | Dùng thử không có bước ngân hàng; bấm lại không cấp trùng; cờ độc lập | Tạo đơn chờ; tắt bán làm tắt dùng thử | 11, 14, 19 |
| D06 | Báo chuyển khoản → hết hạn → tải lại vẫn giữ thông báo, không thúc chuyển lại | Coi thông báo là xác nhận tiền | 9, 15, 19 |
| D07 | Duyệt muộn hợp lệ cho kết quả đúng một lần | Đơn/bản quyền mới khi tải lại hoặc polling | 10, 15, 19 |
| D08 | Tải phần mềm khi chưa kích hoạt không chạy hạn, không bắt xem mã | Tải làm đổi `activated_at` | 12, 16, 19 |
| D09 | Gia hạn đúng một trong hai bản quyền; tách hạn dự kiến/thực tế; máy nhận diện được (tên, ngày đăng ký, lần dùng cuối) | Gia hạn nhầm bản quyền; đổi số máy ngầm; danh sách máy chỉ có UUID | 11, 15, 16, 19 |
| D10 | Xác nhận khoản khớp ngay trên trang đơn; gợi ý chỉ khớp chính xác; hoàn trả một phần/toàn bộ qua UI | Phải sửa DB; ghép mờ; áp dụng khoản đã hoàn trả | 10, 17, 19 |
| D11 | Chỉ M0 dưới dữ liệu tiền/quyền; M1–M4 đúng vùng | Glass, texture hay glow dưới số tiền, form, bảng | 4, 5, 15–17, 21 |
| D12 | Font đúng vai trò; glyph tiếng Việt và ₫ có trong WOFF2 ship; cột tiền canh phải, đọc đủ | Serif trong bảng; synthetic weight; dấu bị cắt | 4, 5, 21, 22 |
| D13 | Tương phản thực tế đạt; warning phân biệt được với vàng thương hiệu | Chữ kem trên vàng; chữ bronze; mất focus ring trên nút vàng | 4, 5, 21 |
| D14 | Hoàn tất tác vụ bằng bàn phím; ngữ nghĩa và ARIA đúng | Focus bị sticky che; icon không tên; thao tác chỉ có khi hover | 5, 14–17, 21 |
| D15 | Nút chính 44px; reflow 320px; zoom 200%; bàn phím ảo không che lỗi | Giảm cỡ chữ để nhét bảng; cuộn ngang trang | 5, 13–17, 21 |
| D16 | Reduced motion giữ nội dung và phản hồi | Nội dung vô hình khi tắt animation | 5, 13, 21 |
| D17 | Thiếu nội dung → trạng thái trung thực, gọn | Tính năng, đánh giá, số liệu giả; nhiều section trống | 7, 13, 14, 18, 21 |
| D18 | Dữ liệu theo chủ sở hữu; API trực tiếp vẫn có guard; thanh toán và bản quyền độc lập | Thấy khoản tiền của người khác; hoàn tiền tự thu hồi | 3, 10–12, 15–20 |
| D19 | Ngân sách hiệu năng đo trên production | Dùng điểm dev; bỏ nội dung để lấy điểm | 21, 22, 24 |
| D20 | Quyền tài sản và provenance ghi đủ; trạng thái ảnh tham chiếu trung thực | Tự nhận đã khớp ảnh thiếu | 4, 6, 21, 23, 24 |
| D21 | Payload VietQR khớp snapshot (BIN, tài khoản, số tiền, nội dung); vector CRC đúng; giải mã vòng lại được; “Lưu ảnh QR” chạy trên mobile | QR khác số tiền trên chữ; CRC sai | 9, 15, 19 |
| D22 | Không tạo đơn chờ thứ hai cho cùng gói và ý định; khách chỉ hủy được trước khi báo chuyển khoản | Hai đơn chờ với hai nội dung chuyển khoản khác nhau | 9, 15 |
| D23 | Email gửi đúng sự kiện, đúng một lần, tiếng Việt, không chứa mã bản quyền, ngày thật; tắt nhắc hết hạn có hiệu lực | Gửi trùng; email chứa mã; nhắc khi bản quyền đã thu hồi | 8, 19, 23 |

## 15. Câu hỏi mở

Đây là dữ liệu hoặc quyết định còn thiếu, không phải quyền tự bịa nội dung. Chỉ gate tương ứng bị chặn.

- [ ] **Ảnh tham chiếu gốc** (chủ sở hữu): ảnh hưởng crop an toàn cho chữ và composition hero.
- [ ] **Artwork/logo được phép dùng** cho năm game và hero (chủ sở hữu + thiết kế).
- [ ] **Dữ liệu sản phẩm:** phiên bản, tương thích, tính năng, ảnh chụp, file cài đặt (chủ sở hữu sản phẩm).
- [ ] **Gói, dùng thử, giá, khuyến mãi** sẽ mở bán (chủ sở hữu kinh doanh).
- [ ] **Ngân hàng (BIN, tài khoản), liên hệ, ghi chú thời gian xử lý thanh toán, chính sách** đã duyệt (vận hành).
- [ ] **Bù ngày hàng loạt:** khi auto ngừng hoạt động vì game cập nhật, có cộng thêm ngày cho mọi bản quyền của sản phẩm đó không, cộng bao nhiêu, ai duyệt? Chưa thiết kế cho tới khi có quyết định.
