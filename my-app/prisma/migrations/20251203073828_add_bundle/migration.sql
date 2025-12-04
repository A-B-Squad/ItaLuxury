-- CreateEnum
CREATE TYPE "BundleType" AS ENUM ('BUY_X_GET_Y_FREE', 'PERCENTAGE_OFF', 'FIXED_AMOUNT_OFF', 'FREE_DELIVERY', 'FREE_GIFT');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "bundleId" TEXT;

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "BundleType" NOT NULL,
    "status" "BundleStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "minPurchaseAmount" DOUBLE PRECISION DEFAULT 0,
    "minQuantity" INTEGER DEFAULT 0,
    "requiredProductRefs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "anyProductRefs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredCategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredBrandIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requireAllProducts" BOOLEAN NOT NULL DEFAULT false,
    "freeProductQuantity" INTEGER DEFAULT 0,
    "freeProductRef" TEXT,
    "discountPercentage" DOUBLE PRECISION DEFAULT 0,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,
    "applyDiscountTo" TEXT DEFAULT 'ALL',
    "givesFreeDelivery" BOOLEAN NOT NULL DEFAULT false,
    "giftProductRef" TEXT,
    "giftQuantity" INTEGER DEFAULT 1,
    "maxUsagePerUser" INTEGER,
    "maxUsageTotal" INTEGER,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bundle_status_startDate_endDate_idx" ON "Bundle"("status", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Bundle_type_status_idx" ON "Bundle"("type", "status");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
