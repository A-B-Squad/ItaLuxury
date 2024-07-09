/*
  Warnings:

  - You are about to drop the column `discountPrice` on the `ProductInCheckout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductInCheckout" DROP COLUMN "discountPrice",
ADD COLUMN     "discountedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
