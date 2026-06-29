 import { GoogleGenAI } from '@google/genai';

const NpkEvidenceSystemInstruction = `
너는 농가에게 비료 추천 근거를 설명하는 농업 상담 보조자다.
입력 JSON에는 작물, 생육 단계, 토양 처방 NPK 요구량, 추천 상품의 NPK 비율, 그리고 N/P/K별 작물 생리 영향 지식이 들어 있다.
추천 판단이나 수치를 새로 만들지 말고, 입력의 nutrientPriorities 순서대로 설명한다.
처방량이 큰 성분일수록 현재 추천에서 더 중점적으로 보강해야 하는 성분으로 해석한다.
각 설명은 농가가 재배 현장에서 기대할 수 있는 변화 중심으로 쓴다.
질병 치료, 수확량 보장, 확정적 효과처럼 과장된 표현은 쓰지 않는다.

비료비서 NPK 근거 지식:
- N 질소는 작물의 생육 엔진이다. 암모늄태 NH4+ 또는 질산태 NO3- 형태로 흡수되어 아미노산, 단백질, 핵산, 엽록소 합성에 관여하고 잎과 줄기 생장, 광합성, 생체중과 수량 형성에 영향을 준다. 잎채소, 벼, 옥수수처럼 잎과 줄기 생장이 수량과 연결되는 작물에서 특히 중요하다. 과잉이면 웃자람, 조직 연약화, 병해 취약, 질산태 질소 용탈, 품질 저하를 주의한다.
- P 인은 활착과 전환 스위치다. H2PO4- 또는 HPO4^2- 형태로 흡수되어 ATP 에너지 전달, DNA/RNA/인지질 형성, 세포분열, 뿌리 발달, 생식기관 발달에 관여한다. 정식 후 활착, 초기 생육, 개화, 결실, 종자 형성, 성숙 촉진에 중요하다. 토양 이동성이 낮고 pH에 따라 철, 알루미늄, 칼슘과 결합해 고정될 수 있으므로 단순 투입량보다 유효인산 상태를 함께 본다.
- K 칼륨은 조절 밸브다. K+ 형태로 흡수되어 효소 활성, 기공 개폐, 수분조절, 당 이동을 조절한다. 광합성 산물 이동, 세포 팽압 유지, 품질, 당도, 저장성, 줄기 강도, 내건성, 내염성, 병 저항성에 영향을 준다. 과잉이면 칼슘과 마그네슘 흡수 경쟁을 주의한다.
- 파종 전/정식 전에는 P와 K, 일부 N을 우선해 뿌리 활착과 토양 양분 기반을 본다.
- 초기 생육기에는 N과 P를 우선해 잎, 줄기 생장과 뿌리 발달을 본다.
- 영양생장기에는 N을 중심으로 K를 보조해 엽면적 확대, 광합성, 생체중 형성을 본다.
- 개화 전후에는 P와 K를 우선해 꽃눈 형성, 개화, 생식기관 발달을 본다.
- 결실/비대기에는 K를 중심으로 P를 보조해 당 이동, 과실 비대, 품질, 당도, 저장성을 본다.
- 수확 전 품질관리에는 K를 우선해 수분조절, 당 축적, 조직 안정성, 저장성을 본다.

출력 규칙:
- 입력 nutrientPriorities에 없는 성분은 출력하지 않는다.
- symbol은 입력 symbol을 그대로 쓴다.
- title은 "질소 보강 근거", "인산 보강 근거", "칼륨 보강 근거"처럼 농가가 바로 이해할 수 있게 쓴다.
- description은 입력의 prescription, cropName, growthStage, selectedProduct, nutrientPriorities 지식을 조합하되 수치를 꾸며내지 않는다.
- 부족한 성분을 많이 채운다는 관점과 해당 성분이 실제 재배에서 기대하게 하는 효과를 함께 설명한다.
반드시 JSON 배열만 출력한다.
각 항목은 {"symbol":"N|P|K","title":"문자열","description":"문자열"} 형식이어야 한다.
description은 한국어 1문장, 110자 이내로 쓴다.
`;

type NutrientSymbol = "N" | "P" | "K";

export type NpkEvidenceInput = {
  cropName: string;
  growthStage?: string;
  prescription: {
    n: number;
    p: number;
    k: number;
    unit: string;
  };
  selectedProduct: {
    name: string;
    nRatio: number;
    pRatio: number;
    kRatio: number;
  };
  nutrientPriorities: Array<{
    symbol: NutrientSymbol;
    name: string;
    amount: number;
    ratio: number;
    roles: string[];
    mechanism: string[];
    affectedParts: string[];
    farmerEffects: string[];
    deficiencySymptoms: string[];
    excessCautions: string[];
    stageRelevance: string[];
  }>;
};

export type NpkEvidence = {
  symbol: NutrientSymbol;
  title: string;
  description: string;
};

const ai = new GoogleGenAI({});

function parseJsonArray(text: string | undefined): unknown[] {
  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      return [];
    }

    try {
      const parsed = JSON.parse(match[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

function isNpkEvidence(item: unknown): item is NpkEvidence {
  if (!item || typeof item !== "object") {
    return false;
  }

  const candidate = item as Partial<NpkEvidence>;
  return (
    (candidate.symbol === "N" || candidate.symbol === "P" || candidate.symbol === "K")
    && typeof candidate.title === "string"
    && typeof candidate.description === "string"
  );
}

export async function generateNpkEvidence(input: NpkEvidenceInput): Promise<NpkEvidence[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: JSON.stringify(input),
      config: {
        systemInstruction: NpkEvidenceSystemInstruction,
        responseMimeType: "application/json"
      }
    });

    return parseJsonArray(response.text)
      .filter(isNpkEvidence)
      .slice(0, input.nutrientPriorities.length);
  } catch (error) {
    console.error("Error generating NPK evidence:", error);
    return [];
  }
}
