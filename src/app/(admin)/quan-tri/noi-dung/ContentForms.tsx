"use client";

/*
 * Các nhóm nội dung CMS dạng tab (DESIGN §5 Quản trị · Nội dung, J6 email):
 * Trang chủ & banner · Ghi chú thanh toán · Hướng dẫn · Câu hỏi thường gặp ·
 * Tin cập nhật · Trang chính sách · Xem trước email. Mỗi nhóm có nút Lưu —
 * bản demo chỉ đổi client state + thông báo. Email xem trước là chữ thuần
 * tiếng Việt, không bao giờ chứa mã bản quyền (R8/J6).
 */
import { useState, type FormEvent } from "react";
import type {
  Announcement,
  Faq,
  Guide,
  LegalPage,
  Product,
  SiteSettings,
} from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { Field, Select, Textarea } from "@/shared/ui/Field";
import { Notice } from "@/shared/ui/Notice";

const DEMO_SAVED = "Đã lưu (bản demo — dữ liệu trở lại mẫu khi tải lại).";

const TABS = [
  { key: "home", label: "Trang chủ & banner" },
  { key: "payment", label: "Ghi chú thanh toán" },
  { key: "guides", label: "Hướng dẫn" },
  { key: "faq", label: "Câu hỏi thường gặp" },
  { key: "news", label: "Tin cập nhật" },
  { key: "legal", label: "Trang chính sách" },
  { key: "email", label: "Xem trước email" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const EMAIL_TEMPLATES: Record<string, string> = {
  created: `Tiêu đề: Đơn [mã đơn] đã được tạo — chờ chuyển khoản

Chào [tên khách],

Đơn [mã đơn] ([tên game] — [tên gói]) đã được tạo.
Số tiền phải trả: [số tiền]
Nội dung chuyển khoản: [mã đơn]
Hạn thanh toán: [hạn thanh toán]

Xem đơn và mã QR: [link đơn hàng]

Giữ nguyên nội dung [mã đơn]. Ngân hàng có thể tự thêm chữ vào nội dung; điều này không ảnh hưởng.`,
  granted: `Tiêu đề: Đơn [mã đơn] đã thanh toán — bản quyền đã được cấp

Chào [tên khách],

Khoản chuyển khoản cho đơn [mã đơn] đã được xác nhận.
Bản quyền [mã tham chiếu] ([tên game] — [tên gói]) đã được cấp, trạng thái Chưa kích hoạt.

Thời hạn sử dụng bắt đầu từ lần kích hoạt đầu tiên. Tải phần mềm không bắt đầu tính hạn.

Xem bản quyền và tải phần mềm: [link Phần mềm của tôi]`,
  renewed: `Tiêu đề: Bản quyền [mã tham chiếu] đã được gia hạn

Chào [tên khách],

Đơn gia hạn [mã đơn] đã được xác nhận.
Bản quyền [mã tham chiếu] ([tên game]) đã được cộng thêm [số ngày] ngày.
Hạn mới: [ngày hết hạn mới]

Xem chi tiết bản quyền: [link chi tiết bản quyền]`,
  expiring: `Tiêu đề: Bản quyền [mã tham chiếu] ([tên game]) hết hạn ngày [ngày]

Chào [tên khách],

Bản quyền [mã tham chiếu] ([tên game]) sẽ hết hạn ngày [ngày] (còn 3 ngày).
Gia hạn để không gián đoạn sử dụng: [link gia hạn]

Bạn nhận được email này vì đang bật nhắc sắp hết hạn. Tắt trong mục Cài đặt: [link cài đặt]`,
};

const EMAIL_LABELS: Record<string, string> = {
  created: "Đơn đã tạo",
  granted: "Đã duyệt và cấp bản quyền",
  renewed: "Đã gia hạn",
  expiring: "Sắp hết hạn",
};

function Saved({ show }: { show: boolean }) {
  if (!show) return null;
  return <Notice tone="success" role="status">{DEMO_SAVED}</Notice>;
}

export function ContentForms({
  products,
  initialGuides,
  initialFaqs,
  initialAnnouncements,
  legalPages,
  settings,
}: {
  products: Product[];
  initialGuides: Guide[];
  initialFaqs: Faq[];
  initialAnnouncements: Announcement[];
  legalPages: LegalPage[];
  settings: SiteSettings;
}) {
  const [tab, setTab] = useState<TabKey>("home");
  const [savedTab, setSavedTab] = useState<string | null>(null);

  // Trang chủ & banner — prefill copy seed DESIGN §1
  const [slogan, setSlogan] = useState("Công Nghệ Khai Mở – Chinh Phục Tam Giới");
  const [hero1, setHero1] = useState("THẦN BINH CÔNG NGHỆ");
  const [hero2, setHero2] = useState("CHINH PHỤC NGŨ ĐẠI THẾ GIỚI");
  const [subtitle, setSubtitle] = useState(
    "Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp & MU.",
  );
  const [cta1, setCta1] = useState("KHÁM PHÁ PHẦN MỀM");
  const [cta2, setCta2] = useState("XEM BẢNG GIÁ");

  // Ghi chú thanh toán
  const [paymentNote, setPaymentNote] = useState(settings.paymentNote ?? "");

  // Hướng dẫn / FAQ / Tin cập nhật
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideSteps, setNewGuideSteps] = useState("");
  const [guideError, setGuideError] = useState<string>();
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [faqError, setFaqError] = useState<string>();
  const [newTitle, setNewTitle] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newsError, setNewsError] = useState<string>();

  // Xem trước email
  const [template, setTemplate] = useState("created");

  function save(key: string) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSavedTab(key);
    };
  }


  function addGuide() {
    if (!newGuideTitle.trim()) {
      setGuideError("Nhập tiêu đề hướng dẫn.");
      return;
    }
    setGuideError(undefined);
    setGuides((gs) => [
      {
        slug: `demo-${Date.now().toString(36)}`,
        title: newGuideTitle.trim(),
        productSlug: null,
        publishedAt: new Date().toISOString(),
        steps: newGuideSteps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      ...gs,
    ]);
    setNewGuideTitle("");
    setNewGuideSteps("");
  }

  function addFaq() {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setFaqError("Nhập đủ câu hỏi và trả lời.");
      return;
    }
    setFaqError(undefined);
    setFaqs((fs) => [
      ...fs,
      { question: newQuestion.trim(), answer: newAnswer.trim() },
    ]);
    setNewQuestion("");
    setNewAnswer("");
  }

  function addAnnouncement() {
    if (!newTitle.trim()) {
      setNewsError("Nhập tiêu đề tin.");
      return;
    }
    setNewsError(undefined);
    setAnnouncements((as) => [
      {
        slug: `demo-${Date.now().toString(36)}`,
        title: newTitle.trim(),
        productSlug: newProduct || null,
        publishedAt: new Date().toISOString(),
        excerpt: "",
        body: newBody
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      ...as,
    ]);
    setNewTitle("");
    setNewBody("");
  }

  function productName(slug: string | null): string {
    if (!slug) return "Chung";
    return products.find((p) => p.slug === slug)?.name ?? slug;
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Nhóm nội dung" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className={`min-h-11 rounded-control border px-3 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-action text-action"
                : "border-border-subtle text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="max-w-3xl">
        {tab === "home" ? (
          <form onSubmit={save("home")} className="flex flex-col gap-4">
            <Saved show={savedTab === "home"} />
            <Field
              label="Slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Hero — dòng 1"
                value={hero1}
                onChange={(e) => setHero1(e.target.value)}
              />
              <Field
                label="Hero — dòng 2"
                value={hero2}
                onChange={(e) => setHero2(e.target.value)}
              />
            </div>
            <Textarea
              label="Phụ đề hero"
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nút chính (hero)"
                value={cta1}
                onChange={(e) => setCta1(e.target.value)}
              />
              <Field
                label="Nút phụ (hero)"
                value={cta2}
                onChange={(e) => setCta2(e.target.value)}
              />
            </div>
            <div>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        ) : null}

        {tab === "payment" ? (
          <form onSubmit={save("payment")} className="flex flex-col gap-4">
            <Saved show={savedTab === "payment"} />
            <Textarea
              label="Ghi chú thanh toán"
              rows={4}
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              hint="Hiển thị ở trang thanh toán và đơn hàng; để trống sẽ ẩn."
            />
            <div>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        ) : null}

        {tab === "guides" ? (
          <form onSubmit={save("guides")} className="flex flex-col gap-4">
            <Saved show={savedTab === "guides"} />
            <ul className="flex flex-col gap-2">
              {guides.map((g) => (
                <li
                  key={g.slug}
                  className="rounded-panel border border-border-subtle px-4 py-3"
                >
                  <p className="font-medium text-text-primary">{g.title}</p>
                  <p className="text-sm text-text-muted">
                    {productName(g.productSlug)} · {formatDate(g.publishedAt)}{" "}
                    · {g.steps.length} bước
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 rounded-panel border border-border-subtle p-4">
              <h2 className="text-base font-semibold text-text-primary">
                Thêm hướng dẫn
              </h2>
              <Field
                label="Tiêu đề"
                value={newGuideTitle}
                onChange={(e) => setNewGuideTitle(e.target.value)}
                error={guideError}
              />
              <Textarea
                label="Các bước"
                rows={4}
                value={newGuideSteps}
                onChange={(e) => setNewGuideSteps(e.target.value)}
                hint="Mỗi dòng một bước."
              />
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={addGuide}>
                  Thêm hướng dẫn
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </div>
          </form>
        ) : null}

        {tab === "faq" ? (
          <form onSubmit={save("faq")} className="flex flex-col gap-4">
            <Saved show={savedTab === "faq"} />
            <ul className="flex flex-col gap-2">
              {faqs.map((f, i) => (
                <li
                  key={`faq-${i}`}
                  className="rounded-panel border border-border-subtle px-4 py-3"
                >
                  <p className="font-medium text-text-primary">{f.question}</p>
                  <p className="mt-1 text-sm text-text-secondary">{f.answer}</p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 rounded-panel border border-border-subtle p-4">
              <h2 className="text-base font-semibold text-text-primary">
                Thêm câu hỏi
              </h2>
              <Field
                label="Câu hỏi"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                error={faqError}
              />
              <Textarea
                label="Trả lời"
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={addFaq}>
                  Thêm câu hỏi
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </div>
          </form>
        ) : null}

        {tab === "news" ? (
          <form onSubmit={save("news")} className="flex flex-col gap-4">
            <Saved show={savedTab === "news"} />
            <ul className="flex flex-col gap-2">
              {announcements.map((a) => (
                <li
                  key={a.slug}
                  className="rounded-panel border border-border-subtle px-4 py-3"
                >
                  <p className="font-medium text-text-primary">{a.title}</p>
                  <p className="text-sm text-text-muted">
                    {productName(a.productSlug)} · {formatDate(a.publishedAt)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 rounded-panel border border-border-subtle p-4">
              <h2 className="text-base font-semibold text-text-primary">
                Thêm tin cập nhật
              </h2>
              <Field
                label="Tiêu đề"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                error={newsError}
              />
              <Select
                label="Game"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
              >
                <option value="">Chung</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Nội dung"
                rows={4}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                hint="Mỗi dòng một đoạn."
              />
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAnnouncement}
                >
                  Thêm tin
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </div>
          </form>
        ) : null}

        {tab === "legal" ? (
          <div className="flex flex-col gap-6">
            {legalPages.map((p) => (
              <form
                key={p.slug}
                onSubmit={save(`legal-${p.slug}`)}
                className="flex flex-col gap-4 rounded-panel border border-border-subtle p-4"
              >
                <h2 className="text-base font-semibold text-text-primary">
                  {p.title}
                </h2>
                <Saved show={savedTab === `legal-${p.slug}`} />
                <Textarea
                  label="Nội dung"
                  rows={8}
                  defaultValue={p.body.join("\n\n")}
                  hint="Mỗi đoạn cách nhau một dòng trống."
                />
                <div>
                  <Button type="submit">Lưu trang này</Button>
                </div>
              </form>
            ))}
          </div>
        ) : null}

        {tab === "email" ? (
          <div className="flex flex-col gap-4">
            <Select
              label="Mẫu email"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {Object.entries(EMAIL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
            <pre className="whitespace-pre-wrap rounded-panel border border-border-subtle bg-surface-panel p-4 text-sm text-text-primary">
              {EMAIL_TEMPLATES[template]}
            </pre>
            <p className="text-sm text-text-muted">
              Email không bao giờ chứa mã bản quyền.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
