import { prisma } from "@/services/prisma";

type SoilDataRecord = NonNullable<Awaited<ReturnType<typeof prisma.soilData.findFirst>>>;

export async function listSoilTypes() {
  return prisma.soilType.findMany({
    orderBy: { id: "asc" },
    select: { code: true, name: true, ph: true }
  });
}

async function toSoilDataResponse(data: SoilDataRecord) {
  const legalDongAddress = await prisma.legalDongAddress.findUnique({
    where: { id: data.legalDongAddressId }
  });

  return {
    source: data.source,
    location: {
      bcode: legalDongAddress?.bcode,
      sido: legalDongAddress?.sido,
      sigungu: legalDongAddress?.sigungu,
      legalDongName: legalDongAddress?.legalDongName
    },
    soilType: data.soilType,
    ph: data.ph,
    organicMatter: {
      value: data.organicMatterValue,
      unit: data.organicMatterUnit,
      level: data.organicMatterLevel
    },
    nutrients: {
      availablePhosphate: { value: data.availablePhosphateValue, unit: data.availablePhosphateUnit },
      potassium: { value: data.potassiumValue, unit: data.potassiumUnit },
      calcium: { value: data.calciumValue, unit: data.calciumUnit },
      magnesium: { value: data.magnesiumValue, unit: data.magnesiumUnit }
    },
    fetchedAt: data.fetchedAt.toISOString()
  };
}

export async function getSoilData(searchParams: URLSearchParams) {
  const bcode = searchParams.get("bcode")?.trim() ?? searchParams.get("stdgCd")?.trim() ?? searchParams.get("STDG_CD")?.trim();
  const sido = searchParams.get("sido")?.trim();
  const sigungu = searchParams.get("sigungu")?.trim();
  const address = searchParams.get("address")?.trim();
  const matchedAddress = address
    ? await prisma.roadAddress.findFirst({
        where: {
          OR: [
            { roadAddress: { contains: address } },
            { jibunAddress: { contains: address } }
          ]
        }
      })
    : null;
  const legalDongAddress = bcode || matchedAddress?.bcode || sido || sigungu
    ? await prisma.legalDongAddress.findFirst({
        where: {
          bcode: bcode ?? matchedAddress?.bcode,
          sido: sido ?? matchedAddress?.sido,
          sigungu: sigungu ?? matchedAddress?.sigungu
        },
        orderBy: { id: "asc" }
      })
    : null;
  const found = await prisma.soilData.findFirst({
    where: {
      legalDongAddressId: legalDongAddress?.id
    },
    orderBy: { id: "asc" }
  }) ?? await prisma.soilData.findFirst({ orderBy: { id: "asc" } });

  return found ? toSoilDataResponse(found) : null;
}
