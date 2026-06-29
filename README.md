# 비료비서 / Birobiseo

곤충 부산물 기반 AI 맞춤 비료 추천, 주문, 배송, 리뷰, 마이페이지 흐름을 하나로 연결한 Next.js 웹 앱 프로토타입입니다. 농가가 토양 상태, 작물 종류, 생육 단계, 희망 목적을 입력하면 더미 추천 로직으로 실제 서비스처럼 비료 배합 결과를 확인할 수 있습니다.

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 페이지 구성

- `/` 랜딩페이지: 서비스 소개, 해결 문제, 핵심 기능, 이용 흐름, 공정, 데이터 구조, 후기
- `/recommend` AI 맞춤 비료 추천: 입력 폼, 추천 결과, 분석 근거, FAQ 아코디언
- `/market` 비료마켓: 검색, 카테고리, 필터, 상품 카드, 장바구니 알림, 리뷰
- `/mypage` 마이페이지: 농가 정보, 추천 이력, 주문/배송, 결제, 리뷰 관리

## 주요 기능

- 공통 Header/Footer와 Next.js Link 기반 페이지 이동
- 모바일 메뉴 접힘 구조
- 재사용 컴포넌트: Header, Footer, HeroSection, FeatureCard, ProcessStep, ProductCard, ReviewCard, DashboardCard, RecommendationResult, FAQAccordion
- Next.js Route Handler 기반 mock 백엔드: `app/api/v1/*`, `lib/backend/*`
- AI 추천 페이지 버튼 클릭 시 추천 결과 강조
- FAQ 아코디언 열기/닫기
- 상품 담기 버튼 클릭 시 알림 표시
- 마이페이지 사이드바 메뉴 선택 상태 표시

## 추후 연동 계획

- 흙토람 API 연동
- 실제 AI 추천 모델 연동
- 주문/결제 API 연동
- 농가 리뷰 데이터 기반 추천 개선
