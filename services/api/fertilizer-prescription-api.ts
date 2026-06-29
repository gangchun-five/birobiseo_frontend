import { xml2js, type ElementCompact } from "xml-js";

const DEFAULT_BASE_URL = "http://apis.data.go.kr/1390802/SoilEnviron/FrtlzrUse";
const GENERAL_OPERATION = "getSoilFrtlzrExamInfo";
const RICE_OPERATION = "getSoilFrtlzrExamRiceInfo";

export type FertilizerPrescriptionCompostRatios = {
  /** Cattle compost mix ratio, percent. API default is 28. */
  cattl?: number;
  /** Pig compost mix ratio, percent. API default is 22. */
  pig?: number;
  /** Chicken compost mix ratio, percent. API default is 19. */
  chick?: number;
};

export type FertilizerPrescriptionFetchOptions = {
  serviceKey?: string;
  baseUrl?: string;
  signal?: AbortSignal;
  compostRatios?: FertilizerPrescriptionCompostRatios;
};

export type FertilizerPrescriptionResponse = {
  resultCode: string;
  resultMessage: string;
  pnuCode: string;
  address: string;
  cropCode: string;
  cropName: string;
  riceQualityCode?: string;
  riceQualityName?: string;
  preFertN: number;
  preFertP: number;
  preFertK: number;
  postFertN: number;
  postFertP: number;
  postFertK: number;
  preCompostCattl: number;
  preCompostPig: number;
  preCompostChick: number;
  preCompostMix: number;
  raw: Record<string, string>;
};

export class FertilizerPrescriptionApiError extends Error {
  constructor(
    message: string,
    readonly resultCode: string,
    readonly resultMessage: string,
    readonly status = 502
  ) {
    super(message);
    this.name = "FertilizerPrescriptionApiError";
  }
}

const errorStatuses: Record<string, number> = {
  "101": 401,
  "201": 400,
  "202": 400,
  "203": 400,
  "204": 400,
  "301": 404,
  "400": 400,
  "404": 404,
  "500": 502,
  "600": 502,
  "999": 502
};

const defaultCompostRatios = {
  cattl: 28,
  pig: 22,
  chick: 19
} satisfies Required<FertilizerPrescriptionCompostRatios>;

function asRecord(value: unknown): ElementCompact {
  return value && typeof value === "object" ? value as ElementCompact : {};
}

function asArray(value: unknown): ElementCompact[] {
  if (Array.isArray(value)) {
    return value.map(asRecord);
  }

  return value ? [asRecord(value)] : [];
}

function textOf(value: unknown) {
  const text = asRecord(value)._text;
  return text === undefined || text === null ? "" : String(text).trim();
}

function requiredNumber(item: Record<string, string>, field: string) {
  const value = Number(item[field]);

  if (!Number.isFinite(value)) {
    throw new FertilizerPrescriptionApiError(
      `비료사용처방 API 응답의 ${field} 값이 올바르지 않습니다.`,
      "INVALID_RESPONSE",
      `Invalid ${field}`,
      502
    );
  }

  return value;
}

function parseXmlResponse(xml: string) {
  const parsed = asRecord(xml2js(xml, {
    compact: true,
    trim: true,
    nativeType: false,
    ignoreDeclaration: true,
    ignoreAttributes: true
  }));
  const response = asRecord(parsed.response);
  const header = asRecord(response.header);
  const body = asRecord(response.body);
  const items = asRecord(body.items);
  const firstItem = asArray(items.item)[0] ?? {};
  const item: Record<string, string> = {};

  for (const [key, value] of Object.entries(firstItem)) {
    if (!key.startsWith("_")) {
      item[key] = textOf(value);
    }
  }

  return {
    resultCode: textOf(header.result_Code) || textOf(header.resultCode),
    resultMessage: textOf(header.result_Msg) || textOf(header.resultMsg),
    item
  };
}

function getServiceKey(explicitKey?: string) {
  const serviceKey = explicitKey
    ?? process.env.FERTILIZER_PRESCRIPTION_SERVICE_KEY;

  if (!serviceKey) {
    throw new FertilizerPrescriptionApiError(
      "비료사용처방 API serviceKey가 설정되지 않았습니다.",
      "MISSING_SERVICE_KEY",
      "Missing service key",
      500
    );
  }

  return serviceKey;
}

function validatePnuCode(pnuCode: string) {
  if (!/^\d{19}$/.test(pnuCode)) {
    throw new FertilizerPrescriptionApiError(
      "PNU_Code는 19자리 숫자 필지고유번호여야 합니다.",
      "201",
      "PARAM_VALI_ERROR",
      400
    );
  }
}

function validateCropCode(cropCode: string) {
  if (!/^\d{5}$/.test(cropCode)) {
    throw new FertilizerPrescriptionApiError(
      "crop_Code는 5자리 숫자 작물코드여야 합니다.",
      "201",
      "PARAM_VALI_ERROR",
      400
    );
  }
}

function validateRiceQualityCode(riceQualityCode: string) {
  if (!/^\d+$/.test(riceQualityCode)) {
    throw new FertilizerPrescriptionApiError(
      "rice_Qlt_Code는 숫자 품질코드여야 합니다.",
      "201",
      "PARAM_VALI_ERROR",
      400
    );
  }
}

function normalizeRatio(value: number, field: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new FertilizerPrescriptionApiError(
      `${field}는 0 이상 100 이하의 혼합비율이어야 합니다.`,
      "201",
      "PARAM_VALI_ERROR",
      400
    );
  }

  return String(Math.round(value));
}

