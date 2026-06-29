import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CreditCard, ReceiptText, Search, WalletCards } from "lucide-react";
import { paginate } from "@/utils/http";
import { getSessionUser } from "@/utils/session";
import type { PageSearchParams } from "@/types";
import "../mypage.css";
import "../subpage.css";

import { MypageSubpageSidebar } from "../_components/MypageSubpageSidebar";
import { getMypageSummary } from "@/services/domains/user/repository";
import { listPaymentsAction } from "@/services/domains/payment/actions";
import type { Payment } from "@/services/domains/payment/repository";

export const dynamic = "force-dynamic";

function parsePaymentAmount(amount: string) {
  return Number(amount.replace(/[^0-9]/g, ""));
}

function getParam(searchParams: Awaited<PageSearchParams>, key: string, fallback = "") {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function parsePaymentDate(date: string) {
  return new Date(date.replaceAll(".", "-"));
}

function getPeriodStart(period: string) {
  const date = new Date();
  const months = period === "year" ? 12 : period === "six" ? 6 : 3;
  date.setMonth(date.getMonth() - months);
  date.setHours(0, 0, 0, 0);
  return date;
}

const paymentStatusValue = {
  paid: "결제완료",
  cancelled: "결제취소"
};

function buildPaymentsPageHref({
  orderNumber,
  period,
  status,
  page
}: {
  orderNumber: string;
  period: string;
  status: string;
  page: number;
}) {
  const query = new URLSearchParams();

  if (orderNumber) query.set("orderNumber", orderNumber);
  if (period !== "recent") query.set("period", period);
  if (status !== "all") query.set("status", status);
  if (page > 1) query.set("page", String(page));

  const queryString = query.toString();
  return queryString ? `/mypage/payments?${queryString}` : "/mypage/payments";
}

export default async function MypagePaymentsPage({ searchParams }: { searchParams: PageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = getParam(resolvedSearchParams, "orderNumber").trim();
  const period = getParam(resolvedSearchParams, "period", "recent");
  const status = getParam(resolvedSearchParams, "status", "all");
  const currentPage = Math.max(1, Number(getParam(resolvedSearchParams, "page", "1")) || 1);
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  const [summary, paymentResult] = await Promise.all([
    getMypageSummary(user.id),
    listPaymentsAction(user.id)
  ]);
  const periodStart = getPeriodStart(period);
  const selectedStatus = paymentStatusValue[status as keyof typeof paymentStatusValue];
  const filteredPayments = (paymentResult.data ?? []).filter((payment: Payment) => {
    const matchesOrderNumber = !orderNumber || payment.orderId.toLowerCase().includes(orderNumber.toLowerCase());
    const matchesPeriod = parsePaymentDate(payment.date) >= periodStart;
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;

    return matchesOrderNumber && matchesPeriod && matchesStatus;
  });
  const paymentPage = paginate(filteredPayments, currentPage - 1, 20);
  const payments = paymentPage.content;
  const totalPages = paymentPage.totalPages;
  const prevPageHref = buildPaymentsPageHref({ orderNumber, period, status, page: currentPage - 1 });
  const nextPageHref = buildPaymentsPageHref({ orderNumber, period, status, page: currentPage + 1 });
  const totalAmount = payments.reduce((sum, payment) => sum + parsePaymentAmount(payment.amount), 0);
  const latestPayment = payments[0];
  const cardPaymentCount = payments.filter((payment) => payment.method.includes("카드")).length;
  const summaryCards = [
    { label: "전체 결제", value: `${payments.length}건`, icon: ReceiptText },
    { label: "누적 결제액", value: `${totalAmount.toLocaleString("ko-KR")}원`, icon: WalletCards },
    { label: "최근 결제일", value: latestPayment?.date ?? "-", icon: CalendarDays },
    { label: "카드 결제", value: `${cardPaymentCount}건`, icon: CreditCard }
  ];

  return (
    <main className="mypage account-page">
      <section className="container-shell account-layout">
        <MypageSubpageSidebar active="payments" name={summary.profile.name} memberLabel={summary.profile.memberLabel} />
        <div className="account-content payments-content">
          <section className="account-hero payments-hero">
            <div>
              <h1>결제 내역</h1>
              <p>주문별 결제일, 결제수단, 금액과 처리 상태를 확인하세요.</p>
            </div>
            <Image src="/images/banner/mypage-banner.png" alt="" width={1792} height={1024} priority />
          </section>

          <form className="payment-filter-card" aria-label="결제 검색 필터" action="/mypage/payments">
            <label>
              <span>주문번호</span>
              <div>
                <input name="orderNumber" placeholder="주문번호를 입력하세요" defaultValue={orderNumber} />
                <Search size={18} />
              </div>
            </label>
            <label>
              <span>결제 기간</span>
              <select name="period" defaultValue={period} aria-label="결제 기간">
                <option value="recent">최근 3개월</option>
                <option value="six">최근 6개월</option>
                <option value="year">최근 1년</option>
              </select>
            </label>
            <label>
              <span>결제 상태</span>
              <select name="status" defaultValue={status} aria-label="결제 상태">
                <option value="all">전체</option>
                <option value="paid">결제완료</option>
                <option value="cancelled">결제취소</option>
              </select>
            </label>
            <button type="submit">조회</button>
          </form>

          <section className="payment-list-section">
            <p>전체 {paymentPage.totalElements}건</p>
            <div className="payment-table-card">
              <div className="payment-table-head">
                <span>결제일</span>
                <span>주문번호</span>
                <span>결제수단</span>
                <span>결제금액</span>
                <span>상태</span>
                <span>상세</span>
              </div>
              <div className="payment-table-body">
                {payments.map((payment) => (
                  <article className="payment-row" key={`${payment.orderId}-${payment.id ?? payment.date}`}>
                    <div className="payment-date">
                      <strong>{payment.date}</strong>
                      <span>승인 완료</span>
                    </div>
                    <div className="payment-order">
                      <strong>{payment.orderId}</strong>
                    </div>
                    <div className="payment-method">
                      <span>{payment.method}</span>
                    </div>
                    <div className="payment-amount">
                      <strong>{payment.amount}</strong>
                    </div>
                    <div className="payment-status">
                      <span className="status-pill done">{payment.status}</span>
                    </div>
                    <div className="payment-action">
                      <Link href={`/order/${payment.orderId}`}>상세보기</Link>
                    </div>
                  </article>
                ))}
                {payments.length === 0 ? (
                  <div className="empty-payment-state">결제 내역이 없습니다.</div>
                ) : null}
              </div>
            </div>
            {totalPages > 1 ? (
              <nav className="list-pagination" aria-label="결제 목록 페이지">
                {currentPage > 1 ? <Link href={prevPageHref}>이전</Link> : <span>이전</span>}
                <strong>{currentPage} / {totalPages}</strong>
                {currentPage < totalPages ? <Link href={nextPageHref}>다음</Link> : <span>다음</span>}
              </nav>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}
