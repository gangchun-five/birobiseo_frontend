import type { Recommendation } from "@/types";

export const recommendations: Recommendation[] = [
  { id: 1, title: "고추 재배 추천 배합", crop: "고추", npk: "12-6-9", blend: "분변토 70% · 탈피각 20% · 유기물 10%", savedAt: "2026.05.30" },
  { id: 2, title: "배추 생육 추천", crop: "배추", npk: "10-7-8", blend: "분변토 60% · 해조추출 15% · 미생물 25%", savedAt: "2026.05.16" },
  { id: 3, title: "오이 착과 추천", crop: "오이", npk: "11-5-10", blend: "분변토 65% · 칼슘보조 15% · 완효성 20%", savedAt: "2026.04.28" }
];

export const defaultResult = {
  fertilizer: "곤충 부산물 복합 비료",
  npk: [
    { label: "N", value: 120 },
    { label: "P", value: 60 },
    { label: "K", value: 90 }
  ],
  blend: ["분변토 70%", "탈피각 20%", "유기물 보조제 10%"],
  effects: ["수확량 증가 +18%", "당도 개선 +1.2 Brix", "토양 유기물 증가 +12%", "토양 pH 안정화 6.2~6.5"],
  usage: ["권장 사용량 200kg/10a", "사용 시기: 정식 7일 전", "주의사항: 과다 시비 주의"]
};
