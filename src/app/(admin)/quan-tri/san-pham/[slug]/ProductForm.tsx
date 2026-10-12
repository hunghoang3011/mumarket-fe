"use client";

/*
 * Form chỉnh sửa sản phẩm (DESIGN §5 Quản trị · Sản phẩm): tên, mô tả,
 * trạng thái + ghi chú, phiên bản, tính năng, các bước cài đặt và xem trước
 * ba crop ảnh đại diện. Bản demo: Lưu chỉ đổi client state + thông báo,
 * không gọi backend.
 */
import { useState, type FormEvent } from "react";
import type { Product, SoftwareStatus } from "@/demo/types";
import { formatDateTime } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { Field, Select, Textarea } from "@/shared/ui/Field";
import { GameArt } from "@/shared/ui/GameArt";
import { Notice } from "@/shared/ui/Notice";

const STATUS_OPTIONS: { value: SoftwareStatus; label: string }[] = [
  { value: "operational", label: "Hoạt động bình thường" },
  { value: "updating", label: "Đang cập nhật theo bản game mới" },
  { value: "paused", label: "Tạm ngừng hoạt động" },
  { value: "unreleased", label: "Chưa phát hành" },
];

const CROPS = [
  { crop: "card", label: "3:4", className: "aspect-[3/4]" },
  { crop: "square", label: "1:1", className: "aspect-square" },
  { crop: "cover", label: "16:10", className: "aspect-[16/10]" },
] as const;

export function ProductForm({ product }: { product: Product }) {
  const [name, setName] = useState(product.name);
  const [shortDescription, setShortDescription] = useState(
    product.shortDescription ?? "",
  );
  const [softwareStatus, setSoftwareStatus] = useState<SoftwareStatus>(
    product.softwareStatus,
  );
  const [statusNote, setStatusNote] = useState(product.statusNote ?? "");
  const [softwareVersion, setSoftwareVersion] = useState(
    product.softwareVersion ?? "",
  );
  const [supportedGameVersion, setSupportedGameVersion] = useState(
    product.supportedGameVersion ?? "",
  );
  const [features, setFeatures] = useState(product.features.join("\n"));
  const [installSteps, setInstallSteps] = useState(
    product.installSteps.join("\n"),
  );
  const [saved, setSaved] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-8">
      {saved ? (
        <Notice tone="success" role="status">
          Đã lưu (bản demo — dữ liệu trở lại mẫu khi tải lại).
        </Notice>
      ) : null}

      <section aria-labelledby="thong-tin" className="flex flex-col gap-4">
        <h2
          id="thong-tin"
          className="text-lg font-semibold text-text-primary"
        >
          Thông tin sản phẩm
        </h2>
        <Field
          label="Tên hiển thị"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          label="Mô tả ngắn"
          rows={3}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          hint="Tối đa hai dòng trên thẻ game và đầu trang sản phẩm."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Trạng thái phần mềm"
            value={softwareStatus}
            onChange={(e) =>
              setSoftwareStatus(e.target.value as SoftwareStatus)
            }
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Field
            label="Ghi chú trạng thái"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            hint="Hiển thị kèm nhãn trạng thái khi cần giải thích."
          />
        </div>
        <Field
          label="Cập nhật lúc"
          defaultValue={
            product.statusUpdatedAt
              ? formatDateTime(product.statusUpdatedAt, true)
              : "Chưa có thông tin"
          }
          readOnly
          hint="Hệ thống tự ghi khi trạng thái thay đổi — không sửa tay."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Phiên bản phần mềm"
            value={softwareVersion}
            onChange={(e) => setSoftwareVersion(e.target.value)}
            placeholder="3.2.1"
          />
          <Field
            label="Phiên bản game hỗ trợ"
            value={supportedGameVersion}
            onChange={(e) => setSupportedGameVersion(e.target.value)}
            placeholder="1.9.4"
          />
        </div>
        <Textarea
          label="Tính năng"
          rows={6}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          hint="Mỗi dòng một tính năng."
        />
        <Textarea
          label="Các bước cài đặt"
          rows={6}
          value={installSteps}
          onChange={(e) => setInstallSteps(e.target.value)}
          hint="Mỗi dòng một bước."
        />
      </section>

      <section aria-labelledby="anh-dai-dien" className="flex flex-col gap-4">
        <h2
          id="anh-dai-dien"
          className="text-lg font-semibold text-text-primary"
        >
          Ảnh đại diện
        </h2>
        <div className="grid items-start gap-4 sm:grid-cols-3">
          {CROPS.map((c) => (
            <figure key={c.crop} className="flex flex-col gap-2">
              <GameArt
                slug={product.slug}
                crop={c.crop}
                className={`${c.className} w-full rounded-detail border border-border-subtle`}
              />
              <figcaption className="text-sm text-text-muted">
                {c.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-sm text-text-muted">
          Bản demo dùng artwork tạm; khi có CMS thật: tải ảnh gốc ≥1600px, đặt
          tiêu điểm, xem trước ba crop.
        </p>
      </section>

      <div>
        <Button type="submit">Lưu thay đổi</Button>
      </div>
    </form>
  );
}
