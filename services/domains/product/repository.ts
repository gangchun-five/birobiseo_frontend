import { prisma } from "@/services/prisma";
import { Review } from "../review/repository";

export type ProductCategory = {
  code: string;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  nRatio: number;
  pRatio: number;
  kRatio: number;
  weight: string;
  rating: number;
  badge: "BEST" | "신상품" | "추천" | null;
  crop: string;
  soil: string;
  reviewCount?: number;
};

export type ProductListOptions = {
  keyword?: string;
  cropCategory?: string;
  soilType?: string;
  maxPrice?: number;
  sort?: string;
};

export type ProductFilterOptions = {
  crops: string[];
  soils: string[];
};

export type ProductInput = Omit<Product, "id" | "nRatio" | "pRatio" | "kRatio" | "rating" | "reviewCount"> & Partial<Pick<Product, "nRatio" | "pRatio" | "kRatio">>;

export type ProductDetail = Product & {
  categoryLabel: string;
  shortDescription: string;
  reviewCount: number;
  favoriteCount: number;
  thumbnails: Array<{
    id: string;
    label: string;
    imageUrl?: string;
  }>;
  purchaseOptions: ProductPurchaseOption[];
  info: {
    summary: string;
    certifications: Array<{ label: string; value: string }>;
    specs: Array<{ label: string; value: string }>;
  };
  effects: string[];
  recommendedCrops: Array<{ name: string; category: string }>;
  cautions: string[];
  usage: string[];
  ingredients: string[];
  shipping: {
    freeShippingThreshold: number;
    todayCutoff: string;
    estimatedDelivery: string;
  };
  qnaCount: number;
  relatedProducts: Product[];
};

type ProductRecord = {
  id: number;
  name: string;
  description: string;
  price: number;
  nRatio: number;
  pRatio: number;
  kRatio: number;
  weight: string;
  rating: number;
  badge: string | null;
  crop: string;
  soil: string;
  infoSummary?: string | null;
  infoSpecs?: string | null;
  effects?: string | null;
  recommendedCrops?: string | null;
  ingredients?: string | null;
  purchaseOptions?: string | null;
  _count?: {
    reviews: number;
  };
};

export type ProductPurchaseOption = {
  id: string;
  label: string;
  weight: string;
  price: number;
  unitPriceLabel: string;
  featured?: boolean;
};

function toProduct(record: ProductRecord): Product {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    price: record.price,
    nRatio: record.nRatio,
    pRatio: record.pRatio,
    kRatio: record.kRatio,
    weight: record.weight,
    rating: record.rating,
    badge: record.badge as Product["badge"],
    crop: record.crop,
    soil: record.soil,
    reviewCount: record._count?.reviews
  };
}

export async function listProductCategories() {
  return prisma.productCategory.findMany({
    orderBy: { id: "asc" },
    select: { code: true, name: true }
  });
}

function toFilterOptions(values: string[]) {
  return ["전체", ...values.filter((value) => value && value !== "전체")];
}

export async function listProductFilterOptions(): Promise<ProductFilterOptions> {
  const [cropRecords, soilRecords] = await Promise.all([
    prisma.product.findMany({
      distinct: ["crop"],
      orderBy: { crop: "asc" },
      select: { crop: true }
    }),
    prisma.product.findMany({
      distinct: ["soil"],
      orderBy: { soil: "asc" },
      select: { soil: true }
    })
  ]);

  return {
    crops: toFilterOptions(cropRecords.map((product) => product.crop)),
    soils: toFilterOptions(soilRecords.map((product) => product.soil))
  };
}

