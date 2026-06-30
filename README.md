# 비료비서 / Birobiseo

비료비서는 농가의 토양 데이터, 작물 정보, 생육 목표를 바탕으로 맞춤 비료를 추천하고, 추천 결과에서 상품 구매와 주문 관리까지 이어지도록 만든 Next.js 웹 앱입니다. 단순 상품 카탈로그가 아니라 토양 검정 데이터, 작물 코드, 비료 NPK 비율, 재고, 리뷰, 주문 상태를 DB 기반으로 연결하는 것을 목표로 합니다.

## 프로젝트 실행에 필요한 코드

이 저장소는 애플리케이션 실행에 필요한 프론트엔드, 서버 로직, Prisma 스키마, migration, 정적 자산을 포함합니다.

- `app/`: Next.js App Router 페이지, 레이아웃, Route Handler
- `components/`: 공통 UI 컴포넌트
- `services/`: Prisma DB 접근, 도메인 로직, Server Action, 외부 API 연동
- `utils/`: 세션, 관리자 인증, ActionResult, 숫자 파싱 등 공통 유틸
- `prisma/`: Prisma schema와 PostgreSQL migration
- `public/`: 로고, 배너, 상품 이미지
- `docs/`: 실행 지침과 API 문서

실행에 필요한 민감한 값은 저장소에 포함하지 않습니다. 환경변수 설정과 실제 실행 절차는 개발 산출물 ZIP의 run-guide.md를 참조하세요.

## 주요 파일

- [package.json](./package.json): 실행 스크립트와 의존성 정의
- [prisma/schema.prisma](./prisma/schema.prisma): PostgreSQL DB 모델 정의
- [prisma.config.ts](./prisma.config.ts): Prisma CLI와 migration 설정
- [services/prisma.ts](./services/prisma.ts): Prisma Client 초기화
- [services/seed-data.ts](./services/seed-data.ts): 개발 환경 seed 데이터
- [services/domains/recommendation/repository.ts](./services/domains/recommendation/repository.ts): 맞춤 비료 추천 핵심 로직
- [services/api/gemini-api.ts](./services/api/gemini-api.ts): Gemini 기반 NPK 추천 근거 생성
- [services/api/fertilizer-prescription-api.ts](./services/api/fertilizer-prescription-api.ts): 흙토람 비료 처방 API 연동
- [utils/session.ts](./utils/session.ts): 로그인 세션 처리
- [utils/admin-auth.ts](./utils/admin-auth.ts): 관리자 권한 확인
- [docs/run-guide.md](./docs/run-guide.md): 단계별 실행 지침

## 사용 기술

- Framework: Next.js 16 App Router
- UI: React 19, TypeScript, CSS Modules/전역 CSS, lucide-react
- Database: PostgreSQL
- ORM: Prisma 7, `@prisma/adapter-pg`
- Server: Next.js Server Component, Server Action, Route Handler
- Data Fetching: `@tanstack/react-query`
- External APIs: Gemini API, 흙토람 비료 처방 API, Kakao Local API
- Deployment: Vercel
- Package Manager: pnpm

## 빠른 실행 방법

자세한 단계와 환경변수 설명은 개발 산출물 ZIP의 run-guide.md를 참조하세요.

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

개발 서버 실행 후 브라우저에서 `http://localhost:3000`으로 접속합니다.

## 주요 기능

### 맞춤 비료 추천

- 사용자는 작물, 토양, 재배 목표, 생육 단계 정보를 입력해 비료 추천을 받을 수 있습니다.
- 추천 로직은 토양 검정 데이터와 흙토람 비료 처방 API 응답을 기반으로 질소(N), 인(P), 칼륨(K) 필요량을 계산합니다.
- 상품 추천은 마켓에 등록된 실제 상품의 NPK 비율, 작물 적합도, 토양 적합도, 재고 상태를 함께 고려합니다.
- 추천 결과에는 추천 상품, 배합 정보, NPK 처방 값, 추천 근거가 표시됩니다.
- Gemini API를 통해 NPK 비율이 작물 생육에 미치는 영향을 설명하는 AI 근거 텍스트를 생성합니다.
- 토양 데이터가 없으면 추천을 진행하지 않도록 설계되어 있습니다.
- 추천 결과는 마켓 상품 재고와 토양 검정 데이터가 변경되면 달라질 수 있습니다.

