"use client";

/*
 * Quản lý gói giá theo sản phẩm (DESIGN §5 Quản trị · Sản phẩm, §3 thuật
 * ngữ): dùng thử không bao giờ hiển thị như giá 0 ₫. Mỗi sản phẩm một form
 * "Thêm gói" riêng — không sửa gói của sản phẩm khác cùng lúc. Validate
 * inline: 1–3650 ngày, 1–100 máy, gói trả phí bắt buộc giá > 0. Bản demo:
 * thêm/bật/tắt chỉ đổi client state.
 */
import { useState, type FormEvent } from "react";
import type { Offer, OfferKind, Product } from "@/demo/types";
import { formatVnd } from "@/shared/format/money";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Field, Select } from "@/shared/ui/Field";
import { Empty, Notice } from "@/shared/ui/Notice";

const KIND_LABEL: Record<OfferKind, string> = {
  trial: "Dùng thử",
  "7_day": "7 ngày",
  "30_day": "30 ngày",
  "90_day": "90 ngày",
  custom: "Tùy chỉnh",
};

const KIND_DAYS: Record<OfferKind, string> = {
  trial: "3",
  "7_day": "7",
  "30_day": "30",
  "90_day": "90",
  custom: "",
};

function promotionLabel(o: Offer): string {
  if (!o.promotion) return "—";
  if (o.promotion.kind === "percent_bp") {
    return `Giảm ${o.promotion.value / 100}%`;
  }
  return `Giảm ${formatVnd(o.promotion.value)}`;
}

interface FormErrors {
  days?: string;
  devices?: string;
  price?: string;
  promo?: string;
}

function OfferSection({
  product,
  offers,
  onToggle,
  onAdd,
}: {
  product: Product;
  offers: Offer[];
  onToggle: (id: string) => void;
  onAdd: (offer: Offer) => void;
}) {
  const [kind, setKind] = useState<OfferKind>("30_day");
  const [days, setDays] = useState("30");
  const [devices, setDevices] = useState("1");
  const [price, setPrice] = useState("");
  const [promo, setPromo] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const columns: Column<Offer>[] = [
    {
      key: "kind",
      header: "Loại",
      render: (o) =>
        o.kind === "trial" ? "Dùng thử" : `${o.durationDays} ngày`,
    },
    { key: "devices", header: "Số máy", render: (o) => `${o.deviceCap} máy` },
    {
      key: "price",
      header: "Giá",
      align: "right",
      render: (o) => (o.kind === "trial" ? "—" : formatVnd(o.priceVnd)),
    },
    { key: "promo", header: "Khuyến mãi", render: promotionLabel },
    {
      key: "active",
      header: "Đang bán",
      render: (o) => (
        <span className="flex items-center gap-2">
          <span>{o.active ? "Có" : "Không"}</span>
          <Button size="sm" variant="outline" onClick={() => onToggle(o.id)}>
            {o.active ? "Tắt bán" : "Mở bán"}
          </Button>
        </span>
      ),
    },
  ];

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isTrial = kind === "trial";
    const nDays = Number(days);
    const nDevices = Number(devices);
    const nPrice = Number(price);
    const nPromo = promo.trim() === "" ? null : Number(promo);
    const next: FormErrors = {};
    if (!Number.isInteger(nDays) || nDays < 1 || nDays > 3650) {
      next.days = "Số ngày phải là số nguyên từ 1 tới 3650.";
    }
    if (!Number.isInteger(nDevices) || nDevices < 1 || nDevices > 100) {
      next.devices = "Số máy phải là số nguyên từ 1 tới 100.";
    }
    if (!isTrial && (!Number.isInteger(nPrice) || nPrice <= 0)) {
      next.price = "Gói trả phí bắt buộc giá lớn hơn 0 ₫.";
    }
    if (
      nPromo !== null &&
      (!Number.isInteger(nPromo) || nPromo < 1 || nPromo > 99)
    ) {
      next.promo = "Khuyến mãi theo phần trăm phải từ 1 tới 99.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSaved(false);
      return;
    }
    onAdd({
      id: `of-demo-${Date.now().toString(36)}`,
      productSlug: product.slug,
      kind,
      durationDays: nDays,
      deviceCap: nDevices,
      priceVnd: isTrial ? 0 : nPrice,
      active: true,
      promotion:
        !isTrial && nPromo !== null
          ? { kind: "percent_bp", value: nPromo * 100 }
          : null,
    });
    setDays(KIND_DAYS[kind]);
    setPrice("");
    setPromo("");
    setSaved(true);
  }

  return (
    <section
      aria-labelledby={`gg-${product.slug}`}
      className="flex flex-col gap-3"
    >
      <h2
        id={`gg-${product.slug}`}
        className="text-lg font-semibold text-text-primary"
      >
        {product.name}
      </h2>
      <DataTable
        columns={columns}
        rows={offers}
        caption={`Các gói của ${product.name}`}
        empty={<Empty title="Chưa có gói nào." />}
      />
      <form
        onSubmit={submit}
        noValidate
        className="flex max-w-2xl flex-col gap-4 rounded-panel border border-border-subtle p-4"
      >
        <h3 className="text-base font-semibold text-text-primary">Thêm gói</h3>
        {saved ? (
          <Notice tone="success" role="status">
            Đã lưu (bản demo — dữ liệu trở lại mẫu khi tải lại).
          </Notice>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Loại gói"
            value={kind}
            onChange={(e) => {
              const k = e.target.value as OfferKind;
              setKind(k);
              setDays(KIND_DAYS[k]);
            }}
          >
            {(Object.keys(KIND_LABEL) as OfferKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </Select>
          <Field
            label="Số ngày"
            required
            type="number"
            min={1}
            max={3650}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            error={errors.days}
          />
          <Field
            label="Số máy"
            required
            type="number"
            min={1}
            max={100}
            value={devices}
            onChange={(e) => setDevices(e.target.value)}
            error={errors.devices}
          />
        </div>
        {kind !== "trial" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Giá (VND)"
              required
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="129000"
              error={errors.price}
            />
            <Field
              label="Khuyến mãi (%)"
              type="number"
              min={1}
              max={99}
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              hint="Để trống nếu không khuyến mãi."
              error={errors.promo}
            />
          </div>
        ) : null}
        <div>
          <Button type="submit">Thêm gói</Button>
        </div>
      </form>
    </section>
  );
}

export function OffersAdmin({
  products,
  initialOffers,
}: {
  products: Product[];
  initialOffers: Offer[];
}) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  function toggle(id: string) {
    setOffers((os) =>
      os.map((o) => (o.id === id ? { ...o, active: !o.active } : o)),
    );
  }

  function add(offer: Offer) {
    setOffers((os) => [...os, offer]);
  }

  return (
    <>
      {products.map((p) => (
        <OfferSection
          key={p.slug}
          product={p}
          offers={offers.filter((o) => o.productSlug === p.slug)}
          onToggle={toggle}
          onAdd={add}
        />
      ))}
    </>
  );
}
