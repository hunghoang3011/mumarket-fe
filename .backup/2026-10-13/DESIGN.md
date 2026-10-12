# Design

## Source of truth

- **Sản phẩm:** GALAXY AUTO — cửa hàng phần mềm Auto Game tiếng Việt, một bên bán, đúng năm danh mục game.
- **Status:** Draft — đặc tả thiết kế để triển khai và nghiệm thu; chưa phải giao diện đã dựng, artwork đã duyệt hoặc kết quả thử nghiệm người dùng.
- **Ngày:** 2026-10-12.
- **Phạm vi:** storefront, năm trang sản phẩm, bảng giá, nội dung/hỗ trợ, xác thực, checkout, tài khoản khách hàng và quản trị.
- **Tài liệu nghiệp vụ:** `galaxy-auto.md`, đặc biệt R5–R15. Tài liệu này quy định cách trình bày và tương tác; không thay đổi giá, điều kiện cấp quyền, phép tính hạn, trạng thái DB, xác thực hoặc thao tác tiền.
- **Tài liệu thiết kế chuẩn:** `DESIGN.md` tại root. Không tạo thêm `design.md` với nội dung khác. Khi triển khai sang thư mục đích trong plan, đưa cùng bản đặc tả này vào root dự án; không tự sinh một design system cạnh tranh.

### Bằng chứng đã có và chưa có

| Nguồn | Đã có | Cách sử dụng |
| --- | --- | --- |
| Prompt gốc người dùng cung cấp ngày 2026-10-12 | Có, văn bản trong hội thoại | Nguồn cho Golden Immortal Galaxy, brand copy, đúng năm game, nội dung và phạm vi màn hình |
| Review UX/UI và plan đã sửa | Có, `galaxy-auto.md` | Giữ các ràng buộc dễ dùng, anti-slop, material/font, R14 bảo mật và R15 hành trình |
| Ảnh “previously provided reference image” | Không có trong workspace/hội thoại hiện tại | Không tuyên bố đã xem, khớp ảnh hoặc đạt pixel fidelity; cần bổ sung trước khi duyệt artwork cuối |
| Code, route, component, CSS token, font WOFF2, ảnh sản phẩm | Chưa có trong workspace này | Tất cả đường dẫn triển khai trong tài liệu là đường dẫn dự kiến, không phải bằng chứng code tồn tại |
| Screenshot, wireframe trực quan, Storybook, Playwright baseline | Chưa có | Bố cục dưới đây là hợp đồng bằng văn bản; task 4 phải dựng composition/wireframe để review |

### Quyết định dung hòa các yêu cầu

1. **Golden Immortal Galaxy là nhận diện chính.** Khôi phục slogan và các headline gốc. Cung điện Trung Hoa, núi tiên, thiên hà xanh đen và ánh sáng vàng thuộc artwork công khai; không thay thế toàn bộ nhận diện bằng lâu đài phương Tây hoặc một template MU tối.
2. **Tinh thần MU là ảnh hưởng bổ trợ:** độ chắc của kim loại, nét khắc, chiều sâu tương phản và artwork của đúng sản phẩm MU. Không dùng nhân vật MU cho các game Võ Lâm; không trộn biểu tượng văn hóa ngẫu nhiên vào một ảnh.
3. **Review “dễ dùng, tiện dùng, không AI slop” vẫn bắt buộc.** Glass/gold/glow được phân vùng và giới hạn, không bị cấm hoàn toàn cũng không được phủ lên mọi control.
4. **Thẩm quyền theo phạm vi:** yêu cầu mới nhất của người dùng → nghiệp vụ/bảo mật trong plan → hợp đồng trình bày tại đây → tóm tắt visual trong plan → chi tiết triển khai. Không dùng quyết định mỹ thuật để nới điều kiện thanh toán hoặc cấp bản quyền.
5. `galaxy-auto.md` phải được đồng bộ phần brand/visual với tài liệu này. Khi phát hiện mâu thuẫn, sửa đặc tả và test tương ứng trước; không thêm ngoại lệ CSS hoặc lựa chọn ngầm giữa hai hướng.

**Quy ước:** MUST = bắt buộc để nghiệm thu; SHOULD = mặc định, ngoại lệ phải có lý do và bằng chứng; MAY = tùy chọn trong giới hạn. “Premium” không phải tiêu chí đủ: phải chứng minh hierarchy, typography, vật liệu, phản hồi thao tác và nội dung thật.

## Brand

### Tính cách và lời hứa

- Trang trọng, huyền ảo, có chiều sâu; công cụ bán hàng và quản lý vẫn điềm tĩnh, rõ ràng.
- Niềm tin đến từ phiên bản/tương thích có nguồn, gói minh bạch, trạng thái tiền chính xác, lịch sử và hỗ trợ truy cập được; không đến từ huy hiệu bảo mật giả.
- Khách cần hiểu “bán phần mềm gì, cho game nào, giá/thời hạn/thiết bị ra sao” trước khi bị yêu cầu đăng nhập hoặc thanh toán.
- Không giả danh nhà phát hành, không hứa ban-safe, tỷ lệ thành công, chống khóa tài khoản, số người dùng hoặc tốc độ xử lý chưa có bằng chứng.

### Brand copy gốc — một nguồn nội dung

Các giá trị sau là seed/default CMS; không hardcode bản sao trong component. Chỉnh sửa hợp lệ qua CMS không bị QA khôi phục về seed. Headline được phép xuống dòng thích ứng nhưng không tự viết lại chữ.

| Khóa nội dung | Giá trị mặc định |
| --- | --- |
| `brand.name` | GALAXY AUTO |
| `brand.slogan` | Công Nghệ Khai Mở – Chinh Phục Tam Giới |
| `home.hero.title.first` | THẦN BINH CÔNG NGHỆ |
| `home.hero.title.second` | CHINH PHỤC NGŨ ĐẠI THẾ GIỚI |
| `home.hero.subtitle` | Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp & MU. |
| `home.hero.cta.primary` | KHÁM PHÁ PHẦN MỀM |
| `home.hero.cta.secondary` | XEM BẢNG GIÁ |
| `home.products.title` | NGŨ ĐẠI THẾ GIỚI |
| `home.products.subtitle` | Khám phá hệ sinh thái phần mềm được phát triển dành riêng cho từng tựa game. |
| `home.benefits.title` | ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC |
| `home.benefits.items` | Giao diện dễ sử dụng; Tùy chỉnh linh hoạt; Cập nhật phiên bản; Hỗ trợ kỹ thuật |
| `home.purchase.steps` | Chọn tựa game; Lựa chọn gói phần mềm; Thanh toán và nhận License; Tải xuống và kích hoạt |

- CTA hero lần lượt đi `/phan-mem` và `/bang-gia`. Không tự tạo đơn, mở modal đăng nhập hoặc cuộn đến một khu vực không có gói.
- Hai headline và CTA hero là ngoại lệ có chủ đích cho uppercase thương hiệu. Form, bảng, thông báo và nút nghiệp vụ dùng tiếng Việt tự nhiên, không uppercase toàn bộ.
- Dưới bước “Thanh toán và nhận License” MUST có chú thích: **“Bản quyền được cấp sau khi khoản chuyển được xác nhận.”** Không ngụ ý bấm báo chuyển khoản là nhận quyền ngay.
- Bốn benefit là nhãn nội dung gốc, không phải bằng chứng tính năng cụ thể của cả năm phần mềm. Mô tả phụ chỉ xuất bản khi có dữ liệu được chủ sở hữu cung cấp; không tự thêm số liệu, cam kết hay testimonial.
- Slogan/nhãn thơ chỉ dành cho brand/editorial. “Bản quyền”, “Đơn hàng”, “Gia hạn”, “Tải phần mềm” không bị thay bằng tên vật phẩm, nhiệm vụ hoặc cấp bậc fantasy.

### Tránh

