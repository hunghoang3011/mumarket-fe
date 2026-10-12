import type {
  Announcement,
  AuditEvent,
  DemoUser,
  Faq,
  FeatureFlags,
  Guide,
  LegalPage,
  SiteSettings,
  Ticket,
} from "../types";
import { demoBank } from "./commerce";

export const demoUsers: Record<"customer" | "admin", DemoUser> = {
  customer: {
    email: "alice@example.test",
    displayName: "Alice Nguyễn",
    role: "customer",
    emailVerified: true,
    reminderEnabled: true,
    suspended: false,
  },
  admin: {
    email: "admin@galaxy.auto",
    displayName: "Quản trị viên",
    role: "admin",
    emailVerified: true,
    reminderEnabled: true,
    suspended: false,
  },
};

export const demoFlags: FeatureFlags = {
  sales: true,
  trials: true,
  support_new_tickets: true,
  announcements_public: true,
};

export const demoSettings: SiteSettings = {
  bank: demoBank,
  contactEmail: "hotro@galaxy.auto",
  contactNote: "Hỗ trợ qua email và mục Hỗ trợ trong tài khoản.",
  paymentNote:
    "Sau khi bạn báo đã chuyển khoản, cửa hàng sẽ đối chiếu với ngân hàng và xác nhận thủ công.",
};

export const demoAnnouncements: Announcement[] = [
  {
    slug: "mu-5-0-3-theo-kip-ban-12-2",
    title: "Auto MU Lục Địa VNG 5.0.3 theo kịp bản game 12.2",
    productSlug: "mu-luc-dia-vng",
    publishedAt: "2026-10-11T03:00:00.000Z",
    excerpt: "Bản 5.0.3 cập nhật theo bản game 12.2 và sửa lỗi nhận diện cửa sổ khi phóng to.",
    body: [
      "Bản 5.0.3 của Auto MU Lục Địa VNG đã phát hành, cập nhật tương thích với bản game 12.2.",
      "Bản này cũng sửa lỗi nhận diện cửa sổ game khi người chơi phóng to hoặc thu nhỏ cửa sổ.",
      "Bản quyền đang hiệu lực có thể tải bản mới từ mục Phần mềm của tôi.",
    ],
  },
  {
    slug: "kiem-the-origin-dang-cap-nhat",
    title: "Auto Kiếm Thế Origin đang được cập nhật theo bản game mới",
    productSlug: "kiem-the-origin",
    publishedAt: "2026-10-12T09:30:00.000Z",
    excerpt: "Phần mềm tạm thời ở trạng thái đang cập nhật. Xem mục này trước khi mua.",
    body: [
      "Do game vừa cập nhật, Auto Kiếm Thế Origin đang được điều chỉnh để tương thích.",
      "Trong thời gian này, phần mềm có thể hoạt động không ổn định. Bản quyền hiện có không bị ảnh hưởng về thời hạn.",
      "Chúng tôi sẽ thông báo tại mục Cập nhật khi bản tương thích sẵn sàng.",
    ],
  },
  {
    slug: "vo-lam-mien-phi-3-2-1",
    title: "Auto Võ Lâm Miễn Phí 3.2.1: sửa lỗi bản đồ Tương Dương",
    productSlug: "vo-lam-mien-phi",
    publishedAt: "2026-10-08T03:00:00.000Z",
    excerpt: "Bản 3.2.1 theo kịp game 1.9.4 và sửa lỗi nhận diện bản đồ Tương Dương.",
    body: [
      "Bản 3.2.1 của Auto Võ Lâm Miễn Phí đã phát hành, tương thích bản game 1.9.4.",
      "Lỗi nhận diện bản đồ Tương Dương khiến phần mềm dừng giữa chừng đã được khắc phục.",
    ],
  },
  {
    slug: "lich-bao-tri-dinh-ky",
    title: "Thông báo chung về lịch cập nhật theo bản game",
    productSlug: null,
    publishedAt: "2026-10-05T02:00:00.000Z",
    excerpt: "Khi game cập nhật, phần mềm cần thời gian điều chỉnh. Theo dõi mục Cập nhật.",
    body: [
      "Mỗi khi game có bản cập nhật lớn, phần mềm cần được điều chỉnh để hoạt động đúng.",
      "Trạng thái của từng phần mềm luôn hiển thị tại trang sản phẩm và mục Phần mềm của tôi.",
      "Vui lòng xem trạng thái trước khi mua hoặc gia hạn.",
    ],
  },
];

