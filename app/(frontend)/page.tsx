import Image from "next/image";
import Link from "next/link";
import {
  ChartNoAxesCombinedIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockArrowDownIcon,
  CpuIcon,
  FlaskConicalIcon,
  RecycleIcon,
  ScaleIcon,
  SproutIcon,
  TruckIcon
} from "lucide-react";
import "./landing.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main>
        <section className="landing-hero" id="service">
          <div className="container-shell hero-layout">
            <div className="hero-copy">
              <p className="hero-eyebrow">AI가 분석하고, 농지를 더 건강하게</p>
              <h1>
                내 농지에 맞는 비료를<br/>
                <span>AI</span>가 추천합니다
              </h1>
              <p className="hero-description">
                작물, 토양 상태, 생육 목적을 분석해 농가에 맞는 비료 배합과 사용 방법을 제안하는 AI 맞춤 비료 추천 서비스입니다.
              </p>
              <div className="hero-actions">
                <Link href="/recommend" className="btn-primary btn-large">
                  AI 추천 시작하기
                  <span aria-hidden="true">›</span>
                </Link>
                <Link href="#features" className="btn-secondary btn-large">
                  서비스 알아보기
                </Link>
              </div>
              <div className="trust-row" aria-label="서비스 강점">
                <span>토양 정보 기반 추천</span>
                <span>곤충 부산물 자원순환</span>
                <span>주문 및 배송 연결</span>
              </div>
            </div>
            <div className="hero-visual" aria-label="비료비서 AI 추천 화면">
              <Image
                src="/images/banner/main-banner.png"
                alt="노트북 AI 추천 화면과 농부 캐릭터, 비료 포대 일러스트"
                width={1792}
                height={1024}
                priority
              />
            </div>
          </div>
        </section>

        <section className="landing-section" id="features">
          <div className="container-shell">
            <h2 className="section-heading">농가의 비료 선택, 왜 어려울까요?</h2>
            <div className="problem-grid">
              <article className="landing-card problem-card">
                <span className="card-icon"><SproutIcon size={42} /></span>
                <div>
                  <h3>토양마다 필요한 영양이 다릅니다</h3>
                  <p>토양 상태에 따라 필요한 영양소와 배합이 달라집니다.</p>
                </div>
              </article>
              <article className="landing-card problem-card">
                <span className="card-icon"><ScaleIcon size={42} /></span>
                <div>
                  <h3>비료 성분 비교가 어렵습니다</h3>
                  <p>제품이 많아 성분과 함량을 비교하기 어렵습니다.</p>
                </div>
              </article>
              <article className="landing-card problem-card">
                <span className="card-icon"><TruckIcon size={42} /></span>
                <div>
                  <h3>추천과 주문이 따로 분리되어 있습니다</h3>
                  <p>추천받아도 구매와 배송을 따로 해야 해 불편합니다.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section compact-section" id="how">
          <div className="container-shell">
            <h2 className="section-heading">비료비서는 이 과정을 하나로 연결합니다</h2>
            <div className="process-line">
              <article className="process-item">
                <div className="process-orb">
                  <ClipboardListIcon size={42} />
                  <span>1</span>
                </div>
                <h3>정보 입력</h3>
                <p>작물, 토양, 재배 목적 입력</p>
              </article>
              <article className="process-item">
                <div className="process-orb">
                  <CpuIcon size={42} />
                  <span>2</span>
                </div>
                <h3>AI 분석</h3>
                <p>토양과 생육 데이터를 분석</p>
              </article>
              <article className="process-item">
                <div className="process-orb">
                  <SproutIcon size={42} />
                  <span>3</span>
                </div>
                <h3>맞춤 추천</h3>
                <p>적합한 비료와 배합 제안</p>
              </article>
              <article className="process-item">
                <div className="process-orb">
                  <TruckIcon size={42} />
                  <span>4</span>
                </div>
                <h3>주문 연결</h3>
                <p>추천 제품을 바로 주문 및 배송</p>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="container-shell">
            <h2 className="section-heading">핵심 기능</h2>
            <div className="feature-grid">
              <article className="landing-card feature-card">
                <span className="feature-mark"><FlaskConicalIcon size={34} /></span>
                <h3>토양 기반 진단</h3>
                <p>토양 상태를 분석해 부족한 영양소를 파악합니다.</p>
              </article>
              <article className="landing-card feature-card">
                <span className="feature-mark"><CpuIcon size={34} /></span>
                <h3>AI 비료 추천</h3>
                <p>분석 결과를 바탕으로 최적의 비료와 배합을 추천합니다.</p>
              </article>
              <article className="landing-card feature-card">
                <span className="feature-mark"><RecycleIcon size={34} /></span>
                <h3>친환경 원료 활용</h3>
                <p>곤충 부산물 등 친환경 원료를 활용한 지속가능한 비료입니다.</p>
              </article>
              <article className="landing-card feature-card">
                <span className="feature-mark"><ClipboardCheckIcon size={34} /></span>
                <h3>추천 이력 관리</h3>
                <p>추천 결과와 주문 이력을 체계적으로 관리합니다.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section result-section">
          <div className="container-shell">
            <h2 className="section-heading">추천 결과는 이렇게 확인할 수 있습니다</h2>
            <div className="demo-flow">
              <article className="landing-card input-panel">
                <h3>정보 입력</h3>
                <label>
                  <span>작물 선택</span>
                  <select defaultValue="pepper" aria-label="작물 선택" className="pointer-events-none">
                    <option value="pepper">고추</option>
                  </select>
                </label>
                <label>
                  <span>토양 상태</span>
                  <select defaultValue="loam" aria-label="토양 상태" className="pointer-events-none">
                    <option value="loam">양토</option>
                  </select>
                </label>
                <label>
                  <span>재배 목적</span>
                  <select defaultValue="stable" aria-label="재배 목적" className="pointer-events-none">
                    <option value="stable">생육 안정화</option>
                  </select>
                </label>
              </article>

              <div className="demo-arrow" aria-hidden="true">›</div>

              <article className="landing-card result-panel">
                <div className="result-main">
                  <Image
                    src="/images/placeholder/fertilizer3.png"
                    alt="비료 포대 이미지"
                    width={150}
                    height={150}
                  />
                  <div>
                    <p>AI 추천 결과</p>
                    <h3>곤충 부산물 복합 비료</h3>
                    <span>NPK 12-6-9</span>
                  </div>
                </div>
                <div className="npk-grid" aria-label="권장 배합">
                  <div>
                    <span>N</span>
                    <strong>120</strong>
                  </div>
                  <div>
                    <span>P</span>
                    <strong>60</strong>
                  </div>
                  <div>
                    <span>K</span>
                    <strong>90</strong>
                  </div>
                </div>
                <div className="result-meta">
                  <div>
                    <span>권장 사용량</span>
                    <strong>20kg / 10a</strong>
                  </div>
                  <div>
                    <span>추천 이유</span>
                    <p>토양 유기물 함량을 높이고 생육을 안정적으로 유지하는 데 도움을 줍니다.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section compact-section" id="reviews">
          <div className="container-shell">
            <h2 className="section-heading">이렇게 달라질 수 있습니다</h2>
            <div className="benefit-grid">
              <article className="benefit-card" key={"비료 선택 시간 단축"}>
                <ClockArrowDownIcon size={40}/>
                <div>
                  <h3>비료 선택 시간 단축</h3>
                  <p>AI가 최적의 비료를 제안해 선택 시간을 줄여드립니다.</p>
                </div>
              </article>
              <article className="benefit-card" key={"과다 시비 부담 완화"}>
                <ChartNoAxesCombinedIcon size={40}/>
                <div>
                  <h3>과다 시비 부담 완화</h3>
                  <p>적정 배합 추천으로 비용과 환경 부담을 줄여드립니다.</p>
                </div>
              </article>
              <article className="benefit-card" key={"친환경 농업 전환 지원"}>
                <SproutIcon size={40}/>
                <div>
                  <h3>친환경 농업 전환 지원</h3>
                  <p>친환경 원료 기반 비료로 지속가능한 농업을 실천할 수 있습니다.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="container-shell final-cta">
          <div>
            <h2>내 농지에 맞는 비료 추천을 받아보세요</h2>
            <p>작물과 토양 정보를 입력하면 AI가 적합한 비료 배합 방향을 제안합니다.</p>
            <Link href="/recommend" className="btn-light">
              AI 맞춤 추천 시작하기
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </section>
    </main>
  );
}
