"use server";

import { revalidatePath } from "next/cache";
import { failure, success, type ActionResult } from "@/utils/action-result";
import { createProduct, updateProduct, type ProductInput } from "./repository";
import { getAdminUser } from "@/utils/admin-auth";

export async function saveProductAction(data: ProductInput): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) {
    return failure("관리자 권한이 필요합니다.");
  }

  await createProduct(data);
  revalidatePath("/admin");

  return success(null);
}

export async function updateProductAction(productId: number, data: Partial<ProductInput>): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) {
    return failure("관리자 권한이 필요합니다.");
  }

  await updateProduct(productId, data);
  revalidatePath("/admin");
  revalidatePath(`/admin/products/${productId}/edit`);

  return success(null);
}
