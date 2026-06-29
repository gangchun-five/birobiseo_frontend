import { prisma } from "@/services/prisma";

export async function listCropCodes() {
  return prisma.cropCode.findMany({
    orderBy: { id: "asc" },
    select: { code: true, name: true, category: true, frtlzrUseApiCropId: true }
  });
}
