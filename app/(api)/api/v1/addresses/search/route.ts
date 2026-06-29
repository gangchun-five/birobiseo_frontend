import { ok, withApiHandler } from "@/utils/http";
import { searchAddresses } from "@/services/domains/address/repository";

async function getHandler(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  return ok(await searchAddresses(query));
}

export const GET = withApiHandler(getHandler);
