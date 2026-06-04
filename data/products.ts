import type { Product } from "@/types";

export const products: Product[] = [
  { id: 1, name: "곤충분변 복합 비료", description: "토양 유기물과 뿌리 활착을 함께 돕는 대표 배합", price: 28000, weight: "20kg", rating: 4.9, badge: "BEST", crop: "전체", soil: "중성" },
  { id: 2, name: "토양회복 비료", description: "척박지와 연작지 회복을 위한 유기질 중심 처방", price: 24000, weight: "20kg", rating: 4.8, badge: "추천", crop: "전체", soil: "척박지" },
  { id: 3, name: "엽채류 맞춤비료", description: "상추, 배추 등 잎채소 생육 균형에 맞춘 배합", price: 26000, weight: "20kg", rating: 4.7, badge: "추천", crop: "엽채류", soil: "중성" },
  { id: 4, name: "과채류 맞춤비료", description: "토마토, 고추 착과기 영양 균형 강화", price: 27000, weight: "20kg", rating: 4.8, badge: "BEST", crop: "과채류", soil: "양토" },
  { id: 5, name: "유기질 프리미엄 비료", description: "곤충 부산물과 식물성 유기물을 고르게 배합", price: 32000, weight: "20kg", rating: 4.9, badge: "신상품", crop: "과수", soil: "산성" },
  { id: 6, name: "완효성 복합비료", description: "천천히 흡수되어 생육 중후반까지 안정 공급", price: 23000, weight: "20kg", rating: 4.6, badge: "추천", crop: "곡물류", soil: "중성" },
  { id: 7, name: "해조추출 비료", description: "미량요소 보강과 스트레스 완화에 좋은 액상 보조", price: 18000, weight: "10kg", rating: 4.5, badge: "신상품", crop: "전체", soil: "전체" },
  { id: 8, name: "미생물 활성비료", description: "토양 미생물 환경을 살리는 발효 기반 비료", price: 22000, weight: "20kg", rating: 4.7, badge: "BEST", crop: "근채류", soil: "척박지" },
  { id: 9, name: "칼슘·마그네슘 비료", description: "과실 품질과 생리장해 예방을 위한 보조 비료", price: 16000, weight: "10kg", rating: 4.6, badge: "추천", crop: "과채류", soil: "산성" },
  { id: 10, name: "퇴비 부숙 촉진제", description: "농장 부산물 퇴비화를 빠르고 안정적으로 돕는 촉진제", price: 15000, weight: "10kg", rating: 4.4, badge: "신상품", crop: "전체", soil: "전체" }
];
