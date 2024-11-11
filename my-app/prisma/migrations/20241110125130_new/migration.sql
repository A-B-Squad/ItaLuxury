/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Brand` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_categoryId_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "categoryId";