export async function listProducts(options: ProductListOptions = {}) {
  const keyword = options.keyword?.trim();
  const cropCategory = options.cropCategory;
  const soilType = options.soilType;
  const maxPrice = options.maxPrice;
  const sort = options.sort ?? "recommended";

  const found = await prisma.product.findMany({
    where: {
      AND: [
        keyword
          ? {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
                { crop: { contains: keyword } },
                { soil: { contains: keyword } }
              ]
            }
          : {},
        cropCategory && cropCategory !== "전체" ? { OR: [{ crop: cropCategory }, { crop: "전체" }] } : {},
        soilType && soilType !== "전체" ? { OR: [{ soil: soilType }, { soil: "전체" }] } : {},
        Number.isFinite(maxPrice) ? { price: { lte: maxPrice } } : {}
      ]
    },
    include: { _count: { select: { reviews: true } } }
  });

  return found.sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "latest") return b.id - a.id;
    if (sort === "popular") return b.rating - a.rating;
    return Number(b.badge === "BEST") - Number(a.badge === "BEST") || b.rating - a.rating;
  }).map(toProduct);
}

function getWritableProductData(data: ProductInput) {
  return {
    ...data,
    rating: 0,
    nRatio: data.nRatio ?? 0.34,
    pRatio: data.pRatio ?? 0.33,
    kRatio: data.kRatio ?? 0.33
  };
}

export async function createProduct(data: ProductInput) {
  return prisma.product.create({ data: getWritableProductData(data) });
}

export async function getProduct(productId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  return product ? toProduct(product) : null;
}

function parseProductJsonArray<T>(value: string | null | undefined, fieldName: string): T[] {
  if (!value) {
    throw new Error(`Product ${fieldName} is not configured.`);
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed as T[];
  } catch {
    throw new Error(`Product ${fieldName} must be a JSON array.`);
  }
}

function getRequiredProductText(value: string | null | undefined, fieldName: string) {
  if (!value?.trim()) {
    throw new Error(`Product ${fieldName} is not configured.`);
  }

  return value;
}

export function getProductPurchaseOptions(product: ProductRecord): ProductPurchaseOption[] {
  return parseProductJsonArray<ProductPurchaseOption>(product.purchaseOptions, "purchaseOptions");
}

function getProductDisplayCopy(product: ProductRecord) {
  const soilCopy = product.soil === "전체" ? "다양한 토양" : `${product.soil} 토양`;

  return {
    categoryLabel: product.soil === "척박지" ? "토양개선 비료" : product.crop === "전체" ? "혼합유기질 비료" : `${product.crop} 맞춤 비료`,
    shortDescription: `${soilCopy}의 건강을 회복하고 작물의 균형 생육을 돕는 비료`
  };
}

function getProductDetailContent(product: ProductRecord) {
  return {
    info: {
      summary: getRequiredProductText(product.infoSummary, "infoSummary"),
      certifications: [],
      specs: parseProductJsonArray<{ label: string; value: string }>(product.infoSpecs, "infoSpecs")
    },
    effects: parseProductJsonArray<string>(product.effects, "effects"),
    recommendedCrops: parseProductJsonArray<{ name: string; category: string }>(product.recommendedCrops, "recommendedCrops"),
    cautions: [
      "사용 전 제품의 라벨을 확인 후 사용하세요.",
      "과다 사용 시 토양에 작물 생육에 영향을 줄 수 있습니다.",
      "어린이 손이 닿지 않는 곳에 보관하세요."
    ],
    usage: [],
    ingredients: parseProductJsonArray<string>(product.ingredients, "ingredients")
  };
}

