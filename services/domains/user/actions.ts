"use server";

import { revalidatePath } from "next/cache";
import { failure, success, type ActionResult } from "@/utils/action-result";
import { updateUserProfile } from "./repository";
import { updateFarm } from "../farm/repository";
import { getSessionUser } from "@/utils/session";

export type MypageSummary = {
  profile: {
    name: string;
    memberLabel: string;
    totalOrderCount?: number;
    savedRecommendationCount?: number;
    reviewCount?: number;
  };
  stats?: {
    recentRecommendationCount: number;
    activeOrderCount: number;
    monthlyPaymentAmount: number;
    subscriptionLabel: string;
  };
};

export async function updateMyProfileAction(data: { name: string; email: string; phone: string }): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  await updateUserProfile(user.id, data);
  revalidatePath("/mypage");

  return success(null);
}

export async function updateMyFarmAddressAction(data: { roadAddress: string }): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  await updateFarm(user.id, data);
  revalidatePath("/mypage");

  return success(null);
}
