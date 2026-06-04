"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pageLinks = [
  { href: "/", label: "서비스 소개" },
  { href: "/recommend", label: "AI 맞춤 추천" },
  { href: "/market", label: "비료마켓" },
  { href: "/mypage", label: "마이페이지" }
];

type HeaderProps = {
  variant?: "default" | "market" | "mypage";
};

export function Header({ variant = "default" }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f5d2c]/10 bg-white/92 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="비료비서 홈으로 이동" className="flex items-center gap-3 font-black text-[#1F5D2C]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1F5D2C] text-lg text-white">비</span>
          <span className="text-xl">비료비서</span>
        </Link>

        {variant === "market" && (
          <label className="hidden flex-1 md:block">
            <span className="sr-only">상품 검색</span>
            <input className="w-full rounded-full border border-[#1f5d2c]/15 bg-[#F5F8F1] px-5 py-3 outline-none focus:border-[#1F5D2C]" placeholder="비료명, 작물, 토양 상태 검색" />
          </label>
        )}

        <nav className="hidden items-center gap-5 lg:flex" aria-label="주요 메뉴">
          {pageLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-bold ${pathname === link.href ? "text-[#1F5D2C]" : "text-[#62715d] hover:text-[#1F5D2C]"}`}>
              {link.label}
            </Link>
          ))}
          {variant === "mypage" && <span className="rounded-full bg-[#F5F8F1] px-3 py-2 text-sm font-bold text-[#1F5D2C]">김농부님</span>}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {variant === "market" && (
            <>
              <button aria-label="로그인" className="grid h-11 w-11 place-items-center rounded-full border border-[#1f5d2c]/15 text-[#1F5D2C]">로그인</button>
              <button aria-label="장바구니" className="grid h-11 w-11 place-items-center rounded-full border border-[#1f5d2c]/15 text-[#1F5D2C]">장바구니</button>
            </>
          )}
          {variant === "mypage" && <button aria-label="알림 보기" className="grid h-11 w-11 place-items-center rounded-full border border-[#1f5d2c]/15 text-[#1F5D2C]">알림</button>}
          <Link href="/recommend" className="btn-primary text-sm" aria-label="AI 맞춤 비료 추천 시작하기">
            맞춤 비료 추천 시작하기
          </Link>
        </div>

        <button aria-label="모바일 메뉴 열기" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#1f5d2c]/15 px-4 py-2 font-bold text-[#1F5D2C] lg:hidden">
          메뉴
        </button>
      </div>
      {open && (
        <div className="border-t border-[#1f5d2c]/10 bg-white lg:hidden">
          <nav className="container-shell grid gap-2 py-4" aria-label="모바일 주요 메뉴">
            {pageLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl px-4 py-3 font-bold text-[#1F5D2C]" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
