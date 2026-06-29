import { prisma } from "@/services/prisma";

export async function searchAddresses(query: string) {
  const keyword = query.trim();

  return prisma.roadAddress.findMany({
    where: keyword
      ? {
          OR: [
            { roadAddress: { contains: keyword } },
            { jibunAddress: { contains: keyword } },
            { sido: { contains: keyword } },
            { sigungu: { contains: keyword } }
          ]
        }
      : undefined,
    orderBy: { id: "asc" },
    take: 10
  });
}
