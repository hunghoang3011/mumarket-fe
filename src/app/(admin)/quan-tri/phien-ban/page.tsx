"use client";

/*
 * /quan-tri/phien-ban — lịch sử phiên bản theo sản phẩm + form "Thêm phiên
 * bản" (DESIGN §5 Quản trị · Sản phẩm). Toàn trang là client leaf vì thao
 * tác thêm quản lý state tại chỗ (bản demo không có backend); nguồn nền là
 * fixtures demo, tôn trọng DEMO_ENABLED giống getProducts().
 */
import { useState, type FormEvent } from "react";
import { DEMO_ENABLED } from "@/demo/config";
import { demoProducts } from "@/demo/fixtures/catalog";
import type { Release } from "@/demo/types";
import { formatDate } from "@/shared/format/date";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Field, Select, Textarea } from "@/shared/ui/Field";
import { Empty, Notice } from "@/shared/ui/Notice";

type Row = Release & { id: string };

const columns: Column<Row>[] = [
  { key: "version", header: "Phiên bản", render: (r) => r.version },
  {
    key: "gameVersion",
    header: "Bản game",
    render: (r) => r.gameVersion ?? "—",
  },
  {
    key: "releasedAt",
    header: "Ngày phát hành",
    render: (r) => formatDate(r.releasedAt),
  },
  {
    key: "downloadable",
    header: "Cho tải",
    render: (r) => (r.downloadable ? "Có" : "Không"),
  },
  {
    key: "notes",
    header: "Ghi chú",
    render: (r) => (r.notes.length > 0 ? r.notes.join("; ") : "—"),
  },
];

export default function AdminReleasesPage() {
  const products = DEMO_ENABLED ? demoProducts : [];
  const [added, setAdded] = useState<Record<string, Release[]>>({});
  const [filter, setFilter] = useState("all");

  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const [version, setVersion] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [downloadable, setDownloadable] = useState(true);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);

  const shown =
    filter === "all" ? products : products.filter((p) => p.slug === filter);

  function addRelease(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!version.trim()) {
      setError("Nhập số phiên bản, ví dụ 3.2.2.");
      setSaved(false);
      return;
    }
    setError(undefined);
    const release: Release = {
      version: version.trim(),
      gameVersion: gameVersion.trim() || null,
      releasedAt: new Date().toISOString(),
      notes: notes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      downloadable,
    };
    setAdded((prev) => ({
      ...prev,
      [slug]: [release, ...(prev[slug] ?? [])],
    }));
    setVersion("");
    setGameVersion("");
    setNotes("");
    setDownloadable(true);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Phiên bản</h1>

      {products.length > 1 ? (
        <div className="max-w-xs">
          <Select
            label="Lọc theo sản phẩm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả sản phẩm</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {shown.map((p) => {
        const releases = [...(added[p.slug] ?? []), ...p.releases];
        const rows: Row[] = releases.map((r) => ({
          ...r,
          id: `${p.slug}-${r.version}`,
        }));
        return (
          <section
            key={p.slug}
            aria-labelledby={`pb-${p.slug}`}
            className="flex flex-col gap-3"
          >
            <h2
              id={`pb-${p.slug}`}
              className="text-lg font-semibold text-text-primary"
            >
              {p.name}
            </h2>
            <DataTable
              columns={columns}
              rows={rows}
              caption={`Lịch sử phiên bản của ${p.name}`}
              empty={<Empty title="Chưa có phiên bản nào." />}
            />
          </section>
        );
      })}

      <section
        aria-labelledby="them-phien-ban"
        className="flex max-w-2xl flex-col gap-4"
      >
        <h2
          id="them-phien-ban"
          className="text-lg font-semibold text-text-primary"
        >
          Thêm phiên bản
        </h2>
        {saved ? (
          <Notice tone="success" role="status">
            Đã lưu (bản demo — dữ liệu trở lại mẫu khi tải lại).
          </Notice>
        ) : null}
        <form onSubmit={addRelease} noValidate className="flex flex-col gap-4">
          <Select
            label="Sản phẩm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Phiên bản"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="3.2.2"
              error={error}
            />
            <Field
              label="Bản game"
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              placeholder="1.9.5"
            />
          </div>
          <Textarea
            label="Ghi chú"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            hint="Mỗi dòng một ghi chú; có thể để trống."
          />
          <label className="flex min-h-11 items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={downloadable}
              onChange={(e) => setDownloadable(e.target.checked)}
              className="h-5 w-5"
            />
            Cho phép tải
          </label>
          <div>
            <Button type="submit">Thêm phiên bản</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
