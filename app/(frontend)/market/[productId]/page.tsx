import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock3,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Star,
  Truck,
  Wheat
} from "lucide-react";
import { paginate } from "@/utils/http";
import type { Paginated, RouteParams } from "@/types";
import "../market.css";
import "./product-detail.css";

import { ProductDetailActions } from "./_components/ProductDetailActions";
import { ProductCard } from "@/components/ProductCard";
import { ProductRating } from "@/components/ProductRating";
import { getProductDetail, listReviews } from "@/services/domains/product/repository";
import { createProductReviewAction } from "@/services/domains/review/actions";
import { hasPurchasedProduct, Review } from "@/services/domains/review/repository";
import { getSessionUser } from "@/utils/session";

export const dynamic = "force-dynamic";

const cropIcons = [Sprout, Leaf, Wheat, PackageCheck, ShieldCheck];

export default async function ProductDetailPage({ params }: RouteParams<{ productId: string }>) {
  const { productId } = await params;
  const product = await getProductDetail(Number(productId));
  const user = await getSessionUser();

  if (!product) {
    notFound();
  }

  const [reviewPage, canWriteReview] = await Promise.all([
    listReviews(new URLSearchParams(`productId=${product.id}&size=3`)).then((reviews) => paginate(reviews, 0, 3) as Paginated<Review>),
    user ? hasPurchasedProduct(user.id, product.id) : Promise.resolve(false)
  ]);
  async function submitProductReview(formData: FormData) {
    "use server";
    await createProductReviewAction(formData);
  }

  const tabItems = [
    ["상품 정보", "#product-info"],
    ["성분 및 효과", "#effects"],
    [`리뷰 (${product.reviewCount})`, "#reviews"],
    ["배송/교환/반품", "#shipping"]
  ];

  return (
    <main className="product-detail-page">
        <section className="container-shell product-detail-hero">
          <div className="product-gallery">
            <div className="product-image-stage">
              {product.badge ? <span className="detail-badge">{product.badge}</span> : null}
              <Image
                src={`/product/${product.id}.png`}
                alt={`${product.name} 상품 이미지`}
                fill
              />
              <p>모니터 해상도에 따라 실제 색상과 차이가 있을 수 있습니다.</p>
            </div>
          </div>

          <div className="product-summary">
            <p className="product-kicker">{product.categoryLabel}</p>
            <h1>{product.name}</h1>
            <p className="summary-description">{product.shortDescription}</p>
            <div className="rating-row">
              <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <ProductDetailActions productId={product.id} options={product.purchaseOptions} />
            <div className="shipping-strip">
              <span><Truck size={18} />무료배송 ({product.shipping.freeShippingThreshold.toLocaleString("ko-KR")}원 이상)</span>
              <span><Clock3 size={18} />{product.shipping.estimatedDelivery} ({product.shipping.todayCutoff})</span>
            </div>
          </div>
        </section>

        <nav className="container-shell detail-tabs" aria-label="상품 상세 메뉴">
          {tabItems.map(([label, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}>{label}</Link>
          ))}
        </nav>

        <section className="container-shell detail-content-grid">
          <article className="detail-card product-info-card" id="product-info">
            <h2>상품 정보</h2>
            <p>{product.info.summary}</p>
            <dl className="spec-table">
              {product.info.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="detail-card effect-card" id="effects">
            <h2>주요 효과</h2>
            <ul className="check-list">
              {product.effects.map((effect) => (
                <li key={effect}><ShieldCheck size={16} />{effect}</li>
              ))}
            </ul>
            <div className="recommended-crops">
              <h3>추천 작물</h3>
              <div>
                {product.recommendedCrops.map((crop, index) => {
                  const CropIcon = cropIcons[index % cropIcons.length];

                  return (
                    <span key={`${crop.name}-${index}`}>
                      <CropIcon size={26} />
                      <strong>{crop.name}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="caution-box">
              <h3>주의사항</h3>
              <ul>
                {product.cautions.map((caution) => <li key={caution}>{caution}</li>)}
              </ul>
            </div>
          </article>

          <article className="detail-card">
            <h2>성분 구성</h2>
            <div className="ingredient-tags">
              {product.ingredients.map((ingredient) => <span key={ingredient}>{ingredient}</span>)}
            </div>
          </article>
        </section>

        <section className="container-shell detail-card review-preview" id="reviews">
          <div className="detail-section-head">
            <h2>리뷰</h2>
            <Link href={`/market/${product.id}#reviews`}>더보기</Link>
          </div>
          <form className="detail-review-form" action={submitProductReview}>
            <input type="hidden" name="productId" value={product.id} />
            <label>
              <span>별점</span>
              <select name="rating" defaultValue="5" disabled={!canWriteReview} required>
                <option value="5">5점</option>
                <option value="4">4점</option>
                <option value="3">3점</option>
                <option value="2">2점</option>
                <option value="1">1점</option>
              </select>
            </label>
            <label>
              <span>리뷰 내용</span>
              <textarea
                name="content"
                placeholder={canWriteReview ? "구매한 상품의 사용 경험을 남겨주세요." : "제품 구매자만 리뷰를 작성할 수 있습니다."}
                disabled={!canWriteReview}
                required
                minLength={5}
              />
            </label>
            <button type="submit" disabled={!canWriteReview}>리뷰 등록</button>
          </form>
          <div className="detail-review-grid">
            {reviewPage.content.length > 0 ? reviewPage.content.map((review) => (
              <article key={review.id}>
                <div>
                  <strong>{review.name}</strong>
                  <span><Star size={14} fill="currentColor" />{review.rating}.0</span>
                </div>
                <p>{review.content}</p>
                <em>{review.date}</em>
              </article>
            )) : (
              <p className="empty-detail-text">아직 등록된 리뷰가 없습니다.</p>
            )}
          </div>
        </section>

        <section className="container-shell detail-card shipping-card" id="shipping">
          <h2>배송/교환/반품</h2>
          <div>
            <p><Truck size={18} />{product.shipping.freeShippingThreshold.toLocaleString("ko-KR")}원 이상 무료배송</p>
            <p><Clock3 size={18} />{product.shipping.todayCutoff} {product.shipping.estimatedDelivery}</p>
            <p><PackageCheck size={18} />수령 후 7일 이내 미개봉 상품 교환/반품 가능</p>
          </div>
        </section>

        <section className="container-shell related-products">
          <div className="detail-section-head">
            <h2>함께 보면 좋은 비료</h2>
            <Link href="/market">더보기</Link>
          </div>
          <div className="market-product-grid">
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
    </main>
  );
}
