"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getMeAction, logoutAction } from "@/services/domains/auth/actions";

type HeaderProps = {
  variant?: "default" | "market" | "mypage" | "recommend";
};

export function Header({ variant = "default" }: HeaderProps) {
  const pathname = usePathname();
  const activeVariant =
    variant !== "default"
      ? variant
      : pathname.startsWith("/market")
        ? "market"
        : pathname.startsWith("/mypage") || pathname.startsWith("/order")
          ? "mypage"
          : pathname.startsWith("/recommend")
            ? "recommend"
            : "default";
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("김농부");

  useEffect(() => {
    const loadSession = async () => {
      const result = await getMeAction();

      setAuthenticated(Boolean(result.data?.authenticated));
      setUserName(result.data?.user?.name ?? "김농부");
    };

    loadSession().catch(() => {
      setAuthenticated(false);
    });
  }, []);

  const logout = async () => {
    const result = await logoutAction();

    if (result.success) {
      setAuthenticated(false);
      alert("로그아웃되었습니다.");
    }
  };

  const navLinks = [
    { href: "/", label: "서비스 소개" },
    { href: "/recommend", label: "AI 맞춤 추천" },
    { href: "/market", label: "비료 마켓" },
    // { href: "/#how", label: "이용 가이드" },
    // { href: "/#contact", label: "고객센터" }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f5d2c]/10 bg-white/90 backdrop-blur">
      <div className="container-shell flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="비료비서 홈으로 이동" className="brand-lockup">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={44}
            height={44}
            priority
          />
          <span>비료비서</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="주요 메뉴">
          {navLinks.map((link, index) => (
            <Link key={`${link.label}-${index}`} href={link.href} className={`text-sm font-bold ${pathname === link.href ? "text-[#1F5D2C] underline underline-offset-[14px] decoration-2" : "text-[#111827] hover:text-[#1F5D2C]"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 lg:hidden">
            <button aria-label="모바일 메뉴 열기" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#1f5d2c]/15 px-4 py-2 font-bold text-[#1F5D2C]">
              메뉴
            </button>
          </div>
          {authenticated ?
            <>
              <Link href="/mypage" className="btn-primary text-sm" aria-label="AI 맞춤 비료 추천 시작하기">
                {`${userName}님`}
              </Link>
              <button type="button" onClick={logout} className="hidden h-11 place-items-center rounded-full border border-[#1f5d2c]/15 px-4 text-sm font-bold text-[#1F5D2C] sm:grid">로그아웃</button>
            </>
            :
            <>
              <Link href="/login" className={`${activeVariant === "market" ? "grid" : "hidden sm:grid"} h-11 place-items-center rounded-full border border-[#1f5d2c]/15 px-4 text-sm font-bold text-[#1F5D2C]`}>
                로그인
              </Link>
              <Link href="/signup" className={`${activeVariant === "market" ? "hidden sm:inline-flex" : "inline-flex"} btn-primary text-sm`} aria-label="회원가입">
                회원가입
              </Link>
            </>
          }
        </div>
      </div>
      {open && (
        <div className="border-t border-[#1f5d2c]/10 bg-white lg:hidden">
          <nav className="container-shell grid gap-2 py-4" aria-label="모바일 주요 메뉴">
            {navLinks.map((link, index) => (
              <Link key={`${link.label}-${index}`} href={link.href} className="rounded-2xl px-4 py-3 font-bold text-[#1F5D2C]" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
