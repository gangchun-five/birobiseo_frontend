import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#173f22] py-12 text-white">
      <div className="container-shell grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3 text-2xl font-black">비료비서</div>
          <p className="max-w-sm text-sm leading-7 text-white/72">곤충 부산물 기반 맞춤 비료 추천부터 주문, 배송, 리뷰까지 농가의 비료 선택을 도와주는 AI 비서입니다.</p>
        </div>
        <div>
          <h3 className="mb-3 font-black">고객센터</h3>
          <p className="text-sm text-white/72">1588-2026</p>
          <p className="text-sm text-white/72">평일 09:00-18:00</p>
        </div>
        <div>
          <h3 className="mb-3 font-black">이용 안내</h3>
          <Link href="/recommend" className="block text-sm text-white/72">AI 추천 받기</Link>
          <Link href="/market" className="block text-sm text-white/72">비료마켓</Link>
          <Link href="/mypage" className="block text-sm text-white/72">마이페이지</Link>
        </div>
        <div>
          <h3 className="mb-3 font-black">회사 정보</h3>
          <p className="text-sm text-white/72">비료비서 주식회사</p>
          <p className="mt-3 text-sm text-white/72">블로그 · 카카오 · 유튜브</p>
        </div>
      </div>
    </footer>
  );
}
