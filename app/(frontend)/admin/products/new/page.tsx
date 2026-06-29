import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminProductForm } from "../_components/AdminProductForm";
import { listProductFilterOptions } from "@/services/domains/product/repository";
import { requireAdminUser } from "@/utils/admin-auth";
import "../../admin.css";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdminUser();

  const filterOptions = await listProductFilterOptions();

  return (
    <main className="admin-page">
      <section className="container-shell admin-hero">
        <div>
          <p>Product Management</p>
          <h1>새 제품 추가</h1>
          <span>제품명, 가격, 작물/토양 정보를 입력하면 마켓 상품 목록에 바로 반영됩니다.</span>
        </div>
        <Link href="/admin" className="admin-secondary-button">
          <ArrowLeft size={18} />
          대시보드
        </Link>
      </section>

      <section className="container-shell admin-form-page">
        <AdminProductForm mode="create" filterOptions={filterOptions} />
      </section>
    </main>
  );
}
