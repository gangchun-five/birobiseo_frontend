import { prisma } from "@/services/prisma";
import { FertilizerPrescriptionApiError, getSoilFrtlzrExamInfo } from "@/services/api/fertilizer-prescription-api";
import { searchAddressCoordinates } from "@/services/api/kakao-local-api";
import { generateNpkEvidence, type NpkEvidence } from "@/services/api/gemini-api";

export type Recommendation = {
  id: number;
  productId?: number | null;
  title: string;
  crop: string;
  npk: string;
  blend: string;
  savedAt: string;
};

export type CodeOption = {
  code: string;
  name: string;
  category?: string | null;
  ph?: number | null;
  frtlzrUseApiCropId?: string | null;
};

type NutrientSymbol = "N" | "P" | "K";

type ProductForRecommendation = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

const nutrientKnowledge: Record<NutrientSymbol, {
  name: string;
  roles: string[];
  mechanism: string[];
  affectedParts: string[];
  farmerEffects: string[];
  deficiencySymptoms: string[];
  excessCautions: string[];
  stageRelevance: string[];
}> = {
  N: {
    name: "질소",
    roles: ["생육 엔진", "잎과 줄기 생장", "엽록소 형성", "단백질 합성", "생체중과 수량 형성"],
    mechanism: [
      "암모늄태 또는 질산태로 흡수",
      "아미노산, 단백질, 핵산, 엽록소 합성",
      "광합성 증가와 생장세 확보"
    ],
    affectedParts: ["잎", "줄기", "생장점"],
    farmerEffects: ["잎색 개선", "초세 확보", "초기 생육량 증가", "엽면적 확대", "생체중 형성 보조"],
    deficiencySymptoms: ["잎 황화", "생육 저하", "잎 크기 감소", "수량 감소"],
    excessCautions: ["웃자람", "조직 연약화", "병해 취약", "질산태 질소 용탈", "품질 저하"],
    stageRelevance: ["초기 생육기", "영양생장기", "잎채소 생체중 증가 목표"]
  },
  P: {
    name: "인산",
    roles: ["활착과 전환 스위치", "ATP 기반 에너지 전달", "뿌리 발달", "세포분열", "개화와 결실", "종자 형성"],
    mechanism: [
      "인산 이온 형태로 흡수",
      "ATP 에너지 전달과 DNA/RNA/인지질 형성",
      "세포분열과 생식기관 발달"
    ],
    affectedParts: ["뿌리", "꽃", "열매", "종자"],
    farmerEffects: ["뿌리 활착 개선", "초기 생육 기반 형성", "개화와 착과 안정", "성숙 촉진 보조"],
    deficiencySymptoms: ["뿌리 발달 저하", "생육 지연", "성숙 지연", "결실 불량"],
    excessCautions: ["토양 고정", "환경오염 가능성", "미량원소 흡수 방해 가능성"],
    stageRelevance: ["파종 전", "정식 전", "초기 생육기", "개화 전후", "결실 비대기"]
  },
  K: {
    name: "칼륨",
    roles: ["조절 밸브", "효소 활성", "기공 개폐", "수분 조절", "당 이동", "스트레스 저항성"],
    mechanism: [
      "K+ 형태로 흡수",
      "효소 활성과 기공 개폐 조절",
      "광합성 산물 이동과 세포 팽압 유지"
    ],
    affectedParts: ["잎", "줄기", "과실", "저장기관"],
    farmerEffects: ["품질 향상", "당도 형성 보조", "저장성 개선", "줄기 강도 보조", "건조와 염류 스트레스 대응"],
    deficiencySymptoms: ["잎 가장자리 마름", "수분 스트레스 취약", "품질 저하"],
    excessCautions: ["칼슘 흡수 경쟁", "마그네슘 흡수 경쟁", "양분 불균형"],
    stageRelevance: ["파종 전", "정식 전", "영양생장기", "개화 전후", "결실 비대기", "수확 전 품질관리"]
  }
};

const growthStageLabels: Record<string, string> = {
  FRUITING: "착과기",
  GROWTH: "생장기",
  HARVEST: "수확기"
};

const growthStageUsage: Record<string, { method: string; timing: string }> = {
  FRUITING: { method: "밑거름 후 웃거름 보완", timing: "개화 전후부터 착과 초기" },
  GROWTH: { method: "밑거름 중심", timing: "정식 전부터 초기 생육기" },
  HARVEST: { method: "웃거름 중심", timing: "수확 전 품질관리기" }
};

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function parseStringArray(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "")
      : [];
  } catch {
    return [];
  }
}

function formatNpk(n: number, p: number, k: number) {
  return `${round(n)}-${round(p)}-${round(k)}`;
}

function getRecommendationTitle(cropName: string, growthStage: string) {
  const stageLabel = growthStageLabels[growthStage] ?? growthStage;
  return `${cropName} ${stageLabel} 비료 추천`;
}

