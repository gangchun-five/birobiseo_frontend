import { prisma } from "@/services/prisma";

export async function updateUserProfile(userId: number, data: Partial<{ name: string; email: string; phone: string }>) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name?.trim() || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      memberType: true,
      subscriptionTier: true,
      createdAt: true
    }
  });
}

export async function getMypageSummary(userId: number) {
  const [user, orderCount, savedRecommendationCount, reviewCount, activeOrderCount, monthlyPayments] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.recommendation.count({ where: { userId, saved: true } }),
    prisma.review.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: { not: "배송완료" } } }),
    prisma.payment.findMany({ where: { order: { userId } } })
  ]);

  return {
    profile: {
      name: user.name,
      memberLabel: user.memberType === "Admin" ? "관리자" : "일반 회원",
      totalOrderCount: orderCount,
      savedRecommendationCount,
      reviewCount
    },
    stats: {
      recentRecommendationCount: Math.min(savedRecommendationCount, 2),
      activeOrderCount,
      monthlyPaymentAmount: monthlyPayments.reduce((sum, payment) => sum + Number(payment.amount.replace(/[^0-9]/g, "")), 0),
      subscriptionLabel: user.subscriptionTier === "PREMIUM" ? "프리미엄" : "무료"
    }
  };
}
