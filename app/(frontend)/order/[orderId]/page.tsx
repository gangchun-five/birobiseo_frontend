import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CreditCard, MapPin, Truck } from "lucide-react";
import { getSessionUser } from "@/utils/session";
import { getErrorRoute } from "@/utils/error-route";
import type { RouteParams } from "@/types";
import "@/app/(frontend)/mypage/mypage.css";
import "@/app/(frontend)/mypage/subpage.css";

import { MypageSubpageSidebar } from "@/app/(frontend)/mypage/_components/MypageSubpageSidebar";
import { ProductRating } from "@/components/ProductRating";
import { getMypageSummary } from "@/services/domains/user/repository";
import { getOrderDetail } from "@/services/domains/order/repository";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: RouteParams<{ orderId: string }>) {
  const { orderId } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(getErrorRoute({
      code: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
      returnTo: "/mypage/orders"
    }));
  }

  const [order, summary] = await Promise.all([
    getOrderDetail(user.id, orderId),
    getMypageSummary(user.id)
  ]);

  if (!order) {
    redirect(getErrorRoute({
      code: "NOT_FOUND",
      message: "주문 상세정보를 불러오지 못했습니다.",
      returnTo: "/mypage/orders"
    }));
  }

  return (
    <main className="mypage account-page">
        <section className="container-shell account-layout">
          <MypageSubpageSidebar active="orders" name={summary.profile.name} memberLabel={summary.profile.memberLabel} />
          <div className="account-content orders-content">
            <section className="account-hero orders-hero">
              <div>
                <h1>주문 상세정보</h1>
                <p>상품, 결제, 배송 진행 정보를 확인하세요.</p>
              </div>
              <Image src="/images/banner/mypage-banner.png" alt="" width={1792} height={1024} priority />
            </section>

            <section className="order-detail-top">
              <div>
                <span>주문번호</span>
                <strong>{order.orderNumber}</strong>
              </div>
              <div>
                <span>주문일</span>
                <strong>{order.orderDate}</strong>
              </div>
              <Link href="/mypage/orders">목록으로</Link>
            </section>

            <section className="order-detail-card product-order-card">
              <div className="order-detail-head">
                <h2>상품 정보</h2>
                <span className="status-pill preparing">{order.status}</span>
              </div>
              <div className="ordered-product-summary">
                <div className="order-product-bag">
                  <Image
                    src={`/product/${order.product.id}.png`}
                    alt="제품 이미지"
                    fill
                  />
                </div>
                <div>
                  <strong>{order.productName}</strong>
                  <p>{order.quantity}개 · {order.unitLabel || order.productSummary}</p>
                  {order.product ? <ProductRating rating={order.product.rating} reviewCount={order.product.reviewCount} /> : null}
                </div>
              </div>
            </section>

            <section className="order-progress-card">
              <h2>배송 진행상황</h2>
              <div className="order-timeline">
                {order.timeline.map((step) => (
                  <div className={step.current ? "current" : step.active ? "active" : ""} key={step.label}>
                    <span></span>
                    <strong>{step.label}</strong>
                  </div>
                ))}
              </div>
            </section>

            <div className="order-detail-layout">
              <article className="order-detail-card">
                <div className="order-detail-head">
                  <h2>결제 정보</h2>
                  <CreditCard size={22} />
                </div>
                <dl className="order-detail-list">
                  <div><dt>결제 상태</dt><dd>{order.payment?.status ?? "결제완료"}</dd></div>
                  <div><dt>결제 수단</dt><dd>{order.payment?.method ?? "NH 신용카드"}</dd></div>
                  <div><dt>결제일</dt><dd>{order.payment?.date ?? order.orderDate}</dd></div>
                  <div><dt>결제 금액</dt><dd>{order.amount}</dd></div>
                </dl>
              </article>

              <article className="order-detail-card">
                <div className="order-detail-head">
                  <h2>배송 정보</h2>
                  <Truck size={22} />
                </div>
                <dl className="order-detail-list">
                  <div><dt>수령인</dt><dd>{order.delivery.recipient}</dd></div>
                  <div><dt>배송지</dt><dd>{order.delivery.address}</dd></div>
                  <div><dt>운송장</dt><dd>{order.delivery.trackingNumber}</dd></div>
                  <div><dt>도착 예정일</dt><dd>{order.expectedDate}</dd></div>
                </dl>
              </article>

              <article className="order-detail-card">
                <div className="order-detail-head">
                  <h2>주문 안내</h2>
                  <CalendarDays size={22} />
                </div>
                <dl className="order-detail-list">
                  <div><dt>배송사</dt><dd>{order.delivery.courier}</dd></div>
                  <div><dt>교환/반품</dt><dd>수령 후 7일 이내 미개봉 상품 가능</dd></div>
                  <div><dt>문의</dt><dd>고객센터 또는 1:1 문의를 이용해주세요.</dd></div>
                </dl>
              </article>
            </div>

            {/*<section className="order-help-banner">
              <MapPin size={34} />
              <div>
                <h2>배송지 변경이 필요하신가요?</h2>
                <p>상품 준비 단계에서는 고객센터를 통해 배송 정보를 확인할 수 있습니다.</p>
              </div>
              <button type="button">고객센터</button>
              <button type="button" className="primary">1:1 문의하기</button>
            </section>*/}
          </div>
        </section>
    </main>
  );
}
