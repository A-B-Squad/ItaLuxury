/*
  Warnings:

  - You are about to drop the `_BestSalesToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BestSalesToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BestSalesToCategory" DROP CONSTRAINT "_BestSalesToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BestSalesToCategory" DROP CONSTRAINT "_BestSalesToCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_BestSalesToProduct" DROP CONSTRAINT "_BestSalesToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_BestSalesToProduct" DROP CONSTRAINT "_BestSalesToProduct_B_fkey";

-- AlterTable
ALTER TABLE "BestSales" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "productId" TEXT;

-- DropTable
DROP TABLE "_BestSalesToCategory";

-- DropTable
DROP TABLE "_BestSalesToProduct";

-- AddForeignKey
ALTER TABLE "BestSales" ADD CONSTRAINT "BestSales_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestSales" ADD CONSTRAINT "BestSales_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