Generic gaming template, neon tím, nền đen với mọi viền đều phát sáng, bento/grid không có chức năng, logo wall giả, dashboard có biểu đồ trang trí, kiểu chữ giả Hán/trung cổ khó đọc, badge “Hot/Best seller” không có dữ liệu, countdown gây áp lực, âm thanh/video tự phát.

## Product goals

### Mục tiêu

1. Từ danh mục tìm đúng game và đến vùng chọn gói mà không cần đăng nhập.
2. Trước khi xác nhận mua, đọc được game, giá phải trả, thời hạn, số thiết bị và thời điểm bắt đầu tính hạn ở cùng ngữ cảnh.
3. Dùng thử không bị dẫn vào luồng chuyển khoản; trial không làm giá mua hiển thị “từ 0đ”.
4. Sau chuyển khoản, biết hệ thống đang ghi nhận điều gì, điều gì chưa xác minh và hành động nào tiếp theo; không bị thúc chuyển lại khi đơn hết hạn.
5. Sau cấp quyền, tải phần mềm, đọc hướng dẫn và tìm đúng bản quyền/gia hạn trên một màn làm việc chính.
6. Admin xử lý khoản tiền chưa khớp, duyệt muộn, hoàn trả và thu hồi bằng các thao tác phân biệt rõ, không cần sửa DB.

### Không làm

Không giỏ hàng, đa nhà bán, chợ item, đấu giá, affiliate, chat mới, auto-debit, tự chuyển/hoàn tiền, cơ chế game/client hoặc tính năng AI. Không đổi stack, bổ sung thư viện UI hoặc tạo thêm font để đạt hiệu ứng. Không bịa tính năng/giá/tương thích/chính sách.

### Dấu hiệu thành công

- Hoàn tất các tác vụ U1–U7 của plan trên mobile/desktop; DB và thông báo UI khớp nhau.
- Tất cả trạng thái từ chối có lý do và đường tiếp tục phù hợp, không phải một nút disabled không giải thích.
- Cùng loại dữ liệu/thao tác có cùng vị trí, nhãn và hình thức trên năm sản phẩm.
- Không đạt nghiệm thu chỉ nhờ Lighthouse, screenshot đẹp hoặc một điểm visual trung bình; từng lỗi nghiệp vụ/accessibility quan trọng vẫn chặn.

## Personas and jobs

Đây là giả định phục vụ thiết kế, chưa phải kết quả phỏng vấn hoặc nghiên cứu người dùng.

| Nhóm | Việc cần làm | Nguy cơ thiết kế phải xử lý |
| --- | --- | --- |
| Khách mới dùng điện thoại | Chọn đúng game/gói, đăng ký, chuyển qua ứng dụng ngân hàng rồi quay lại | Mất lựa chọn sau xác thực, copy nhầm nội dung, tưởng đã trả tiền là đã có quyền |
| Khách đã mua | Tải đúng phiên bản, xem hạn và thiết bị, gia hạn đúng license | Nhiều license cùng game khó phân biệt; phải qua nhiều menu hoặc lộ khóa để tải |
| Khách cần hỗ trợ | Tìm đơn/bản quyền và gửi mô tả lỗi đúng ngữ cảnh | Không có đường hỗ trợ khi trạng thái bất thường; bị yêu cầu gửi khóa bí mật |
| Người quản trị | Đối soát tiền, quản lý gói/phát hành/nội dung | Nhầm hoàn trả với thu hồi; stale form; màn quá trang trí làm khó quét dữ liệu |

**Ngữ cảnh mặc định:** tiếng Việt; dark theme; người dùng có thể dùng mạng chậm, zoom, bàn phím hoặc trình đọc màn hình. Không suy ra trình độ kỹ thuật cao chỉ vì họ chơi MMORPG.

## Information architecture

### Điều hướng

- Public header: Trang Chủ, Phần Mềm, Bảng Giá, Hướng Dẫn, Cập Nhật, Hỗ Trợ; thêm Đăng nhập hoặc Phần mềm của tôi theo phiên.
- Phần Mềm mở bằng click/keyboard, không chỉ hover; đúng năm mục, hỗ trợ Escape và trả focus. Mobile dùng drawer có cùng nội dung, không thay tên game bằng icon.
- Footer: thông tin kinh doanh/liên hệ có thật, hướng dẫn, điều khoản, riêng tư, hoàn tiền. Không sinh địa chỉ, hotline hay giấy chứng nhận giả.
- Tài khoản: Phần mềm của tôi là điểm thao tác chính; giữ các route chi tiết để deep-link và xem lịch sử.
- Quản trị: menu theo công việc, không theo tên bảng DB. Tách “Đơn hàng”, “Đối soát thanh toán”, “Bản quyền”; không gom mọi thao tác nhạy cảm vào một nút chung.

### Danh mục cố định

| Tên hiển thị chính xác | Slug |
| --- | --- |
| Auto Võ Lâm Miễn Phí | `vo-lam-mien-phi` |
| Auto Võ Lâm Mobile 1 | `vo-lam-mobile-1` |
| Auto Kiếm Thế Origin | `kiem-the-origin` |
| Auto MU Lục Địa VNG | `mu-luc-dia-vng` |
| Auto Võ Lâm 2.0 PC | `vo-lam-2-pc` |

Một slot sản phẩm mỗi danh mục theo R2; không danh mục thứ sáu, không gom năm game thành một sản phẩm. “Miễn Phí” trong tên không quyết định giá phần mềm.

### Route và mục đích

| Nhóm | Route | Mục đích chính |
| --- | --- | --- |
| Public | `/`, `/phan-mem` | Nhận diện, chọn game; không bắt đăng nhập để xem |
| Sản phẩm | `/phan-mem/[slug]`, `/bang-gia` | Xem thông tin đúng game và chọn gói; giá độc lập |
| Nội dung | `/huong-dan`, `/huong-dan/[slug]`, `/cap-nhat`, `/cap-nhat/[slug]`, `/ho-tro` | Hướng dẫn, phiên bản, FAQ và đường hỗ trợ |
| Chính sách | `/dieu-khoan`, `/quyen-rieng-tu`, `/chinh-sach-hoan-tien` | Nội dung chủ sở hữu cung cấp; thiếu nội dung cần thiết chặn mở bán theo plan |
| Auth | `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`, `/dat-lai-mat-khau`, `/xac-thuc` | Xác thực và trả về intent hợp lệ, không mất gói đã chọn |
| Giao dịch | `/thanh-toan`, `/don-hang/[id]` | Xác nhận snapshot, chỉ dẫn chuyển khoản, theo dõi đơn/đối soát |
| Khách hàng | `/tai-khoan`, `/tai-khoan/phan-mem`, `/tai-khoan/ban-quyen` | Tổng quan, phần mềm đã mua, license/thiết bị |
| Khách hàng | `/tai-khoan/don-hang`, `/tai-khoan/ho-tro`, `/tai-khoan/cai-dat` | Lịch sử, ticket, tài khoản/bảo mật |
| Admin | `/quan-tri`, `/quan-tri/san-pham`, `/quan-tri/phien-ban`, `/quan-tri/goi-gia` | Tổng quan công việc, catalog, phát hành, gói |
| Admin | `/quan-tri/khach-hang`, `/quan-tri/don-hang`, `/quan-tri/thanh-toan`, `/quan-tri/ban-quyen` | Khách, đơn, đối soát/hoàn trả, quyền và thiết bị |
| Admin | `/quan-tri/ho-tro`, `/quan-tri/noi-dung`, `/quan-tri/cau-hinh`, `/quan-tri/nhat-ky` | Ticket, CMS, cấu hình, audit |

### Bố cục chuẩn theo màn

