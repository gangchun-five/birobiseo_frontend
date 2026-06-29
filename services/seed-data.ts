import { hashPassword } from "./domains/auth/repository";
import { prisma } from "./prisma";

const products = [
  { id: 1, name: "퇴비개선 토양계량 비료", description: "토양 유기물과 뿌리 활착을 함께 돕는 대표 배합", price: 28000, weight: "20kg", badge: "BEST", nRatio: 0.44, pRatio: 0.22, kRatio: 0.34, crop: "전체", soil: "중성" },
  { id: 2, name: "토양회복 비료", description: "척박지와 연작지 회복을 위한 유기질 중심 처방", price: 24000, weight: "20kg", badge: "추천", nRatio: 0.36, pRatio: 0.28, kRatio: 0.36, crop: "전체", soil: "척박지" },
  { id: 3, name: "엽채류 맞춤비료", description: "상추, 배추 등 잎채소 생육 균형에 맞춘 배합", price: 26000, weight: "20kg", badge: "추천", nRatio: 0.40, pRatio: 0.28, kRatio: 0.32, crop: "엽채류", soil: "중성" },
  { id: 4, name: "과채류 맞춤비료", description: "토마토, 고추 착과기 영양 균형 강화", price: 27000, weight: "20kg", badge: "BEST", nRatio: 0.42, pRatio: 0.20, kRatio: 0.38, crop: "과채류", soil: "양토" },
  { id: 6, name: "완효성 복합비료", description: "천천히 흡수되어 생육 중후반까지 안정 공급", price: 23000, weight: "20kg", badge: "추천", nRatio: 0.46, pRatio: 0.20, kRatio: 0.34, crop: "곡물류", soil: "중성" },
  { id: 7, name: "해조추출 비료", description: "미량요소 보강과 스트레스 완화에 좋은 액상 보조", price: 18000, weight: "10kg", badge: "신상품", nRatio: 0.30, pRatio: 0.25, kRatio: 0.45, crop: "전체", soil: "전체" },
  { id: 8, name: "미생물 활성비료", description: "토양 미생물 환경을 살리는 발효 기반 비료", price: 22000, weight: "20kg", badge: "BEST", nRatio: 0.38, pRatio: 0.24, kRatio: 0.38, crop: "근채류", soil: "척박지" },
  { id: 10, name: "퇴비 부숙 촉진제", description: "농장 부산물 퇴비화를 빠르고 안정적으로 돕는 촉진제", price: 15000, weight: "10kg", badge: "신상품", nRatio: 0.33, pRatio: 0.33, kRatio: 0.34, crop: "전체", soil: "전체" }
];

const recommendations = [
  { id: 1, productId: 1, title: "고추 재배 추천 배합", crop: "고추", npk: "12-6-9", blend: "분변토 70% · 탈피각 20% · 유기물 10%", savedAt: new Date("2026-05-30T00:00:00.000Z") },
  { id: 2, productId: 3, title: "배추 생육 추천", crop: "배추", npk: "10-7-8", blend: "분변토 60% · 해조추출 15% · 미생물 25%", savedAt: new Date("2026-05-16T00:00:00.000Z") },
  { id: 3, productId: 4, title: "오이 착과 추천", crop: "오이", npk: "11-5-10", blend: "분변토 65% · 칼슘보조 15% · 완효성 20%", savedAt: new Date("2026-04-28T00:00:00.000Z") }
];

const orders = [
  { id: "BB-202606-1024", productId: 1, orderedAt: new Date("2026-06-01T00:00:00.000Z"), amount: 4, status: "배송중", expectedDate: new Date("2026-06-06T00:00:00.000Z") },
  { id: "BB-202605-0981", productId: 3, orderedAt: new Date("2026-05-18T00:00:00.000Z"), amount: 3, status: "배송완료", expectedDate: new Date("2026-05-22T00:00:00.000Z") },
  { id: "BB-202605-0944", productId: 4, orderedAt: new Date("2026-05-07T00:00:00.000Z"), amount: 2, status: "배합준비", expectedDate: new Date("2026-06-08T00:00:00.000Z") }
];

