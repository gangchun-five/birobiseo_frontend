"use server";

import { revalidatePath } from "next/cache";

import { failure, formText, success, type ActionResult } from "@/utils/action-result";
import { getSessionUser } from "@/utils/session";
import { createReview, hasPurchasedProduct } from "./repository";

export async function createProductReviewAction(formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) {
    return failure("로그인이 필요합니다.");
  }

  const productId = Number(formText(formData.get("productId")));
  const rating = Number(formText(formData.get("rating")));
  const content = formText(formData.get("content")).trim();

  if (!Number.isInteger(productId) || productId <= 0) {
    return failure("상품 정보가 올바르지 않습니다.");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return failure("별점은 1점부터 5점까지 선택해주세요.");
  }

  if (content.length < 5) {
    return failure("리뷰 내용을 5자 이상 입력해주세요.");
  }

  const purchased = await hasPurchasedProduct(user.id, productId);
  if (!purchased) {
    return failure("구매한 상품에만 리뷰를 작성할 수 있습니다.");
  }

  await createReview({
    userId: user.id,
    productId,
    name: user.name,
    rating,
    content
  });

  revalidatePath(`/market/${productId}`);
  revalidatePath("/market");
  return success(null);
}
