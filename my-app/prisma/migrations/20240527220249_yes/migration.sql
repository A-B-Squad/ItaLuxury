/*
  Warnings:

  - Added the required column `email` to the `CompanyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `CompanyInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyInfo" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