**Trang chủ — thứ tự MUST giữ:**
1. Header/điều hướng.
2. Hero: brand copy gốc, subtitle, hai CTA; một cảnh chính, không intro bắt chờ.
3. Năm sản phẩm: artwork riêng, tên, mô tả có dữ liệu, trạng thái, giá mua từ kèm thời hạn/cap, Mua gói và Xem chi tiết.
4. Bốn benefit gốc: bốn khối nhẹ, không bốn khung vàng/phát sáng độc lập.
5. Bốn bước mua; caption giải thích duyệt thủ công và nhánh dùng thử không thanh toán.
6. Cập nhật đã xuất bản; chưa có thì một thông báo gọn.
7. Footer.

Hero có thể tạo cảm giác điện ảnh bằng bố cục/ánh sáng, không cần cao 100vh. Hai cụm headline là hai khối logic; mobile được xuống thêm dòng để không cắt chữ. Sản phẩm phải đến ngay sau hero, không chèn một dãy banner/đếm số/quote trang trí.

**Trang sản phẩm:**
- Đầu trang: breadcrumb, tên game/phần mềm, artwork đúng game, trạng thái/tương thích, lối đến gói và hướng dẫn.
- Vùng quyết định mua: gói theo thứ tự thời hạn được cấu hình; mỗi gói có duration/cap/final price/start rule. Trial tách khỏi gói trả phí. Tóm tắt gói đang chọn ở cạnh/đầu CTA; chọn radio không tạo đơn.
- Chi tiết: mô tả/tính năng, ảnh chụp, phiên bản phần mềm và game, hướng dẫn cài đặt, download theo quyền, kích hoạt, changelog. Anchor có scroll offset; không tạo anchor trống.
- Thiếu thông tin thiết yếu: ghi rõ từng điều chưa biết. Thiếu screenshot/changelog/tính năng tùy chọn: một thông báo readiness gọn; không xếp nhiều section “đang cập nhật”.
- Desktop có thể dùng summary bên cạnh; mobile dùng cùng thứ tự DOM và summary trong luồng. Sticky mua là tùy chọn, không bắt buộc nếu che nội dung hoặc bàn phím.

**Bảng giá:** nhóm theo đúng năm game, không một bảng giá dùng chung. So sánh essential facts không cần cuộn ngang. Không tự suy ra giá/ngày hoặc giá/tháng của gói custom. Không hiển thị những loại gói admin chưa cấu hình.

**Checkout/đơn hàng:** một cột thông tin chính trên mobile; desktop summary + nội dung thanh toán. Trước submit hiện game, gói, thời hạn, cap, số tiền, quy tắc tính hạn và chính sách có thật. Sau tạo đơn hiện đúng snapshot ngân hàng/giá/mã chuyển; mỗi giá trị có copy riêng. Tách ba nhóm: trạng thái đơn, tình trạng thanh toán, quyền sử dụng.

**Phần mềm của tôi:** nhóm theo sản phẩm, nhưng mỗi license có định danh không bí mật và hành động riêng. Cùng vùng thấy phiên bản tải, trạng thái, hạn, thiết bị, Tải phần mềm, Hướng dẫn, Xem mã bản quyền và Gia hạn khi đủ điều kiện. Không cần reveal key để tải. Màn overview chỉ có dữ liệu/tác vụ thật, không biểu đồ SaaS trang trí.

**Admin đối soát:** danh sách có phân trang → chi tiết receipt và đơn ứng viên → đối chiếu bằng chứng/số dư → hành động có tên rõ → xác nhận/step-up → kết quả từ server. Desktop đặt receipt và đơn cạnh nhau; mobile xếp receipt trước, đơn sau, rồi confirmation. Không đưa quyết định tài chính vào menu icon ba chấm khó thấy.

## Design principles

1. **Một thế giới hình ảnh, một hệ thao tác.** Golden Immortal Galaxy trên mọi shell; artwork khác game nhưng nút/form/giá/trạng thái không đổi quy ước.
2. **Phân cấp bằng thông tin trước trang trí.** Game và trạng thái trước giá; giá phải trả cùng thời hạn/cap; CTA gần dữ liệu quyết định.
3. **Fantasy giảm theo độ nhạy cảm.** Hero nhiều nghệ thuật → sản phẩm có kiểm soát → checkout phẳng → khách/admin thiên về dữ liệu.
4. **Vàng là trọng âm, không phải mặc định cho mọi thứ.** Dành cho brand/action/selected border; thành công/lỗi có token và chữ riêng.
5. **Dễ dùng không có nghĩa bỏ kiểm tra.** Không bỏ step-up, xác nhận, giá snapshot hoặc lý do hoàn trả để giảm số click.
6. **Thành công phải do server xác nhận.** Optimistic UI chỉ dùng cho tương tác không cấp quyền/không ghi nhận tiền; không optimistic paid, refund hoặc revoke.
7. **Không bịa để lấp bố cục.** Empty state tốt hơn doanh số, testimonial, tính năng hay screenshot giả.
8. **Ngôn ngữ bình thường trong nghiệp vụ.** Không dùng chữ “triệu hồi”, “thức tỉnh”, “phong ấn” làm tên thao tác tài khoản/thanh toán.
9. **Có thể đo và bác bỏ.** Mỗi quy tắc trọng yếu có ca âm tính và bằng chứng, không nghiệm thu bằng cảm giác “trông premium”.

## Visual language

### Color — primitive và semantic tokens

Các giá trị dưới đây là baseline thiết kế, không phải stylesheet đã tồn tại. Implementation có một nguồn tại `src/shared/styles/tokens.css`; Tailwind và CSS modules dùng semantic roles, không rải mã màu mới vào JSX. Thay token phải cập nhật tài liệu, contrast check và screenshot chịu ảnh hưởng.

| Primitive | Giá trị | Vai trò |
| --- | --- | --- |
| Cosmic Black | `#080B12` | Nền trang, chữ trên nút vàng |
| Celestial Navy | `#0B1423` | Panel/nền nội dung |
| Imperial Gold | `#D4A843` | Primary CTA, điểm nhấn brand, viền chọn |
| Divine Gold | `#FFD978` | Hover/highlight có giới hạn, link trên nền tối |
| Ancient Bronze | `#8C622B` | Hoa văn/viền trang trí; không body/muted text nhỏ |
| Celestial White | `#F5EBD6` | Chữ chính |

| Semantic token | Giá trị nền tảng | Quy tắc |
| --- | --- | --- |
| `--surface-page` / `--surface-panel` | `#080B12` / `#0B1423` | Nền đặc cho toàn bộ vùng nghiệp vụ |
| `--surface-raised` / `--surface-input` | `#132238` / `#080B12` | Dialog/drawer và field; không dựa chỉ vào chênh nền để nhận biết field |
| `--text-primary` / `--text-secondary` / `--text-muted` | `#F5EBD6` / `#C6C0B5` / `#A5ADBB` | Không giảm opacity tùy tiện trên artwork |
| `--action-primary` / `--action-hover` / `--on-action` | `#D4A843` / `#FFD978` / `#080B12` | Nút vàng luôn chữ tối; focus khác hover |
| `--border-subtle` / `--border-control` | `#28364B` / `#6D7F99` | Subtle chỉ chia khối trang trí; field/state cần control hoặc chỉ báo đủ tương phản |
| `--focus-ring` / `--focus-offset` | `#9BC7FF` / `#080B12` | Ring 3px, offset 2px tối; không đặt ring xanh sát nút vàng rồi mặc định đạt |
| `--status-info` / `--status-info-bg` | `#92C5FF` / `#0E2035` | Thông tin/chưa kích hoạt; không đồng nghĩa đã trả tiền |
| `--status-success` / `--status-success-bg` | `#82D5AA` / `#11261E` | Kết quả thành công đã xác nhận |
| `--status-warning` / `--status-warning-bg` | `#F2C66D` / `#2B2212` | Chờ xử lý/hết hạn; có nhãn cụ thể |
| `--status-danger` / `--status-danger-bg` | `#FF9A99` / `#30191D` | Lỗi/thu hồi/thao tác phá hủy, không dùng cho mọi trạng thái chưa hoàn tất |
| `--status-neutral` | `#B8C1CF` | Thông tin không mang ý nghĩa thành công/thất bại |

