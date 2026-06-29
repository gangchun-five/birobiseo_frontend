# 비료비서 코드 품질 규약

현재 코드베이스 기준으로 정리한 구현 규칙입니다. 새 기능은 이 문서를 기준으로 추가합니다.

## 1. API 호출 규칙

### 서버 컴포넌트

- 내부 `/api/v1`로 HTTP 요청을 보내지 않고 `lib/backend/repository.ts`와 `lib/backend/session.ts`의 로직을 직접 호출한다.
- 목록 페이지의 페이지네이션은 `lib/backend/http.ts`의 `paginate`를 사용한다.
- 로그인 필요 페이지는 `getSessionUser()`로 세션을 확인한 뒤 user id를 repository 함수에 전달한다.
- 오류 화면 이동이 필요하면 repository 결과를 기준으로 `/error?code=...&message=...&returnTo=...`를 만든다.

### 클라이언트 컴포넌트

- 직접 `fetch("/api/v1...")`를 쓰지 않는다.
- 서버 변경이 필요한 작업은 해당 `page.tsx` 라우트 디렉토리의 `actions.ts`에 둔 Server Action을 호출한다.
- 독립 API로 남긴 조회 엔드포인트를 호출해야 할 때도 호출부를 명확히 격리한다.

## 2. 오류 처리 규칙

- 프론트에서 임의 오류 코드를 만들지 않는다.
- 리소스 접근 실패는 백엔드가 내려준 `error.code`, `error.message`를 사용한다.
- 주문 상세 오류는 다음처럼 구분한다.
  - `UNAUTHORIZED`: 로그인 필요
  - `NOT_FOUND`: 주문 ID 없음
  - `FORBIDDEN`: 주문은 있으나 현재 사용자의 주문이 아님
- 라우트 이동형 오류 화면은 `/error?code=...&message=...&returnTo=...`를 사용한다.

## 3. 백엔드 라우트 규칙

- 모든 Route Handler는 `withApiHandler`로 감싼다.
- 성공 응답은 `ok(data, init?)`를 사용한다.
- 실패 응답은 `fail(code, message, status, details?)`를 사용한다.
- 인증이 필요한 API는 핸들러 초반에 `getSessionUser()`를 확인한다.
- 존재 여부와 권한은 분리한다.
  - 먼저 리소스 존재 여부 확인
  - 존재하면 소유자/권한 확인
  - 그 다음 상세 데이터 조회

## 4. 데이터 접근 규칙

- Prisma 접근은 가능한 `lib/backend/repository.ts`로 모은다.
- API route 안에서 직접 Prisma를 써야 할 때는 권한/존재 여부 확인처럼 route 응답 코드와 밀접한 경우로 제한한다.
- 목업 데이터는 시드용으로만 사용한다. 프론트 화면에서 직접 import하지 않는다.

## 5. 프론트 디자인 규칙

- 전역 토큰은 `app/globals.css`의 `:root` 변수를 우선 사용한다.
- 카드 radius는 기본 `8px`를 유지한다.
- 페이지 섹션은 `container-shell`을 사용해 폭을 맞춘다.
- 액션 버튼은 기존 `.btn-primary`, `.btn-secondary` 또는 페이지별 동일 패턴을 따른다.
- 서버 데이터를 기다릴 수 없는 UI는 하드코딩하지 말고 API fallback 또는 empty state를 둔다.
- 페이지별 CSS는 해당 라우트 폴더의 CSS에 두되, 공통 컴포넌트 스타일은 전역 또는 컴포넌트 단위로 승격한다.

## 6. 라우팅 규칙

- 주문 상세는 `/order/{orderId}`를 사용한다.
- 마이페이지 주문 목록은 `/mypage/orders`, 상세는 `/order/{orderId}`로 이동한다.
- 로그인 필요 페이지는 서버에서 세션을 확인한다.
- 권한 오류는 이전 페이지 리다이렉트가 아니라 `/error`로 보낸다.

## 7. 점검 체크리스트

새 화면 또는 API를 추가할 때 확인한다.

- 직접 `/api/v1` fetch를 쓰지 않았는가?
- Server Component에서 내부 API를 HTTP로 우회 호출하지 않았는가?
- API route가 `ok/fail/withApiHandler`를 쓰는가?
- `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`가 섞이지 않는가?
- 프론트에 아직 더미 배열이 남아 있다면 실제 정적 콘텐츠인지, API 연결 대상인지 구분했는가?
- `pnpm run lint`와 `pnpm run build`를 통과했는가?
