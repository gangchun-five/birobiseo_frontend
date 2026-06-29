import Link from "next/link";
import { BarChart3, Boxes, Edit3, PackagePlus, Star, Tags } from "lucide-react";
import { paginate } from "@/utils/http";
import type { Paginated } from "@/types";
import "./admin.css";

import { listProducts, Product } from "@/services/domains/product/repository";
import { requireAdminUser } from "@/utils/admin-auth";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export default async function AdminPage() {
  await requireAdminUser();

  const product = await listProducts({ sort: "latest" });

  const productPage = paginate(product, 0, 100) as Paginated<Product>;
  const products = productPage.content;
  const bestCount = products.filter((product) => product.badge === "BEST").length;
  const averageRating = products.length
    ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
    : 0;
  const totalCatalogValue = products.reduce((sum, product) => sum + product.price, 0);
  const stats = [
    { label: "등록 제품", value: `${productPage.totalElements}개`, icon: Boxes },
    { label: "대표 배지", value: `${bestCount}개`, icon: Tags },
    { label: "평균 평점", value: averageRating.toFixed(1), icon: Star },
    { label: "카탈로그 단가 합계", value: formatPrice(totalCatalogValue), icon: BarChart3 }
  ];

  return (
    <main className="admin-page">
        <section className="container-shell admin-hero">
          <div>
            <p>Admin Dashboard</p>
            <h1>제품 관리 대시보드</h1>
            <span>마켓에 노출되는 비료 상품을 등록하고 최신 정보로 관리하세요.</span>
          </div>
          <Link href="/admin/products/new" className="admin-primary-button">
            <PackagePlus size={18} />
            새 제품 추가
          </Link>
        </section>

        <section className="container-shell admin-dashboard">
          <div className="admin-content">
            <div className="admin-stat-grid">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article className="admin-stat-card" key={stat.label}>
                    <span aria-hidden="true"><Icon size={21} /></span>
                    <div>
                      <p>{stat.label}</p>
                      <strong>{stat.value}</strong>
                    </div>
                  </article>
                );
              })}
            </div>

            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <p>최근 등록순</p>
                  <h2>제품 목록</h2>
                </div>
                <span>총 {productPage.totalElements}개</span>
              </div>

              {products.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-product-table">
                    <thead>
                      <tr>
                        <th>제품</th>
                        <th>작물</th>
                        <th>토양</th>
                        <th>가격</th>
                        <th>중량</th>
                        <th>평점</th>
                        <th>배지</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="admin-product-name">
                              <strong>{product.name}</strong>
                              <span>{product.description}</span>
                            </div>
                          </td>
                          <td>{product.crop}</td>
                          <td>{product.soil}</td>
                          <td>{formatPrice(product.price)}</td>
                          <td>{product.weight}</td>
                          <td>{product.rating.toFixed(1)}</td>
                          <td>
                            {product.badge ? <span className="admin-badge">{product.badge}</span> : <span className="admin-muted">없음</span>}
                          </td>
                          <td>
                            <Link href={`/admin/products/${product.id}/edit`} className="admin-icon-button" aria-label={`${product.name} 수정`}>
                              <Edit3 size={16} />
                              수정
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="admin-empty">등록된 제품이 없습니다.</p>
              )}
            </section>
          </div>
        </section>
    </main>
  );
}
