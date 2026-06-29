import { prisma } from "@/services/prisma";
import { parseNumber } from "@/utils/parse-number";

export type Farm = {
  name: string;
  address: {
    roadAddress: string;
    bcode?: string;
    sido?: string;
    sigungu?: string;
    lat?: number | null;
    lng?: number | null;
  };
  crops: Array<{ code?: string; name: string }>;
  soil: {
    type: string;
    ph?: number | null;
    organicMatterLevel?: string | null;
    source?: string;
  };
  areaSquareMeter: number;
};

type FarmRecord = NonNullable<Awaited<ReturnType<typeof prisma.farm.findFirst>>>;

type FarmUpdateData = Partial<{
  name: string;
  farmName: string;
  roadAddress: string;
  farmAddress: string;
  bcode: string;
  areaSquareMeter: number;
  area: number | string;
  crops: string | Array<{ code?: string; name: string }>;
  soilType: string;
  sido: string;
  sigungu: string;
}>;

export async function createDefaultFarm(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });

  return prisma.farm.create({
    data: {
      ownerId: userId,
      name: `${user?.name ?? "나의"} 농가`,
      crops: JSON.stringify([]),
      soilType: "미등록",
      soilSource: "USER_INPUT",
      areaSquareMeter: 0
    }
  });
}

export async function getFarm(userId: number) {
  const found = await prisma.farm.findFirst({ where: { ownerId: userId } }) ?? (await createDefaultFarm(userId));

  return toFarmResponse(found);
}

export async function updateFarm(userId: number, data: FarmUpdateData) {
  const found = await prisma.farm.findFirst({ where: { ownerId: userId } }) ?? (await createDefaultFarm(userId));
  const crops = normalizeCropInput(data.crops);
  const areaSquareMeter = parseNumber(data.areaSquareMeter ?? data.area);
  const roadAddress = data.roadAddress ?? data.farmAddress;
  const nextAddress = roadAddress
    ? await prisma.roadAddress.findFirst({
        where: {
          OR: [
            { roadAddress },
            { roadAddress: { contains: roadAddress } },
            { jibunAddress: { contains: roadAddress } },
            ...(data.bcode ? [{ bcode: data.bcode }] : [])
          ]
        },
        orderBy: { id: "asc" }
      })
    : null;
  const updated = await prisma.farm.update({
    where: { id: found.id },
    data: {
      name: data.name ?? data.farmName,
      addressId: nextAddress?.id,
      areaSquareMeter,
      crops: crops ? JSON.stringify(crops) : undefined,
      soilType: data.soilType
    }
  });

  return toFarmResponse(updated);
}

async function toFarmResponse(found: FarmRecord) {
  const address = found.addressId
    ? await prisma.roadAddress.findUnique({ where: { id: found.addressId } })
    : null;

  return {
    id: found.id,
    ownerId: found.ownerId,
    name: found.name,
    address: {
      sido: address?.sido,
      sigungu: address?.sigungu,
      roadAddress: address?.roadAddress ?? "등록된 농가 주소가 없습니다.",
      bcode: address?.bcode,
      lat: address?.lat ?? null,
      lng: address?.lng ?? null
    },
    crops: JSON.parse(found.crops) as Array<{ code: string; name: string }>,
    soil: {
      type: found.soilType,
      ph: found.soilPh,
      organicMatterLevel: found.organicMatterLevel,
      source: found.soilSource
    },
    areaSquareMeter: found.areaSquareMeter
  };
}

function normalizeCropInput(value: FarmUpdateData["crops"]) {
  if (Array.isArray(value)) {
    return value.map((crop) => ({ code: crop.code ?? crop.name, name: crop.name })).filter((crop) => crop.name);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ code: name, name }));
  }

  return undefined;
}