const payments = [
  { date: "2026.06.01", orderId: "BB-202606-1024", method: "NH 신용카드", amount: "112,000원", status: "결제완료" },
  { date: "2026.05.18", orderId: "BB-202605-0981", method: "농협 계좌", amount: "78,000원", status: "결제완료" },
  { date: "2026.05.07", orderId: "BB-202605-0944", method: "NH 신용카드", amount: "55,000원", status: "결제완료" }
];

const reviews = [
  { id: 1, name: "전라북도 ○○ 농가", product: "퇴비개선 토양계량 비료", rating: 5, content: "토마토 착과기 추천대로 사용했더니 잎색과 열매 균형이 안정적으로 좋아졌습니다.", date: "2026.05.12" },
  { id: 2, name: "충청남도 ○○ 농가", product: "토양회복 비료", rating: 5, content: "연작지라 걱정이 많았는데 토양 상태에 맞춰 설명이 나와 선택이 쉬웠습니다.", date: "2026.05.18" },
  { id: 3, name: "경상북도 ○○ 농가", product: "엽채류 맞춤비료", rating: 4, content: "주문부터 배송까지 한 화면에서 보여서 재주문 관리가 편합니다.", date: "2026.05.25" }
];

const myReviews = [
  { id: 11, name: "김농부님", product: "퇴비개선 토양계량 비료", rating: 5, content: "고추밭에 사용했는데 생육 초반 뿌리 활착이 빨라졌습니다.", date: "2026.05.02" },
  { id: 12, name: "김농부님", product: "미생물 활성비료", rating: 4, content: "토양이 부드러워진 느낌이 있고 냄새도 심하지 않아 만족합니다.", date: "2026.04.21" },
  { id: 13, name: "김농부님", product: "칼슘·마그네슘 비료", rating: 5, content: "오이 착과기에 보조로 쓰기 좋았습니다. 추천 배합표와 같이 보니 편합니다.", date: "2026.04.08" }
];

const cropCodes = [
  { code: "TOMATO", name: "토마토", category: "과채류", frtlzrUseApiCropId: "04016" },
  { code: "PEPPER", name: "고추", category: "과채류", frtlzrUseApiCropId: "04003" },
  { code: "LETTUCE", name: "상추", category: "엽채류", frtlzrUseApiCropId: "07008" },
  { code: "CABBAGE", name: "배추", category: "엽채류", frtlzrUseApiCropId: "07002" },
  { code: "CUCUMBER", name: "오이", category: "과채류", frtlzrUseApiCropId: "04012" },
  { code: "RICE", name: "벼", category: "곡물류", frtlzrUseApiCropId: "00001" }
];

const soilTypes = [
  { code: "LOAM", name: "양토", ph: 6.2 },
  { code: "ACID", name: "산성토" },
  { code: "SANDY", name: "사질토" },
  { code: "CLAY", name: "점질토" },
  { code: "BARREN", name: "척박지" },
  { code: "NEUTRAL", name: "중성토" }
];

const productCategories = [
  { code: "CROP", name: "작물별" },
  { code: "SOIL", name: "토양개선" },
  { code: "ECO", name: "친환경 비료" },
  { code: "CUSTOM", name: "맞춤 추천" },
  { code: "SUBSCRIPTION", name: "정기배송" },
  { code: "POPULAR", name: "인기상품" }
];

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}

