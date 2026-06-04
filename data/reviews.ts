import type { Review } from "@/types";

export const reviews: Review[] = [
  { id: 1, name: "전라북도 ○○ 농가", product: "곤충분변 복합 비료", rating: 5, content: "토마토 착과기 추천대로 사용했더니 잎색과 열매 균형이 안정적으로 좋아졌습니다.", date: "2026.05.12" },
  { id: 2, name: "충청남도 ○○ 농가", product: "토양회복 비료", rating: 5, content: "연작지라 걱정이 많았는데 토양 상태에 맞춰 설명이 나와 선택이 쉬웠습니다.", date: "2026.05.18" },
  { id: 3, name: "경상북도 ○○ 농가", product: "엽채류 맞춤비료", rating: 4, content: "주문부터 배송까지 한 화면에서 보여서 재주문 관리가 편합니다.", date: "2026.05.25" }
];

export const myReviews: Review[] = [
  { id: 11, name: "김농부님", product: "곤충분변 복합 비료", rating: 5, content: "고추밭에 사용했는데 생육 초반 뿌리 활착이 빨라졌습니다.", date: "2026.05.02" },
  { id: 12, name: "김농부님", product: "미생물 활성비료", rating: 4, content: "토양이 부드러워진 느낌이 있고 냄새도 심하지 않아 만족합니다.", date: "2026.04.21" },
  { id: 13, name: "김농부님", product: "칼슘·마그네슘 비료", rating: 5, content: "오이 착과기에 보조로 쓰기 좋았습니다. 추천 배합표와 같이 보니 편합니다.", date: "2026.04.08" }
];
