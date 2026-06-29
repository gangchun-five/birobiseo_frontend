"use client";

import { useState } from "react";

const faqs = [
  { q: "AI 맞춤 추천은 어떻게 이루어지나요?", a: "사용자가 입력한 작물, 생육 단계, 토양 상태와 표준 시비 기준, 원료 성분 데이터를 함께 비교해 추천 배합을 제안합니다." },
  { q: "토양 성분 데이터가 없어도 추천받을 수 있나요?", a: "가능합니다. 미입력 상태를 선택하면 작물과 생육 단계 중심의 기본 추천을 먼저 제공하고 추후 토양 데이터로 보정할 수 있습니다." },
  { q: "추천 결과는 얼마나 자주 업데이트되나요?", a: "현재 화면은 더미 데이터 기반이며, 실제 서비스에서는 계절, 리뷰, 주문 결과 데이터를 반영해 주기적으로 개선할 수 있습니다." },
  { q: "추천 비료는 어디서 주문하나요?", a: "추천 결과에서 바로 주문하기를 선택하거나 비료마켓에서 같은 상품을 찾아 주문할 수 있습니다." }
];

export function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq, index) => (
        <article key={faq.q} className="soft-card overflow-hidden">
          <button aria-label={`${faq.q} 답변 열기`} onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between p-5 text-left font-bold text-[#173f22]">
            {faq.q}
            <span>{open === index ? "접기" : "열기"}</span>
          </button>
          {open === index && <p className="border-t border-[#1f5d2c]/10 p-5 text-sm leading-7 text-[#63725f]">{faq.a}</p>}
        </article>
      ))}
    </div>
  );
}

