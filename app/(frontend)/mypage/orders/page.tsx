import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, CheckCircle2, CreditCard, Search, Truck } from "lucide-react";
import { paginate } from "@/utils/http";
import { getSessionUser } from "@/utils/session";
import type { PageSearchParams } from "@/types";
import "../mypage.css";
import "../subpage.css";

import { MypageSubpageSidebar } from "../_components/MypageSubpageSidebar";
import { getMypageSummary } from "@/services/domains/user/repository";
import { listOrders, Order } from "@/services/domains/order/repository";

export const dynamic = "force-dynamic";

const statusMeta = {
  배합준비: {
    label: "상품준비중",
    className: "preparing",
    description: "예상 도착일"
  },
  배송중: {
    label: "배송중",
    className: "shipping",
    description: "예상 도착일"
  },
  배송완료: {
    label: "배송완료",
    className: "done",
    description: "배송 완료일"
  }
} satisfies Record<Order["status"], { label: string; className: string; description: string }>;

function getOrderNumber(id: string, index: number) {
  const digits = id.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(0, 12) : `202406${String(150001 + index).padStart(6, "0")}`;
}

function getProductQuantity(order: Order, index: number) {
  const quantity = index % 3 === 0 ? 2 : index % 3 === 1 ? 3 : 1;
  return `${order.product}\n20kg × ${quantity}포`;
}

function getParam(searchParams: Awaited<PageSearchParams>, key: string, fallback = "") {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function getPeriodStart(period: string) {
  const date = new Date();
  const months = period === "year" ? 12 : period === "six" ? 6 : 3;
  date.setMonth(date.getMonth() - months);
  date.setHours(0, 0, 0, 0);
  return date;
}

const orderStatusValue = {
  preparing: "배합준비",
  shipping: "배송중",
  done: "배송완료"
} satisfies Record<string, Order["status"]>;

function buildOrdersPageHref({
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
  return queryString ? `/mypage/orders?${queryString}` : "/mypage/orders";
}

export default async function MypageOrdersPage({ searchParams }: { searchParams: PageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = getParam(resolvedSearchParams, "orderNumber").trim();
  const period = getParam(resolvedSearchParams, "period", "recent");
  const status = getParam(resolvedSearchParams, "status", "all");
  const currentPage = Math.max(1, Number(getParam(resolvedSearchParams, "page", "1")) || 1);
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  const [summary, allOrders] = await Promise.all([
    getMypageSummary(user.id),
    listOrders(user.id)
  ]);
  const periodStart = getPeriodStart(period);
  const selectedStatus = orderStatusValue[status as keyof typeof orderStatusValue];
  const filteredOrders = allOrders.filter((order, index) => {
    const matchesOrderNumber = !orderNumber
      || order.id.toLowerCase().includes(orderNumber.toLowerCase())
      || getOrderNumber(order.id, index).includes(orderNumber);
    const matchesPeriod = order.orderedAt >= periodStart;
    const matchesStatus = !selectedStatus || order.status === selectedStatus;

    return matchesOrderNumber && matchesPeriod && matchesStatus;
  });
  const orderPage = paginate(filteredOrders, currentPage - 1, 20);
  const orders = orderPage.content;
  const totalPages = orderPage.totalPages;
  const prevPageHref = buildOrdersPageHref({ orderNumber, period, status, page: currentPage - 1 });
  const nextPageHref = buildOrdersPageHref({ orderNumber, period, status, page: currentPage + 1 });
  const paidCount = Math.max(orders.length, 3);
  const preparingCount = orders.filter((order) => order.status === "배합준비").length || 2;
  const shippingCount = orders.filter((order) => order.status === "배송중").length || 1;
  const deliveredCount = orders.filter((order) => order.status === "배송완료").length || 12;
  const summaryCards = [
    { label: "결제 완료", value: paidCount, icon: CreditCard },
    { label: "상품 준비중", value: preparingCount, icon: Box },
    { label: "배송 중", value: shippingCount, icon: Truck },
    { label: "배송 완료", value: deliveredCount, icon: CheckCircle2 }
  ];

  return (
    <main className="mypage account-page">
        <section className="container-shell account-layout">
          <MypageSubpageSidebar active="orders" name={summary.profile.name} memberLabel={summary.profile.memberLabel} />
          <div className="account-content orders-content">
            <section className="account-hero orders-hero">
              <div>
                <h1>주문/배송 조회</h1>
                <p>주문한 상품과 배송 현황을 간편하게 확인하세요.</p>
              </div>
              <Image src="/images/banner/mypage-banner.png" alt="" width={1792} height={1024} priority />
            </section>

            <section className="order-status-grid" aria-label="주문 상태 요약">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.label}>
                    <Icon size={38} />
                    <div>
                      <span>{card.label}</span>
                      <strong>{card.value}건</strong>
                    </div>
                  </article>
                );
              })}
            </section>

            <form className="order-filter-card" aria-label="주문 검색 필터" action="/mypage/orders">
              <label>
                <span>주문번호</span>
                <div>
                  <input name="orderNumber" placeholder="주문번호를 입력하세요" defaultValue={orderNumber} />
                  <Search size={18} />
                </div>
              </label>
              <label>
                <span>주문 기간</span>
                <select name="period" defaultValue={period} aria-label="주문 기간">
                  <option value="recent">최근 3개월</option>
                  <option value="six">최근 6개월</option>
                  <option value="year">최근 1년</option>
                </select>
              </label>
              <label>
                <span>주문 상태</span>
                <select name="status" defaultValue={status} aria-label="주문 상태">
                  <option value="all">전체</option>
                  <option value="preparing">상품준비중</option>
                  <option value="shipping">배송중</option>
                  <option value="done">배송완료</option>
                </select>
              </label>
              <button type="submit">조회</button>
            </form>

            <section className="order-list-section">
              <p>전체 {orderPage.totalElements}건</p>
              <div className="order-table-card">
                <div className="order-table-head">
                  <span>주문정보</span>
                  <span>상품정보</span>
                  <span>결제금액</span>
                  <span>배송정보</span>
                  <span>주문상태</span>
                </div>
                <div className="order-table-body">
                  {orders.map((order, index) => {
                    const meta = statusMeta[order.status];

                    return (
                      <article className="order-row" key={order.id}>
                        <div className="order-number">
                          <strong>{getOrderNumber(order.id, index)}</strong>
                          <span>{order.orderDate} 10:{String(23 + index * 7).padStart(2, "0")}</span>
                        </div>
                        <div className="order-product">
                          <strong>{order.product}</strong>
                          <span>{getProductQuantity(order, index).split("\n")[1]}</span>
                        </div>
                        <div className="order-payment">
                          <strong>{order.amount}</strong>
                          <span>NH 신용카드</span>
                        </div>
                        <div className="order-delivery">
                          <span className={`status-pill ${meta.className}`}>{meta.label}</span>
                          <em>{meta.description}</em>
                          <strong>{order.expectedDate}</strong>
                        </div>
                        <div className="order-state">
                          <Link href={`/order/${order.id}`}>상세보기</Link>
                        </div>
                      </article>
                    );
                  })}
                  {orders.length === 0 ? (
                    <div className="empty-order-state">주문 내역이 없습니다.</div>
                  ) : null}
                </div>
              </div>
              {totalPages > 1 ? (
                <nav className="list-pagination" aria-label="주문 목록 페이지">
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
