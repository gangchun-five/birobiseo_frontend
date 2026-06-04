import Link from "next/link";
import type { ReactNode } from "react";

type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children: ReactNode;
};

export function HeroSection({ eyebrow, title, description, primaryHref = "/recommend", primaryLabel = "맞춤 비료 추천받기", secondaryHref = "#features", secondaryLabel = "서비스 소개 보기", children }: HeroSectionProps) {
  return (
    <section className="hero-bg overflow-hidden">
      <div className="container-shell grid min-h-[620px] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          {eyebrow && <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#1F5D2C] shadow-sm">{eyebrow}</p>}
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#16311D] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#62715d]">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="btn-primary" aria-label={primaryLabel}>{primaryLabel}</Link>
            <Link href={secondaryHref} className="btn-secondary" aria-label={secondaryLabel}>{secondaryLabel}</Link>
          </div>
        </div>
        <div className="illustration-screen soft-card p-6">{children}</div>
      </div>
    </section>
  );
}
