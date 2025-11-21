/*
  Warnings:

  - Added the required column `updatedAt` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `ProductDiscount` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('MANUAL', 'PROMOTIONAL_CAMPAIGN');

-- DropIndex
DROP INDEX "public"."ProductDiscount_productId_key";

-- AlterTable
ALTER TABLE "ProductDiscount" ADD COLUMN     "campaignName" TEXT,
ADD COLUMN     "campaignType" "CampaignType" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN     "discountValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "newPrice" SET DEFAULT 0,
ALTER COLUMN "dateOfStart" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DiscountCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "productsAffected" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "DiscountCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCampaign_name_key" ON "DiscountCampaign"("name");

-- CreateIndex
CREATE INDEX "DiscountCampaign_dateStart_dateEnd_isActive_idx" ON "DiscountCampaign"("dateStart", "dateEnd", "isActive");

-- CreateIndex
CREATE INDEX "ProductDiscount_productId_dateOfStart_dateOfEnd_idx" ON "ProductDiscount"("productId", "dateOfStart", "dateOfEnd");

-- CreateIndex
CREATE INDEX "ProductDiscount_campaignName_isActive_idx" ON "ProductDiscount"("campaignName", "isActive");

-- CreateIndex
CREATE INDEX "ProductDiscount_isActive_dateOfStart_dateOfEnd_idx" ON "ProductDiscount"("isActive", "dateOfStart", "dateOfEnd");

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountCampaign" ADD CONSTRAINT "DiscountCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
