/*
 * Footer (DESIGN §4): thông tin kinh doanh/liên hệ do chủ sở hữu cung cấp
 * (qua CMS/settings), hướng dẫn, điều khoản, quyền riêng tư, chính sách
 * hoàn tiền, slogan. Không tự sinh địa chỉ, hotline hay chứng nhận.
 */
import Link from "next/link";
import { getProducts, getSettings } from "@/demo";
import { Wordmark } from "../Wordmark";

export async function SiteFooter() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <footer className="border-t border-border-subtle bg-surface-panel">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:grid-cols-2 xl:grid-cols-4 xl:px-8">
        <div>
          <Wordmark />
          <p className="mt-3 text-sm text-text-secondary">
            Công Nghệ Khai Mở – Chinh Phục Tam Giới
          </p>
          {settings.contactEmail ? (
            <p className="mt-2 text-sm text-text-muted">
              Liên hệ:{" "}
              <a className="content-link" href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
            </p>
          ) : null}
          {settings.contactNote ? (
            <p className="mt-1 text-sm text-text-muted">{settings.contactNote}</p>
          ) : null}
        </div>
        <nav aria-label="Sản phẩm">
          <p className="text-sm font-semibold text-text-primary">Phần mềm</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link className="content-link" href={`/phan-mem/${p.slug}`}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Hỗ trợ">
          <p className="text-sm font-semibold text-text-primary">Hỗ trợ</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link className="content-link" href="/huong-dan">
                Hướng dẫn
              </Link>
            </li>
            <li>
              <Link className="content-link" href="/cap-nhat">
                Cập nhật
              </Link>
            </li>
            <li>
              <Link className="content-link" href="/ho-tro">
                Hỗ trợ
              </Link>
            </li>
            <li>
              <Link className="content-link" href="/bang-gia">
                Bảng giá
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Chính sách">
          <p className="text-sm font-semibold text-text-primary">Chính sách</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link className="content-link" href="/dieu-khoan">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link className="content-link" href="/quyen-rieng-tu">
                Quyền riêng tư
              </Link>
            </li>
            <li>
              <Link className="content-link" href="/chinh-sach-hoan-tien">
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border-subtle">
        <p className="mx-auto max-w-[1200px] px-4 py-4 text-xs text-text-muted xl:px-8">
          GALAXY AUTO — cửa hàng phần mềm auto do một chủ sở hữu vận hành.
          Không phải nhà phát hành game.
        </p>
      </div>
    </footer>
  );
}
