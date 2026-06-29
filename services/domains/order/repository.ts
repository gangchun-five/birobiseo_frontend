import { prisma } from "@/services/prisma";
import { getProductDetail, Product } from "../product/repository";

export type Order = {
  id: string;
  product: string;
  productId: number;
  orderDate: string;
  orderedAt: Date;
  amount: string;
  quantity: number;
  status: "배송중" | "배송완료" | "배합준비";
  expectedDate: string;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  productSummary: string;
  productName: string;
  quantity: number;
  unitLabel: string;
  orderDate: string;
  orderedAt: Date;
  amount: string;
  status: Order["status"];
  expectedDate: string;
  product: (Product & { reviewCount: number }) | null;
  payment: {
    id: number;
    method: string;
    amount: string;
    status: string;
    date: string;
  } | null;
  delivery: {
    recipient: string;
    address: string;
    courier: string;
    trackingNumber: string;
  };
  timeline: Array<{
    label: string;
    active: boolean;
    current: boolean;
  }>;
};

type OrderWithRelations = Awaited<ReturnType<typeof findOrdersForUser>>[number];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

function dateOnly(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const next = dateOnly(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildTrackingNumber(orderId: string) {
  return `BR-${orderId.replace(/\D/g, "").slice(-10).padStart(10, "0")}`;
}

function getDefaultTimeline(status: Order["status"]) {
  const statusSteps = ["결제완료", "상품준비중", "배송중", "배송완료"];
  const activeIndex = status === "배송완료" ? 3 : status === "배송중" ? 2 : 1;

  return statusSteps.map((label, index) => ({
    label,
    active: index <= activeIndex,
    current: index === activeIndex
  }));
}

function parseTimeline(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as OrderDetail["timeline"] : [];
  } catch {
    return [];
  }
}

function getPaymentAmount(order: OrderWithRelations) {
  return order.payments[0]?.amount ?? `${(order.product.price * order.amount).toLocaleString("ko-KR")}원`;
}

function toOrder(order: OrderWithRelations): Order {
  return {
    id: order.id,
    product: order.product.name,
    productId: order.productId,
    orderDate: formatDate(order.orderedAt),
    orderedAt: order.orderedAt,
    amount: getPaymentAmount(order),
    quantity: order.amount,
    status: order.status as Order["status"],
    expectedDate: formatDate(order.expectedDate)
  };
}

function findOrdersForUser(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      product: true,
      payments: { orderBy: { id: "desc" } }
    },
    orderBy: { orderedAt: "desc" }
  });
}

export async function listOrders(userId: number) {
  const orders = await findOrdersForUser(userId);
  return orders.map(toOrder);
}

export async function createDirectOrderWithPayment(
  userId: number,
  data: { productId: number; quantity: number; optionId?: string }
) {
  const product = await getProductDetail(data.productId);

  if (!product) {
    return null;
  }

  const quantity = Number.isFinite(data.quantity) && data.quantity > 0 ? data.quantity : 1;
  const selectedOption = product.purchaseOptions.find((option) => option.id === data.optionId);
  const unitPrice = selectedOption?.price ?? product.price;
  const unitLabel = selectedOption?.label ?? product.weight;
  const totalAmount = unitPrice * quantity;
  const orderedAt = new Date();
  const orderId = `BB-${orderedAt.getFullYear()}06-${Date.now()}`;
  const [farm, farmAddress] = await Promise.all([
    prisma.farm.findFirst({ where: { ownerId: userId } }),
    prisma.farm.findFirst({ where: { ownerId: userId } }).then((found) => (
      found?.addressId ? prisma.roadAddress.findUnique({ where: { id: found.addressId } }) : null
    ))
  ]);
  const status = "배합준비" as const;
  const expectedDate = addDays(orderedAt, 3);
  const productSummary = `${product.name} ${unitLabel} × ${quantity}포`;
  const deliveryRecipient = farm ? `${farm.name} 담당자` : "";
  const deliveryAddress = farmAddress?.roadAddress ?? "";
  const deliveryCourier = "비료비서 자체 배합센터";
  const trackingNumber = buildTrackingNumber(orderId);
  const timeline = JSON.stringify(getDefaultTimeline(status));

  const order = await prisma.order.create({
    data: {
      id: orderId,
      userId,
      productId: product.id,
      productName: product.name,
      productSummary,
      unitLabel,
      orderedAt,
      amount: quantity,
      status,
      expectedDate,
      deliveryRecipient,
      deliveryAddress,
      deliveryCourier,
      trackingNumber,
      timeline
    }
  });
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      date: formatDate(orderedAt),
      method: "NH 신용카드",
      amount: `${totalAmount.toLocaleString("ko-KR")}원`,
      status: "결제완료"
    }
  });

  return {
    order,
    payment,
    totalAmount,
    paymentRequired: false
  };
}

export async function getOrderDetail(userId: number, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      product: { include: { _count: { select: { reviews: true } } } },
      payments: { orderBy: { id: "desc" } }
    }
  });

  if (!order) {
    return null;
  }

  const product = order.product;
  const payment = order.payments[0] ?? null;
  const timeline = parseTimeline(order.timeline);

  return {
    id: order.id,
    orderNumber: order.id,
    productSummary: order.productSummary,
    productName: order.productName,
    quantity: order.amount,
    unitLabel: order.unitLabel,
    orderDate: formatDate(order.orderedAt),
    orderedAt: order.orderedAt,
    amount: payment?.amount ?? `${(product.price * order.amount).toLocaleString("ko-KR")}원`,
    status: order.status as Order["status"],
    expectedDate: formatDate(order.expectedDate),
    product: {
      id: order.productId,
      name: order.productName,
      description: product.description,
      price: product.price,
      nRatio: product.nRatio,
      pRatio: product.pRatio,
      kRatio: product.kRatio,
      weight: product.weight,
      rating: product.rating,
      badge: product.badge as Product["badge"],
      crop: product.crop,
      soil: product.soil,
      reviewCount: product._count.reviews
    },
    payment: payment
      ? {
          id: payment.id,
          method: payment.method,
          amount: payment.amount,
          status: payment.status,
          date: payment.date
        }
      : null,
    delivery: {
      recipient: order.deliveryRecipient,
      address: order.deliveryAddress,
      courier: order.deliveryCourier,
      trackingNumber: order.trackingNumber
    },
    timeline
  };
}
