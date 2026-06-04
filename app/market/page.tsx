import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";

const categories = ["작물별", "토양개선", "친환경 비료", "맞춤추천", "정기배송", "인기상품"];
const advantages = ["친환경 자원순환", "빠른 배송", "농가 리뷰 기반", "정기구독 가능"];

export default function MarketPage() {
  return (
    <>
      <Header variant="market" />
      <main>
        <HeroSection
          title="내 농지에 맞는 비료를 쉽게 찾는 비료마켓"
          description="AI 맞춤 추천부터 친환경 곤충 부산물 비료까지 간편 주문·빠른 배송으로 농사의 든든한 동반자가 됩니다."
          primaryLabel="AI 맞춤 추천 받기"
          secondaryLabel="상품 둘러보기"
          secondaryHref="#products"
        >
          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            {["비료비서 곤충 부산물 비료", "토양회복 유기질 비료", "엽채류 맞춤 비료"].map((name) => (
              <div key={name} className="rounded-[28px] bg-white p-5 text-center shadow-xl">
                <div className="mx-auto mb-4 h-28 w-24 rounded-[24px] border-4 border-[#6FA044] bg-[#F5F8F1]" aria-label={`${name} 포대 일러스트`} />
                <p className="text-sm font-black text-[#173f22]">{name}</p>
              </div>
            ))}
          </div>
        </HeroSection>

        <section className="section-pad">
          <div className="container-shell">
            <div className="grid-auto">{categories.map((category) => <FeatureCard key={category} title={category} />)}</div>
          </div>
        </section>

        <section id="products" className="section-pad bg-[#F5F8F1]">
          <div className="container-shell grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="soft-card h-fit p-6">
              <h2 className="text-xl font-black text-[#173f22]">필터</h2>
              {[
                ["작물", ["전체", "엽채류", "과채류", "근채류", "과수", "곡물류"]],
                ["토양 상태", ["전체", "산성", "중성", "알칼리성", "척박지"]],
                ["정렬", ["추천순", "인기순", "최신순", "낮은 가격순", "높은 가격순"]]
              ].map(([label, items]) => (
                <div key={label as string} className="mt-6">
                  <p className="mb-3 font-black text-[#173f22]">{label as string}</p>
                  <div className="flex flex-wrap gap-2">
                    {(items as string[]).map((item) => <button key={item} aria-label={`${label} ${item}`} className="rounded-full border border-[#1f5d2c]/15 bg-white px-3 py-2 text-sm font-bold text-[#52624f]">{item}</button>)}
                  </div>
                </div>
              ))}
              <label className="mt-6 grid gap-3 font-black text-[#173f22]">가격대<input aria-label="가격대 슬라이더" type="range" min="10000" max="40000" className="accent-[#1F5D2C]" /></label>
            </aside>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-shell soft-card grid gap-8 bg-[#173f22] p-8 text-white lg:grid-cols-[0.8fr_1fr_0.8fr]">
            <div className="grid min-h-48 place-items-center rounded-[28px] bg-white/10 font-black">AI 비서 캐릭터</div>
            <div>
              <h2 className="text-3xl font-black">작물과 토양 정보를 입력하면 내 농지에 딱 맞는 비료를 추천해드려요</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <input aria-label="작물 선택" className="rounded-2xl px-4 py-3 text-[#173f22]" placeholder="작물 선택" />
                <input aria-label="토양 상태" className="rounded-2xl px-4 py-3 text-[#173f22]" placeholder="토양 상태" />
                <input aria-label="경작 면적" className="rounded-2xl px-4 py-3 text-[#173f22]" placeholder="경작 면적" />
              </div>
              <button aria-label="추천 시작하기" className="mt-5 rounded-full bg-white px-6 py-4 font-black text-[#1F5D2C]">추천 시작하기</button>
            </div>
            <div className="rounded-[28px] bg-white p-5 text-[#173f22]">
              <p className="font-black text-[#1F5D2C]">AI 분석 결과 미리보기</p>
              <p className="mt-4 text-sm leading-7">고추 · 양토 · 3,000㎡ 기준으로 곤충분변 복합 비료 300kg을 추천합니다.</p>
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#F5F8F1]">
          <div className="container-shell grid-auto">{advantages.map((item) => <FeatureCard key={item} title={item} />)}</div>
        </section>

        <section className="section-pad">
          <div className="container-shell">
            <div className="section-title"><h2 className="text-3xl font-black text-[#173f22]">고객 리뷰 BEST</h2></div>
            <div className="grid-auto">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
