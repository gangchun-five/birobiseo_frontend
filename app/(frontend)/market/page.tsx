import Image from "next/image";
import Link from "next/link";
import { paginate } from "@/utils/http";
import type { PageSearchParams } from "@/types";
import "./market.css";

import { ProductCard } from "@/components/ProductCard";
import { ProductRating } from "@/components/ProductRating";
import { listProductFilterOptions, listProducts, listReviews } from "@/services/domains/product/repository";
import { CalendarSyncIcon, MessageSquareCheckIcon, RecycleIcon, TruckIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const sortOptions = [
  { label: "추천순", value: "recommended" },
  { label: "인기순", value: "popular" },
  { label: "최신순", value: "latest" },
  { label: "낮은 가격순", value: "price_asc" },
  { label: "높은 가격순", value: "price_desc" }
];

const serviceHighlights = [
  [RecycleIcon, "친환경 자원순환", "곤충 부산물을 활용한 친환경 비료"],
  [TruckIcon, "빠른 배송", "전국 어디서나 빠르고 안전하게"],
  [MessageSquareCheckIcon, "농가 리뷰 기반", "실제 농가의 리뷰로 믿을 수 있는 선택"],
  [CalendarSyncIcon, "정기 구독 가능", "필요한 주기에 맞춰 정기 배송"]
] as const;

function getParam(searchParams: Awaited<PageSearchParams>, key: string, fallback = "") {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function appendIfPresent(params: URLSearchParams, key: string, value: string) {
  if (value && value !== "전체") {
    params.set(key, value);
  }
}

export default async function MarketPage({ searchParams }: { searchParams: PageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const keyword = getParam(resolvedSearchParams, "keyword").trim();
  const cropCategory = getParam(resolvedSearchParams, "cropCategory", "전체");
  const soilType = getParam(resolvedSearchParams, "soilType", "전체");
  const sort = getParam(resolvedSearchParams, "sort", "recommended");
  const maxPrice = getParam(resolvedSearchParams, "maxPrice", "100000");
  const size = Math.max(12, Number(getParam(resolvedSearchParams, "size", "12")) || 12);
  const productQuery = new URLSearchParams({
    size: String(size),
    sort
  });

  appendIfPresent(productQuery, "keyword", keyword);
  appendIfPresent(productQuery, "cropCategory", cropCategory);
  appendIfPresent(productQuery, "soilType", soilType);
  appendIfPresent(productQuery, "maxPrice", maxPrice);

  const [productPage, filterOptions, reviewPage] = await Promise.all([
    listProducts({
      keyword,
      cropCategory,
      soilType,
      maxPrice: Number(maxPrice),
      sort
    }).then((items) => paginate(items, 0, size)),
    listProductFilterOptions(),
    listReviews(new URLSearchParams("sort=best&size=3")).then((items) => paginate(items, 0, 3))
  ]);

  const cropOptions = filterOptions.crops;
  const soilOptions = filterOptions.soils;
  const activeMaxPrice = Number(maxPrice);
  const selectedSort = sortOptions.some((option) => option.value === sort) ? sort : "recommended";
  const loadMoreQuery = new URLSearchParams(productQuery);
  loadMoreQuery.set("size", String(size + 12));

  return (
    <main className="market-page">
        <section className="market-search-section">
          <div className="container-shell">
            <form className="market-search" role="search" action="/market">
              <label>
                <span className="sr-only">검색 범위</span>
                <select defaultValue="all" aria-label="검색 범위">
                  <option value="all">전체</option>
                  <option value="fertilizer">비료</option>
                  <option value="crop">작물</option>
                </select>
              </label>
              <input name="keyword" defaultValue={keyword} aria-label="상품 검색" placeholder="비료명 검색" />
              <input type="hidden" name="cropCategory" value={cropCategory} />
              <input type="hidden" name="soilType" value={soilType} />
              <input type="hidden" name="maxPrice" value={maxPrice} />
              <button type="submit" aria-label="검색">⌕</button>
            </form>
          </div>
        </section>

        <section className="market-hero">
          <div className="container-shell market-hero-inner">
            <div className="market-hero-copy">
              <h1>
                내 농지에 맞는 비료를
                <span>쉽게 찾는 비료마켓</span>
              </h1>
              <p>AI 맞춤 추천부터 친환경 곤충 부산물 비료까지 간편 주문, 빠른 배송으로 농사의 든든한 동반자가 됩니다.</p>
              <Link href="/recommend" className="btn-primary btn-large">
                AI 맞춤 비료 추천 받기
                <span aria-hidden="true">›</span>
              </Link>
              <div className="market-hero-tags">
                <span>AI 맞춤 추천</span>
                <span>친환경 곤충 부산물 비료</span>
                <span>빠른 주문 및 배송</span>
              </div>
            </div>
            <Image
              src="/images/banner/market-banner.png"
              alt="비료비서 마켓의 비료 포대 상품 일러스트"
              width={1792}
              height={1024}
              priority
            />
          </div>
        </section>

        <section className="container-shell market-catalog" id="products">
          <form className="market-filter" aria-label="상품 필터" action="/market">
            <div className="filter-title">
              <h2>필터</h2>
              <Link href="/market">초기화</Link>
            </div>
            <input type="hidden" name="keyword" value={keyword} />
            <fieldset>
              <p>작물</p>
              {cropOptions.map((item) => (
                <label key={item}>
                  <input type="radio" name="cropCategory" value={item} defaultChecked={cropCategory === item || (!cropCategory && item === "전체")} />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <p>토양 상태</p>
              {soilOptions.map((item) => (
                <label key={item}>
                  <input type="radio" name="soilType" value={item} defaultChecked={soilType === item || (!soilType && item === "전체")} />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <p>정렬</p>
              {sortOptions.map((option) => (
                <label key={option.value}>
                  <input type="radio" name="sort" value={option.value} defaultChecked={selectedSort === option.value} />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <p>가격대</p>
              <input type="range" name="maxPrice" min="0" max="100000" step="5000" defaultValue={maxPrice} aria-label="가격대" />
              <div className="range-labels">
                <span>0원</span>
                <span>{Number.isFinite(activeMaxPrice) ? activeMaxPrice.toLocaleString("ko-KR") : "100,000"}원 이하</span>
              </div>
            </fieldset>
            <button type="submit" className="filter-submit">필터 적용</button>
          </form>

          <div className="market-products-area">
            <div className="market-section-head">
              <div>
                <h2>비료마켓</h2>
                <span>총 {productPage.totalElements}개의 상품</span>
              </div>
              <form action="/market" className="sort-form">
                <input type="hidden" name="keyword" value={keyword} />
                <input type="hidden" name="cropCategory" value={cropCategory} />
                <input type="hidden" name="soilType" value={soilType} />
                <input type="hidden" name="maxPrice" value={maxPrice} />
                <input type="hidden" name="size" value={size} />
                <select name="sort" defaultValue={selectedSort} aria-label="상품 정렬">
                  {sortOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </select>
                <button type="submit">정렬</button>
              </form>
            </div>
            <div className="market-product-grid">
              {productPage.content.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {productPage.content.length === 0 ? (
              <p className="empty-products">조건에 맞는 비료 상품이 없습니다.</p>
            ) : null}
            {productPage.totalElements > productPage.content.length ? (
              <Link href={`/market?${loadMoreQuery.toString()}#products`} className="load-more">더 많은 상품 보기</Link>
            ) : null}
          </div>
        </section>

        <section className="container-shell service-strip">
          {serviceHighlights.map(([Icon, title, description]) => (
            <article key={title}>
              <Icon />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="container-shell market-reviews">
          <div className="market-section-head">
            <h2>고객 리뷰 BEST</h2>
          </div>
          <div className="review-row">
            {reviewPage.content.map((review) => (
              <article key={review.id} className="market-review-card">
                <div className="review-profile">
                  <div aria-hidden="true">{review.name.slice(0, 1)}</div>
                  <div>
                    <h3>{review.name}</h3>
                    <ProductRating rating={review.rating} />
                  </div>
                </div>
                <p>{review.content}</p>
                  <div className="review-product">
                  <Image src={`/product/${review.productId}.png`} alt={`${review.product} 20kg`} width={50} height={50} />
                  <strong>{review.product} 20kg</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
    </main>
  );
}
