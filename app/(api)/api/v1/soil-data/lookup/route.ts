import { fail, ok, withApiHandler } from "@/utils/http";
import { getSoilData } from "@/services/domains/soil-data/repository";

async function getHandler(request: Request) {
  const { searchParams } = new URL(request.url);
  const soilData = await getSoilData(searchParams);

  if (!soilData) {
    return fail("NOT_FOUND", "토양 데이터를 찾을 수 없습니다.", 404);
  }

  return ok(soilData);
}

export const GET = withApiHandler(getHandler);
