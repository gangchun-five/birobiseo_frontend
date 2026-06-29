# 비료비서 서버 인터페이스

현재 프론트 클라이언트에서 서버 변경이 필요한 작업은 HTTP API가 아니라 각 `page.tsx` 라우트 디렉토리의 `actions.ts` Server Action으로 처리합니다. 서버 컴포넌트는 `services/repository.ts`, `services/session.ts`를 직접 호출합니다.

## 유지 API

독립 조회 엔드포인트로 남겨둔 API입니다.

### GET `/api/v1/addresses/search?query=예산`

DB의 도로명 주소/법정동 주소 마스터에서 주소를 검색합니다.

### GET `/api/v1/soil-data/lookup?bcode=4481034021`

DB의 법정동 주소 마스터 기준으로 토양 데이터를 조회합니다. `stdgCd`, `STDG_CD`, `address`, `sido`, `sigungu`도 호환 조회용으로 허용합니다.

## 삭제된 내부 API

인증, 사용자, 농가, 상품 관리, 주문 생성, 추천 분석, 리뷰, 결제, 코드, 외부 토양 통계 프록시 라우트는 클라이언트 HTTP 호출 대상에서 제외되어 삭제했습니다. 필요한 서버 로직은 `services/*`와 Server Action에서 직접 호출합니다.
