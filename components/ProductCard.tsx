"use client";

import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = () => {
    alert(`${product.name}을 장바구니에 담았습니다.`);
  };

  return (
    <article className="soft-card hover-lift overflow-hidden">
      <div className="relative h-40 bg-[#F5F8F1] p-5" aria-label={`${product.name} 이미지 영역`}>
        <span className="absolute left-4 top-4 rounded-full bg-[#1F5D2C] px-3 py-1 text-xs font-black text-white">{product.badge}</span>
        <div className="mx-auto mt-8 h-24 w-28 rounded-[26px] border-4 border-[#6FA044] bg-white shadow-inner">
          <div className="mx-auto mt-5 h-8 w-16 rounded-full bg-[#DDEBCF]" />
          <div className="mx-auto mt-3 h-3 w-20 rounded-full bg-[#1F5D2C]/20" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-[#173f22]">{product.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-[#63725f]">{product.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold text-[#E0A13A]">별점 {product.rating}</span>
          <span className="text-[#63725f]">{product.weight}</span>
        </div>
        <p className="mt-3 text-xl font-black text-[#1F5D2C]">{product.price.toLocaleString("ko-KR")}원</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button aria-label={`${product.name} 장바구니 담기`} onClick={addToCart} className="btn-primary px-3 py-3 text-sm">담기</button>
          <button aria-label={`${product.name} 상세보기`} className="btn-secondary px-3 py-3 text-sm">상세보기</button>
        </div>
      </div>
    </article>
  );
}