export async function getProductDetail(productId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return null;
  }

  const reviewsForProduct = await prisma.review.count({ where: { productId } });
  const relatedCandidates = await prisma.product.findMany({
    where: { id: { not: product.id } },
    include: { _count: { select: { reviews: true } } }
  });
  const relatedProducts = relatedCandidates
    .map((candidate) => ({
      ...candidate,
      score: getRelatedProductScore(product, candidate)
    }))
    .sort((a, b) => b.score - a.score || b.rating - a.rating || a.id - b.id)
    .slice(0, 5)
    .map(toProduct);
  const displayCopy = getProductDisplayCopy(product);
  const detailContent = getProductDetailContent(product);

  return {
    ...toProduct(product),
    ...displayCopy,
    ...detailContent,
    reviewCount: reviewsForProduct,
    favoriteCount: 180 + product.id * 23,
    thumbnails: [
      { id: "main", label: "상품 이미지" },
      { id: "soil", label: "토양 입자", imageUrl: "/images/banner/market-banner.png" },
      { id: "crop", label: "적용 작물", imageUrl: "/images/banner/recommend-banner.png" },
      { id: "field", label: "사용 농지", imageUrl: "/images/banner/main-banner.png" }
    ],
    purchaseOptions: getProductPurchaseOptions(product),
    shipping: {
      freeShippingThreshold: 50000,
      todayCutoff: "오후 2시 이전 주문 시",
      estimatedDelivery: "오늘 출발"
    },
    qnaCount: 18 + product.id,
    relatedProducts
  };
}

function getRelatedProductScore(
  current: ProductRecord,
  candidate: ProductRecord & { _count?: { reviews: number } }
) {
  const cropScore = candidate.crop === current.crop ? 4 : candidate.crop === "전체" || current.crop === "전체" ? 1.6 : 0;
  const soilScore = candidate.soil === current.soil ? 3 : candidate.soil === "전체" || current.soil === "전체" ? 1.2 : 0;
  const priceDistance = Math.abs(candidate.price - current.price) / Math.max(current.price, candidate.price, 1);
  const priceScore = Math.max(0, 1 - priceDistance) * 1.4;
  const ratingScore = candidate.rating * 1.1;
  const reviewScore = Math.min(candidate._count?.reviews ?? 0, 30) / 10;
  const badgeScore = candidate.badge === "BEST" ? 0.8 : candidate.badge === "추천" ? 0.5 : candidate.badge ? 0.25 : 0;

  return cropScore + soilScore + priceScore + ratingScore + reviewScore + badgeScore;
}

export async function updateProduct(productId: number, data: Partial<ProductInput>) {
  return prisma.product.update({ where: { id: productId }, data });
}

export async function deleteProduct(productId: number) {
  return prisma.product.delete({ where: { id: productId } });
}

export async function listReviews(searchParams: URLSearchParams, userId?: number): Promise<Review[]> {
  const mine = searchParams.get("mine") === "true";
  const productId = Number(searchParams.get("productId") ?? "0");
  const sort = searchParams.get("sort") ?? "latest";

  const found = await prisma.review.findMany({
    where: {
      userId: mine ? userId : undefined,
      productId: productId > 0 ? productId : undefined
    },
    include: { product: true },
    orderBy: [{ id: "desc" }]
  });

  const sorted = sort === "best"
    ? found
        .map((review) => ({ ...review, score: getBestReviewScore(review) }))
        .sort((a, b) => b.score - a.score || b.rating - a.rating || b.id - a.id)
    : found;

  return sorted.map((review) => ({
    id: review.id,
    name: review.name,
    product: review.product?.name ?? "알 수 없는 상품",
    productId: review.productId!,
    rating: review.rating,
    content: review.content,
    date: review.createdAt.toISOString().slice(0, 10).replaceAll("-", ".")
  }));
}

function getBestReviewScore(review: {
  rating: number;
  content: string;
  date?: string | null;
  createdAt: Date;
  product?: { rating: number; badge: string | null } | null;
}) {
  const reviewDate = review.createdAt;
  const ageDays = Math.max(0, (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
  const recencyScore = Math.max(0, 1 - ageDays / 180) * 0.8;
  const contentScore = Math.min(review.content.trim().length / 120, 1) * 1.4;
  const ratingScore = review.rating * 1.8;
  const productScore = (review.product?.rating ?? 4) * 0.6;
  const badgeScore = review.product?.badge === "BEST" ? 0.4 : review.product?.badge ? 0.2 : 0;

  return ratingScore + contentScore + recencyScore + productScore + badgeScore;
}
