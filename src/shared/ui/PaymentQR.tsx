"use client";

/*
 * PaymentQR (DESIGN §7): mã VietQR PNG tối thiểu 240px trên nền trắng có
 * vùng trống; "Lưu ảnh QR" dùng Web Share khi trình duyệt hỗ trợ, không thì
 * tải file; kèm gợi ý nhấn giữ ảnh. Lỗi tạo QR → còn chuyển khoản thủ công.
 * Bản demo: payload dựng phía client từ snapshot đơn (backend thật: server).
 */
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildVietQrPayload } from "../vietqr/payload";
import type { VietQrSnapshot } from "../vietqr/payload";
import { Button } from "./Button";
import { Notice } from "./Notice";

export function PaymentQR({ snapshot }: { snapshot: VietQrSnapshot }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareHint, setShareHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(buildVietQrPayload(snapshot), {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError("Không tạo được mã QR.");
      });
    return () => {
      cancelled = true;
    };
  }, [snapshot]);

  const save = async () => {
    if (!dataUrl) return;
    setShareHint(null);
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `qr-${snapshot.transferReference}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Mã QR chuyển khoản" });
        return;
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-${snapshot.transferReference}.png`;
      a.click();
      setShareHint("Đã tải ảnh QR về máy.");
    } catch {
      setShareHint("Chưa lưu được — bạn có thể nhấn giữ ảnh QR để lưu.");
    }
  };

  if (error) {
    return (
      <Notice tone="warning" title="Không tạo được mã QR">
        Vui lòng chuyển khoản thủ công theo các thông tin bên dưới. Nội dung
        chuyển khoản và số tiền không đổi.
      </Notice>
    );
  }

  return (
    <div data-testid="payment-qr" className="flex flex-col items-center gap-3">
      <div className="rounded-panel bg-white p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`Mã QR chuyển khoản cho đơn ${snapshot.transferReference}`}
            width={240}
            height={240}
            className="h-60 w-60"
          />
        ) : (
          <div className="flex h-60 w-60 items-center justify-center text-sm text-black">
            Đang tạo mã QR…
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={save} disabled={!dataUrl}>
        Lưu ảnh QR
      </Button>
      <p className="text-center text-sm text-text-muted">
        Mở ứng dụng ngân hàng, chọn Quét QR rồi chọn ảnh vừa lưu.
        <br />
        hoặc nhấn giữ ảnh để lưu.
      </p>
      {shareHint ? (
        <p aria-live="polite" className="text-sm text-success">
          {shareHint}
        </p>
      ) : null}
    </div>
  );
}
