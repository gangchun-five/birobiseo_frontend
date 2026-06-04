"use client";

import { useState } from "react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProcessStep } from "@/components/ProcessStep";
import { RecommendationResult } from "@/components/RecommendationResult";

const steps = ["정보 입력", "토양 분석", "AI 추천", "배합 결과", "주문 연결"];
const bases = ["흙토람 토양 정보", "작물별 시비 기준", "원료 성분 데이터", "사용자 입력 데이터", "리뷰 데이터"];

export default function RecommendPage() {
  const [shown, setShown] = useState(false);

  return (
    <>
      <Header />
      <main>
        <HeroSection
          eyebrow="AI가 분석하는 맞춤 비료 추천"
          title="내 농지에 맞는 AI 맞춤 비료 추천"
          description="토양 정보, 작물 정보, 생육 단계까지 AI가 분석하여 최적의 비료 배합을 추천합니다."
          primaryLabel="지금 AI 맞춤 추천 시작하기"
          secondaryLabel="추천 예시 보기"
          secondaryHref="#result"
        >
          <div className="relative z-10 rounded-[28px] bg-white p-6 shadow-2xl">
            <p className="font-black text-[#1F5D2C]">추천 결과 미리보기</p>
            <dl className="mt-4 grid gap-3 text-sm">
              {[
                ["재배 작물", "토마토"],
                ["생육 단계", "착과기"],
                ["토양 상태", "양토"],
                ["추천 비료", "곤충 부산물 복합 비료"],
                ["NPK", "12-6-9"],
                ["예상 효과", "수확량 +18%, 토양 유기물 +12%"]
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between rounded-2xl bg-[#F5F8F1] p-3">
                  <dt className="font-bold text-[#63725f]">{key}</dt><dd className="font-black text-[#173f22]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </HeroSection>

        <section className="section-pad">
          <div className="container-shell">
            <div className="grid gap-4 md:grid-cols-5">{steps.map((step, index) => <ProcessStep key={step} index={index + 1} label={step} />)}</div>
          </div>
        </section>

        <section id="result" className="section-pad bg-[#F5F8F1]">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <form className="soft-card p-6" onSubmit={(event) => { event.preventDefault(); setShown(true); }}>
              <h2 className="text-2xl font-black text-[#173f22]">농지 정보 입력</h2>
              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 font-bold text-[#173f22]">농가 주소 입력<input aria-label="농가 주소 입력" className="rounded-2xl border border-[#1f5d2c]/15 p-4" placeholder="예: 충남 예산군 삽교읍" /></label>
                <label className="grid gap-2 font-bold text-[#173f22]">재배 작물 선택<select aria-label="재배 작물 선택" className="rounded-2xl border border-[#1f5d2c]/15 p-4"><option>토마토</option><option>고추</option><option>오이</option><option>상추</option><option>감자</option></select></label>
                <label className="grid gap-2 font-bold text-[#173f22]">생육 단계 선택<select aria-label="생육 단계 선택" className="rounded-2xl border border-[#1f5d2c]/15 p-4"><option>유묘기</option><option>생장기</option><option>개화기</option><option>착과기</option><option>수확기</option></select></label>
                <label className="grid gap-2 font-bold text-[#173f22]">토양 상태 선택<select aria-label="토양 상태 선택" className="rounded-2xl border border-[#1f5d2c]/15 p-4"><option>양토</option><option>사질토</option><option>점토</option><option>미입력</option></select></label>
                <label className="grid gap-2 font-bold text-[#173f22]">희망 목적 선택<select aria-label="희망 목적 선택" className="rounded-2xl border border-[#1f5d2c]/15 p-4"><option>수확량 개선</option><option>토양 개선</option><option>친환경 재배</option><option>균형 공급</option></select></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input aria-label="관수 방식" className="rounded-2xl border border-[#1f5d2c]/15 p-4" placeholder="관수 방식" />
                  <input aria-label="재배 면적" className="rounded-2xl border border-[#1f5d2c]/15 p-4" placeholder="재배 면적" />
                </div>
                <button aria-label="AI 분석 및 추천 받기" className="btn-primary mt-2" type="submit">AI 분석 및 추천 받기</button>
              </div>
            </form>
            <RecommendationResult visible={shown} />
          </div>
        </section>

        <section className="section-pad">
          <div className="container-shell">
            <div className="section-title"><h2 className="text-3xl font-black text-[#173f22]">AI 분석 근거</h2></div>
            <div className="grid-auto">{bases.map((base) => <FeatureCard key={base} title={base} />)}</div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-shell grid gap-6 lg:grid-cols-3">
            <div className="soft-card p-6 lg:col-span-2">
              <h2 className="text-2xl font-black text-[#173f22]">추천 결과 상세</h2>
              <div className="mt-6 grid gap-4">
                {[["질소 N", 90], ["인산 P", 52], ["칼륨 K", 72]].map(([label, width]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{width}%</span></div>
                    <div className="h-4 rounded-full bg-[#F5F8F1]"><div className="chart-bar h-4" style={{ width: `${width}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="soft-card p-6">
              <h2 className="text-2xl font-black text-[#173f22]">다음 단계</h2>
              <div className="mt-5 grid gap-3">{["장바구니 담기", "바로 주문하기", "배합표 저장", "상담 문의"].map((item) => <button key={item} className="btn-secondary" aria-label={item}>{item}</button>)}</div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#F5F8F1]">
          <div className="container-shell">
            <div className="section-title"><h2 className="text-3xl font-black text-[#173f22]">자주 묻는 질문</h2></div>
            <FAQAccordion />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
