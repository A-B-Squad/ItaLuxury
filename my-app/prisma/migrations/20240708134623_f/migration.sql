/*
  Warnings:

  - Added the required column `price` to the `ProductInCheckout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInCheckout" ADD COLUMN     "discountPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
