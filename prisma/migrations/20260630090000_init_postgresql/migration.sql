-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "memberType" TEXT NOT NULL DEFAULT 'User',
    "subscriptionTier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "addressId" INTEGER,
    "name" TEXT NOT NULL,
    "crops" TEXT NOT NULL,
    "soilType" TEXT NOT NULL,
    "soilPh" DOUBLE PRECISION,
    "organicMatterLevel" TEXT,
    "soilSource" TEXT NOT NULL,
    "areaSquareMeter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "badge" TEXT,
    "nRatio" DOUBLE PRECISION NOT NULL,
    "pRatio" DOUBLE PRECISION NOT NULL,
    "kRatio" DOUBLE PRECISION NOT NULL,
    "crop" TEXT NOT NULL,
    "soil" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 100,
    "imageUrl" TEXT,
    "infoSummary" TEXT NOT NULL DEFAULT '',
    "infoSpecs" TEXT NOT NULL DEFAULT '[]',
    "effects" TEXT NOT NULL DEFAULT '[]',
    "recommendedCrops" TEXT NOT NULL DEFAULT '[]',
    "ingredients" TEXT NOT NULL DEFAULT '[]',
    "purchaseOptions" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "productId" INTEGER,
    "title" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "npk" TEXT NOT NULL,
    "blend" TEXT NOT NULL,
    "saved" BOOLEAN NOT NULL DEFAULT true,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL DEFAULT '',
    "productSummary" TEXT NOT NULL DEFAULT '',
    "unitLabel" TEXT NOT NULL DEFAULT '',
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "deliveryRecipient" TEXT NOT NULL DEFAULT '',
    "deliveryAddress" TEXT NOT NULL DEFAULT '',
    "deliveryCourier" TEXT NOT NULL DEFAULT '',
    "trackingNumber" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "productId" INTEGER,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadAddress" (
    "id" SERIAL NOT NULL,
    "roadAddress" TEXT NOT NULL,
    "jibunAddress" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "bcode" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoadAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalDongAddress" (
    "id" SERIAL NOT NULL,
    "bcode" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "legalDongName" TEXT NOT NULL,

    CONSTRAINT "LegalDongAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilData" (
    "id" SERIAL NOT NULL,
    "legalDongAddressId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "soilType" TEXT NOT NULL,
    "ph" DOUBLE PRECISION NOT NULL,
    "organicMatterValue" DOUBLE PRECISION NOT NULL,
    "organicMatterUnit" TEXT NOT NULL,
    "organicMatterLevel" TEXT NOT NULL,
    "availablePhosphateValue" DOUBLE PRECISION NOT NULL,
    "availablePhosphateUnit" TEXT NOT NULL,
    "potassiumValue" DOUBLE PRECISION NOT NULL,
    "potassiumUnit" TEXT NOT NULL,
    "calciumValue" DOUBLE PRECISION NOT NULL,
    "calciumUnit" TEXT NOT NULL,
    "magnesiumValue" DOUBLE PRECISION NOT NULL,
    "magnesiumUnit" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoilData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "frtlzrUseApiCropId" TEXT,

    CONSTRAINT "CropCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ph" DOUBLE PRECISION,

    CONSTRAINT "SoilType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoadAddress_roadAddress_key" ON "RoadAddress"("roadAddress");

-- CreateIndex
CREATE UNIQUE INDEX "LegalDongAddress_bcode_key" ON "LegalDongAddress"("bcode");

-- CreateIndex
CREATE UNIQUE INDEX "SoilData_legalDongAddressId_key" ON "SoilData"("legalDongAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "CropCode_code_key" ON "CropCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SoilType_code_key" ON "SoilType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_code_key" ON "ProductCategory"("code");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