export const demoGuides: Guide[] = [
  {
    slug: "cai-dat-va-kich-hoat",
    title: "Cài đặt và kích hoạt bản quyền",
    productSlug: null,
    publishedAt: "2026-10-01T02:00:00.000Z",
    steps: [
      "Mua gói hoặc dùng thử để nhận bản quyền trong mục Phần mềm của tôi.",
      "Tải phần mềm tương ứng với game bạn chơi.",
      "Mở mục Phần mềm của tôi, chọn bản quyền và xem mã bản quyền (cần xác nhận lại mật khẩu).",
      "Nhập mã bản quyền vào phần mềm khi được hỏi.",
      "Thời hạn sử dụng bắt đầu từ lần kích hoạt đầu tiên; tải phần mềm không bắt đầu tính hạn.",
    ],
  },
  {
    slug: "chuyen-khoan-dung-noi-dung",
    title: "Chuyển khoản đúng nội dung",
    productSlug: null,
    publishedAt: "2026-10-02T02:00:00.000Z",
    steps: [
      "Sau khi tạo đơn, bạn nhận được mã nội dung chuyển khoản dạng GA kèm 5 ký tự.",
      "Lưu ảnh QR trên trang đơn, mở ứng dụng ngân hàng, chọn Quét QR rồi chọn ảnh vừa lưu.",
      "Giữ nguyên nội dung chuyển khoản. Ngân hàng có thể tự thêm chữ vào nội dung; điều này không ảnh hưởng.",
      "Bấm Tôi đã chuyển khoản trên trang đơn sau khi chuyển.",
      "Không chuyển lại chỉ vì đơn đã hết hạn; hãy liên hệ hỗ trợ để kiểm tra khoản đã chuyển.",
    ],
  },
  {
    slug: "go-may-khi-doi-thiet-bi",
    title: "Gỡ máy khi đổi thiết bị",
    productSlug: null,
    publishedAt: "2026-10-03T02:00:00.000Z",
    steps: [
      "Vào Phần mềm của tôi và mở chi tiết bản quyền.",
      "Trong danh sách máy đã đăng ký, chọn máy cần gỡ và bấm Gỡ máy.",
      "Xác nhận lại mật khẩu để hoàn tất.",
      "Phần mềm trên máy bị gỡ sẽ dừng ở lần kiểm tra kế tiếp (thường trong vòng 5 phút). Hạn bản quyền không thay đổi.",
    ],
  },
];

export const demoFaqs: Faq[] = [
  {
    question: "Khi nào tôi nhận được bản quyền sau khi chuyển khoản?",
    answer:
      "Bản quyền được cấp sau khi khoản chuyển được xác nhận. Sau khi bạn báo đã chuyển khoản, cửa hàng đối chiếu với ngân hàng và xác nhận thủ công; trạng thái đơn cập nhật ngay tại trang đơn hàng.",
  },
  {
    question: "Thời hạn bản quyền được tính từ lúc nào?",
    answer:
      "Thời hạn sử dụng bắt đầu từ lần kích hoạt đầu tiên. Tải phần mềm không bắt đầu tính hạn.",
  },
  {
    question: "Tôi có thể dùng một bản quyền trên bao nhiêu máy?",
    answer:
      "Mỗi gói ghi rõ số máy tối đa, ví dụ “tối đa 2 máy”. Đây là số máy đã đăng ký, không phải số phiên game chạy cùng lúc. Bạn có thể gỡ máy cũ trong chi tiết bản quyền.",
  },
  {
    question: "Gia hạn được tính thế nào?",
    answer:
      "Hạn mới bằng thời điểm muộn hơn giữa lúc thanh toán được duyệt và hạn hiện tại, cộng thời hạn gói. Nếu bản quyền đã hết hạn, thời gian gia hạn bắt đầu khi thanh toán được duyệt.",
  },
  {
    question: "Ngân hàng tự thêm chữ vào nội dung chuyển khoản có sao không?",
    answer:
      "Không ảnh hưởng. Hệ thống tìm đúng mã đơn trong nội dung chuyển khoản; giữ nguyên mã đơn là đủ.",
  },
];

