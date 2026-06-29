"use client";

import Image from "next/image";
import Link from "next/link";
import { FileTextIcon, TruckIcon } from "lucide-react";
import { useState } from "react";
import { useKakaoPostcodePopup, type Address as KakaoAddress } from "react-daum-postcode";

import { useRecommendationQuery } from "@/hooks/useRecommendationQuery";
import { saveRecommendationAction } from "@/services/domains/recommendation/actions";

// 전라북도 완주군 이서면 용서리 672-23
// 전라북도 완주군 이서면 용서리 674-7

type RecommendFaq = {
  id: number;
  question: string;
  answer: string;
};

type CodeOption = {
  code: string;
  name: string;
};

type RecommendationEvidence = {
  type: string;
  title: string;
  description: string;
};

const evidenceTypeLabels: Record<string, string> = {
  SOIL_DATA: "토양 데이터",
  CROP_STANDARD: "작물 기준",
  PRODUCT_MATCH: "상품 매칭",
  NPK_EFFECT: "NPK 효과"
};

function formatEvidenceText(evidence: RecommendationEvidence) {
  const typeLabel = evidenceTypeLabels[evidence.type];
  return typeLabel ? `${typeLabel}: ${evidence.description}` : evidence.description;
}

type RecommendationRegion = {
  fullAddress: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  eupmyun: string | null;
  dongri: string;
  region: string;
};

function getFullAddress(data: KakaoAddress) {
  let fullAddress = data.roadAddress || data.address;
  let extraAddress = "";

  if (data.addressType === "R") {
    if (data.bname) {
      extraAddress += data.bname;
    }

    if (data.buildingName) {
      extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
    }

    fullAddress += extraAddress ? ` (${extraAddress})` : "";
  }

  return fullAddress;
}

function toRecommendationRegion(data: KakaoAddress): RecommendationRegion {
  let region = `${data.sido} ${data.sigungu}`;
  if (data.bname1 != "") {
    region += ` ${data.bname1}`;
  }
  region += ` ${data.bname}`;

  return {
    fullAddress: getFullAddress(data),
    roadAddress: data.roadAddress || data.autoRoadAddress,
    jibunAddress: data.jibunAddress || data.autoJibunAddress,
    sido: data.sido,
    sigungu: data.sigungu,
    eupmyun: data.bname1 || null,
    dongri: data.bname,
    region
  };
}

