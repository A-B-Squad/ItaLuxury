/*
  Warnings:

  - You are about to drop the column `Hex` on the `Colors` table. All the data in the column will be lost.
  - Added the required column `hex` to the `Colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Colors" DROP COLUMN "Hex",
ADD COLUMN     "hex" TEXT NOT NULL;
