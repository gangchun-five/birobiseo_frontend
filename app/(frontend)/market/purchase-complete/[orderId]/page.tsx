import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, CreditCard, PackageCheck, Truck } from "lucide-react";
import { getSessionUser } from "@/utils/session";
import { getErrorRoute } from "@/utils/error-route";
import type { RouteParams } from "@/types";
import "../../market.css";
import "../../../mypage/subpage.css";

import { ProductRating } from "@/components/ProductRating";
import { getOrderDetail } from "@/services/domains/order/repository";

export const dynamic = "force-dynamic";

export default async function PurchaseCompletePage({ params }: RouteParams<{ orderId: string }>) {
  const { orderId } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(getErrorRoute({
      code: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
      returnTo: "/market"
    }));
  }

  const order = await getOrderDetail(user.id, orderId);

  if (!order) {
    redirect(getErrorRoute({
      code: "NOT_FOUND",
      message: "구매 완료 정보를 불러오지 못했습니다.",
      returnTo: "/market"
    }));
  }

  return (
    <main className="purchase-complete-page">
        <section className="container-shell purchase-complete-hero">
          <CheckCircle2 size={54} />
          <p>구매가 완료되었습니다</p>
          <h1>{order.productName}</h1>
          <span>주문번호 {order.orderNumber}</span>
        </section>

        <section className="container-shell order-detail-layout">
          <article className="order-detail-card product-order-card">
            <div className="order-detail-head">
              <h2>구매 상품</h2>
              <span className="status-pill preparing">{order.status}</span>
            </div>
            <div className="ordered-product-summary">
              <div className="order-product-bag" aria-hidden="true">
                <PackageCheck size={24} />
              </div>
              <div>
                <strong>{order.productName}</strong>
                <p>{order.productSummary}</p>
                {order.product ? <ProductRating rating={order.product.rating} reviewCount={order.product.reviewCount} /> : null}
              </div>
            </div>
          </article>

          <article className="order-detail-card order-payment-card">
            <div className="order-detail-head">
              <h2>결제 정보</h2>
              <CreditCard size={22} />
            </div>
            <dl className="order-detail-list">
              <div><dt>결제 상태</dt><dd>{order.payment?.status ?? "결제완료"}</dd></div>
              <div><dt>결제 수단</dt><dd>{order.payment?.method ?? "NH 신용카드"}</dd></div>
              <div><dt>결제 일자</dt><dd>{order.payment?.date ?? order.orderDate}</dd></div>
              <div><dt>최종 결제금액</dt><dd>{order.amount}</dd></div>
            </dl>
          </article>

          <article className="order-detail-card order-delivery-card">
            <div className="order-detail-head">
              <h2>배송 정보</h2>
              <Truck size={22} />
            </div>
            <dl className="order-detail-list">
              <div><dt>수령인</dt><dd>{order.delivery.recipient}</dd></div>
              <div><dt>배송지</dt><dd>{order.delivery.address}</dd></div>
              <div><dt>배송사</dt><dd>{order.delivery.courier}</dd></div>
              <div><dt>도착 예정일</dt><dd>{order.expectedDate}</dd></div>
            </dl>
          </article>
        </section>

        <section className="container-shell purchase-complete-actions">
          <Link href={`/order/${order.id}`}>주문 상세보기</Link>
          <Link href="/market" className="secondary">비료 더 보기</Link>
        </section>
    </main>
  );
}
