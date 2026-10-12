/*
 * /ho-tro — Hỗ trợ (DESIGN §5; J6).
 * Ba khối: FAQ dùng <details>/<summary> ngữ nghĩa (bàn phím dùng được),
 * liên hệ công khai từ cấu hình, và lối gửi yêu cầu hỗ trợ theo vai trò.
 * Nhắc đúng copy: "Không gửi mật khẩu hoặc mã bản quyền."
 */
import Link from "next/link";
import { getFaqs, getSettings } from "@/demo";
import { getDemoSession } from "@/demo/session";
import { LinkButton } from "@/shared/ui/Button";
import { Notice } from "@/shared/ui/Notice";

export default async function SupportPage() {
  const [faqs, settings, session] = await Promise.all([
    getFaqs(),
    getSettings(),
    getDemoSession(),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="font-display text-2xl font-semibold text-action sm:text-3xl">
        Hỗ trợ
      </h1>
      <span className="divider-editorial mt-3" aria-hidden="true">
        <span />
      </span>

      {/* Câu hỏi thường gặp */}
      <section aria-labelledby="t-ho-tro-faq" className="mt-10">
        <h2
          id="t-ho-tro-faq"
          className="text-xl font-semibold text-text-primary"
        >
          Câu hỏi thường gặp
        </h2>
        {faqs.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">
            Chưa có câu hỏi thường gặp nào.
          </p>
        ) : (
          <div className="mt-4 max-w-[68ch] space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-panel border border-border-subtle bg-surface-panel px-4 py-3"
              >
                <summary className="cursor-pointer text-base font-medium text-text-primary">
                  {f.question}
                </summary>
                <p className="mt-2 text-sm text-text-secondary">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Liên hệ công khai */}
      <section aria-labelledby="t-ho-tro-lien-he" className="mt-10">
        <h2
          id="t-ho-tro-lien-he"
          className="text-xl font-semibold text-text-primary"
        >
          Liên hệ
        </h2>
        <div className="mt-4 max-w-[68ch] space-y-2 text-base text-text-secondary">
          {settings.contactEmail ? (
            <p>
              Email:{" "}
              <a
                href={`mailto:${settings.contactEmail}`}
                className="content-link"
              >
                {settings.contactEmail}
              </a>
            </p>
          ) : null}
          {settings.contactNote ? <p>{settings.contactNote}</p> : null}
          {!settings.contactEmail && !settings.contactNote ? (
            <p className="text-text-muted">Chưa có thông tin.</p>
          ) : null}
        </div>
      </section>

      {/* Gửi yêu cầu hỗ trợ */}
      <section aria-labelledby="t-ho-tro-yeu-cau" className="mt-10">
        <h2
          id="t-ho-tro-yeu-cau"
          className="text-xl font-semibold text-text-primary"
        >
          Gửi yêu cầu hỗ trợ
        </h2>
        <div className="mt-4 max-w-[68ch]">
          {session.role === "guest" ? (
            <p className="text-base text-text-secondary">
              <Link
                href="/dang-nhap?next=%2Ftai-khoan%2Fho-tro"
                className="content-link"
              >
                Đăng nhập
              </Link>{" "}
              để gửi yêu cầu hỗ trợ.
            </p>
          ) : (
            <LinkButton href="/tai-khoan/ho-tro" variant="outline">
              Gửi yêu cầu hỗ trợ
            </LinkButton>
          )}
          <div className="mt-4">
            <Notice tone="neutral">
              Không gửi mật khẩu hoặc mã bản quyền.
            </Notice>
          </div>
        </div>
      </section>
    </div>
  );
}
