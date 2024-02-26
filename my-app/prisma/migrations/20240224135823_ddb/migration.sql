/*
  Warnings:

  - Added the required column `hex` to the `Colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Colors" ADD COLUMN     "hex" TEXT NOT NULL;
