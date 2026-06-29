"use server";

import { failure, success, type ActionResult } from "@/utils/action-result";
import { createRecommendation, listRecommendations, saveRecommendation } from "./repository";
import { getSessionUser } from "@/utils/session";

export type RecommendationResult = {
  id: number;
  title: string;
  crop: { code: string; name: string };
  recommendedProduct: {
    id: number;
    name: string;
    price: number;
    weight: string;
    rating: number;
  };
  npk: { n: number; p: number; k: number; unit: string };
  blend: Array<{ name: string; ratio: number; unit: string }>;
  effects: Array<{ label: string; value: string }>;
  usage: {
    amount: string;
    method: string;
    timing: string;
    cautions: string[];
  };
  evidence?: Array<{
    type: string;
    title: string;
    description: string;
  }>;
};

export async function createRecommendationAction(input: {
  jibunAddress: string;
  cropCode: string;
  growthStage: string;
  soilType: string;
}): Promise<ActionResult<RecommendationResult>> {
  if (!input.cropCode) {
    return failure("재배 작물을 선택해주세요.");
  }

  const user = await getSessionUser();
  const recommendation = await createRecommendation(input, user?.id);

  return success(recommendation as RecommendationResult);
}

export async function listRecommendationsAction(userId: number) {
  const recommendations = await listRecommendations(userId);
  return success(recommendations);
}

export async function saveRecommendationAction(recommendationId: number): Promise<ActionResult<{ saved: boolean }>> {
  const user = await getSessionUser();
  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  try {
    await saveRecommendation(user.id, recommendationId, true);
    return success({ saved: true });
  } catch {
    return failure("배합표 저장에 실패했습니다.");
  }
}
