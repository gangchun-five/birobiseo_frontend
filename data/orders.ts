import type { Order } from "@/types";

export const orders: Order[] = [
  { id: "BB-202606-1024", product: "곤충분변 복합 비료", orderDate: "2026.06.01", amount: "112,000원", status: "배송중", expectedDate: "2026.06.06" },
  { id: "BB-202605-0981", product: "엽채류 맞춤비료", orderDate: "2026.05.18", amount: "78,000원", status: "배송완료", expectedDate: "2026.05.22" },
  { id: "BB-202605-0944", product: "고추 재배 추천 배합", orderDate: "2026.05.07", amount: "55,000원", status: "배합준비", expectedDate: "2026.06.08" }
];

export const payments = [
  { date: "2026.06.01", orderId: "BB-202606-1024", method: "NH 신용카드", amount: "112,000원", status: "결제완료" },
  { date: "2026.05.18", orderId: "BB-202605-0981", method: "농협 계좌", amount: "78,000원", status: "결제완료" },
  { date: "2026.05.07", orderId: "BB-202605-0944", method: "NH 신용카드", amount: "55,000원", status: "결제완료" }
];