### 비료 마켓

- 등록된 비료 상품을 검색, 작물 필터, 토양 필터, 가격 필터로 탐색할 수 있습니다.
- 상품 카드는 DB의 상품 정보, 가격, 중량, 배지, NPK 비율, 리뷰 수, 누적 리뷰 평균 별점을 표시합니다.
- 상품 별점은 관리자가 직접 입력하는 값이 아니라 리뷰 점수 평균으로 갱신됩니다.
- 리뷰가 없는 상품은 별점 숫자 대신 `리뷰 없음`으로 표시됩니다.
- 상품 상세 페이지는 DB에 저장된 상세 요약, 상품 정보 표, 주요 효과, 추천 작물, 성분 구성, 용량 선택 옵션을 사용합니다.
- 상품 상세의 주의사항은 고정 안내 문구로 표시합니다.
- 관련 상품은 작물, 토양, 가격, 리뷰 수, 별점, 배지를 기준으로 정렬합니다.

### 리뷰

- 구매한 상품에 대해서만 리뷰를 작성할 수 있습니다.
- 리뷰 작성 시 상품 상세와 마켓 목록 캐시가 갱신됩니다.
- 리뷰 생성, 수정, 삭제 시 해당 상품의 평균 별점이 즉시 다시 계산되어 `Product.rating`에 반영됩니다.
- 마켓 리뷰 영역과 상품 상세 리뷰 미리보기에서 실제 Review 테이블 데이터를 사용합니다.

### 주문과 결제 내역

- 상품 주문 시 주문 정보, 상품 스냅샷, 배송 정보, 타임라인, 결제 내역을 DB에 저장합니다.
- 주문 상세 페이지는 하드코딩된 주문 정보가 아니라 Order, Product, Payment 데이터를 기반으로 렌더링합니다.
- 마이페이지에서 주문 목록, 배송 상태, 결제 내역을 확인할 수 있습니다.
- 주문 상세의 상품 별점과 리뷰 수 역시 실제 상품/리뷰 데이터에서 가져옵니다.

### 마이페이지

- 사용자 프로필, 농장 정보, 저장한 맞춤 추천, 주문/배송, 결제, 리뷰 통계를 제공합니다.
- 농장 정보는 사용자의 Farm 데이터와 주소/토양 데이터와 연결됩니다.
- 저장한 맞춤 추천은 Recommendation 테이블을 기반으로 표시합니다.
- 추천 상품 이미지는 productId에 맞는 실제 상품 이미지(`/public/product/{id}.png`)를 사용합니다.

### 주소와 토양 데이터

- 주소 검색 API는 DB의 도로명 주소와 법정동 주소 마스터를 조회합니다.
- 토양 데이터 조회 API는 법정동 코드 또는 주소 조건을 기반으로 SoilData를 찾습니다.
- 추천 기능은 토양 데이터가 있는 지역을 기준으로 동작합니다.

### 관리자 기능

- 관리자 페이지는 로그인 사용자의 `memberType`이 `Admin`인 경우에만 접근할 수 있습니다.
- 일반 사용자는 `/admin` 접근 시 차단됩니다.
- 관리자 계정은 개발 seed 기준 `admin@example.com / admin123`입니다.
- 관리자 로그인 성공 시 바로 `/admin`으로 이동합니다.
- 관리자는 상품 목록을 확인하고 상품을 등록/수정할 수 있습니다.
- 관리자 상품 폼의 작물/토양 옵션은 DB의 상품 데이터에서 가져옵니다.
- 상품 평점은 리뷰 평균으로 관리되므로 관리자 폼에서 직접 입력하지 않습니다.

## 페이지 구성

- `/`
  서비스 소개, 핵심 가치, 이용 흐름, 마켓/추천/마이페이지 진입점

- `/login`, `/signup`
  이메일 기반 로그인/회원가입, 세션 쿠키 발급

- `/recommend`
  맞춤 비료 추천 입력, 추천 결과, NPK AI 근거, FAQ

- `/market`
  상품 목록, 검색, 필터, 정렬, 리뷰 섹션