export const demoLegalPages: LegalPage[] = [
  {
    slug: "dieu-khoan",
    title: "Điều khoản sử dụng",
    body: [
      "Đây là nội dung điều khoản mẫu phục vụ bản demo giao diện. Nội dung chính thức do chủ sở hữu cung cấp qua CMS trước khi mở bán.",
      "Phần mềm được cấp quyền sử dụng theo gói đã mua, trên số máy tối đa ghi trong gói, trong thời hạn của gói.",
      "Người mua chịu trách nhiệm giữ bí mật mã bản quyền và tuân thủ điều khoản của trò chơi tương ứng.",
    ],
  },
  {
    slug: "quyen-rieng-tu",
    title: "Quyền riêng tư",
    body: [
      "Đây là nội dung quyền riêng tư mẫu phục vụ bản demo giao diện. Nội dung chính thức do chủ sở hữu cung cấp qua CMS trước khi mở bán.",
      "Cửa hàng chỉ thu thập email, tên hiển thị và dữ liệu cần thiết để giao bản quyền và hỗ trợ.",
      "Mã bản quyền và mật khẩu không bao giờ được yêu cầu qua kênh hỗ trợ.",
    ],
  },
  {
    slug: "chinh-sach-hoan-tien",
    title: "Chính sách hoàn tiền",
    body: [
      "Đây là nội dung chính sách hoàn tiền mẫu phục vụ bản demo giao diện. Nội dung chính thức do chủ sở hữu cung cấp qua CMS trước khi mở bán.",
      "Các khoản hoàn trả được ghi nhận thủ công sau khi đối chiếu với ngân hàng; hệ thống không tự chuyển tiền.",
      "Hoàn tiền đơn đã thanh toán và thu hồi bản quyền là hai thao tác riêng biệt.",
    ],
  },
];

export const demoTickets: Ticket[] = [
  {
    id: "T-1001",
    subject: "Đã chuyển khoản nhưng đơn GA4T7QW báo hết hạn",
    state: "waiting_admin",
    productSlug: "kiem-the-origin",
    orderCode: "GA4T7QW",
    licenseRef: null,
    createdAt: "2026-10-12T01:00:00.000Z",
    messages: [
      {
        at: "2026-10-12T01:00:00.000Z",
        from: "customer",
        body: "Em đã chuyển khoản cho đơn GA4T7QW nhưng hôm nay thấy đơn báo hết hạn thanh toán. Nhờ kiểm tra giúp em.",
      },
      {
        at: "2026-10-12T01:05:00.000Z",
        from: "customer",
        body: "Em chuyển 90.000 ₫ lúc 14:31 qua Vietcombank.",
      },
    ],
  },
  {
    id: "T-1002",
    subject: "Hỏi về cách gỡ máy đã đăng ký",
    state: "resolved",
    productSlug: "mu-luc-dia-vng",
    orderCode: null,
    licenseRef: "BQ-7K3M2Q",
    createdAt: "2026-09-10T02:00:00.000Z",
    messages: [
      {
        at: "2026-09-10T02:00:00.000Z",
        from: "customer",
        body: "Cho em hỏi cách gỡ máy cũ để cài sang máy mới.",
      },
      {
        at: "2026-09-10T03:30:00.000Z",
        from: "admin",
        body: "Bạn vào Phần mềm của tôi, mở chi tiết bản quyền BQ-7K3M2Q, chọn máy cần gỡ và bấm Gỡ máy. Thao tác yêu cầu xác nhận lại mật khẩu.",
      },
      {
        at: "2026-09-10T04:00:00.000Z",
        from: "customer",
        body: "Em làm được rồi, cảm ơn.",
      },
    ],
  },
];

export const demoAuditEvents: AuditEvent[] = [
  { at: "2026-10-13T07:00:00.000Z", actor: "admin@galaxy.auto", action: "Nhập khoản tiền đã nhận", target: "RC-2026-1052" },
  { at: "2026-10-12T09:00:00.000Z", actor: "admin@galaxy.auto", action: "Ghi nhận hoàn trả một phần 50.000 ₫", target: "RC-2026-1013" },
  { at: "2026-10-12T09:30:00.000Z", actor: "admin@galaxy.auto", action: "Cập nhật trạng thái phần mềm: Đang cập nhật theo bản game mới", target: "kiem-the-origin" },
  { at: "2026-10-11T08:05:00.000Z", actor: "admin@galaxy.auto", action: "Ghi nhận khoản tiền lệch", target: "RC-2026-1041" },
  { at: "2026-10-10T02:12:00.000Z", actor: "admin@galaxy.auto", action: "Cập nhật giá gói 30 ngày", target: "vo-lam-mien-phi" },
  { at: "2026-09-18T06:00:00.000Z", actor: "admin@galaxy.auto", action: "Duyệt thanh toán đơn gia hạn", target: "GA6R1PL" },
];
