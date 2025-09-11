-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "groupProductVariantId" TEXT;

-- CreateTable
CREATE TABLE "GroupProductVariant" (
    "id" TEXT NOT NULL,
    "groupProductName" TEXT NOT NULL,

    CONSTRAINT "GroupProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupProductVariant_groupProductName_key" ON "GroupProductVariant"("groupProductName");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_groupProductVariantId_fkey" FOREIGN KEY ("groupProductVariantId") REFERENCES "GroupProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
