/*
  Warnings:

  - You are about to drop the column `adminId` on the `Bundle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Bundle" DROP CONSTRAINT "Bundle_adminId_fkey";

-- AlterTable
ALTER TABLE "Bundle" DROP COLUMN "adminId";