export function RecommendPageClient({
  crops,
  soilTypes,
  faqs
}: {
  crops: CodeOption[];
  soilTypes: CodeOption[];
  faqs: RecommendFaq[];
}) {
  const [address, setAddress] = useState<RecommendationRegion | null>(null);
  const [mainJibun, setMainJibun] = useState("");
  const [subJibun, setSubJibun] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cropCode, setCropCode] = useState(crops[0]?.code ?? "TOMATO");
  const [growthStage, setGrowthStage] = useState("FRUITING");
  const [soilType] = useState(soilTypes[0]?.code ?? "LOAM");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id ?? 0);

  const jibunAddress = address
    ? `${address.region} ${mainJibun}-${subJibun}`
    : "";

  const { data, refetch, isFetching, isLoading, isSuccess } = useRecommendationQuery({
    jibunAddress,
    cropCode,
    growthStage,
    soilType
  });

  const openPostcode = useKakaoPostcodePopup();
  const hasCurrentRecommendation = (isSuccess && !isFetching && Boolean(data)) ?? false;
  const marketHref = data ? `/market/${data.recommendedProduct.id}` : "";
  const evidenceItems = hasCurrentRecommendation ? data?.evidence ?? [] : [];

  const analyze = async () => {
    setAddressError("");
    setSaveStatus("idle");

    try {
      if (!address) {
        setAddressError("주소 검색으로 농가 주소를 선택해주세요.");
        return;
      }

      if (!mainJibun || !subJibun) {
        setAddressError("농가 지번을 입력해주세요.");
        return;
      }

      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "추천 분석에 실패했습니다.");
    }
  };

  const saveBlend = async () => {
    if (!data) return;

    setSaveStatus("saving");
    const result = await saveRecommendationAction(data.id);

    if (!result.success) {
      setSaveStatus("idle");
      alert(result.error?.message ?? "배합표 저장에 실패했습니다.");
      return;
    }

    setSaveStatus("saved");
  };

  const searchAddress = () => {
    openPostcode({
      defaultQuery: address?.jibunAddress ?? undefined,
      popupTitle: "비료비서 주소 검색",
      onComplete: (data) => {
        setAddress(toRecommendationRegion(data));
        setAddressError("");
      },
      onError: () => alert("주소 검색 서비스를 불러오지 못했습니다.")
    });
  };

  return (
    <>
      <section className="container-shell recommend-dashboard">
        <aside className="recommend-input-card">
          <h2><span>1</span> 정보 입력</h2>
          <label>
            <span>농가 지역 *</span>
            <div className="address-row">
              <input
                value={address?.region ?? ""}
                readOnly
                aria-label="농가 지역"
              />
              <button type="button" onClick={searchAddress}>주소 검색</button>
            </div>
            {addressError ? <strong className="field-error">{addressError}</strong> : null}
          </label>
          <label>
            <span>농가 지번 *</span>
            <div className="jibun-row">
              <input
                aria-label="농가 지번 1"
                onChange={(e) => setMainJibun(e.target.value)}
              />
              -
              <input
                aria-label="농가 지번 2"
                onChange={(e) => setSubJibun(e.target.value)}
              />
            </div>
            {addressError ? <strong className="field-error">{addressError}</strong> : null}
          </label>
          <label>
            <span>재배 작물 *</span>
            <select value={cropCode} onChange={(event) => setCropCode(event.target.value)} aria-label="재배 작물">
              {crops.map((crop) => <option value={crop.code} key={crop.code}>{crop.name}</option>)}
            </select>
          </label>
          <label>
            <span>생육 단계 *</span>
            <select value={growthStage} onChange={(event) => setGrowthStage(event.target.value)} aria-label="생육 단계">
              <option value="FRUITING">착과기</option>
              <option value="GROWTH">생장기</option>
              <option value="HARVEST">수확기</option>
            </select>
          </label>
          <button type="button" className="analyze-button" onClick={analyze} disabled={isFetching}>
            {isFetching || isLoading ? "AI 분석 중..." : "AI 분석 및 추천 받기"}
          </button>
        </aside>

        <section className="recommend-result-card">
          <div className="result-title-row">
            <h2><span>2</span> 추천 결과</h2>
            <div>
              <span>토양 맞춤</span>
              <span>친환경</span>
              <span>곤충 부산물 기반</span>
            </div>
          </div>
          {isSuccess ? (
            <>
              <div className="result-panels">
                <article className="result-product">
                  <h3>추천 배합 비료</h3>
                  <div className="bag-and-copy">
                    <div className="recommend-bag" aria-hidden="true">
                      <Image
                        src={`/product/${data.recommendedProduct.id}.png`}
                        alt="추천 비료 이미지"
                        fill
                      />
                    </div>
                    <div>
                      <h4>{data.recommendedProduct.name}</h4>
                      <p>NPK {data.npk.n}-{data.npk.p}-{data.npk.k}</p>
                      <ul>
                        {data.blend.map((item) => <li key={item.name}>{item.name} {item.ratio}{item.unit}</li>)}
                      </ul>
                      <Link href={`/market/${data.recommendedProduct.id}`}>제품 상세 보기</Link>
                    </div>
                  </div>
                </article>
                <article className="npk-panel">
                  <h3>추천 NPK 함량 <span>({data.npk.unit} 기준)</span></h3>
                  <div className="npk-values">
                    <strong>N <span>{data.npk.n}</span></strong>
                    <strong>P <span>{data.npk.p}</span></strong>
                    <strong>K <span>{data.npk.k}</span></strong>
                  </div>
                  <h4>권장 배합 비율</h4>
                  <div className="donut-row">
                    <div className="donut-chart" aria-label={data.blend.map((item) => `${item.name} ${item.ratio}${item.unit}`).join(", ")} />
                    <ul>
                      {data.blend.map((item) => <li key={item.name}><span></span>{item.name} {item.ratio}{item.unit}</li>)}
                    </ul>
                  </div>
                </article>
              </div>
              <div className="usage-strip">
                <div><span>권장 사용량</span><strong>{data.usage.amount}</strong></div>
                <div><span>시비 방법</span><strong>{data.usage.method}</strong></div>
                <div><span>시비 시기</span><strong>{data.usage.timing}</strong></div>
              </div>
            </>
          ) : (
            <div className="recommend-empty-state">
              <h3>추천 결과 대기 중</h3>
              <p>농가 주소와 재배 작물을 확인하면 토양 검정 데이터가 있는 필지에 한해 맞춤 비료 배합 결과가 표시됩니다.</p>
            </div>
          )}
        </section>
      </section>

      <section className="container-shell evidence-section">
        <div className="evidence-heading">
          <h2>AI 분석 근거</h2>
          <p>다양한 데이터와 AI 모델을 기반으로 정확하고 신뢰할 수 있는 추천을 제공합니다.</p>
        </div>
        {evidenceItems.length > 0 ? (
          <div className="evidence-grid">
            {evidenceItems.map((evidence: RecommendationEvidence) => (
              <article key={`${evidence.type}-${evidence.title}`}>
                <h3>{evidence.title}</h3>
                <p>{formatEvidenceText(evidence)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="recommend-empty-state evidence-empty-state">
            <h3>분석 근거 대기 중</h3>
            <p>AI 분석 및 추천을 완료하면 토양 정보와 작물 기준을 바탕으로 분석 근거가 표시됩니다.</p>
          </div>
        )}
      </section>

      <section className="container-shell lower-grid">
        <article className="next-card">
          <h2>추천 후 다음 단계</h2>
          <div className="next-grid">
            <div>
              <TruckIcon size={35} />
              <h3>바로 주문하기</h3>
              <p>추천 구성으로 간편하게 바로 주문하세요.</p>
              {hasCurrentRecommendation ? (
                <Link href={marketHref}>바로 주문하기</Link>
              ) : (
                <button type="button" disabled>바로 주문하기</button>
              )}
            </div>
            <div>
              <FileTextIcon size={35} />
              <h3>배합표 저장</h3>
              <p>추천 배합표를 저장하고 언제든 확인하세요.</p>
              <button
                type="button"
                onClick={saveBlend}
                disabled={!hasCurrentRecommendation || saveStatus === "saving" || saveStatus === "saved"}
              >
                {saveStatus === "saving" ? "저장 중..." : saveStatus === "saved" ? "저장됨" : "배합표 저장"}
              </button>
            </div>
          </div>
        </article>

        <article className="recommend-faq">
          <div className="mini-section-head">
            <h2>자주 묻는 질문</h2>
          </div>
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div className="faq-item" key={faq.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`recommend-faq-${faq.id}`}
                  onClick={() => setOpenFaqId(isOpen ? 0 : faq.id)}
                >
                  <span>{faq.question}</span>
                  <strong>{isOpen ? "−" : "+"}</strong>
                </button>
                {isOpen ? (
                  <p id={`recommend-faq-${faq.id}`}>
                    {faq.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </article>
      </section>
    </>
  );
}