**Kiểm tra số học trên màu đặc** (chưa chứng minh UI/artwork đã render): primary/panel ~15.58:1; secondary/panel ~10.20:1; muted/raised ~7.08:1; dark/gold ~8.89:1; control/raised ~3.92:1; info/info-bg ~9.13:1; success/success-bg ~9.13:1; warning/warning-bg ~9.75:1; danger/danger-bg ~8.06:1.

**Cặp cấm cho chữ thường:** cream/gold ~1.87:1; bronze/panel ~3.42:1. Focus blue/gold chỉ ~1.27:1: MUST có offset tối và kiểm tra vùng kề thực tế. Nền texture, alpha, hover và disabled được kiểm tra riêng; ratio của mã màu gốc không tự chứng minh mọi composite đạt.

### Typography

| Vai trò | Family / weight | Kích thước baseline / line-height |
| --- | --- | --- |
| Hero brand | Noto Serif 700 | `clamp(2rem, 4.2vw, 3.5rem)` / >=1.2; cho phép xuống dòng, không ép nowrap |
| Heading editorial public | Noto Serif 600 | 24–36px / >=1.3, không áp cho mọi heading nhỏ |
| Page title tài khoản/admin | Be Vietnam Pro 600 | 24–28px / >=1.35 |
| Product/offer title | Be Vietnam Pro 600 | 18–20px / >=1.4 |
| Body, input, nhãn điều khiển | Be Vietnam Pro 400/500/600 | 16px / >=1.5 |
| Table, supporting text | Be Vietnam Pro 400/500 | 14px / >=1.4; không hạ tiếp để nhét cột |
| Giá nhấn mạnh | Be Vietnam Pro 600 | 24–32px / >=1.3; currency rõ, không để chữ số tách đơn vị |

- Hai font family, không thêm font “medieval” hoặc font monospace chỉ để tạo cảm giác hacker. Mã đơn/transfer reference dùng chữ dễ phân biệt và nút copy; không che/cắt giá trị thiết yếu.
- Chỉ ship weight/subset cần dùng, không synthetic bold/italic. Noto Serif variable hay static tùy asset hợp lệ; không mặc định mọi font đều có variable build.
- WOFF2 tự host, giữ thông báo bản quyền/OFL; glyph Latin, tiếng Việt, số và ký hiệu ₫ phải có trong asset thực tế. Metadata upstream không thay kiểm tra font đóng gói.
- Giá/ngày/số thiết bị theo cột dùng `font-variant-numeric: tabular-nums`. Định dạng tiền qua `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`; không đổi quy tắc số tiền integer trong domain.
- Khoảng cách chữ body/UI bình thường; không kéo tracking để giả sang trọng. Hero/editorial không vượt 0.02em nếu chưa có kiểm tra dấu và xuống dòng.
- Màu chữ chính là màu đặc. Không text-as-image, gradient text cho giá, emboss/glow nhỏ, thin weight trên nền chuyển động hoặc crop dấu bởi fixed-height/overflow hidden.
- Test NFC và NFD: `Đã chuyển khoản`, `Bản quyền chưa kích hoạt`, `Ngũ đại thế giới`, `123.456 ₫`, chữ hoa có dấu và tên game dài.

### Spacing, geometry, radius, elevation

- Scale spacing duy nhất: **4, 8, 12, 16, 24, 32, 48, 64, 96px**; triển khai bằng rem. Không tự tạo khoảng lệch riêng cho mỗi game.
- Public content max-width **1200px**; gutter 16px mobile, 24px tablet, 32px desktop. Đoạn văn dài max-width khoảng 68ch.
- Gap chính: 16px mobile, 24px desktop. Section padding-block mặc định 48px mobile, 64px desktop; không thêm khoảng trắng lớn chỉ để kéo dài trang.
- Radius: 4px cho chi tiết nhỏ, 6px control, 8px panel, 12px dialog/drawer. Chỉ status badge/chip nhỏ dùng pill; không mọi nút đều hình viên thuốc.
- Border thường 1px; decoration không thay focus ring. Elevation chỉ ba mức: flat, raised panel, overlay; shadow nhẹ để phân lớp, không nhiều lớp viền vàng và bóng đen lặp lại.
- Layer scale dự kiến: base 0, sticky 20, dropdown 30, overlay 40, toast 50. Dùng cùng hệ; không thêm z-index 9999 để chữa một lỗi xếp lớp. Toast không che focus hoặc quyết định trong modal.

### Material recipes — ranh giới bắt buộc

| Recipe | Nơi được dùng | Thể hiện | Không được dùng |
| --- | --- | --- | --- |
| M0 · Plain navy | Offer facts, checkout, bank data, account/admin, form/table | Nền đặc, border/divider nhỏ, typography rõ | Texture, blur, glyph khắc hoặc glow dưới dữ liệu |
| M1 · Celestial scene | Hero và artwork sản phẩm phù hợp | Cung điện/núi tiên/thiên hà xanh tối, ánh vàng và khí quyển có chiều sâu | Thành background form, tài khoản hoặc mọi section |
| M2 · Engraved metal | Mép cover, logo frame, divider editorial | Đồng/vàng cổ có cạnh sáng nhỏ; một motif thống nhất | Khung trong khung, tất cả bốn cạnh đều chói, viền dày quanh từng control |
| M3 · Celestial glass | Header public trên hero hoặc một overlay trong hero không chứa dữ liệu nghiệp vụ | Một lớp navy gần đặc, mép sáng nhẹ; blur tối đa 8px nếu dùng | Nested glass, blur toàn viewport, glass dưới giá/trạng thái/field/thông tin ngân hàng |
| M4 · Controlled halo | Selected/hover artwork cover hoặc một điểm sáng hero | Glow tĩnh/bounded, nằm sau artwork và trong component | Pulse loop, rainbow edge, hover làm đổi kích thước layout hoặc rung chữ |

- M3 có nền fallback đặc; MUST đọc được khi tắt backdrop-filter hoặc ảnh sáng nhất nằm phía sau. Khi header rời hero, dùng nền đặc. Không coi blur là cơ chế tạo tương phản.
- Product card có viền vàng mảnh và halo rất nhẹ khi hover/focus đúng tinh thần prompt, nhưng vùng giá/description luôn M0. Không phủ gold fill lên toàn bộ card.
- Dùng tối đa một glass layer và một focal light lớn trong mỗi composition public; không chồng nhiều orb/glow để bù thiếu artwork.
- Account/admin không nhập M1–M4. Một đường nhấn brand và primary action vàng là đủ duy trì nhận diện.
- Texture/formation là phần artwork hoặc pseudo-element trang trí không nhận pointer, không vào accessibility tree; không tạo component tương tác giả.

### Motion

- Phản hồi UI 150–240ms; danh sách thuộc tính transition rõ ràng, không `transition: all`.
- Ưu tiên opacity/transform; không animate layout, blur lớn, box-shadow liên tục hoặc chữ số giá.
- Hover không phải cách duy nhất thấy hành động. Không parallax/tilt theo chuột, reveal-on-scroll làm nội dung ban đầu vô hình, scroll hijack hoặc page loader điện ảnh.
- Framer Motion đã chọn trong stack chỉ ở interactive leaves thực sự cần; CSS xử lý hover/focus thông thường. Không kéo runtime animation vào dashboard cho hiệu ứng nhỏ.
- Reduced motion bỏ spatial/decorative animation, dừng halo/particle/video trang trí nếu có; trạng thái/focus vẫn rõ. Trang này không yêu cầu particle/video tự phát.

### Imagery và iconography

