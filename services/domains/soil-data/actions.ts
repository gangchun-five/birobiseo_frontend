import { success } from "@/utils/action-result";
import { getSoilData, listSoilTypes } from "./repository";

export async function listSoilTypesAction() {
  const soilTypes = await listSoilTypes();
  return success(soilTypes);
}

export async function getSoilDataAction(searchParams: URLSearchParams) {
  const soilData = await getSoilData(searchParams);
  return success(soilData);
}
