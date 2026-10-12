/*
 * Trang danh mục /phan-mem (DESIGN §4–§5): h1 "Phần mềm" + lưới năm thẻ game,
 * cùng cơ chế bố cục với trang chủ — ≥1200px năm thẻ dọc một hàng;
 * 640–1199px thẻ ngang hai cột (2+2+1, cuối canh giữa); <640px ngang một cột.
 */
import type { Metadata } from "next";
import { getProducts } from "@/demo";
import { GameCard } from "@/shared/ui/GameCard";

export const metadata: Metadata = { title: "Phần mềm" };

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 xl:px-8 xl:py-16">
      <h1 className="text-3xl font-semibold text-text-primary">Phần mềm</h1>

      {/* ≥1200px: năm thẻ dọc một hàng */}
      <div className="mt-8 hidden justify-between xl:flex">
        {products.map((p) => (
          <GameCard key={p.slug} product={p} layout="vertical" />
        ))}
      </div>

      {/* 640–1199px: thẻ ngang hai cột (2+2+1, thẻ cuối canh giữa) */}
      <div className="mt-8 hidden grid-cols-2 gap-4 sm:grid xl:hidden">
        {products.map((p, i) => (
          <div
            key={p.slug}
            className={
              i === products.length - 1 && products.length % 2 === 1
                ? "col-span-2 mx-auto w-full max-w-[calc(50%-8px)]"
                : ""
            }
          >
            <GameCard product={p} layout="horizontal" />
          </div>
        ))}
      </div>

      {/* <640px: thẻ ngang một cột */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:hidden">
        {products.map((p) => (
          <GameCard key={p.slug} product={p} layout="horizontal" />
        ))}
      </div>
    </div>
  );
}