- Hero: một cảnh có tiền/trung/hậu cảnh; cung điện hoặc núi tiên và chiến binh là chủ thể có thứ bậc, không collage mọi motif. Ánh vàng dẫn mắt vào nội dung, không đặt mặt/đỉnh vũ khí sau headline.
- Chuẩn bị crop riêng cho mobile; xác định text-safe zone trong composition. Không scale ảnh desktop đến mức mất chủ thể hoặc làm chữ đè chi tiết.
- Artwork năm game phải phân biệt được; không đổi hue của cùng một ảnh rồi gọi là năm art direction. Giữ aspect ratio cover **16:10** và khung thông tin chung.
- Đồ họa/icon chức năng dùng cùng một bộ style, nét quang học nhất quán, cỡ 16/20/24px. Không emoji cho status ngân hàng/giấy phép, không trộn icon outline/fill/3D ngẫu nhiên.
- Icon-only control phải có tên truy cập và vùng chạm đủ; ưu tiên nhãn chữ cho hành động quan trọng. Icon trang trí có alt rỗng/aria-hidden.
- Không lấy logo/game art không có quyền, không hotlink. Ledger ghi nguồn, tác giả/chủ quyền, quyền sử dụng, ngày, đường dẫn asset; ảnh generated ghi provenance và điều kiện sử dụng, không tự coi là đã được cấp mọi quyền.
- Không có reference image thì được dùng composition tự dựng có nhãn “chưa kiểm tra fidelity”; không bịa ảnh đã được xem hoặc tự tải một ảnh khác làm reference của người dùng.

## Components

Không có component hiện hữu để tái sử dụng trong workspace này. Các tên dưới là hợp đồng dự kiến của `src/shared/ui/` và UI module tương ứng, không phải yêu cầu thêm component library.

| Component | Cấu trúc / variants | Hành vi bắt buộc |
| --- | --- | --- |
| Button/LinkButton | primary, secondary, ghost, danger; icon+text hoặc icon-only có nhãn | Action dùng button, điều hướng dùng link; primary hit area >=44x44; loading giữ nhãn/kích thước, chống submit trùng |
| Field/Select | label, input, hint, error; input 16px, vùng thao tác cao >=44px | Error inline và aria-describedby, focus lỗi đầu; autocomplete/type/inputmode đúng, không chặn paste |
| Dialog/Drawer | title, nội dung, cancel/confirm | Trap/return focus, Escape khi an toàn; target/hậu quả rõ; xử lý unsaved state, không lồng modal nhiều cấp |
| Navigation/Dropdown | desktop menu, mobile drawer; đúng năm mục game | Bàn phím/touch đầy đủ; cùng route/nhãn; focus không mất khi responsive |
| ProductCard | artwork → tên → mô tả thật → status → giá từ/duration/cap → hai hành động | Mua gói đến vùng gói để chọn, không tự tạo đơn; Xem chi tiết đến trang game; no-price có lý do, trial không biến giá mua thành 0 |
| OfferSelector | nhóm lựa chọn gói có label; trial riêng | Hiện total/duration/cap/start rule cùng gói; không tự chọn gói đắt, không fake recommended; chọn không submit |
| Price | integer VND đã xử lý domain, current/original khi có promo | Giữ currency/amount dễ đọc; không suy giá custom, không badge tiết kiệm chưa tính đúng |
| StatusBadge/Notice | semantic role + nhãn chữ; icon bổ trợ | Không dùng một badge để đại diện cả payment và license; không color-only |
| CopyValue | label, full/copyable value, copy control, live feedback | Copy đúng snapshot, phản hồi “Đã sao chép”; lỗi clipboard có đường chọn/copy thủ công; không toast thành công giả |
| OrderProgress | order label + payment label + deadline/history + next action | Dữ liệu server; không animation progress giả, không tick paid từ report |
| SoftwareLicenseRow | game, non-secret reference, state, expiry, devices, hành động | Nhiều license cùng game khác rõ; download không ép reveal; step-up quay lại đúng target |
| ReceiptWorkbench | receipt, candidate order, balance/history, reasons, actions | Apply/late settlement/return/refund/revoke tách biệt; stale conflict không tự re-submit |
| DataTable/Pagination | semantic table; mobile summary/detail hoặc scroll region có tên | Không giảm chữ để nhét; identity/status/amount/action luôn truy cập được; phân trang không làm mất bộ lọc an toàn |
| TicketThread | trạng thái, tin nhắn plain text, form trả lời | Owner-only, không attachment/chat mới; không yêu cầu gửi password/license secret |
| Empty/Error/Toast | heading ngắn, giải thích, hành động hợp lệ | Lỗi tiền/quyền quan trọng là inline/persistent, không chỉ toast tự biến mất |

### Ownership và hạn chế biến thể

- `tokens.css` giữ giá trị; shared primitives giữ geometry/states; CSS modules giữ M1–M4 ở public shell/artwork; module UI ghép thông tin nghiệp vụ; route chỉ composition.
- Base Button, Field, Price, DataTable không nhận prop “fantasy=true” làm thay toàn bộ thao tác. Material thuộc container/cover, không nhân bản primitive.
- Không tạo một theme con cho từng game. Per-game config chỉ đổi artwork/crop/alt và nội dung đã quản trị; semantic status, body font và pattern checkout giữ nguyên.
- Primitive-host phải cho thấy default/hover/focus/active/loading/error/disabled và long-content theo plan R14; không publish showcase vào ứng dụng chính.

## Accessibility

**Mục tiêu:** WCAG 2.2 AA, cộng một số tiêu chí tiện dùng mạnh hơn được ghi rõ. Đây là mục tiêu nghiệm thu, không phải tuyên bố đã đạt.

- Normal text >=4.5:1; large text >=3:1 (không tự gọi mọi heading là large); cần kiểm tra cả hover/selected và ảnh/composite. Control/state indicator cần thiết >=3:1 với màu kề; decoration thuần túy không bị nhầm thành indicator.
- Không chỉ màu: trạng thái/lỗi có chữ; icon bổ trợ không thay nhãn. Không dùng gradient/glow thay focus.
- Primary purchase/copy/download/renew target >=44x44 CSS px theo tiêu chí dự án. Control còn lại đáp ứng AA 24px hoặc ngoại lệ spacing/inline phù hợp, có kiểm tra; không gọi 44px là ngưỡng AA.
- Một h1 phù hợp mỗi trang, hierarchy h2/h3 đúng; landmark header/nav/main/footer, skip link, semantic button/link/form/table trước ARIA.
- Keyboard sử dụng được dropdown, radio gói, tabs, dialog, drawer, pagination và bảng. Không trap focus ngoài modal có chủ đích; focus trả về trigger sau đóng.
- Không bỏ outline mà thiếu thay thế. Sticky UI không che focus/error; tiêu chí dự án yêu cầu control được focus nhìn đầy đủ, không chỉ một góc nhỏ.
- Field có label rõ; hint không nằm duy nhất trong placeholder. Lỗi submit inline, summary khi nhiều lỗi, focus lỗi đầu; không chặn paste/password manager. Trạng thái bất đồng bộ dùng live region phù hợp, không đọc lại cả trang mỗi lần polling.
- Giữ browser zoom; không user-scalable=no. Kiểm tra 200% zoom và reflow 320px, tên dài/dấu NFD, mobile keyboard. Không dùng overflow-x:hidden che một lỗi nội dung quan trọng.
- Text trong ảnh không thay DOM. Media có ý nghĩa cần mô tả phù hợp; decorative image/formation không gây nhiễu trình đọc màn hình.
- Reduced motion được test như một mode thực, không chỉ có một CSS query. Tắt ảnh trang trí không làm mất giá, điều hướng hay kết quả thao tác.
- Axe là một nguồn bằng chứng, không thay keyboard walkthrough, kiểm tra font/contrast hoặc task outcomes. Nguồn chuẩn đối chiếu: plan R12 S7/S10–S12.

## Responsive behavior

