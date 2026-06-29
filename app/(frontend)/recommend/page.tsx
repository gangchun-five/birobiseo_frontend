import "./recommend.css";

import { RecommendPageClient } from "./_components/RecommendPageClient";
import { listSoilTypes } from "@/services/domains/soil-data/repository";
import { listCropCodes } from "@/services/domains/crop/repository";

export const dynamic = "force-dynamic";

const processSteps = [
  ["정보 입력", "농지와 작물, 목표 등 기본 정보 입력"],
  ["토양 분석", "흙토람 데이터를 기반으로 토양 상태 분석"],
  ["비료 추천", "최적의 비료 및 AI를 통한 사용 방법 제공"],
  ["배합 결과", "추천 배합과 예상 효과를 한눈에 확인"],
  ["주문 연결", "추천 제품을 바로 주문까지 연결"]
];

const recommendFaqs = [
  {
    id: 1,
    question: "맞춤 추천은 어떻게 이루어지나요?",
    answer: "입력한 농가 주소의 토양 검정 데이터를 흙토람 비료사용처방 API로 조회하고, 작물 코드와 생육 단계, 마켓 상품의 NPK 비율과 재고 상태를 함께 비교해 추천합니다."
  },
  {
    id: 2,
    question: "토양 데이터가 없어도 추천 받을 수 있나요?",
    answer: "아니요. 해당 필지의 토양 검정 데이터가 없으면 비료사용처방량을 계산할 근거가 없어서 추천을 제공하지 않습니다. 먼저 토양 검정을 등록한 뒤 다시 요청해야 합니다."
  },
  {
    id: 3,
    question: "추천 결과는 언제 달라지나요?",
    answer: "추천 결과는 마켓 상품 재고, 상품별 NPK 비율, 작물별 처방 코드, 최신 토양 검정 데이터가 바뀌면 함께 업데이트됩니다."
  },
  {
    id: 4,
    question: "추천 비료를 꼭 그대로 사용해야 하나요?",
    answer: "추천 결과는 토양 처방량과 현재 판매 가능한 상품을 기준으로 한 선택지입니다. 실제 시비 전에는 농가의 생육 상태, 날씨, 관수 조건을 함께 확인하는 것이 좋습니다."
  }
];

export default async function RecommendPage() {
  const [crops, soilTypes] = await Promise.all([
    listCropCodes(),
    listSoilTypes()
  ]);

  return (
    <main className="recommend-page">
        <section className="recommend-process">
          <div className="container-shell process-board">
            <div className="process-title">
              <h2>추천 프로세스</h2>
              <p>5단계 간편한 AI 맞춤 추천</p>
            </div>
            <div className="process-track">
              {processSteps.map(([title, description], index) => (
                <article key={title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RecommendPageClient crops={crops} soilTypes={soilTypes} faqs={recommendFaqs} />
    </main>
  );
}
