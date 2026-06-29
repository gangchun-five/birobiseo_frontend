import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "OUT_OF_STOCK"
  | "PAYMENT_FAILED"
  | "RECOMMENDATION_FAILED";

type RouteHandler<Args extends unknown[] = unknown[]> = (...args: Args) => Response | Promise<Response>;

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null
    },
    init
  );
}

export function fail(code: ApiErrorCode, message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code,
        message,
        details: details ?? null
      }
    },
    { status }
  );
}

export function toApiError(error: unknown) {
  if (error instanceof Error) {
    return {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: error.message || "서버 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "production" ? null : { name: error.name, stack: error.stack }
    };
  }

  return {
    code: "INTERNAL_SERVER_ERROR" as const,
    message: "서버 오류가 발생했습니다.",
    details: process.env.NODE_ENV === "production" ? null : error
  };
}

export function withApiHandler<Args extends unknown[]>(handler: RouteHandler<Args>): RouteHandler<Args> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      const apiError = toApiError(error);
      return fail(apiError.code, apiError.message, 500, apiError.details);
    }
  };
}

export function paginate<T>(items: T[], page: number, size: number) {
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const safeSize = Number.isFinite(size) && size > 0 ? size : 10;
  const start = safePage * safeSize;
  const content = items.slice(start, start + safeSize);

  return {
    content,
    page: safePage,
    size: safeSize,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safeSize))
  };
}