| Kích thước CSS | Public/catalog | Account/admin | Quy tắc |
| --- | --- | --- | --- |
| 320–639px | Một cột, card width đầy đủ, header drawer, hero text có thể nhiều dòng | Một cột, nav drawer, dòng license/receipt có label | Gutter 16px; essential offer/amount/status/action không yêu cầu horizontal page scroll |
| 640–1023px | Hai cột sản phẩm; hero vẫn ưu tiên text-safe crop | Customer nav gọn/drawer; form/table thích ứng nội dung | Gutter 24px; touch/keyboard không bị coi là desktop hover |
| >=1024px | Ba cột sản phẩm; hero/art và summary có thể chia cột | Customer sidebar khoảng 240px; admin sidebar 256px từ >=1280px, thấp hơn dùng drawer | Container 1200px; phần dư của hàng năm sản phẩm giữ cùng card width, không tạo card thứ sáu |

- Five-card grid là 3+2 ở desktop, 2+2+1 ở tablet, 1+1+1+1+1 ở mobile. Không kéo riêng hai card cuối thành “featured” lớn hơn nếu không có ý nghĩa nghiệp vụ.
- Nội dung quyết định mua giữ cùng reading order DOM khi thay bố cục. Không một bản giá cho desktop và một bản logic khác cho mobile.
- CTA bar cố định là MAY: có safe-area-inset-bottom, khoảng trống bù cuối trang, không đè lỗi/keyboard/footer; nếu không đạt thì dùng CTA trong document flow.
- Header sticky phải có scroll-padding/scroll-margin tương ứng cho anchors; mục được focus không trốn sau header.
- Dense admin table MAY cuộn ngang trong region có tên hoặc mở detail labelled; không cuộn ngang toàn trang. Cột bỏ khỏi summary phải có detail truy cập bằng click/keyboard, không chỉ tooltip.
- Giá/số thiết bị/reference không biến thành icon khi chật. Nhãn điều khiển được wrap hoặc đổi layout, không hạ xuống 10–12px.
- Test 375/768/1280, stress 320/1440; thêm kiểm tra tại điểm đổi 640/1024/1280 khi layout tương ứng có breakpoint. Tablet/hybrid không bị mất thao tác do pointer assumption.

## Interaction states

### Trạng thái dùng chung

| Trạng thái | Phải hiển thị | Không được làm |
| --- | --- | --- |
| Loading lần đầu | Skeleton có geometry ổn định hoặc “Đang tải…” có ngữ nghĩa; giữ context | Số tiền 0đ, badge thành công tạm hoặc spinner toàn màn không có lý do |
| Submitting | Nhãn hành động + tiến trình ngắn; chống trùng; giữ dữ liệu form | Mất target, nhảy layout hoặc thông báo thành công trước server |
| Empty hợp lệ | Chưa có đơn/bản quyền/cập nhật, giải thích và hành động hợp lệ | Fake data, biểu đồ zero giả có vẻ đã vận hành, nhiều khối placeholder |
| Chưa cấu hình | “Chưa mở bán”/“Thông tin đang cập nhật” ở đúng field; support nếu có thật | Ngầm suy giá, tương thích hoặc miễn phí |
| Validation error | Lỗi sát field, hướng sửa, dữ liệu đã nhập giữ lại | Toast chung chung rồi xóa form |
| Unauthorized/session expired | Yêu cầu đăng nhập/xác thực lại, giữ intent an toàn | Tiết lộ dữ liệu cũ hoặc tự replay hành động nhạy cảm sau login |
| Unavailable/disabled | Lý do thấy được, thời điểm/thao tác thử lại khi có cơ sở | Disabled không chú thích hoặc lịch hẹn/SLA tự bịa |
| Offline/slow network | Nêu chưa xác minh trạng thái mới, lần cập nhật gần nhất nếu có; Retry | Tạo lại đơn hoặc coi “timeout” là chuyển tiền thất bại |
| Conflict/stale data | Giá/số dư/eligibility mới và yêu cầu xác nhận lại | Tự sửa submitted amount hoặc âm thầm áp dụng target khác |
| Success | Kết quả đã xác nhận + next action; financial notice đủ bền để đọc lại | Full-screen celebration cản tải phần mềm hoặc mất lịch sử |

### J1 · Mua gói

Chọn game → xem thông tin/gói → chọn gói → login/verify nếu cần → kiểm tra lại offer → xác nhận snapshot → tạo một đơn → chuyển khoản → báo đã chuyển → chờ đối soát → paid/fulfillment → Phần mềm của tôi.

- Customer có thể xem giá trước login. Return path allowlist giữ product/offer/intent nhưng không khóa giá ở client; server revalidates trước commitment.
- Thay giá/offer hết hạn phải hiển thị khác biệt và xin xác nhận lại. Không tự đổi sang gói khác hoặc tạo đơn khi chỉ click card.
- Bank amount/account/beneficiary/reference là snapshot của đơn. Cấu hình ngân hàng đổi không thay chỉ dẫn đơn đã có. Copy thành công không đồng nghĩa chuyển khoản thành công.

### J2 · Dùng thử

Dùng thử được cấu hình → verified login → xác nhận duration/cap/start rule → claim idempotent → entitlement gốc nếu retry hợp lệ → Phần mềm của tôi.

- Không pending bank order, không số tài khoản ngân hàng, không QR/payment step. Đã dùng trial thì nêu rõ và link bản quyền cũ nếu được phép.
- `trials` và `sales` độc lập theo R9; không dùng một nút “Mở bán” để suy ra cả hai. Paid price bỏ trial khỏi phép lấy min.

### J3 · Đơn và đối soát — hai trục, không trộn enum

| Đơn / bằng chứng | Nhãn và hành động |
| --- | --- |
| Pending, chưa report/receipt liên quan | Chờ thanh toán; copy chỉ dẫn, Tôi đã chuyển khoản |
| Pending/cancelled/expired, chỉ có report của khách | Đã ghi nhận thông báo chuyển khoản — chưa xác nhận tiền; giữ trạng thái đơn riêng, mã đơn và Hỗ trợ |
| Đơn chưa paid, verified receipt liên quan đang unresolved | Khoản chuyển cần đối soát; lý do an toàn và Hỗ trợ; chưa có license/success |
| Expired/cancelled, không report/receipt liên quan | Trạng thái đơn; tạo đơn mới khi hợp lệ, kèm cảnh báo liên hệ trước nếu đã chuyển |
| Paid và fulfillment commit | Đã thanh toán; Phần mềm của tôi, download/reveal/guide theo quyền; license bị đình chỉ không biến đơn thành chưa trả tiền |
| Completed return/refund | Ghi rõ số tiền đã hoàn trả một phần/toàn bộ như một sự kiện lịch sử; không tự sửa license/đơn ngoài R6/R14 |

- Không thêm `unresolved` vào enum đơn. Customer report không phải receipt đã xác minh.
- Chỉ hiển thị receipt an toàn đã gắn đúng đơn của khách; receipt chưa ghép hoặc chứng cứ người khác chỉ admin xem.
- Báo chuyển tiền → hết hạn → reload vẫn giữ report và lời nhắc **“Không chuyển lại chỉ vì đơn đã hết hạn. Liên hệ hỗ trợ để kiểm tra khoản đã chuyển.”** Không hướng dẫn tự nạp bù khi chưa đối soát.
- Deadline là thời điểm server, hiển thị ngày/giờ và timezone rõ; mặc định UI tiếng Việt dùng `Asia/Ho_Chi_Minh`, lưu trữ UTC. Không fake urgency hoặc countdown cam kết duyệt tiền.

### J4 · Sử dụng, thiết bị và gia hạn

