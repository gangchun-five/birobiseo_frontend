import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container-shell footer-grid">
        <div>
          <Link href="/" className="brand-lockup footer-brand" aria-label="비료비서 홈으로 이동">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={44}
              height={44}
              priority
            />
            <span>비료비서</span>
          </Link>
          <p>곤충 부산물 기반 AI 맞춤 비료 추천 서비스</p>
        </div>
        <div>
          <h3>고객센터</h3>
          <p>070-1234-5678</p>
          <p>support@birobiseo.com</p>
          <p>평일 09:00 - 18:00</p>
        </div>
        <div>
          <h3>이용 안내</h3>
          <Link href="/#how">이용 가이드</Link>
          <Link href="/recommend">AI 추천 받기</Link>
          <Link href="/market">비료마켓</Link>
        </div>
        <div>
          <h3>법적 고지</h3>
          <Link href="/">개인정보처리방침</Link>
          <Link href="/">서비스 이용약관</Link>
        </div>
      </div>
      <p className="copyright">© 2024 비료비서. All rights reserved.</p>
    </footer>
  );
}
