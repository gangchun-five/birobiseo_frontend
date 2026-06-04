import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProcessStep } from "@/components/ProcessStep";
import { ReviewCard } from "@/components/ReviewCard";
import { reviews } from "@/data/reviews";

const problems = [
  ["비료 선택 어려움", "농가마다 토양과 작물이 달라 어떤 비료가 맞는지 판단하기 어렵습니다."],
  ["토양 정보 부족", "토양 상태를 정확히 반영하지 못하면 과다 시비나 영양 불균형이 생길 수 있습니다."],
  ["친환경 자원 활용 부족", "곤충 부산물은 유기질 자원으로 활용 가능하지만 농가와 연결되는 구조가 부족합니다."],
  ["주문·납품 관리 비효율", "추천, 주문, 배송, 리뷰가 분리되어 있어 관리가 번거롭습니다."]
];

const features = ["토양 진단", "작물별 맞춤 추천", "AI 배합 도출", "주문·배송 관리", "리뷰·커뮤니티", "마이페이지/이력 관리"];
const flow = ["주소·작물 입력", "토양 분석", "AI 배합 추천", "주문", "생산·배송", "리뷰·재주문"];
const process = ["원료 수급", "전처리", "배합", "출하"];
const benefits = ["비료 사용 효율 향상", "친환경 농업 지원", "지역 자원순환", "농가 의사결정 지원"];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection
          eyebrow="AI가 찾고, 자연이 키웁니다"
          title="곤충 부산물로 만든 맞춤 비료 추천 서비스, 비료비서"
          description="토양과 작물 정보를 분석해 최적의 배합을 추천하고, 주문부터 생산·배송까지 한 번에 연결해드립니다."
        >
          <div className="relative z-10 grid h-full content-center gap-4">
            <div className="mx-auto w-full max-w-md rounded-[28px] bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-black text-[#1F5D2C]">AI 추천 대시보드</span>
                <span className="rounded-full bg-[#F5F8F1] px-3 py-1 text-xs font-black text-[#6FA044]">분석완료</span>
              </div>
              <div className="grid gap-3">
                {["토마토 착과기", "양토 pH 6.2", "곤충 부산물 복합 비료"].map((item) => (
                  <div key={item} className="rounded-2xl bg-[#F5F8F1] p-4 font-bold text-[#173f22]">{item}</div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {["N 120", "P 60", "K 90"].map((item) => <div key={item} className="rounded-2xl bg-[#1F5D2C] p-3 text-sm font-black text-white">{item}</div>)}
              </div>
            </div>
          </div>
        </HeroSection>

        <section id="features" className="section-pad">
          <div className="container-shell">
            <div className="section-title">
              <h2 className="text-3xl font-black text-[#173f22]">비료비서가 해결하는 문제</h2>
              <p>흩어진 토양, 작물, 주문 정보를 하나의 추천 흐름으로 묶어 농가의 판단 부담을 줄입니다.</p>
            </div>
            <div className="grid-auto">
              {problems.map(([title, description]) => <FeatureCard key={title} title={title} description={description} />)}
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#F5F8F1]">
          <div className="container-shell">
            <div className="section-title">
              <h2 className="text-3xl font-black text-[#173f22]">핵심 기능</h2>
              <p>추천부터 주문, 배송, 리뷰까지 실제 서비스에 필요한 화면과 데이터를 준비했습니다.</p>
            </div>
            <div className="grid-auto">
              {features.map((feature) => <FeatureCard key={feature} title={feature} icon="AI" />)}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-shell">
            <div className="section-title">
              <h2 className="text-3xl font-black text-[#173f22]">서비스 이용 흐름</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {flow.map((item, index) => <ProcessStep key={item} index={index + 1} label={item} />)}
            </div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-shell grid gap-8 lg:grid-cols-2">
            <div className="soft-card p-8">
              <h2 className="text-3xl font-black text-[#173f22]">공정 및 구조</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                {process.map((item, index) => <ProcessStep key={item} index={index + 1} label={item} />)}
              </div>
            </div>
            <div className="soft-card p-8">
              <h2 className="text-3xl font-black text-[#173f22]">데이터와 기술</h2>
              <div className="mt-7 grid items-center gap-5 md:grid-cols-[1fr_160px_1fr]">
                <ul className="grid gap-3 text-sm font-bold text-[#52624f]">
                  <li>흙토람 토양 정보</li><li>작물별 표준 시비 기준</li><li>원료 성분 데이터</li>
                </ul>
                <div className="grid aspect-square place-items-center rounded-full bg-[#1F5D2C] p-6 text-center font-black text-white">AI 비료 추천 모델</div>
                <ul className="grid gap-3 text-sm font-bold text-[#52624f]">
                  <li>사용자 입력 데이터</li><li>리뷰 데이터</li><li>계절·기후 참고 데이터</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#F5F8F1]">
          <div className="container-shell">
            <div className="grid-auto">
              {benefits.map((benefit) => <FeatureCard key={benefit} title={benefit} />)}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-shell">
            <div className="section-title"><h2 className="text-3xl font-black text-[#173f22]">사용자 후기</h2></div>
            <div className="grid-auto">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
          </div>
        </section>

        <section className="bg-[#1F5D2C] py-16 text-white">
          <div className="container-shell flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <h2 className="text-3xl font-black">내 농지에 맞는 비료를 지금 추천받아보세요</h2>
            <Link href="/recommend" className="rounded-full bg-white px-6 py-4 font-black text-[#1F5D2C]" aria-label="맞춤 비료 추천 시작하기">맞춤 비료 추천 시작하기</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
