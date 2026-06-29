"use server";

import { revalidatePath } from "next/cache";
import { failure, success, type ActionResult } from "@/utils/action-result";
import { updateFarm } from "./repository";
import { getSessionUser } from "@/utils/session";

export async function updateMyFarmAction(data: {
  farmName?: string;
  farmAddress?: string;
  crops?: string;
  area?: string;
  soilType?: string;
}): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  await updateFarm(user.id, data);
  revalidatePath("/mypage");

  return success(null);
}
