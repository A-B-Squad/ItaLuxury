/*
  Warnings:

  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropTable
DROP TABLE "Variant";