const productEffectsById: Record<number, string[]> = {
  1: [
    "토양 유기물 보강으로 작물 뿌리 활착 환경 개선",
    "부식산과 유기물 공급으로 토양 입단 구조 형성 보조",
    "정식 전 밑거름 사용 시 초기 생육 기반 확보",
    "중성 토양에서 양분 보유력과 통기성 개선"
  ],
  2: [
    "연작지와 척박지의 유기물 기반 회복 보조",
    "토양 완충력을 높여 작물 생육 스트레스 완화",
    "미생물 활동 기반을 마련해 토양 회복 속도 개선",
    "뿌리 주변 환경 안정화로 양분 흡수 조건 개선"
  ],
  3: [
    "엽채류의 잎 생장과 엽색 유지에 필요한 질소 균형 보강",
    "상추와 배추 초기 생육기의 잎 면적 확대 보조",
    "수분 보유력 개선으로 잎채소 품질 안정화",
    "인산 보강으로 정식 후 뿌리 활착 지원"
  ],
  4: [
    "착과기 과채류의 칼륨 요구를 보강해 과실 비대 지원",
    "토마토와 고추의 당 이동과 과실 품질 형성 보조",
    "개화 전후 생식 생장 전환에 필요한 인산 공급",
    "양토 조건에서 뿌리와 지상부 생육 균형 유지"
  ],
  6: [
    "완효성 공급으로 생육 중후반까지 양분 공급 안정화",
    "곡물류의 잎과 줄기 생장에 필요한 질소 지속 공급",
    "비료 성분 급방출을 줄여 시비 관리 부담 완화",
    "중성 토양에서 생육 기간 전반의 양분 균형 유지"
  ],
  7: [
    "해조 추출물 기반으로 고온과 건조 스트레스 완화 보조",
    "칼륨 중심 배합으로 당 이동과 품질 관리 지원",
    "미량요소 보강으로 생육 후반 활력 유지",
    "액상 보조 사용에 적합해 빠른 생육 관리에 활용"
  ],
  8: [
    "발효 기반 미생물 공급으로 토양 생물성 개선",
    "근채류 뿌리 주변 환경을 부드럽게 만들어 비대 조건 보조",
    "척박지의 유기물 분해와 양분 순환 활성화",
    "뿌리 발달과 저장기관 품질 형성에 필요한 토양 기반 개선"
  ],
  10: [
    "농장 부산물 퇴비화 과정의 부숙 속도 개선",
    "퇴비 온도 상승과 유기물 분해 활성 보조",
    "미숙 퇴비 사용으로 인한 작물 생육 부담 완화",
    "자가 퇴비 제조 시 냄새와 부숙 편차 관리 지원"
  ]
};

function getProductDetailSeed(product: (typeof products)[number]) {
  const cropTargets = product.crop === "전체" ? ["채소류", "과수류", "곡물류", "특용작물", "화훼류"] : [product.crop, "채소류", "과수류", "특용작물", "화훼류"];
  const basePrice = product.price;

  return {
    infoSummary: `${product.name}는 유기물 공급과 토양 미생물 활성을 함께 고려한 비료입니다. ${product.description}`,
    infoSpecs: JSON.stringify([
      { label: "제품명", value: product.name },
      { label: "종류", value: "유기농업자재 공시" },
      { label: "형태", value: product.weight === "10kg" ? "입상형" : "펠릿형" },
      { label: "주요 성분", value: "유기물 45% 이상, 부식산 10% 이상, 미생물" },
      { label: "제조사", value: "비료비서 영농조합법인" },
      { label: "보관 방법", value: "직사광선을 피하고 서늘한 곳에 보관" },
      { label: "유통기한", value: "제조일로부터 24개월" }
    ]),
    effects: JSON.stringify(productEffectsById[product.id] ?? []),
    recommendedCrops: JSON.stringify(cropTargets.map((name) => ({ name, category: name === product.crop ? "추천" : "범용" }))),
    ingredients: JSON.stringify(["곤충분변토", "식물성 유기물", "해조 추출물", "미생물 발효 부산물", "칼슘·마그네슘"]),
    purchaseOptions: JSON.stringify([
      {
        id: "10kg",
        label: "10kg",
        weight: "10kg",
        price: roundToThousand(basePrice * 0.75),
        unitPriceLabel: "1kg당 1,800원"
      },
      {
        id: "20kg",
        label: "20kg",
        weight: "20kg",
        price: basePrice,
        unitPriceLabel: "1kg당 1,200원",
        featured: true
      },
      {
        id: "25kg",
        label: "25kg",
        weight: "25kg",
        price: roundToThousand(basePrice * 1.17),
        unitPriceLabel: "1kg당 1,120원"
      },
      {
        id: "20kgx2",
        label: "20kg x 2포",
        weight: "40kg",
        price: Math.max(basePrice * 2 - 2000, basePrice),
        unitPriceLabel: "1kg당 1,150원"
      }
    ])
  };
}

