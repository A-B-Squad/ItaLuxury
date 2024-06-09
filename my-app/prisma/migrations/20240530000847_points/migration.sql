/*
  Warnings:

  - Made the column `checkoutId` on table `Package` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Package" ALTER COLUMN "checkoutId" SET NOT NULL;