function buildUrl(operation: string, params: URLSearchParams, options: FertilizerPrescriptionFetchOptions) {
  const baseUrl = (
    options.baseUrl
    ?? process.env.FERTILIZER_PRESCRIPTION_BASE_URL
    ?? DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  const serviceKey = getServiceKey(options.serviceKey);

  return `${baseUrl}/${operation}?serviceKey=${serviceKey}&${params.toString()}`;
}

function buildParams(
  pnuCode: string,
  cropCode: string,
  options: FertilizerPrescriptionFetchOptions,
  riceQualityCode?: string
) {
  validatePnuCode(pnuCode);
  validateCropCode(cropCode);

  if (riceQualityCode !== undefined) {
    validateRiceQualityCode(riceQualityCode);
  }

  const ratios = {
    ...defaultCompostRatios,
    ...options.compostRatios
  };
  const params = new URLSearchParams({
    PNU_Code: pnuCode,
    crop_Code: cropCode,
    animix_Ratio_Cattl: normalizeRatio(ratios.cattl, "animix_Ratio_Cattl"),
    animix_Ratio_Pig: normalizeRatio(ratios.pig, "animix_Ratio_Pig"),
    animix_Ratio_Chick: normalizeRatio(ratios.chick, "animix_Ratio_Chick")
  });

  if (riceQualityCode !== undefined) {
    params.set("rice_Qlt_Code", riceQualityCode);
  }

  return params;
}

function toPrescriptionResponse(
  parsed: ReturnType<typeof parseXmlResponse>,
  fallback: { pnuCode: string; cropCode: string }
): FertilizerPrescriptionResponse {
  const item = parsed.item;

  return {
    resultCode: parsed.resultCode || "200",
    resultMessage: parsed.resultMessage || "OK",
    pnuCode: item.pnu_Code || fallback.pnuCode,
    address: item.addr || "",
    cropCode: item.crop_Code || fallback.cropCode,
    cropName: item.crop_Nm || "",
    riceQualityCode: item.rice_Qlt_Code || undefined,
    riceQualityName: item.rice_Qlt_Nm || undefined,
    preFertN: requiredNumber(item, "pre_Fert_N"),
    preFertP: requiredNumber(item, "pre_Fert_P"),
    preFertK: requiredNumber(item, "pre_Fert_K"),
    postFertN: requiredNumber(item, "post_Fert_N"),
    postFertP: requiredNumber(item, "post_Fert_P"),
    postFertK: requiredNumber(item, "post_Fert_K"),
    preCompostCattl: requiredNumber(item, "pre_Compost_Cattl"),
    preCompostPig: requiredNumber(item, "pre_Compost_Pig"),
    preCompostChick: requiredNumber(item, "pre_Compost_Chick"),
    preCompostMix: requiredNumber(item, "pre_Compost_Mix"),
    raw: item
  };
}

async function fetchPrescription(
  operation: string,
  pnuCode: string,
  cropCode: string,
  options: FertilizerPrescriptionFetchOptions,
  riceQualityCode?: string
): Promise<FertilizerPrescriptionResponse> {
  const response = await fetch(buildUrl(operation, buildParams(pnuCode, cropCode, options, riceQualityCode), options), {
    method: "GET",
    signal: options.signal,
    headers: {
      Accept: "application/xml,text/xml,*/*"
    }
  });

  if (!response.ok) {
    throw new FertilizerPrescriptionApiError(
      `비료사용처방 API 요청 실패: HTTP ${response.status}`,
      String(response.status),
      response.statusText,
      502
    );
  }

  let parsed: ReturnType<typeof parseXmlResponse>;

  try {
    parsed = parseXmlResponse(await response.text());
  } catch (error) {
    if (error instanceof FertilizerPrescriptionApiError) {
      throw error;
    }

    throw new FertilizerPrescriptionApiError(
      "비료사용처방 API의 XML 응답을 해석하지 못했습니다.",
      "INVALID_XML",
      "Invalid XML response",
      502
    );
  }

  if (parsed.resultCode && parsed.resultCode !== "200") {
    throw new FertilizerPrescriptionApiError(
      parsed.resultMessage || "비료사용처방 API 오류",
      parsed.resultCode,
      parsed.resultMessage,
      errorStatuses[parsed.resultCode] ?? 502
    );
  }

  if (Object.keys(parsed.item).length === 0) {
    throw new FertilizerPrescriptionApiError(
      "해당 필지와 작물의 비료사용처방 정보가 없습니다.",
      "301",
      "OK_NO_DATA_ERROR",
      404
    );
  }

  return toPrescriptionResponse(parsed, { pnuCode, cropCode });
}

/** 벼 이외 작물의 비료사용처방량을 kg/10a 단위로 조회합니다. */
export async function getSoilFrtlzrExamInfo(
  pnuCode: string,
  cropCode: string,
  options: FertilizerPrescriptionFetchOptions = {}
) {
  return fetchPrescription(GENERAL_OPERATION, pnuCode, cropCode, options);
}

/** 벼 작물의 품질코드별 비료사용처방량을 kg/10a 단위로 조회합니다. */
export async function getSoilFrtlzrExamRiceInfo(
  pnuCode: string,
  cropCode: string,
  riceQualityCode: string,
  options: FertilizerPrescriptionFetchOptions = {}
) {
  return fetchPrescription(RICE_OPERATION, pnuCode, cropCode, options, riceQualityCode);
}

export const fetchFertilizerPrescription = getSoilFrtlzrExamInfo;
export const fetchRiceFertilizerPrescription = getSoilFrtlzrExamRiceInfo;
