import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { paginate } from "@/utils/http";
import { getSessionUser } from "@/utils/session";
import type { Paginated } from "@/types";
import { PackageIcon, CreditCardIcon } from "lucide-react";
import "./mypage.css";

import { MypageSubpageSidebar } from "./_components/MypageSubpageSidebar";
import { getFarm } from "@/services/domains/farm/repository";
import { getMypageSummary } from "@/services/domains/user/repository";
import { listOrders, Order } from "@/services/domains/order/repository";
import { listPaymentsAction } from "@/services/domains/payment/actions";
import { Payment } from "@/services/domains/payment/repository";
import { listRecommendationsAction } from "@/services/domains/recommendation/actions";
import { Recommendation } from "@/services/domains/recommendation/repository";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  const [summary, farm, recommendationPage, orderPage, paymentPage] = await Promise.all([
    getMypageSummary(user.id),
    getFarm(user.id),
    listRecommendationsAction(user.id).then((items) => paginate(items.data!, 0, 3) as Paginated<Recommendation>),
    listOrders(user.id).then((items) => paginate(items, 0, 10) as Paginated<Order>),
    listPaymentsAction(user.id).then((items) => paginate(items.data!, 0, 10) as Paginated<Payment>),
  ]);

  const stats = [
    ["진행 중 주문", `${summary.stats.activeOrderCount}건`, "주문/배송 조회", "/mypage/orders", PackageIcon],
    ["이번 달 결제액", `${summary.stats.monthlyPaymentAmount.toLocaleString("ko-KR")}원`, "결제 내역 보기", "/mypage/payments", CreditCardIcon],
  ] as const;
  const farmInfo = [
    ["농가명", farm.name],
    ["주소", farm.address.roadAddress],
    ["재배 작물", farm.crops.map((crop) => crop.name).join(", ") || "등록된 작물이 없습니다."],
    ["토양 상태", `${farm.soil.type} ${farm.soil.ph ? `(pH ${farm.soil.ph})` : ""}, 유기물 ${farm.soil.organicMatterLevel ?? "보통"}`],
    ["재배 면적", `${farm.areaSquareMeter.toLocaleString("ko-KR")}㎡`]
  ];

  return (
    <main className="mypage">
        <section className="container-shell mypage-hero">
          <div>
            <h1>마이페이지</h1>
            <p>농가 정보부터 추천, 주문, 결제까지 한 곳에서 편리하게 관리하세요.</p>
          </div>
          <Image src="/images/banner/mypage-banner.png" alt="태블릿을 든 농부와 농장 일러스트" width={1792} height={1024} priority />
        </section>

        <section className="container-shell mypage-layout">
          <MypageSubpageSidebar
            name={summary.profile.name}
            memberLabel={summary.profile.memberLabel}
            active="mypage"
            stats={{
              totalOrderCount: summary.profile.totalOrderCount ?? 0,
              savedRecommendationCount: summary.profile.savedRecommendationCount ?? 0,
              reviewCount: summary.profile.reviewCount ?? 0
            }}
          />

          <div className="my-content">
            <div className="summary-grid">
              {stats.map(([label, value, action, href, Icon]) => (
                <article key={label} className="summary-card">
                  <Icon />
                  <div>
                    <p>{label}</p>
                    <strong>{value}</strong>
                    <Link href={href}>{action} ›</Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="my-two-col">
              <section className="my-card farm-card">
                <div className="my-card-head">
                  <h2>내 농가 정보</h2>
                  <Link href="/mypage/farm">수정하기</Link>
                </div>
                <dl>
                  {farmInfo.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="my-card saved-card">
                <div className="my-card-head">
                  <h2>저장한 맞춤 추천</h2>
                </div>
                <div className="saved-list">
                  {recommendationPage.content.map((item) => (
                    <article key={item.id}>
                      <div className="saved-thumb" aria-hidden="true">
                        {item.productId ? (
                          <Image
                            src={`/product/${item.productId}.png`}
                            alt=""
                            fill
                            sizes="52px"
                          />
                        ) : "비료"}
                      </div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.crop} · {item.npk}</p>
                        <span>{item.blend}</span>
                      </div>
                      <em>저장일: {item.savedAt}</em>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <section className="my-card table-card">
              <div className="my-card-head">
                <h2>주문 / 배송 현황</h2>
                <Link href="/mypage/orders">전체 보기 ›</Link>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>{["주문번호", "상품명", "주문일", "주문금액", "배송상태", "배송예정일", "배송조회"].map((head) => <th key={head}>{head}</th>)}</tr>
                  </thead>
                  <tbody>
                    {orderPage.content.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.product}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.amount}</td>
                        <td><span>{order.status}</span></td>
                        <td>{order.expectedDate}</td>
                        <td><a href={`/order/${order.id}`}>조회</a></td>
                      </tr>
                    ))}
                    {orderPage.content.length === 0 ? (
                      <tr>
                        <td colSpan={7}>주문 내역이 없습니다.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="payment-grid">
              <section className="my-card table-card">
                <div className="my-card-head">
                  <h2>결제 내역</h2>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>{["결제일", "주문번호", "결제수단", "결제금액", "상태"].map((head) => <th key={head}>{head}</th>)}</tr>
                    </thead>
                    <tbody>
                      {paymentPage.content.map((payment) => (
                        <tr key={payment.orderId}>
                          <td>{payment.date}</td>
                          <td>{payment.orderId}</td>
                          <td>{payment.method}</td>
                          <td>{payment.amount}</td>
                          <td><span>{payment.status}</span></td>
                        </tr>
                      ))}
                      {paymentPage.content.length === 0 ? (
                        <tr>
                          <td colSpan={5}>결제 내역이 없습니다.</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <Link className="table-link" href="/mypage/payments">전체 결제 내역 보기 ›</Link>
              </section>
            </div>
          </div>
        </section>
    </main>
  );
}
