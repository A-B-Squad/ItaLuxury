/*
  Warnings:

  - The primary key for the `Basket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Checkout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Colors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Discount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateOfEnd` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfStart` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `newPrice` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Discount` table. All the data in the column will be lost.
  - The primary key for the `FavoriteProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductAttribute` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `percentage` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventory` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dateOfEnd` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfStart` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newPrice` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_basketId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteProducts" DROP CONSTRAINT "FavoriteProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_colorsId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_discountId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "_BasketProducts" DROP CONSTRAINT "_BasketProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_BasketProducts" DROP CONSTRAINT "_BasketProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Basket_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Basket_id_seq";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "basketId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Checkout_id_seq";

-- AlterTable
ALTER TABLE "Colors" DROP CONSTRAINT "Colors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Colors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Colors_id_seq";

-- AlterTable
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_pkey",
DROP COLUMN "dateOfEnd",
DROP COLUMN "dateOfStart",
DROP COLUMN "discount",
DROP COLUMN "newPrice",
DROP COLUMN "price",
ADD COLUMN     "percentage" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Discount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Discount_id_seq";

-- AlterTable
ALTER TABLE "FavoriteProducts" DROP CONSTRAINT "FavoriteProducts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "FavoriteProducts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FavoriteProducts_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "colorsId" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "inventory" SET NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductAttribute_id_seq";

-- AlterTable
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_pkey",
ADD COLUMN     "dateOfEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateOfStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "discountId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductDiscount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductDiscount_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "_BasketProducts" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_CategoryToProduct" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Variant";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_colorsId_fkey" FOREIGN KEY ("colorsId") REFERENCES "Colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "Basket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProducts" ADD CONSTRAINT "FavoriteProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BasketProducts" ADD CONSTRAINT "_BasketProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Basket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BasketProducts" ADD CONSTRAINT "_BasketProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