function toProductSeedFields(product: (typeof products)[number]) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    weight: product.weight,
    rating: 0,
    badge: product.badge,
    nRatio: product.nRatio,
    pRatio: product.pRatio,
    kRatio: product.kRatio,
    crop: product.crop,
    soil: product.soil,
    ...getProductDetailSeed(product)
  };
}

function buildOrderTrackingNumber(orderId: string) {
  return `BR-${orderId.replace(/\D/g, "").slice(-10).padStart(10, "0")}`;
}

function getOrderTimeline(status: string) {
  const statusSteps = ["결제완료", "상품준비중", "배송중", "배송완료"];
  const activeIndex = status === "배송완료" ? 3 : status === "배송중" ? 2 : 1;

  return statusSteps.map((label, index) => ({
    label,
    active: index <= activeIndex,
    current: index === activeIndex
  }));
}

function toOrderSeedFields(
  order: (typeof orders)[number],
  product: (typeof products)[number],
  deliveryAddress: string
) {
  return {
    ...order,
    productName: product.name,
    productSummary: `${product.name} ${product.weight} × ${order.amount}포`,
    unitLabel: product.weight,
    deliveryRecipient: `${farm.name} 담당자`,
    deliveryAddress,
    deliveryCourier: order.status === "배합준비" ? "비료비서 자체 배합센터" : "비료비서 배송",
    trackingNumber: buildOrderTrackingNumber(order.id),
    timeline: JSON.stringify(getOrderTimeline(order.status))
  };
}

async function insertProductSeed(id: number, data: ReturnType<typeof toProductSeedFields>) {
  await prisma.product.createMany({
    data: [{ id, ...data }]
  });
}

async function upsertOrderSeed(data: ReturnType<typeof toOrderSeedFields>, userId: number) {
  const { id, ...orderData } = data;

  await prisma.order.upsert({
    where: { id },
    update: {
      ...orderData,
      userId
    },
    create: {
      id,
      ...orderData,
      userId
    }
  });
}

async function updateProductSeed(id: number, data: ReturnType<typeof toProductSeedFields>) {
  await prisma.product.update({
    where: { id },
    data
  });
}

async function refreshSeedProductRatings() {
  const productIds = products.map((product) => product.id);

  for (const productId of productIds) {
    const aggregate = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregate._avg.rating ? Math.round(aggregate._avg.rating * 10) / 10 : 0
      }
    });
  }
}

const farm = {
  id: 10,
  ownerId: 1,
  name: "햇살농장",
  address: {
    sido: "충청남도",
    sigungu: "예산군",
    roadAddress: "충청남도 예산군 삽교읍 예재로 123",
    bcode: "4481034021",
    lat: 36.6881,
    lng: 126.7397
  },
  crops: [
    { code: "PEPPER", name: "고추" },
    { code: "CABBAGE", name: "배추" },
    { code: "CUCUMBER", name: "오이" }
  ],
  soil: {
    type: "LOAM",
    ph: 6.2,
    organicMatterLevel: "NORMAL",
    source: "HEUKTORAM"
  },
  areaSquareMeter: 12000
};

const roadAddressRecords = [
  {
    roadAddress: "충청남도 예산군 삽교읍 예재로 123",
    jibunAddress: "충청남도 예산군 삽교읍 농지 1",
    zipCode: "32414",
    bcode: "4481034021",
    sido: "충청남도",
    sigungu: "예산군",
    lat: 36.6881,
    lng: 126.7397
  },
  {
    roadAddress: "충청남도 홍성군 홍북읍 농생명로 45",
    jibunAddress: "충청남도 홍성군 홍북읍 농지 45",
    zipCode: "32255",
    bcode: "4480035021",
    sido: "충청남도",
    sigungu: "홍성군",
    lat: 36.6576,
    lng: 126.6728
  },
  {
    roadAddress: "전라북도 익산시 왕궁면 식품로 89",
    jibunAddress: "전라북도 익산시 왕궁면 농지 89",
    zipCode: "54576",
    bcode: "4514036021",
    sido: "전라북도",
    sigungu: "익산시",
    lat: 35.9697,
    lng: 127.0071
  }
];

