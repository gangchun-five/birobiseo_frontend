import { prisma } from "@/services/prisma";

export type Payment = {
  id?: number;
  date: string;
  orderId: string;
  method: string;
  amount: string;
  status: string;
};

export async function listPayments(userId: number) {
  return prisma.payment.findMany({
    where: { order: { userId } },
    orderBy: { id: "desc" }
  });
}

export async function createPayment(data: { orderId: string; amount: number }) {
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      method: "NH 신용카드",
      amount: `${data.amount.toLocaleString("ko-KR")}원`,
      status: "결제완료"
    }
  });
}
