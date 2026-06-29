import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminProductForm } from "../../_components/AdminProductForm";
import { getProductDetail, listProductFilterOptions } from "@/services/domains/product/repository";
import type { RouteParams } from "@/types";
import { requireAdminUser } from "@/utils/admin-auth";
import "../../../admin.css";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: RouteParams<{ productId: string }>) {
  await requireAdminUser();

  const { productId } = await params;
  const [product, filterOptions] = await Promise.all([
    getProductDetail(Number(productId)),
    listProductFilterOptions()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="admin-page">
      <section className="container-shell admin-hero">
        <div>
          <p>Product Management</p>
          <h1>제품 수정</h1>
          <span>{product.name}의 마켓 노출 정보를 업데이트합니다.</span>
        </div>
        <Link href="/admin" className="admin-secondary-button">
          <ArrowLeft size={18} />
          대시보드
        </Link>
      </section>

      <section className="container-shell admin-form-page">
        <AdminProductForm mode="edit" product={product} filterOptions={filterOptions} />
      </section>
    </main>
  );
}
