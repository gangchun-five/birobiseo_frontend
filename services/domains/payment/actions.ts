"use server";

import { success } from "@/utils/action-result";
import { listPayments } from "./repository";

export async function listPaymentsAction(userId: number) {
  const payments = await listPayments(userId);
  return success(payments);
}