const legalDongAddressRecords = roadAddressRecords.map((address) => ({
  bcode: address.bcode,
  sido: address.sido,
  sigungu: address.sigungu,
  legalDongName: address.jibunAddress.split(" ").slice(0, 4).join(" ")
}));

const soilDataRecords = [
  {
    source: "HEUKTORAM",
    bcode: "4481034021",
    soilType: "LOAM",
    ph: 6.2,
    organicMatterValue: 25,
    organicMatterUnit: "g/kg",
    organicMatterLevel: "NORMAL",
    availablePhosphateValue: 180,
    availablePhosphateUnit: "mg/kg",
    potassiumValue: 0.55,
    potassiumUnit: "cmol+/kg",
    calciumValue: 5.2,
    calciumUnit: "cmol+/kg",
    magnesiumValue: 1.8,
    magnesiumUnit: "cmol+/kg"
  },
  {
    source: "HEUKTORAM",
    bcode: "4480035021",
    soilType: "SANDY",
    ph: 5.9,
    organicMatterValue: 21,
    organicMatterUnit: "g/kg",
    organicMatterLevel: "LOW",
    availablePhosphateValue: 145,
    availablePhosphateUnit: "mg/kg",
    potassiumValue: 0.42,
    potassiumUnit: "cmol+/kg",
    calciumValue: 4.6,
    calciumUnit: "cmol+/kg",
    magnesiumValue: 1.4,
    magnesiumUnit: "cmol+/kg"
  },
  {
    source: "HEUKTORAM",
    bcode: "4514036021",
    soilType: "CLAY",
    ph: 6.5,
    organicMatterValue: 29,
    organicMatterUnit: "g/kg",
    organicMatterLevel: "NORMAL",
    availablePhosphateValue: 205,
    availablePhosphateUnit: "mg/kg",
    potassiumValue: 0.62,
    potassiumUnit: "cmol+/kg",
    calciumValue: 5.7,
    calciumUnit: "cmol+/kg",
    magnesiumValue: 2.0,
    magnesiumUnit: "cmol+/kg"
  }
];

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  seedPromise ??= seedDatabase();
  await seedPromise;
}

