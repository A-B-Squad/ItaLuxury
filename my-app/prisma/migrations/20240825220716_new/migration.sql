/*
  Warnings:

  - You are about to drop the column `sameProductsId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SameProducts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sameProductsId_fkey";

-- DropIndex
DROP INDEX "SameProducts_name_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sameProductsId";

-- AlterTable
ALTER TABLE "SameProducts" DROP COLUMN "name",
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "sameProductId" TEXT;

-- AddForeignKey
ALTER TABLE "SameProducts" ADD CONSTRAINT "SameProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
