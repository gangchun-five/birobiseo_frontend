import { prisma } from "@/services/prisma";
import { Prisma } from "@/services/generated/prisma/client";

export type Review = {
  id: number;
  name: string;
  product: string;
  productId: number;
  rating: number;
  content: string;
  date?: string;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

export async function listReviews(searchParams: URLSearchParams, userId?: number): Promise<Review[]> {
  const mine = searchParams.get("mine") === "true";
  const productId = Number(searchParams.get("productId") ?? "0");
  const size = Number(searchParams.get("size") ?? "0");

  if (mine && !userId) {
    return [];
  }

  const reviews = await prisma.review.findMany({
    where: {
      userId: mine ? userId : undefined,
      productId: Number.isInteger(productId) && productId > 0 ? productId : undefined
    },
    include: { product: true },
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" }
    ],
    take: Number.isInteger(size) && size > 0 ? size : undefined
  });

  return reviews.map((review) => ({
    id: review.id,
    name: review.name,
    product: review.product?.name ?? "알 수 없는 상품",
    productId: review.productId!,
    rating: review.rating,
    content: review.content,
    date: formatDate(review.createdAt)
  }));
}

export async function createReview(data: Omit<Review, "id" | "product" | "date"> & { userId?: number }) {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({ data });
    await refreshProductRating(tx, review.productId);
    return review;
  });
}

export async function hasPurchasedProduct(userId: number, productId: number) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      productId
    },
    select: { id: true }
  });

  return order !== null;
}

export async function updateReview(reviewId: number, data: Partial<Omit<Review, "id" | "product" | "date">>) {
  return prisma.$transaction(async (tx) => {
    const previous = await tx.review.findUniqueOrThrow({
      where: { id: reviewId },
      select: { productId: true }
    });
    const review = await tx.review.update({ where: { id: reviewId }, data });

    await refreshProductRating(tx, previous.productId);
    if (review.productId !== previous.productId) {
      await refreshProductRating(tx, review.productId);
    }

    return review;
  });
}

export async function deleteReview(reviewId: number) {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.delete({ where: { id: reviewId } });
    await refreshProductRating(tx, review.productId);
    return review;
  });
}

async function refreshProductRating(tx: Prisma.TransactionClient, productId: number | null) {
  if (!productId) {
    return;
  }

  const aggregate = await tx.review.aggregate({
    where: { productId },
    _avg: { rating: true }
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      rating: roundRating(aggregate._avg.rating)
    }
  });
}

function roundRating(rating: number | null | undefined) {
  return rating ? Math.round(rating * 10) / 10 : 0;
}
