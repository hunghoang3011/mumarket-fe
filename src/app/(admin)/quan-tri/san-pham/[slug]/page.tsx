/*
 * /quan-tri/san-pham/[slug] — form chỉnh sửa một slot sản phẩm (DESIGN §5
 * Quản trị · Sản phẩm). Slug lạ → 404. Lưu ở bản demo chỉ là client state.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/demo";
import { ProductForm } from "./ProductForm";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <p>
        <Link href="/quan-tri/san-pham" className="content-link text-sm">
          ← Sản phẩm
        </Link>
      </p>
      <h1 className="text-2xl font-semibold text-text-primary">
        {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
