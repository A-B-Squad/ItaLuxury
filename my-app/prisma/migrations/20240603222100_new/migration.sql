/*
  Warnings:

  - You are about to drop the column `freeDeleviry` on the `Coupons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupons" DROP COLUMN "freeDeleviry";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pointsSolde" DOUBLE PRECISION NOT NULL DEFAULT 0;