async function seedDatabase() {
  const demoUser = {
    id: 1,
    name: "김농부",
    phone: "010-1234-5678",
    email: "farmer@example.com",
    memberType: "User",
    subscriptionTier: "PREMIUM",
    createdAt: "2026-01-01T09:00:00+09:00"
  };
  const adminUser = {
    name: "관리자",
    phone: "010-0000-0000",
    email: "admin@example.com",
    memberType: "Admin",
    subscriptionTier: "ADMIN",
    createdAt: "2026-01-01T09:00:00+09:00"
  };

  const seededUser = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {
      passwordHash: hashPassword("password123")
    },
    create: {
      name: demoUser.name,
      phone: demoUser.phone,
      email: demoUser.email,
      memberType: demoUser.memberType,
      subscriptionTier: demoUser.subscriptionTier,
      createdAt: demoUser.createdAt,
      passwordHash: hashPassword("password123")
    }
  });
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      name: adminUser.name,
      phone: adminUser.phone,
      memberType: adminUser.memberType,
      subscriptionTier: adminUser.subscriptionTier,
      passwordHash: hashPassword("admin123")
    },
    create: {
      name: adminUser.name,
      phone: adminUser.phone,
      email: adminUser.email,
      memberType: adminUser.memberType,
      subscriptionTier: adminUser.subscriptionTier,
      createdAt: adminUser.createdAt,
      passwordHash: hashPassword("admin123")
    }
  });

  const existingProductCount = await prisma.product.count();

  for (const address of roadAddressRecords) {
    await prisma.roadAddress.upsert({
      where: { roadAddress: address.roadAddress },
      update: address,
      create: address
    });
  }

  for (const address of legalDongAddressRecords) {
    await prisma.legalDongAddress.upsert({
      where: { bcode: address.bcode },
      update: address,
      create: address
    });
  }

  for (const soilData of soilDataRecords) {
    const { bcode, ...soilDataFields } = soilData;
    const legalDongAddress = await prisma.legalDongAddress.findUnique({ where: { bcode } });

    if (!legalDongAddress) {
      continue;
    }

    await prisma.soilData.upsert({
      where: { legalDongAddressId: legalDongAddress.id },
      update: soilDataFields,
      create: {
        ...soilDataFields,
        legalDongAddressId: legalDongAddress.id
      }
    });
  }

  for (const cropCode of cropCodes) {
    await prisma.cropCode.upsert({
      where: { code: cropCode.code },
      update: cropCode,
      create: cropCode
    });
  }

  for (const soilType of soilTypes) {
    await prisma.soilType.upsert({
      where: { code: soilType.code },
      update: soilType,
      create: soilType
    });
  }

  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { code: category.code },
      update: category,
      create: category
    });
  }

  for (const product of products) {
    const data = toProductSeedFields(product);
    const existingById = await prisma.product.findUnique({
      where: { id: product.id },
      select: { id: true }
    });
    const existingByName = await prisma.product.findFirst({
      where: { name: product.name },
      select: { id: true }
    });

    if (!existingById && existingByName) {
      const [orderCount, recommendationCount, reviewCount] = await Promise.all([
        prisma.order.count({ where: { productId: existingByName.id } }),
        prisma.recommendation.count({ where: { productId: existingByName.id } }),
        prisma.review.count({ where: { productId: existingByName.id } })
      ]);

      if (orderCount + recommendationCount + reviewCount > 0) {
        throw new Error(`Seed product "${product.name}" exists with id ${existingByName.id}, but expected ${product.id}.`);
      }

      await prisma.product.delete({ where: { id: existingByName.id } });
    }

    const productWithExpectedId = await prisma.product.findUnique({
      where: { id: product.id },
      select: { id: true }
    });

    if (productWithExpectedId) {
      await updateProductSeed(product.id, data);
      continue;
    }

    await insertProductSeed(product.id, data);
  }

  if (existingProductCount > 0) {
    return;
  }

  const farmAddress = await prisma.roadAddress.findUnique({ where: { roadAddress: farm.address.roadAddress } });
  await prisma.farm.upsert({
    where: { id: farm.id },
    update: {},
    create: {
      ownerId: seededUser.id,
      name: farm.name,
      addressId: farmAddress?.id,
      crops: JSON.stringify(farm.crops),
      soilType: farm.soil.type,
      soilPh: farm.soil.ph,
      organicMatterLevel: farm.soil.organicMatterLevel,
      soilSource: farm.soil.source,
      areaSquareMeter: farm.areaSquareMeter
    }
  });

  for (const recommendation of recommendations) {
    await prisma.recommendation.upsert({
      where: { id: recommendation.id },
      update: {},
      create: {
        title: recommendation.title,
        crop: recommendation.crop,
        npk: recommendation.npk,
        blend: recommendation.blend,
        savedAt: recommendation.savedAt,
        productId: recommendation.productId,
        userId: seededUser.id,
        saved: true
      }
    });
  }

  for (const order of orders) {
    const product = products.find((item) => item.id === order.productId);

    if (!product) {
      continue;
    }

    await upsertOrderSeed(toOrderSeedFields(order, product, farmAddress?.roadAddress ?? ""), seededUser.id);
  }

  for (const payment of payments) {
    await prisma.payment.create({
      data: payment
    });
  }

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
        name: review.name,
        rating: review.rating,
        content: review.content,
        createdAt: review.date ? new Date(`${review.date.replaceAll(".", "-")}T00:00:00.000Z`) : undefined,
        productId: products.find((product) => product.name === review.product)?.id
      }
    });
  }

  for (const review of myReviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
        name: review.name,
        rating: review.rating,
        content: review.content,
        createdAt: review.date ? new Date(`${review.date.replaceAll(".", "-")}T00:00:00.000Z`) : undefined,
        userId: seededUser.id,
        productId: products.find((product) => product.name === review.product)?.id
      }
    });
  }

  await refreshSeedProductRatings();
}