function getCompostBlend(prescription: {
  preCompostCattl: number;
  preCompostPig: number;
  preCompostChick: number;
  preCompostMix: number;
}) {
  return [
    { name: "우분퇴비", ratio: round(prescription.preCompostCattl), unit: "kg/10a" },
    { name: "돈분퇴비", ratio: round(prescription.preCompostPig), unit: "kg/10a" },
    { name: "계분퇴비", ratio: round(prescription.preCompostChick), unit: "kg/10a" },
    { name: "혼합퇴비", ratio: round(prescription.preCompostMix), unit: "kg/10a" }
  ].filter((item) => item.ratio > 0);
}

function getRecommendationEffects(product: ProductForRecommendation) {
  return parseStringArray(product.effects).map((effect, index) => ({
    label: `효과 ${index + 1}`,
    value: effect
  }));
}

function getUsage(
  growthStage: string,
  prescription: {
    preFertN: number;
    preFertP: number;
    preFertK: number;
    postFertN: number;
    postFertP: number;
    postFertK: number;
  }
) {
  const preTotal = prescription.preFertN + prescription.preFertP + prescription.preFertK;
  const postTotal = prescription.postFertN + prescription.postFertP + prescription.postFertK;
  const stageUsage = growthStageUsage[growthStage] ?? { method: "처방량 기준 분시", timing: growthStage };

  return {
    amount: `밑거름 ${round(preTotal)} kg/10a · 웃거름 ${round(postTotal)} kg/10a`,
    method: stageUsage.method,
    timing: stageUsage.timing,
    cautions: [
      "흙토람 비료사용처방량 기준으로 시비하세요.",
      "강우 직전 살포와 과다 시비는 피하세요."
    ]
  };
}