- License hợp lệ chưa kích hoạt: “Chưa kích hoạt”; tải được nhưng chưa chạy hạn. Không ghi “Đang hoạt động” chỉ vì đã paid/download.
- Hiện riêng state license, expiry, used/cap thiết bị. Đó là số thiết bị đã đăng ký, không cam kết số phiên game đồng thời.
- Reveal key/removal có step-up một lần đúng purpose theo R14; xong quay lại đúng license/target. Copy khóa không log/URL/telemetry; không bắt reveal để tải.
- Gia hạn từ đúng row license, xác nhận non-secret reference, hạn hiện tại, thời lượng thêm, cap, giá và cách tính `max(settlement_time, current_expiry) + duration`.
- Hạn mới trước duyệt là dự kiến. License đã hết hạn tính thêm từ lúc duyệt thanh toán, không từ lần mở phần mềm tiếp theo. Hiện hạn thực tế sau settlement.
- Hai license cùng sản phẩm phải phân biệt được; chỉ target đã chọn được gia hạn. Đổi cap là “Mua bản quyền mới”, không đổi âm thầm.
- Sales-off chặn đơn gia hạn mới; receipt của đơn đã nhận chỉ được apply khi target vẫn eligible theo R14. Suspended/revoked/account-suspended không có success giả.

### J5 · Admin đối soát và hoàn trả

1. Nhập verified receipt từ tiền thật đã kiểm tra, chưa cần chọn đơn.
2. Chọn đơn ứng viên; đọc account/reference/amount/eligibility hai phía.
3. Xem received/applied/returned/remaining và audit; action chưa hợp lệ có lý do.
4. Chọn “Áp dụng vào đơn” hoặc duyệt muộn có lý do theo server guard.
5. Nếu hoàn trả đã thực hiện ngoài hệ thống: “Ghi nhận đã hoàn trả”; ghi loại, số tiền, tham chiếu thực tế.
6. “Ghi nhận hoàn tiền đơn đã thanh toán” và “Thu hồi bản quyền” là hành động riêng, hậu quả riêng, xác nhận riêng.

- Không tự ghép bằng fuzzy match, không đổi expected price, không tiền thật chạy khi click “ghi nhận”.
- Partial/full return cập nhật số dư và lý do khả dụng; fully returned không apply được. Stale/concurrent conflict refresh số dư và yêu cầu xác nhận, không replay ngầm.
- Step-up không xóa form nhưng không làm yếu backend verification. UI disable chỉ là hỗ trợ; trực tiếp API/RPC vẫn bị guard.

### J6 · Hỗ trợ, CMS và flags

- Hỗ trợ dùng public contact/FAQ/ticket hiện có. Khi tắt tạo ticket mới, thread cũ vẫn reply theo R9; không hiện CTA bị chặn mà không hướng đi khác.
- Ticket prefill được game/đơn/non-secret license reference của khách; nhắc không gửi mật khẩu hoặc khóa bản quyền. Không thêm upload/chat trong thiết kế này.
- CMS preview phải cho thấy desktop/mobile crop, alt, đoạn chữ dài và trạng thái chưa cấu hình; draft không lộ vào public cache.
- Toggle sales/trials/support/update có impact preview chính xác, lý do/audit; không đổi các quyền đã mua chỉ vì menu bị tắt.

## Content voice

- Tất cả nội dung người dùng nhìn thấy là tiếng Việt; ngoại lệ brand, tên game, version/API identifier và từ License trong seed gốc. UI nghiệp vụ ưu tiên “bản quyền”.
- Dùng nhãn hành động cụ thể: “Mua gói”, “Dùng thử”, “Xem mã bản quyền”, “Tải phần mềm”, “Gia hạn”, “Ghi nhận đã hoàn trả”; tránh “Tiếp tục” khi người dùng không biết hậu quả.
- “Thông báo đã chuyển khoản” ≠ “Đã xác nhận tiền” ≠ “Đã cấp bản quyền” ≠ “Đã kích hoạt”. Không rút gọn thành một chữ “Thành công”.
- Lỗi nói chuyện gì xảy ra, điều gì chưa xảy ra và cách xử lý; không chỉ hiện mã máy hoặc “Có lỗi xảy ra”. Không rò tài khoản tồn tại qua thông báo auth/reset.
- Chỉ nhắc mốc/hạn có thật, không “chỉ còn 2 phút”, “duyệt trong 30 giây” hoặc “nhiều người đang xem” do frontend tạo.
- Text trống không được lấp bằng lorem ipsum trong production. Các `[giá]`, `[thời hạn]`, `[mã đơn]` trong thiết kế là slot cần dữ liệu, không phải copy được phép ship.

| Trường hợp | Copy mẫu có thể triển khai |
| --- | --- |
| Chưa có gói trả phí | Chưa mở bán. Thông tin gói sẽ được hiển thị khi được cấu hình. |
| Copy thành công | Đã sao chép nội dung chuyển khoản. |
| Report đã nhận | Đã ghi nhận thông báo chuyển khoản. Khoản tiền vẫn đang chờ xác nhận. |
| Giá thay đổi | Giá gói đã thay đổi. Vui lòng kiểm tra lại tổng tiền trước khi xác nhận. |
| Chưa kích hoạt | Thời hạn sử dụng bắt đầu từ lần kích hoạt đầu tiên. Tải phần mềm không bắt đầu tính hạn. |
| Gia hạn bản quyền hết hạn | Thời gian gia hạn bắt đầu khi thanh toán được duyệt, không phải lần mở phần mềm tiếp theo. |
| Chưa xác minh do mất mạng | Chưa thể cập nhật trạng thái mới. Không tạo lại đơn hoặc chuyển thêm tiền trước khi kiểm tra. |
| Return đã ghi nhận | Đã ghi nhận khoản hoàn trả thực tế. Thao tác này không tự chuyển tiền hoặc thu hồi bản quyền. |

## Implementation constraints

### Stack, boundaries và nguồn sự thật

- Giữ Next.js, React, TypeScript strict, Tailwind CSS, Framer Motion, Supabase/PostgreSQL như plan. Không chọn version mới trong design doc; bootstrap kiểm tra stable tương thích và pin theo R12.
- RSC mặc định, client leaves cho tương tác cần thiết. CSS tokens duy nhất → primitives → public material recipes → module UI → thin routes. Không CSS-in-JS, `!important`, raw color tùy tiện hoặc component nhân bản theo game.
- Không cài thêm UI/icon/animation/font package vì tài liệu có một hình thức mới. Dùng assets hợp lệ/pattern đang được bootstrap cho phép; nếu thật sự cần dependency ngoài stack, đó là quyết định riêng.
- Product/offer/content/status là dữ liệu quản trị và projection server. Dùng Zod/typed DTO, không client tính eligibility hoặc gán paid. Tiền integer VND, snapshot và price floor giữ nguyên R5/R14.
- Phiên bản hình ảnh/font, source/license và preset crop thuộc ledger. Không ảnh/giá thật của một game bị cache sang game khác; private account/admin/checkout không cache chung/no-store như plan.
- Không secrets/license material/bank evidence trong URL, log hoặc telemetry. Admin identity/MFA và customer ownership phải được backend kiểm tra dù UI đã ẩn control.
- Không đưa tool dev/showcase vào production. Primitive-host tách biệt theo R14, production `/__showcase` phải 404.

### Performance budgets

Giữ budget plan: public initial JS <=200KiB gzip; ảnh hero mobile được chọn <=350KiB; lab LCP <=2.5s, CLS <=0.1, interaction latency thử nghiệm <=200ms theo emulation cố định. Chưa phải kết quả đo hiện tại; field INP không được suy ra từ lab.

- Artwork responsive AVIF/WebP với width/height/aspect ratio; hero LCP không lazy, below-fold lazy. Không decode full-size ảnh desktop rồi thu nhỏ trên điện thoại.
- Font tự host; preload tối thiểu các face/subset critical của route, dùng display strategy tránh chữ vô hình dài và đo layout shift. Không bỏ glyph tiếng Việt để đạt điểm.
- Vật liệu không được phụ thuộc canvas/WebGL/video hoặc một runtime mới. Backdrop-filter chỉ vùng M3 giới hạn, có fallback đặc và test thiết bị chậm.
- Đo production build; không giấu nội dung, flatten artwork vô cớ, bỏ tương tác hoặc giảm chữ để đạt Lighthouse. Mục tiêu score trong plan không thay task usability.

