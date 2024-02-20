/*
  Warnings:

  - You are about to drop the `_BasketProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BasketProducts" DROP CONSTRAINT "_BasketProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_BasketProducts" DROP CONSTRAINT "_BasketProducts_B_fkey";

-- AlterTable
ALTER TABLE "Basket" ADD COLUMN     "productId" TEXT;

-- DropTable
DROP TABLE "_BasketProducts";

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