- `/market/[productId]`
  상품 상세, 상품 정보, 주요 효과, 추천 작물, 성분, 용량 선택, 리뷰 작성

- `/market/purchase-complete/[orderId]`
  주문 완료 후 주문 요약 확인

- `/order/[orderId]`
  주문 상세, 배송 타임라인, 결제 정보, 상품 정보

- `/mypage`
  사용자 요약, 농장 정보, 추천 이력, 주문/결제/리뷰 요약

- `/mypage/info`, `/mypage/farm`, `/mypage/orders`, `/mypage/payments`
  사용자 정보, 농장 정보, 주문 내역, 결제 내역 관리

- `/admin`
  관리자 대시보드, 상품 관리

- `/admin/products/new`, `/admin/products/[productId]/edit`
  관리자 상품 등록/수정

## 서버 구조

이 프로젝트는 대부분의 서버 로직을 HTTP API보다 Server Action과 서버 컴포넌트에서 직접 호출하는 구조로 구성했습니다.

- `services/prisma.ts`
  Prisma Client 초기화. PostgreSQL용 `@prisma/adapter-pg`를 사용합니다.

- `services/seed-data.ts`
  개발 환경 최초 실행 시 기본 사용자, 관리자, 상품, 리뷰, 주문, 주소, 토양 데이터 seed를 넣습니다.

- `services/domains/*`
  도메인별 repository/action 계층입니다.

- `services/api/*`
  외부 API 연동 계층입니다.
  - `fertilizer-prescription-api.ts`: 흙토람 비료 처방 API
  - `gemini-api.ts`: NPK 추천 근거 생성
  - `kakao-local-api.ts`: 주소 검색 보조

- `app/(api)/api/v1/addresses/search/route.ts`
  주소 검색용 유지 API

- `app/(api)/api/v1/soil-data/lookup/route.ts`
  토양 데이터 조회용 유지 API

## 데이터베이스

DB는 PostgreSQL 기반이며 Prisma ORM을 사용합니다.

주요 모델:

- `User`: 사용자, 관리자 구분, 로그인 정보
- `Farm`: 사용자 농장 정보
- `Product`: 마켓 상품, NPK 비율, 상세 정보, 리뷰 평균 별점
- `Review`: 상품 리뷰
- `Recommendation`: 저장한 맞춤 추천
- `Order`: 주문 및 배송 스냅샷
- `Payment`: 결제 내역
- `RoadAddress`, `LegalDongAddress`: 주소 마스터
- `SoilData`: 지역별 토양 데이터
- `CropCode`, `SoilType`, `ProductCategory`: 추천/필터용 코드 데이터

## 실행 방법

패키지 매니저는 pnpm 기준입니다.

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 주요 스크립트

```bash
pnpm dev            # 개발 서버 실행
pnpm build          # Next.js 빌드
pnpm lint           # ESLint 검사
pnpm db:generate    # Prisma Client 생성
pnpm db:migrate     # 개발 DB migration
pnpm db:push        # Prisma schema를 DB에 push
pnpm vercel-build   # Vercel 배포용 generate + migrate deploy + build
```

## Vercel 배포

권장 Build Command:

```bash
pnpm vercel-build
```

이 스크립트는 배포 시 다음 순서로 실행됩니다.

1. `prisma generate`
2. `prisma migrate deploy`
3. `next build`

`postinstall`에도 `prisma generate`가 설정되어 있어 Vercel 빌드 캐시 환경에서도 Prisma Client 누락을 줄입니다.

## 현재 구현상 주의점

- 개발 seed는 `NODE_ENV=development`에서만 최초 실행됩니다.
- 운영 환경에서는 seed가 자동 실행되지 않습니다.
- 상품 별점은 리뷰 평균 캐시로 관리됩니다. DB를 직접 수정해 Review를 넣는 경우 별도 동기화가 필요합니다.
- 추천 결과는 토양 데이터, 외부 비료 처방 API, 마켓 상품 데이터가 모두 준비되어야 정상적으로 생성됩니다.
- API 키가 없거나 외부 API 호출이 실패하면 추천 근거 생성이나 토양/처방 조회 일부가 제한될 수 있습니다.