### Deliverables trước khi viết UI

Task 4 tiếp nhận tài liệu này thay vì viết lại từ template, hoàn tất:
1. `docs/design/materials.md`: recipes M0–M4, allowed surfaces, token linkage và ảnh minh họa thực tế nếu có.
2. `docs/design/journeys.md`: J1–J6, state/action/denial/return paths tương ứng DTO task 2.
3. `docs/design/wireframes/`: ít nhất homepage/catalog, product/package+trial, expired reported order, owned software nhiều license, renewal confirmation, receipt workbench; mobile và desktop.
4. `docs/design/ux-acceptance.md`: nối các tiêu chí D01–D20 dưới đây với plan U1–U7, owner task và test.
5. Asset/font ledger và evidence kiểm tra glyph/contrast; independent design review trước task 5.

Không đánh dấu các deliverable này đã tồn tại chỉ vì đã tạo `DESIGN.md`. Khi chưa có reference image, wireframe/UX có thể được review, nhưng reference-fidelity/artwork cuối không được tự pass. `$visual-ralph` chỉ là workflow pixel-match khi có baseline được duyệt, không thay thế design governance.

### Acceptance gates — pass/fail riêng từng tiêu chí

| ID | Điều kiện đạt | Ca phải bắt lỗi | Chủ sở hữu trong plan |
| --- | --- | --- | --- |
| D01 | Brand/hero/menu seed đúng prompt gốc, CMS edit hợp lệ được giữ | Khôi phục copy MU-only cũ hoặc chữ trong ảnh thay DOM | 4,13,24 |
| D02 | Đúng năm danh mục/landing riêng, artwork phân biệt và dữ liệu độc lập | Card thứ sáu, một sản phẩm dùng chung hoặc giá game A đổi B | 7,13,14 |
| D03 | Gói cùng cấu trúc total/duration/cap/start rule; không giả recommended | Thiếu cap, min price lấy từ trial, badge không nguồn | 2,7,14 |
| D04 | Login/verify trở về đúng intent và revalidate trước commit | Mất gói hoặc tự submit giá cũ sau login | 9,14,15 |
| D05 | Trial không bank checkout; claim retry không cấp trùng | Tạo pending order hoặc sales-off làm tắt trial hợp lệ | 11,14,19 |
| D06 | Report → expiry → reload vẫn giữ thông báo và không thúc chuyển lại | Report bị coi là verified hoặc UI gợi chuyển tiền lần nữa | 9,15,19 |
| D07 | Late settlement hợp lệ trả về paid/fulfillment đúng một lần | Tạo đơn mới/entitlement mới khi refresh/poll | 10,15,19 |
| D08 | Download license chưa kích hoạt không chạy hạn/ép reveal | Download đổi activated_at hoặc yêu cầu copy secret trước | 12,16,19 |
| D09 | Gia hạn đúng một trong hai license, phân biệt preview/actual expiry | Gia hạn sibling, tính từ reactivation hoặc đổi cap ngầm | 11,15,16,19 |
| D10 | Workbench xử lý receipt chưa có đơn và return partial/full qua UI | Apply receipt đã hoàn trả, success giả hoặc cần sửa DB | 10,17,19 |
| D11 | Chỉ M0 dưới dữ liệu tiền/quyền; M1–M4 đúng ranh giới | Glass/texture/glow dưới amount, form, table | 4,5,15–17,21 |
| D12 | Font đúng vai trò, glyph NFC/NFD/₫ đầy đủ, giá canh đọc được | Serif data table, synthetic weight, dấu bị cắt, text-as-image | 4,5,21,22 |
| D13 | Contrast thực tế đạt theo text/control/states | Cream trên vàng, bronze chữ nhỏ, focus ring mất trên gold | 4,5,21 |
| D14 | Keyboard/focus/dialog/drawer hoàn tất tác vụ; ARIA/semantics đúng | Focus bị sticky che, icon không tên, hover-only action | 5,14–17,21 |
| D15 | Primary target 44px, reflow/zoom/keyboard mobile không mất dữ liệu | Hạ chữ để nhét bảng, page scroll ngang, sticky đè lỗi | 5,15–17,21 |
| D16 | Reduced motion giữ nội dung và feedback rõ | Content vô hình khi tắt animation, perpetual particle | 5,13,21 |
| D17 | Chưa có nội dung là trạng thái trung thực, compact | Fake features/reviews/metrics, nhiều section filler | 7,13,14,18,21 |
| D18 | Owner-scoped data, direct APIs giữ guard; payment/license độc lập | Receipt người khác, expired auth vẫn reveal, refund tự revoke | 3,10–12,15–20 |
| D19 | Production budgets được đo, không hy sinh nội dung/glyph/flow | Lấy dev score, giả field INP hoặc bỏ nội dung để đẹp điểm | 21,22,24 |
| D20 | Asset rights/provenance, reference status và evidence truthful | Tự nhận đã xem ảnh thiếu, asset không quyền, tự duyệt fidelity | 4,6,21,23,24 |

**Bằng chứng:** mỗi gate ghi criterion ID, route/state, viewport, command/exit code khi có, screenshot/trace và verdict; không một điểm tổng hợp nào được ghi đè gate fail. Visual iteration dùng `$visual-verdict` trước vòng sửa tiếp theo; task 21/F3 review độc lập cả hình ảnh lẫn hành trình. Cần freeze SHA/manifest theo plan khi final QA. Các kiểm tra này không được quảng cáo là nghiên cứu người dùng thật.

## Open questions

Các mục này là dữ liệu/asset còn thiếu, không phải quyền tự bịa nội dung. Có thể hoàn tất đặc tả và thực thi local bằng fixture rõ ràng; chỉ gate tương ứng bị chặn.

- [ ] **Ảnh tham chiếu gốc ở đâu?** Owner: chủ sở hữu. Ảnh chưa được cung cấp trong workspace này; ảnh hưởng text-safe crop, composition và final reference-fidelity. Không chặn viết hợp đồng UX/token.
- [ ] **Artwork/logo/font asset nào đã được phép phân phối?** Owner: chủ sở hữu + thiết kế. Cần ledger và asset thật trước khi duyệt mỹ thuật/phát hành; không giả định mọi hình MU/Võ Lâm đều dùng được.
- [ ] **Mỗi sản phẩm có phiên bản, compatibility, tính năng, screenshot và binary nào?** Owner: chủ sở hữu sản phẩm. UI vẫn có unknown/readiness state; release/download thật cần dữ liệu và kiểm tra theo plan.
- [ ] **Gói/trial/duration/cap/giá/khuyến mãi nào sẽ mở?** Owner: chủ sở hữu kinh doanh. Không seed giá thương mại hoặc cam kết miễn phí; ảnh hưởng CTA khả dụng và production sales.
- [ ] **Thông tin ngân hàng, liên hệ, lịch hỗ trợ và chính sách đã phê duyệt?** Owner: vận hành. Không tự hứa SLA/hoàn tiền; thiếu điều kiện bắt buộc chặn mở bán theo R6/R14.
- [ ] **Composition/wireframe và font bundle thực tế đã qua gate chưa?** Owner: task 4 + reviewer độc lập. Chưa có các artifact này trong workspace; phải hoàn tất trước task 5, không coi bản Markdown là screenshot/UI đã duyệt.

**Điều kiện hoàn thành tài liệu:** đủ các mục hợp đồng, source-of-truth thống nhất với plan, tiêu chí có test owner, unknowns được ghi đúng. **Điều kiện hoàn thành sản phẩm:** vẫn là các gate triển khai/QA trong plan; tạo tài liệu này không đồng nghĩa ứng dụng đã được xây, an toàn hay sẵn sàng mở bán.
