/*
  Warnings:

  - You are about to drop the column `broke` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "broke",
ADD COLUMN     "broken" INTEGER NOT NULL DEFAULT 0;
