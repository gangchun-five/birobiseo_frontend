"use client";

import Link from "next/link";
import { ProductRating } from "./ProductRating";
import { Product } from "@/services/domains/product/repository";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="market-product-card">
      <Link href={`/market/${product.id}`} aria-label={`${product.name} 상세보기`}>
        <div className="market-product-image">
          { product.badge != null ?
            <span className={`market-badge ${product.badge === "신상품" ? "orange" : product.badge === "추천" ? "blue" : ""}`}>{product.badge}</span>
            : <></>
          }
          <Image
            src={`/product/${product.id}.png`}
            alt={`${product.name} 상품 이미지`}
            fill
          />
        </div>
        <div className="market-product-body">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <ProductRating rating={product.rating} reviewCount={product.reviewCount ?? 0} />
          <div className="market-price-row">
            <strong>{product.price.toLocaleString("ko-KR")}원</strong>
            <span>{product.weight}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
