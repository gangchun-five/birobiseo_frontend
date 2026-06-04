"use client";

import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { myReviews } from "@/data/reviews";
import { orders, payments } from "@/data/orders";
import { recommendations } from "@/data/recommendations";

const menu = ["내 정보", "내 농가 정보", "추천 이력", "주문/배송 조회", "결제 내역", "리뷰 관리", "구독 관리", "문의 내역"];

export default function MyPage() {
  const [active, setActive] = useState("내 정보");

  return (
    <>
      <Header variant="mypage" />
      <main className="bg-[#F5F8F1]">
        <section className="container-shell py-12">
          <h1 className="text-4xl font-black text-[#173f22]">마이페이지</h1>
          <p className="mt-3 text-[#63725f]">농가 정보부터 추천, 주문, 결제까지 한 곳에서 편리하게 관리하세요.</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-5">
              <div className="soft-card p-6 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[32px] bg-[#DDEBCF] font-black text-[#1F5D2C]" aria-label="김농부님 캐릭터 이미지">농부</div>
                <h2 className="mt-4 text-xl font-black text-[#173f22]">김농부님</h2>
                <p className="text-sm font-bold text-[#6FA044]">스마트 농가 회원</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                  <span>누적 주문<br /><b>28건</b></span><span>저장 추천<br /><b>12개</b></span><span>리뷰<br /><b>15개</b></span>
                </div>
              </div>
              <nav className="soft-card grid gap-1 p-3" aria-label="마이페이지 메뉴">
                {menu.map((item) => (
                  <button key={item} aria-label={`${item} 메뉴 선택`} onClick={() => setActive(item)} className={`rounded-2xl px-4 py-3 text-left font-bold ${active === item ? "bg-[#1F5D2C] text-white" : "text-[#52624f] hover:bg-[#F5F8F1]"}`}>
                    {item}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-4">
                <DashboardCard label="최근 추천 결과" value="2건" />
                <DashboardCard label="진행 중 주문" value="1건" />
                <DashboardCard label="이번 달 결제액" value="245,000원" />
                <DashboardCard label="구독 상태" value="프리미엄" />
              </div>

              <section className="soft-card p-6">
                <h2 className="text-2xl font-black text-[#173f22]">내 농가 정보</h2>
                <div className="mt-5 grid gap-3 text-sm text-[#52624f] md:grid-cols-2">
                  <p><b>농가명:</b> 햇살농장</p><p><b>주소:</b> 충청남도 예산군 삽교읍 예재로 123</p>
                  <p><b>재배 작물:</b> 고추, 배추, 오이</p><p><b>토양 상태:</b> 양토, pH 6.2, 유기물 보통</p>
                  <p><b>재배 면적:</b> 12,000㎡</p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-black text-[#173f22]">저장한 추천 배합표</h2>
                <div className="grid-auto">
                  {recommendations.map((item) => (
                    <article key={item.id} className="soft-card p-5">
                      <h3 className="font-black text-[#173f22]">{item.title}</h3>
                      <p className="mt-3 text-sm text-[#63725f]">작물: {item.crop}</p>
                      <p className="text-sm text-[#63725f]">NPK: {item.npk}</p>
                      <p className="text-sm text-[#63725f]">배합비: {item.blend}</p>
                      <p className="mt-3 text-xs font-bold text-[#6FA044]">저장일 {item.savedAt}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="soft-card overflow-x-auto p-6">
                <h2 className="mb-4 text-2xl font-black text-[#173f22]">주문/배송 현황</h2>
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-[#63725f]"><tr>{["주문번호", "상품명", "주문일", "주문금액", "배송상태", "배송예정일", "조회"].map((h) => <th key={h} className="py-3">{h}</th>)}</tr></thead>
                  <tbody>{orders.map((order) => <tr key={order.id} className="border-t border-[#1f5d2c]/10"><td className="py-4 font-bold">{order.id}</td><td>{order.product}</td><td>{order.orderDate}</td><td>{order.amount}</td><td><span className="rounded-full bg-[#DDEBCF] px-3 py-1 font-black text-[#1F5D2C]">{order.status}</span></td><td>{order.expectedDate}</td><td><button className="btn-secondary px-3 py-2 text-xs" aria-label={`${order.id} 배송조회`}>배송조회</button></td></tr>)}</tbody>
                </table>
              </section>

              <section className="soft-card overflow-x-auto p-6">
                <h2 className="mb-4 text-2xl font-black text-[#173f22]">결제 내역</h2>
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-[#63725f]"><tr>{["결제일", "주문번호", "결제수단", "결제금액", "상태"].map((h) => <th key={h} className="py-3">{h}</th>)}</tr></thead>
                  <tbody>{payments.map((payment) => <tr key={payment.orderId} className="border-t border-[#1f5d2c]/10"><td className="py-4">{payment.date}</td><td>{payment.orderId}</td><td>{payment.method}</td><td>{payment.amount}</td><td>{payment.status}</td></tr>)}</tbody>
                </table>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div>
                  <h2 className="mb-4 text-2xl font-black text-[#173f22]">리뷰 관리</h2>
                  <div className="grid gap-4">{myReviews.map((review) => <article key={review.id} className="soft-card grid gap-4 p-5 sm:grid-cols-[96px_1fr]"><div className="h-24 rounded-3xl bg-[#DDEBCF]" aria-label={`${review.product} 이미지`} /><div><h3 className="font-black text-[#173f22]">{review.product}</h3><p className="text-sm font-bold text-[#E0A13A]">별점 {review.rating} · {review.date}</p><p className="mt-2 text-sm leading-6 text-[#63725f]">{review.content}</p></div></article>)}</div>
                </div>
                <aside className="soft-card h-fit p-6">
                  <h3 className="text-xl font-black text-[#173f22]">구매한 상품의 리뷰를 남겨주세요</h3>
                  <button aria-label="리뷰 작성하기" className="btn-primary mt-5 w-full">리뷰 작성하기</button>
                </aside>
              </section>

              <section className="soft-card bg-[#1F5D2C] p-8 text-white">
                <h2 className="text-3xl font-black">새로운 AI 비료 추천을 받아보세요</h2>
                <button aria-label="AI 추천 받기" className="mt-5 rounded-full bg-white px-6 py-4 font-black text-[#1F5D2C]">AI 추천 받기</button>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
