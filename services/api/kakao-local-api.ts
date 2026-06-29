const DEFAULT_BASE_URL = "https://dapi.kakao.com/v2/local";
const ADDRESS_SEARCH_OPERATION = "search/address.json";

export type KakaoLocalAnalyzeType = "similar" | "exact";

export type KakaoLocalFetchOptions = {
  restApiKey?: string;
  baseUrl?: string;
  signal?: AbortSignal;
};

export type KakaoAddressCoordinateQuery = {
  query: string;
  analyzeType?: KakaoLocalAnalyzeType;
  page?: number;
  size?: number;
};

export type KakaoLocalMeta = {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
};

export type KakaoLocalAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name: string;
  h_code: string;
  b_code: string;
  mountain_yn: "Y" | "N" | string;
  main_address_no: string;
  sub_address_no: string;
  x: string;
  y: string;
};

export type KakaoLocalRoadAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: "Y" | "N" | string;
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
  x: string;
  y: string;
};

export type KakaoAddressCoordinateDocument = {
  address_name: string;
  address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR" | string;
  x: string;
  y: string;
  address: KakaoLocalAddress | null;
  road_address: KakaoLocalRoadAddress | null;
};

export type KakaoAddressCoordinateResponse = {
  meta: KakaoLocalMeta;
  documents: KakaoAddressCoordinateDocument[];
};

export class KakaoLocalApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status = 502
  ) {
    super(message);
    this.name = "KakaoLocalApiError";
  }
}

function getRestApiKey(explicitKey?: string) {
  const restApiKey = explicitKey
    ?? process.env.KAKAO_APP_REST_API_KEY
    ?? process.env.KAKAO_REST_API_KEY;

  if (!restApiKey) {
    throw new KakaoLocalApiError(
      "카카오 로컬 API REST API 키가 설정되지 않았습니다.",
      "MISSING_REST_API_KEY",
      500
    );
  }

  return restApiKey;
}

function getEndpoint(baseUrl?: string) {
  return `${(baseUrl ?? process.env.KAKAO_LOCAL_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")}/${ADDRESS_SEARCH_OPERATION}`;
}

function validateIntegerRange(value: number | undefined, field: string, min: number, max: number) {
  if (value === undefined) {
    return;
  }

  if (!Number.isInteger(value) || value < min || value > max) {
    throw new KakaoLocalApiError(
      `${field}는 ${min} 이상 ${max} 이하의 정수여야 합니다.`,
      "INVALID_PARAMETER",
      400
    );
  }
}

function buildUrl(queryParameter: KakaoAddressCoordinateQuery, options: KakaoLocalFetchOptions) {
  const query = queryParameter.query.trim();

  if (!query) {
    throw new KakaoLocalApiError("주소 검색어 query는 필수입니다.", "INVALID_PARAMETER", 400);
  }

  validateIntegerRange(queryParameter.page, "page", 1, 45);
  validateIntegerRange(queryParameter.size, "size", 1, 30);

  const params = new URLSearchParams({ query });

  if (queryParameter.analyzeType) {
    params.set("analyze_type", queryParameter.analyzeType);
  }

  if (queryParameter.page !== undefined) {
    params.set("page", String(queryParameter.page));
  }

  if (queryParameter.size !== undefined) {
    params.set("size", String(queryParameter.size));
  }

  return `${getEndpoint(options.baseUrl)}?${params.toString()}`;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const text = await response.text();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function isKakaoAddressCoordinateResponse(value: unknown): value is KakaoAddressCoordinateResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<KakaoAddressCoordinateResponse>;
  return Boolean(candidate.meta && Array.isArray(candidate.documents));
}

/** 카카오 로컬 API의 주소로 좌표 변환을 호출합니다. */
export async function searchAddressCoordinates(
  queryParameter: KakaoAddressCoordinateQuery,
  options: KakaoLocalFetchOptions = {}
): Promise<KakaoAddressCoordinateResponse> {
  const response = await fetch(buildUrl(queryParameter, options), {
    method: "GET",
    signal: options.signal,
    headers: {
      Authorization: `KakaoAK ${getRestApiKey(options.restApiKey)}`,
      Accept: "application/json"
    }
  });

  const parsed = await parseResponse(response);

  if (!response.ok) {
    const body = parsed && typeof parsed === "object" ? parsed as { errorType?: string; message?: string } : {};
    throw new KakaoLocalApiError(
      body.message || `카카오 주소 좌표 변환 API 요청 실패: HTTP ${response.status}`,
      body.errorType || String(response.status),
      response.status
    );
  }

  if (!isKakaoAddressCoordinateResponse(parsed)) {
    throw new KakaoLocalApiError(
      "카카오 주소 좌표 변환 API 응답 형식이 올바르지 않습니다.",
      "INVALID_RESPONSE",
      502
    );
  }

  return parsed;
}
