/*
  Warnings:

  - You are about to drop the `SameProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SameProducts" DROP CONSTRAINT "SameProducts_productId_fkey";

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "SameProducts";
