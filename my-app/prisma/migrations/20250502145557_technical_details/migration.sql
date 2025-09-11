/*
  Warnings:

  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "technicalDetails" TEXT;

-- DropTable
DROP TABLE "ProductAttribute";
