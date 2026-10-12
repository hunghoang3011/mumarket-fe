/*
 * DataTable / Pagination (DESIGN §7): bảng ngữ nghĩa; mobile giữ nhãn bằng
 * data-th; không giảm cỡ chữ dưới 14px; cột tiền canh phải.
 */
import type { ReactNode } from "react";
import { LinkButton } from "./Button";

export interface Column<Row> {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (row: Row) => ReactNode;
}

export function DataTable<Row extends { id: string }>({
  columns,
  rows,
  caption,
  empty,
}: {
  columns: Column<Row>[];
  rows: Row[];
  caption: string;
  empty: ReactNode;
}) {
  if (rows.length === 0) {
    return <>{empty}</>;
  }
  return (
    <div className="overflow-x-auto rounded-panel border border-border-subtle">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-border-subtle bg-surface-panel">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-4 py-3 font-medium text-text-secondary ${
                  c.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border-subtle last:border-0 hover:bg-surface-panel"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  data-th={c.header}
                  className={`px-4 py-3 align-top text-text-primary ${
                    c.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  /** Trả về href cho số trang (bộ lọc giữ trong URL) */
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <LinkButton href={hrefFor(page - 1)} variant="outline" size="sm">
          Trang trước
        </LinkButton>
      ) : null}
      <span className="text-sm text-text-muted">
        Trang {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <LinkButton href={hrefFor(page + 1)} variant="outline" size="sm">
          Trang sau
        </LinkButton>
      ) : null}
    </nav>
  );
}
