"use server";

import { failure, success, type ActionResult } from "@/utils/action-result";
import { createDirectOrderWithPayment } from "./repository";
import { getSessionUser } from "@/utils/session";

export async function createDirectOrderAction(data: {
  productId: number;
  optionId?: string;
  quantity: number;
}): Promise<ActionResult<{ order: { id: string } }>> {
  const user = await getSessionUser();

  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  const result = await createDirectOrderWithPayment(user.id, data);

  if (!result) {
    return failure("상품을 찾을 수 없습니다.");
  }

  return success({ order: { id: result.order.id } });
}