function getProductScore(product: ProductForRecommendation, options: {
  cropCategory?: string | null;
  soilName?: string | null;
  targetNRatio: number;
  targetPRatio: number;
  targetKRatio: number;
}) {
  const npkDistance =
    Math.abs(product.nRatio - options.targetNRatio)
    + Math.abs(product.pRatio - options.targetPRatio)
    + Math.abs(product.kRatio - options.targetKRatio);
  const cropPenalty = product.crop === "전체" || product.crop === options.cropCategory ? 0 : 0.2;
  const soilPenalty = product.soil === "전체" || product.soil === options.soilName ? 0 : 0.15;

  return npkDistance + cropPenalty + soilPenalty;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

function toRecommendation(record: {
  id: number;
  productId: number | null;
  title: string;
  crop: string;
  npk: string;
  blend: string;
  savedAt: Date;
}): Recommendation {
  return {
    id: record.id,
    productId: record.productId,
    title: record.title,
    crop: record.crop,
    npk: record.npk,
    blend: record.blend,
    savedAt: formatDate(record.savedAt)
  };
}

export async function listRecommendations(userId: number): Promise<Recommendation[]> {
  const recommendations = await prisma.recommendation.findMany({
    where: { userId, saved: true },
    orderBy: { id: "desc" }
  });
  return recommendations.map(toRecommendation);
}

export async function getRecommendation(recommendationId: number) {
  const recommendation = await prisma.recommendation.findUnique({ where: { id: recommendationId } });
  return recommendation ? toRecommendation(recommendation) : null;
}

export async function saveRecommendation(userId: number, recommendationId: number, saved: boolean) {
  return prisma.recommendation.update({
    where: { id: recommendationId, userId },
    data: {
      saved,
      savedAt: new Date()
    }
  });
}

export async function createRecommendation(
  input: {
    jibunAddress: string;
    cropCode: string;
    growthStage: string;
    soilType: string;
  },
  userId?: number
) {
  const kakaoAddressDocuments = await searchAddressCoordinates({
    query: input.jibunAddress,
    analyzeType: "exact"
  }).then(res => res.documents);

  if (
    kakaoAddressDocuments.length < 1
    || kakaoAddressDocuments[0].address == null
  ) {
    throw new Error();
  }

  const { b_code, mountain_yn, main_address_no, sub_address_no } = kakaoAddressDocuments[0].address;
  const pnuCode = b_code + (mountain_yn == "N" ? "1" : "2") + main_address_no.padStart(4, "0") + sub_address_no.padStart(4, "0");

  const [crop, soilType] = await Promise.all([
    prisma.cropCode.findUnique({ where: { code: input.cropCode } }),
    prisma.soilType.findUnique({ where: { code: input.soilType } })
  ]);

  if (!crop) {
    throw new Error("선택한 작물 코드가 DB에 없습니다.");
  }

  if (!soilType) {
    throw new Error("선택한 토양 코드가 DB에 없습니다.");
  }

  if (!crop.frtlzrUseApiCropId) {
    throw new Error("선택한 작물의 흙토람 비료사용처방 코드가 DB에 없습니다.");
  }

  const prescription = await getSoilFrtlzrExamInfo(pnuCode, crop.frtlzrUseApiCropId)
    .catch(e => {
      if (e instanceof FertilizerPrescriptionApiError) {
        if (e.resultCode == "301") {
          throw new Error("요청한 농가가 흙토람 서비스에 등록되어 있지 않습니다.");
        }
      }

      throw e;
    });

  const targetNKgPer10a = prescription.preFertN;
  const targetPKgPer10a = prescription.preFertP;
  const targetKKgPer10a = prescription.preFertK;
  const kgSum = targetNKgPer10a + targetPKgPer10a + targetKKgPer10a;
  const targetNRatio = kgSum > 0 ? targetNKgPer10a / kgSum : 0;
  const targetPRatio = kgSum > 0 ? targetPKgPer10a / kgSum : 0;
  const targetKRatio = kgSum > 0 ? targetKKgPer10a / kgSum : 0;
  const nutrientPriorities = [
    { symbol: "N" as const, amount: targetNKgPer10a, ratio: targetNRatio },
    { symbol: "P" as const, amount: targetPKgPer10a, ratio: targetPRatio },
    { symbol: "K" as const, amount: targetKKgPer10a, ratio: targetKRatio }
  ]
    .sort((a, b) => b.amount - a.amount || b.ratio - a.ratio)
    .map((item) => ({
      ...item,
      ...nutrientKnowledge[item.symbol]
    }));

  const products = await prisma.product.findMany();
  if (products.length < 1) {
    throw new Error("추천할 상품이 DB에 없습니다.");
  }

  const matchingProduct = products
    .map((product) => ({
      ...product,
      distance: getProductScore(product, {
        cropCategory: crop.category,
        soilName: soilType.name,
        targetNRatio,
        targetPRatio,
        targetKRatio
      })
    }))
    .sort((a, b) => a.distance - b.distance || b.rating - a.rating)[0];
  const soilStatSummary = ratioToPercentages(targetNRatio, targetPRatio, targetKRatio).join(", ");
  const blend = getCompostBlend(prescription);
  const usage = getUsage(input.growthStage, prescription);
  const effects = getRecommendationEffects(matchingProduct);

  const created = await prisma.recommendation.create({
    data: {
      userId,
      productId: matchingProduct.id,
      title: getRecommendationTitle(crop.name, input.growthStage),
      crop: crop.name,
      npk: formatNpk(targetNKgPer10a, targetPKgPer10a, targetKKgPer10a),
      blend: blend.map((item) => `${item.name} ${item.ratio}${item.unit}`).join(" · "),
      saved: false,
      savedAt: new Date()
    }
  });
  const npkEvidence = await generateNpkEvidence({
    cropName: crop.name,
    growthStage: input.growthStage ?? "FRUITING",
    prescription: {
      n: targetNKgPer10a,
      p: targetPKgPer10a,
      k: targetKKgPer10a,
      unit: "kg/10a"
    },
    selectedProduct: {
      name: matchingProduct.name,
      nRatio: matchingProduct.nRatio,
      pRatio: matchingProduct.pRatio,
      kRatio: matchingProduct.kRatio
    },
    nutrientPriorities
  });

  return {
    id: created.id,
    title: created.title,
    crop,
    growthStage: input.growthStage ?? "FRUITING",
    recommendedProduct: {
      id: matchingProduct.id,
      name: matchingProduct.name,
      price: matchingProduct.price,
      weight: matchingProduct.weight,
      rating: matchingProduct.rating
    },
    npk: {
      n: round(targetNKgPer10a),
      p: round(targetPKgPer10a),
      k: round(targetKKgPer10a),
      unit: "kg/10a"
    },
    blend,
    effects,
    usage,
    evidence: [
      { type: "SOIL_DATA", title: "흙토람 비료사용처방", description: `${prescription.address || input.jibunAddress}의 N:P:K 처방 비율 ${soilStatSummary}을 반영했습니다.` },
      { type: "CROP_STANDARD", title: "작물별 처방 기준", description: `${crop.name} 흙토람 작물코드 ${crop.frtlzrUseApiCropId}의 비료사용처방량을 기준으로 계산했습니다.` },
      { type: "PRODUCT_MATCH", title: "상품 매칭", description: `${matchingProduct.name}의 NPK 비율과 ${crop.category ?? crop.name}, ${soilType.name} 조건을 함께 비교했습니다.` },
      ...toNpkEvidenceItems(npkEvidence)
    ],
    saved: false,
    createdAt: created.createdAt.toISOString()
  };
}

function toNpkEvidenceItems(items: NpkEvidence[]) {
  return items.map((item) => ({
    type: "NPK_EFFECT",
    title: item.title,
    description: item.description
  }));
}

function ratioToPercentages(...ratios: number[]) {
  const sum = ratios.reduce((a, b) => a + b, 0);
  if (sum === 0) return ratios.map(() => 0);

  const exact = ratios.map(val => (val / sum) * 100);
  const lower = exact.map(val => Math.floor(val));

  const currentSum = lower.reduce((a, b) => a + b, 0);
  const difference = 100 - currentSum;

  const remainders = exact.map((val, idx) => ({
    index: idx,
    remainder: val - lower[idx]
  }));

  remainders.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < difference; i++) {
    lower[remainders[i].index] += 1;
  }

  return lower;
}
