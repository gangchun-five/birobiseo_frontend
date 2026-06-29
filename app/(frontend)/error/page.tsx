import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import type { PageSearchParams } from "@/types";
import "../mypage/subpage.css";

export const dynamic = "force-dynamic";

function getSafeReturnTo(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/error")) {
    return "/";
  }

  return value;
}

function getErrorTitle(code?: string) {
  if (code === "UNAUTHORIZED") {
    return "로그인이 필요합니다";
  }

  if (code === "FORBIDDEN") {
    return "접근 권한이 없습니다";
  }

  if (code === "NOT_FOUND") {
    return "주문을 확인할 수 없습니다";
  }

  return "요청을 처리하지 못했습니다";
}

export default async function FrontendErrorPage({ searchParams }: { searchParams: PageSearchParams }) {
  const params = await searchParams;
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const returnToParam = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const messageParam = Array.isArray(params.message) ? params.message[0] : params.message;
  const returnTo = getSafeReturnTo(returnToParam);
  const title = getErrorTitle(code);
  const message = messageParam ?? "잠시 후 다시 시도하거나 고객센터로 문의해주세요.";

  return (
    <main className="frontend-error-page">
      <section className="container-shell frontend-error-card">
        <span className="frontend-error-icon">
          <AlertTriangle size={38} />
        </span>
        <p>{code ?? "ERROR"}</p>
        <h1>{title}</h1>
        <span>{message}</span>
        <div className="frontend-error-actions">
          <Link href={returnTo}><RotateCcw size={18} />이전 화면으로</Link>
          <Link href="/" className="secondary"><Home size={18} />홈으로</Link>
        </div>
      </section>
    </main>
  );
}
